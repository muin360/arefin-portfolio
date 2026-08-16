/**
 * Centralised site / contact / brand config (v3).
 *
 * Single source of truth for every URL, email, phone, and social
 * profile used across the site. Re-import from `@/lib/config` in any
 * component, metadata block, JSON-LD schema, or server action — never
 * hard-code these values inline.
 *
 * `url` falls back to `https://tensorix.me` (the canonical production
 * domain) when `NEXT_PUBLIC_SITE_URL` is not set — for example during
 * local development or in preview deployments that haven't been wired
 * to the env var yet. The existing `@/lib/site-url` helper still
 * exists as a backwards-compat shim and re-exports `SITE.url`.
 */
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tensorix.me";

export const SITE = {
  /** Canonical site URL with no trailing slash. */
  url: RAW_SITE_URL.replace(/\/+$/, ""),
  /** Brand display name. */
  name: "Arefin Mueen",
  /** One-line positioning. */
  tagline: "AI Agent & Automation Engineer",
  /** Long-form description used in meta + JSON-LD. */
  description:
    "Arefin Mueen is an AI Agent & Automation Engineer based in Dhaka. I build voice AI agents, multi-agent systems, RAG pipelines, and automation workflows with n8n, LangChain, Python, and modern LLMs.",
  /** Person behind the portfolio. */
  author: "Arefin Mueen",
  /** Contact inbox. Use this for forms / "contact me" links. */
  contactEmail: "hello@tensorix.me",
  /** Direct inbox. */
  founderEmail: "arefinmuin@gmail.com",
  /** WhatsApp number in E.164 format (no `+`). Routed through `lib/cta`. */
  whatsapp: "8801994605717",
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

/** Helper: build a `wa.me` link with a pre-typed message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Helper: build a `mailto:` link with an optional pre-typed subject + body. */
export function mailto(
  email: string,
  opts: { subject?: string; body?: string } = {},
): string {
  const params = new URLSearchParams();
  if (opts.subject) params.set("subject", opts.subject);
  if (opts.body) params.set("body", opts.body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ""}`;
}
