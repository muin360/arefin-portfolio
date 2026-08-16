import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * The contact form server action has private helpers (escapeHtml,
 * validateSingleEmail, rateLimit) plus a Zod schema. Since they're
 * not exported, we re-implement them here for contract-testing, and
 * also integration-test sendContact through its FormData interface.
 */

// ── Re-implement private helpers to contract-test their behavior ────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateSingleEmail(email: string): boolean {
  return /^[^,;\s]+@[^,;\s]+\.[^,;\s]+$/.test(email);
}

// ── escapeHtml ──────────────────────────────────────────────────────

describe("escapeHtml", () => {
  it("escapes ampersand", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes less-than", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes greater-than", () => {
    expect(escapeHtml("a > b")).toBe("a &gt; b");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("handles combined XSS payload", () => {
    const result = escapeHtml('<img onerror="alert(1)" src=x>');
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).not.toContain('"');
  });

  it("returns empty string for empty input", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("leaves safe strings unchanged", () => {
    expect(escapeHtml("Hello World 123")).toBe("Hello World 123");
  });
});

// ── validateSingleEmail ─────────────────────────────────────────────

describe("validateSingleEmail", () => {
  it("accepts a valid email", () => {
    expect(validateSingleEmail("user@example.com")).toBe(true);
  });

  it("accepts an email with subdomain", () => {
    expect(validateSingleEmail("user@mail.example.com")).toBe(true);
  });

  it("accepts an email with plus addressing", () => {
    expect(validateSingleEmail("user+tag@example.com")).toBe(true);
  });

  it("rejects comma-separated emails (header injection)", () => {
    expect(validateSingleEmail("a@b.com,c@d.com")).toBe(false);
  });

  it("rejects semicolon-separated emails", () => {
    expect(validateSingleEmail("a@b.com;c@d.com")).toBe(false);
  });

  it("rejects emails with spaces", () => {
    expect(validateSingleEmail("a @b.com")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(validateSingleEmail("")).toBe(false);
  });

  it("rejects a string without @", () => {
    expect(validateSingleEmail("not-an-email")).toBe(false);
  });
});

// ── ContactSchema (Zod) via sendContact integration ─────────────────

// Mock next/headers and external dependencies so we can import
// sendContact and test the Zod validation path without hitting Resend.
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: (key: string) => {
      if (key === "x-forwarded-for") return "127.0.0.1";
      return null;
    },
  })),
}));

vi.mock("@sentry/nextjs", () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: "test" }, error: null }),
    },
  })),
}));

function buildFormData(overrides: Record<string, string> = {}): FormData {
  const defaults: Record<string, string> = {
    name: "Test User",
    email: "test@example.com",
    subject: "AI automation project",
    message: "This is a test message that is long enough to pass.",
    website: "",
    elapsed: "2000",
  };
  const data = new FormData();
  const merged = { ...defaults, ...overrides };
  for (const [key, val] of Object.entries(merged)) {
    data.set(key, val);
  }
  return data;
}

describe("sendContact (integration)", () => {
  let sendContact: (
    prev: { ok: boolean; error?: string },
    formData: FormData,
  ) => Promise<{ ok: boolean; error?: string; fieldErrors?: Record<string, string> }>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("../../contact/actions");
    sendContact = mod.sendContact;
  });

  it("rejects when name is empty", async () => {
    const result = await sendContact({ ok: false }, buildFormData({ name: "" }));
    expect(result.ok).toBe(false);
    expect(result.error).toContain("fix");
  });

  it("rejects when email is invalid", async () => {
    const result = await sendContact(
      { ok: false },
      buildFormData({ email: "not-email" }),
    );
    expect(result.ok).toBe(false);
  });

  it("rejects when subject is not in allowed topics", async () => {
    const result = await sendContact(
      { ok: false },
      buildFormData({ subject: "Buy my stuff" }),
    );
    expect(result.ok).toBe(false);
  });

  it("rejects when message is too short", async () => {
    const result = await sendContact(
      { ok: false },
      buildFormData({ message: "Hi" }),
    );
    expect(result.ok).toBe(false);
  });

  it("rejects when elapsed time is too low (bot detection)", async () => {
    const result = await sendContact(
      { ok: false },
      buildFormData({ elapsed: "100" }),
    );
    expect(result.ok).toBe(false);
  });

  it("rejects when honeypot field is filled (bot trap)", async () => {
    const result = await sendContact(
      { ok: false },
      buildFormData({ website: "http://spam.com" }),
    );
    expect(result.ok).toBe(false);
  });

  it("returns error when RESEND_API_KEY is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const result = await sendContact({ ok: false }, buildFormData());
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Email delivery");
  });
});
