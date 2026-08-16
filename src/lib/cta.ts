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
    "Hi Arefin! I saw your portfolio. I'd like to discuss an AI automation or agent project.",
  audit:
    "Hi Arefin! I'd like to discuss an AI automation scoping call. Best time for me is …",
  aiAutomation:
    "Hi Arefin! I'd like to look at a workflow automation for my team. Here's what we do manually today: ",
  messengerBot:
    "Hi Arefin! I'd like to talk about an AI assistant or chatbot for my workflow. The kinds of questions it would handle: ",
  websiteTeardown:
    "Hi Arefin! I'd like to talk about connecting automations and APIs to my website: ",
  engagement: (name: string) =>
    `Hi Arefin! I'd like to discuss the "${name}" project. Here's a quick overview of what I'm looking for: `,
} as const;

// ── 5 CTA button variations (A/B-able from a single constant) ─────────────
export const CTA_VARIANTS = {
  buildAutomation: "Let's build an automation",
  bookAudit: "Book a free 30-min scoping call",
  whatsappNow: "Message on WhatsApp",
  viewProjects: "View my projects",
  contactMe: "Contact me",
} as const;

export const CTA = {
  primary: CTA_VARIANTS.buildAutomation,
  secondary: CTA_VARIANTS.whatsappNow,
};

// ── 3 hero variations (toggleable) ────────────────────────────────────────
export type HeroVariant = {
  eyebrow: string;
  headline: { line1: string; line2: string; line3: string; line4: string };
  sub: string;
  trust: string[];
};

export const HERO_VARIANTS: Record<"A" | "B" | "C", HeroVariant> = {
  A: {
    eyebrow: "Arefin Mueen · AI Automation & AI Agent Developer",
    headline: {
      line1: "I build AI",
      line2: "systems that",
      line3: "automate real",
      line4: "work.",
    },
    sub:
      "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    trust: [
      "AI Agents · RAG · Multi-Agent",
      "n8n · LangChain · Langflow",
      "Dhaka · Open to projects",
    ],
  },
  B: {
    eyebrow: "Arefin Mueen · Practical AI & Automation",
    headline: {
      line1: "Practical AI agents,",
      line2: "workflow automation,",
      line3: "and webhook systems —",
      line4: "built for real work.",
    },
    sub:
      "Reliable agents and automations that connect your tools, handle repetitive steps, and remove manual friction.",
    trust: [
      "Clear scoping before build",
      "Documented handoff",
      "You own 100% of the workflows",
    ],
  },
  C: {
    eyebrow: "Arefin Mueen · AI Automation Developer",
    headline: {
      line1: "Practical",
      line2: "AI automation &",
      line3: "agent developer.",
      line4: "Hands-on builder.",
    },
    sub:
      "Direct communication, practical architecture, and complete documentation on every project.",
    trust: [
      "Practical solutions",
      "You own accounts and code",
      "Video walkthroughs included",
    ],
  },
};

export const ACTIVE_HERO: keyof typeof HERO_VARIANTS = "A";
