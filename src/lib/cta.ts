/**
 * Conversion-focused CTA copy library.
 *
 * Single source of truth for buttons, hero variations and WhatsApp deep links
 * across the site. Swap the active hero variant or CTA wording in one place
 * and it propagates everywhere it's referenced.
 */

// ── WhatsApp ───────────────────────────────────────────────────────────────
export const PHONE_E164 = "8801994605717";
export const PHONE_DISPLAY = "+880 1994-605717";

/**
 * Build a wa.me deep link with a pre-filled message body.
 * URL-encodes the text for you.
 */
export function whatsappHref(message: string, phoneE164: string = PHONE_E164) {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
}

// ── Pre-filled WhatsApp messages, indexed by intent ────────────────────────
export const WA_MESSAGES = {
  generic:
    "Hi Tensorix team, I saw your site. I'd like to talk about AI automation or agent systems for my business.",
  audit:
    "Hi Tensorix team, I'd like to book a free 30-min systems audit. Best time for me is …",
  aiAutomation:
    "Hi Tensorix team, I'd like to look at a workflow automation for my team. Here's what we do manually today: ",
  messengerBot:
    "Hi Tensorix team, I'd like to talk about an AI chat agent for my business. The channels and the kinds of questions it would handle: ",
  websiteTeardown:
    "Hi Tensorix team, I'd like to talk about a conversion-focused website wired into our automations. Here's our current site (or what we're starting from): ",
  engagement: (name: string) =>
    `Hi Tensorix team, I'd like to discuss the "${name}" engagement. Here's a quick overview of my situation: `,
} as const;

// ── 5 CTA button variations (A/B-able from a single constant) ─────────────
// `primary` = the headline button on hero / final-cta. Pick the one that's
// converting best in your analytics and rename `active` below.
export const CTA_VARIANTS = {
  freeAudit: "Book a free systems audit",
  bookAudit: "Book a free 30-min audit",
  whatsappNow: "Message on WhatsApp",
  freeBotDemo: "Talk about an AI chat agent",
  websiteTeardown: "Talk about a conversion website",
} as const;

export const CTA = {
  primary: CTA_VARIANTS.freeAudit,
  secondary: CTA_VARIANTS.whatsappNow,
};

// ── 3 hero variations (toggleable) ────────────────────────────────────────
// Switch `ACTIVE_HERO` below to swap the headline + sub across the site.
//
// • A — outcome-led, default (best for cold traffic + paid ads)
// • B — pain-led (best for retargeting people who've visited before)
// • C — proof-led / authority (best for warm referral traffic)
//
export type HeroVariant = {
  eyebrow: string;
  headline: { line1: string; line2: string; line3: string; line4: string };
  sub: string;
  trust: string[];
};

export const HERO_VARIANTS: Record<"A" | "B" | "C", HeroVariant> = {
  A: {
    eyebrow: "Tensorix · AI Automation & Agent Engineering",
    headline: {
      line1: "AI systems",
      line2: "that turn repetitive",
      line3: "work into reliable",
      line4: "workflows.",
    },
    sub:
      "I help small teams automate lead handling, customer replies, CRM updates, reporting, and internal operations with practical AI agents, workflow automation, and integrated web systems.",
    trust: [
      "Founder-led · n8n / Make / GoHighLevel",
      "APIs · LLM agents · Websites",
      "Dhaka → Global",
    ],
  },
  B: {
    eyebrow: "Tensorix · Practical AI for small teams",
    headline: {
      line1: "Practical AI agents,",
      line2: "workflow automation,",
      line3: "and web systems —",
      line4: "built around your work.",
    },
    sub:
      "Reliable agents and automations that capture qualified leads, sync your tools, and remove the operations work that doesn't need a human.",
    trust: [
      "Acceptance criteria up-front",
      "30-day launch support",
      "You own accounts and source code",
    ],
  },
  C: {
    eyebrow: "Tensorix · Founder-led AI systems studio",
    headline: {
      line1: "Founder-led",
      line2: "AI systems studio.",
      line3: "Engineering-first,",
      line4: "not tool-reseller.",
    },
    sub:
      "Small client load for direct founder attention. Documentation, handover, and 30-day launch support included on every engagement.",
    trust: [
      "Engineering-first, not hype",
      "You own everything we build",
      "Docs and handover included",
    ],
  },
};

export const ACTIVE_HERO: keyof typeof HERO_VARIANTS = "A";
