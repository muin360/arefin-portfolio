"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { Resend } from "resend";

// Tunables — keep in sync with the client form's maxLengths so server-side
// validation never appears to "randomly" reject a message that fit on screen.
const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 4000;

// Topic list mirrors src/app/contact/ContactForm.tsx — duplicated rather
// than imported because client / server contexts are different.
const TOPICS = [
  "AI automation project",
  "AI agent build",
  "GoHighLevel setup",
  "Workflow audit",
  "Just saying hi",
] as const;

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(MAX_NAME),
  email: z.string().trim().toLowerCase().email().max(MAX_EMAIL),
  subject: z.enum(TOPICS),
  message: z.string().trim().min(10).max(MAX_MESSAGE),
  // Honeypot — any non-empty value means it's a bot submission.
  website: z.string().max(0).optional().default(""),
  // Soft anti-bot — tracked client-side as ms since first interaction; bots
  // typically submit instantly. We require at least 1.5s.
  elapsed: z.coerce.number().min(1500),
});

export type ContactState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string>>;
};

// In-memory rate limit. Process-local (per Vercel function instance) — good
// enough for a portfolio. For multi-region production, swap with Upstash.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const rateLog = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (rateLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) return false;
  arr.push(now);
  rateLog.set(ip, arr);
  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const apiKey = process.env.RESEND_API_KEY;

  // Validate first — even if Resend isn't configured we still want to
  // reject bad payloads cleanly.
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website"),
    elapsed: formData.get("elapsed"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof ContactSchema>;
      fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  // Honeypot — silently succeed so bots don't learn anything.
  if (parsed.data.website) {
    return { ok: true };
  }

  // Rate limit by IP.
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) {
    return {
      ok: false,
      error: "Too many messages from this network. Try again in a minute.",
    };
  }

  if (!apiKey) {
    // Email infra not configured — surface a clear message rather than
    // silently dropping the message. The form falls back to a mailto: link.
    return {
      ok: false,
      error:
        "Email delivery isn't configured yet. Please email hello@tensorix.ai directly.",
    };
  }

  const { name, email, subject, message } = parsed.data;
  const resend = new Resend(apiKey);

  // FROM domain must be verified in Resend. Until you verify your own
  // domain, use the Resend onboarding sender; it works out of the box but
  // sends from `onboarding@resend.dev`. After verifying tensorix.ai
  // (or whatever), set CONTACT_FROM_EMAIL to "Tensorix <hi@your.dev>".
  const from = process.env.CONTACT_FROM_EMAIL || "Tensorix <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL || "hello@tensorix.ai";

  try {
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Tensorix] ${subject} — ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${subject}\n\n${message}\n`,
      html: `
        <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 600px;">
          <h2 style="margin:0 0 16px 0">New contact form submission</h2>
          <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;<br/>
          <strong>Topic:</strong> ${escapeHtml(subject)}</p>
          <hr/>
          <pre style="white-space: pre-wrap; font-family: inherit; line-height: 1.5;">${escapeHtml(message)}</pre>
        </div>
      `.trim(),
    });
    if (result.error) {
      console.error("Resend error", result.error);
      return { ok: false, error: "Couldn't send right now. Try again or email directly." };
    }
    return { ok: true };
  } catch (err) {
    console.error("sendContact failed", err);
    return { ok: false, error: "Couldn't send right now. Try again or email directly." };
  }
}
