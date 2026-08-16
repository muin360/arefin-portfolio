"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { Resend } from "resend";
import * as Sentry from "@sentry/nextjs";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "arefinmueen360@gmail.com";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL;

// Tunables — keep in sync with the client form's maxLengths so server-side
// validation never appears to "randomly" reject a message that fit on screen.
const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 4000;
const MAX_FORMDATA_SIZE = 5 * 1024 * 1024; // 5MB — prevent abuse

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

// In-memory rate limit. Process-local (per Vercel function instance).
// For production, use Upstash Redis: https://upstash.com
// This is a temporary solution for portfolio scale.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const rateLog = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  // Filter to the current window
  const arr = (rateLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) return false;
  arr.push(now);
  rateLog.set(ip, arr);

  // Lazy cleanup: periodically purge stale entries for this IP and a few
  // others, instead of a module-level setInterval (which leaks in serverless).
  if (Math.random() < 0.05) {
    for (const [key, times] of rateLog.entries()) {
      const fresh = times.filter((t) => now - t < RATE_WINDOW_MS * 5);
      if (fresh.length === 0) {
        rateLog.delete(key);
      } else {
        rateLog.set(key, fresh);
      }
    }
  }

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

/**
 * Validate that email is a single valid address, not comma-separated.
 * Prevents reply-To header injection.
 */
function validateSingleEmail(email: string): boolean {
  // RFC 5321 simplified — disallow commas, semicolons, and other delimiters
  return /^[^,;\s]+@[^,;\s]+\.[^,;\s]+$/.test(email);
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const apiKey = process.env.RESEND_API_KEY;

  // Check FormData size to prevent abuse
  // Note: FormData size is approximate and not guaranteed
  const formDataArray = await Promise.all(
    Array.from(formData.entries()).map(async ([, value]) => {
      if (typeof value === "string") return value.length;
      if (value instanceof File) return value.size;
      return 0;
    }),
  );
  const totalSize = formDataArray.reduce((a, b) => a + b, 0);
  if (totalSize > MAX_FORMDATA_SIZE) {
    Sentry.captureMessage(
      "Contact form payload exceeded size limit",
      "warning",
    );
    return {
      ok: false,
      error: "Message too large. Please keep it under 5MB.",
    };
  }

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
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors,
    };
  }

  // Honeypot — detect and log bots, but silently succeed so they don't learn.
  if (parsed.data.website) {
    Sentry.captureMessage("Honeypot field filled (bot submission)", "info");
    return { ok: true };
  }

  // Rate limit by IP.
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (!rateLimit(ip)) {
    Sentry.captureMessage(
      `Contact form rate limit exceeded for IP: ${ip}`,
      "warning",
    );
    return {
      ok: false,
      error: "Too many messages from this network. Try again in a minute.",
    };
  }

  if (!apiKey) {
    // Email infra not configured — surface a clear message rather than
    // silently dropping the message. The form falls back to a mailto: link.
    Sentry.captureMessage(
      "Contact form submitted but RESEND_API_KEY not configured",
      "warning",
    );
    return {
      ok: false,
      error:
        "Email delivery isn't configured yet. Please email " + CONTACT_EMAIL + " directly.",
    };
  }

  const { name, email, subject, message } = parsed.data;

  // Validate reply-To is a single email (prevent header injection)
  if (!validateSingleEmail(email)) {
    Sentry.captureMessage(
      `Invalid email format in replyTo: ${email}`,
      "warning",
    );
    return {
      ok: false,
      error: "Invalid email format. Please check and try again.",
    };
  }

  const resend = new Resend(apiKey);

  // FROM domain must be verified in Resend. Until you verify your own
  // domain, use the Resend onboarding sender; it works out of the box but
  // sends from `onboarding@resend.dev`. After verifying your domain
  // set CONTACT_FROM_EMAIL to "Tensorix <hi@your.dev>".
  const from =
    process.env.CONTACT_FROM_EMAIL || "Tensorix <onboarding@resend.dev>";
  const to = CONTACT_TO_EMAIL;

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
      const errorMsg = result.error.message || JSON.stringify(result.error);
      Sentry.captureException(new Error(`Resend error: ${errorMsg}`));
      return {
        ok: false,
        error: "Couldn't send right now. Try again or email directly.",
      };
    }

    // Persist submission to Sanity if write token is configured
    if (process.env.SANITY_API_WRITE_TOKEN) {
      try {
        const { writeClient } = await import("@/sanity/client");
        const client = writeClient();
        await client.create({
          _type: "contactSubmission",
          name,
          email,
          subject,
          message,
          read: false,
        });
      } catch (sanityErr) {
        Sentry.captureException(sanityErr);
      }
    }

    return { ok: true };
  } catch (err) {
    Sentry.captureException(err);
    return {
      ok: false,
      error: "Couldn't send right now. Try again or email directly.",
    };
  }
}
