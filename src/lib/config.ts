/**
 * Centralised site / contact / brand config (v3).
 *
 * Single source of truth for every URL, email, phone, and social
 * profile used across the site. Re-import from `@/lib/config` in any
 * component, metadata block, JSON-LD schema, or server action — never
 * hard-code these values inline.
 *
 * `url` falls back to `https://tensorstudio.vercel.app` (the canonical production
 * domain) when `NEXT_PUBLIC_SITE_URL` is not set.
 */
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tensorstudio.vercel.app";

export const SITE = {
  /** Canonical site URL with no trailing slash. */
  url: RAW_SITE_URL.replace(/\/+$/, ""),
  /** Brand display name. */
  name: "Arefin Mueen",
  /** One-line positioning. */
  tagline: "AI Automation & AI Agent Developer",
  /** Long-form description used in meta + JSON-LD. */
  description:
    "Arefin Mueen is an AI Automation & AI Agent Developer based in Dhaka. I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
  /** Person behind the portfolio. */
  author: "Arefin Mueen",
  /** Contact inbox. Use this for forms / "contact me" links. */
  contactEmail: process.env.CONTACT_EMAIL || "arefinmueen360@gmail.com",
  /** Direct inbox. */
  founderEmail: "arefinmueen360@gmail.com",
  /** WhatsApp number in E.164 format (no `+`). Routed through `lib/cta`. */
  whatsapp: process.env.CONTACT_PHONE_E164 || "8801994605717",
  /** Booking page URL (relative). */
  bookUrl: "/book",
  /** Contact page URL (relative). */
  contactUrl: "/contact",
  /** Public social profiles — order matters: shown left → right in footer. */
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61588840534814",
    github: "https://github.com/arefinmuin",
    linkedin: "https://www.linkedin.com/in/arefin-muin/",
    twitter: "https://x.com/arefin_muin",
  },
  /** Service regions used in JSON-LD `areaServed`. ISO 3166 alpha-2. */
  areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsapp}`;
  if (!message) return `${base}?text=`;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function mailto(
  email: string,
  options?: { subject?: string; body?: string },
): string {
  const params = new URLSearchParams();
  if (options?.subject) params.set("subject", options.subject);
  if (options?.body) params.set("body", options.body);
  const query = params.toString();
  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
}
