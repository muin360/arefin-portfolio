import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  escapeHtml,
  sanitizeSlug,
  isValidEmail,
  sanitizeE164Phone,
  isValidHttpUrl,
  clampInteger,
  timingSafePasscodeCheck,
} from "@/lib/validators";

describe("Enterprise Input Sanitizers & Validators", () => {
  it("sanitizes strings and control characters", () => {
    expect(sanitizeString("  hello\u0000world  ")).toBe("helloworld");
    expect(sanitizeString(null)).toBe("");
    expect(sanitizeString(123 as unknown)).toBe("");
  });

  it("escapes HTML to prevent XSS", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(escapeHtml('Hello "world" & \'test\'')).toBe("Hello &quot;world&quot; &amp; &#039;test&#039;");
  });

  it("normalizes and cleans slugs", () => {
    expect(sanitizeSlug("AI Automation & Agents!")).toBe("ai-automation-agents");
    expect(sanitizeSlug("---hello--world---")).toBe("hello-world");
    expect(sanitizeSlug("Multi   Space   Separated")).toBe("multi-space-separated");
  });

  it("validates RFC email formats", () => {
    expect(isValidEmail("arefin@example.com")).toBe(true);
    expect(isValidEmail("user.name+tag@sub.domain.co")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
  });

  it("sanitizes phone numbers to digits", () => {
    expect(sanitizeE164Phone("+880 1994-605717")).toBe("8801994605717");
    expect(sanitizeE164Phone("(555) 123-4567")).toBe("5551234567");
  });

  it("validates HTTP/HTTPS URLs", () => {
    expect(isValidHttpUrl("https://tensorstudio.vercel.app")).toBe(true);
    expect(isValidHttpUrl("http://localhost:3000")).toBe(true);
    expect(isValidHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isValidHttpUrl("not a url")).toBe(false);
  });

  it("clamps integers within bounds", () => {
    expect(clampInteger(5, 1, 10, 1)).toBe(5);
    expect(clampInteger(100, 1, 10, 1)).toBe(10);
    expect(clampInteger(-5, 1, 10, 1)).toBe(1);
    expect(clampInteger("invalid", 1, 10, 3)).toBe(3);
  });
});

describe("Timing-Safe Passcode Comparison", () => {
  it("matches identical passcodes accurately", () => {
    expect(timingSafePasscodeCheck("secretPasscode123!", "secretPasscode123!")).toBe(true);
  });

  it("rejects non-matching passcodes", () => {
    expect(timingSafePasscodeCheck("wrong", "secretPasscode123!")).toBe(false);
    expect(timingSafePasscodeCheck("", "secretPasscode123!")).toBe(false);
    expect(timingSafePasscodeCheck(undefined, "secretPasscode123!")).toBe(false);
  });
});
