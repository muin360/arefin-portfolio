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
    "Hi Tensorix team, I saw your website. I want to know how AI automation can help my business.",
  audit:
    "Hi Tensorix team! I'd like to book a free 30-min audit call. Best time for me is …",
  aiAutomation:
    "Hi Tensorix team! I'd like to know if my workflow can be automated. Here's what my team does manually right now: ",
  messengerBot:
    "Hi Tensorix team! I'd like a free Messenger bot demo for my Facebook page. My page name is: ",
  websiteTeardown:
    "Hi Tensorix team! I'd like a free teardown of my current website. My site is: ",
  engagement: (name: string) =>
    `Hi Tensorix team! I'd like to discuss the "${name}" engagement. Here's a quick overview of my situation: `,
} as const;

// ── 5 CTA button variations (A/B-able from a single constant) ─────────────
// `primary` = the headline button on hero / final-cta. Pick the one that's
// converting best in your analytics and rename `active` below.
export const CTA_VARIANTS = {
  freeAudit: "Get my free 30-min audit",
  bookAudit: "Book my free audit call",
  whatsappNow: "WhatsApp me now",
  freeBotDemo: "Get a free Messenger bot demo",
  websiteTeardown: "Get a free 1-page website teardown",
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
    eyebrow:
      "AI automation, Messenger bots & websites for small businesses",
    headline: {
      line1: "We build the",
      line2: "systems that bring you",
      line3: "more leads —",
      line4: "while you sleep.",
    },
    sub:
      "Done-for-you AI chatbots, Facebook & Messenger automation, and high-converting websites. Built in days, not months. Owned by you, not us.",
    trust: [
      "Reply on WhatsApp in under 1 hour",
      "Built by an AI engineer",
      "4+ years shipping automations",
    ],
  },
  B: {
    eyebrow: "Stop losing leads to slow replies and a dated site",
    headline: {
      line1: "Your Messenger inbox",
      line2: "is your storefront.",
      line3: "We make it sell —",
      line4: "even at 3am.",
    },
    sub:
      "AI chatbots, Facebook & Messenger automation, and conversion-built websites for small businesses. Reply in 30 seconds. Sell while you sleep.",
    trust: [
      "Reply on WhatsApp in under 1 hour",
      "Two clients at a time",
      "30 days free post-launch support",
    ],
  },
  C: {
    eyebrow: "Trusted by small businesses from Dhaka to Dubai",
    headline: {
      line1: "An AI engineer,",
      line2: "not an agency.",
      line3: "Building systems",
      line4: "that pay for themselves.",
    },
    sub:
      "We build AI automations, Messenger bots and high-converting websites for small businesses. Flat price. You own everything. Reachable on WhatsApp every working day.",
    trust: [
      "Operated by a senior AI engineer, not a sales team",
      "All accounts and source code in your name",
      "Flat price — no hourly surprises",
    ],
  },
};

export const ACTIVE_HERO: keyof typeof HERO_VARIANTS = "A";
