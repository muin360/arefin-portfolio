/**
 * Built-in fallback content. Used when Sanity is not configured (no
 * NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET) or when a
 * fetch fails.
 *
 * This keeps the site renderable out of the box and gives `/studio` editors
 * a reference for what shape the data should take. Once Sanity is wired
 * up and seeded, these values are silently superseded by the live content.
 *
 * The site owner edits the live values from `/studio` — these defaults are
 * only displayed as a safety net.
 */

import type {
  EngagementDoc,
  FaqDoc,
  HeroDoc,
  PostListItem,
  ProjectDoc,
  ServiceDoc,
  SiteConfig,
  SkillCategoryDoc,
  TestimonialDoc,
} from "@/sanity/types";

export const FALLBACK_SITE_CONFIG: SiteConfig = {
  name: "Arefin Muin",
  role: "AI Automation & Agent Engineer",
  email: "arefinmueen360@gmail.com",
  phone: "+880 1994-605717",
  phoneE164: "8801994605717",
  tagline:
    "AI engineer building agents, automation workflows and LLM-powered systems that quietly run in production.",
  siteDescription:
    "Tensor is an AI engineering studio. We design, ship and maintain AI agents, automation workflows and LLM-powered systems with n8n, LangChain, GoHighLevel, Python and TypeScript.",
  availability: "Available · accepting new engagements",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61588840534814",
    whatsapp: "https://wa.me/8801994605717",
    email: "mailto:arefinmueen360@gmail.com",
  },
  heroTiles: [],
  live30Days: [],
  showLiveTicker: false,
  showHeroTiles: false,
  showLive30Days: false,
};

export const FALLBACK_ENGAGEMENTS: EngagementDoc[] = [
  {
    _id: "engagement.sprint",
    tag: "Sprint",
    name: "Two-week sprint",
    price: "Custom quote",
    cadence: "2 weeks · fixed scope",
    summary:
      "A focused, time-boxed build for a single workflow or one tightly-scoped agent.",
    deliverables: [
      "Discovery + scoped proposal",
      "One workflow or one agent shipped",
      "Loom walkthrough + written handoff",
      "30-day reliability guarantee",
    ],
    ideal: "When you know exactly what you want and need it live this month.",
    featured: false,
    order: 0,
  },
  {
    _id: "engagement.build",
    tag: "Build",
    name: "Engineering engagement",
    price: "Custom quote",
    cadence: "4–8 weeks · milestone-based",
    summary:
      "End-to-end design and build of a multi-step automation or production-grade agent system.",
    deliverables: [
      "Architecture + integration map",
      "Custom code where it matters",
      "Real-data testing + observability",
      "Documentation, training, source under your repo",
    ],
    ideal: "For teams replacing brittle tools with one durable system.",
    featured: true,
    ctaLabel: "Talk on WhatsApp",
    order: 1,
  },
  {
    _id: "engagement.retainer",
    tag: "Retainer",
    name: "On-call studio",
    price: "Custom quote",
    cadence: "Monthly · ongoing capacity",
    summary:
      "Ongoing engineering capacity for your existing AI stack — improvements, monitoring, new agents.",
    deliverables: [
      "Same-day response on incidents",
      "Bi-weekly roadmap + reporting",
      "Continuous improvements + new flows",
      "Direct WhatsApp / email channel",
    ],
    ideal: "When AI is a real part of your operation, not a side project.",
    featured: false,
    order: 2,
  },
];

export const FALLBACK_SERVICES: ServiceDoc[] = [
  {
    _id: "service.ai-automation",
    title: "AI Automation",
    iconName: "agent",
    hook: "Get back 15–40 hours a month — without new software to learn.",
    problem:
      "Your team copies, pastes and replies the same things 40 times a week. Lead qualification, follow-ups and CRM updates eat your most expensive hours.",
    solution:
      "I build custom AI workflows on n8n, Zapier and Make that handle the repetitive 80% — sitting on top of the tools you already use.",
    outcome: "Save 15–40 hours every month. Zero new software.",
    bullets: [
      "Lead qualification + auto-routing",
      "AI follow-ups + CRM hygiene on autopilot",
      "Daily WhatsApp updates while building",
    ],
    ctaLabel: "See if your workflow can be automated",
    ctaPrefill:
      "Hi Arefin! I'd like to know if my workflow can be automated. Here's what my team does manually right now: ",
    isFeatured: false,
    description:
      "Your team copies, pastes and replies the same things 40 times a week. I build custom AI workflows on n8n, Zapier and Make that handle the repetitive 80% — lead qualification, follow-ups, CRM updates, AI replies. Get back 15–40 hours every month, zero new software to learn.",
    order: 0,
  },
  {
    _id: "service.messenger-automation",
    title: "Facebook & Messenger Automation",
    iconName: "chart",
    hook: "Reply in 30 seconds, all day, every day. Even at 3am.",
    problem:
      "Your Messenger inbox is your storefront — but DMs and comments pile up faster than you can reply. Hot leads go cold while you sleep.",
    solution:
      "A 24/7 AI Messenger bot that answers FAQs in your voice, qualifies buyers, books appointments — and only hands off when it actually matters.",
    outcome: "Reply in under 30s. Capture every lead. Sleep at night.",
    bullets: [
      "Answers FAQs in your brand voice",
      "Qualifies buyers + books appointments",
      "Smart human handoff for real opportunities",
    ],
    ctaLabel: "Get a free Messenger bot demo",
    ctaPrefill:
      "Hi Arefin! I'd like a free Messenger bot demo for my Facebook page. My page name is: ",
    isFeatured: true,
    badge: "Most Popular",
    description:
      "Your Messenger inbox is your storefront — but DMs and comments pile up faster than you can reply. I build a 24/7 AI Messenger bot that answers FAQs in your voice, qualifies buyers, books appointments and only hands off when it really matters. Reply in under 30 seconds, all day, every day.",
    order: 1,
  },
  {
    _id: "service.website-development",
    title: "Website Development",
    iconName: "code",
    hook: "A site built around one job: turning visitors into customers.",
    problem:
      "Your current site looks like 2017 and quietly tells visitors you're not the serious option. Buyers click away before they reach the form.",
    solution:
      "Fast, mobile-first websites with WhatsApp, booking and payment built in. Easy for you to update — no developer needed for small changes.",
    outcome: "Visitors that convert. Pages that load in <2s.",
    bullets: [
      "Mobile-first, conversion-focused design",
      "WhatsApp + booking + payment built in",
      "You can edit copy without calling me",
    ],
    ctaLabel: "Get a free 1-page website teardown",
    ctaPrefill:
      "Hi Arefin! I'd like a free teardown of my current website. My site is: ",
    isFeatured: false,
    description:
      "Your current site looks like 2017 and quietly tells visitors you're not the serious option. I ship fast, mobile-first websites built around one job: turning visitors into customers. WhatsApp, booking and payment built in. Easy for you to update — no developer needed for small changes.",
    order: 2,
  },
];

export const FALLBACK_FAQS: FaqDoc[] = [
  {
    _id: "faq.pricing",
    question: "How much does it cost?",
    answer:
      "Most AI automation projects fall between BDT 25,000–250,000 (~$200–$2,000) depending on scope. Messenger bots start at BDT 15,000 (~$125). Websites start at BDT 35,000 (~$300). We agree on a flat price before I start — no surprises, no hourly billing.",
    order: 0,
  },
  {
    _id: "faq.timeline",
    question: "How long does it take?",
    answer:
      "7–14 days for most automations and Messenger bots. 14–21 days for a complete website. You'll get daily updates on WhatsApp.",
    order: 1,
  },
  {
    _id: "faq.ownership",
    question: "Will I be able to run it after you leave?",
    answer:
      "Yes. Every project ships with Loom video walkthroughs, written docs, and 30 days of free post-launch support. If your team can't run it on Day 30 — it's not done.",
    order: 2,
  },
  {
    _id: "faq.tools",
    question: "What if I don't have a CRM or the right tools yet?",
    answer:
      "No problem. I'll recommend the simplest stack for your size and budget — usually free or low-cost tools you'll actually use. I make money building, not reselling software.",
    order: 3,
  },
  {
    _id: "faq.industries",
    question: "Do you work with my industry?",
    answer:
      "If your business has customers, messages, leads or repetitive tasks — yes. So far: e-commerce, dental & beauty clinics, coaches, real estate, online agencies and local services across Bangladesh, the GCC and the US.",
    order: 4,
  },
  {
    _id: "faq.guarantee",
    question: "What if it doesn't work?",
    answer:
      "The 30-min audit call is free, no obligation. If you start a project and the system doesn't deliver the agreed outcome by handoff, I'll keep working on it without billing more — until it does.",
    order: 5,
  },
];

export const FALLBACK_TESTIMONIALS: TestimonialDoc[] = [];

export const FALLBACK_HERO: HeroDoc = {
  _id: "hero.fallback",
  eyebrow: "AI automation, Messenger bots & websites for small businesses",
  headline: "We build the systems that bring you more leads — while you sleep.",
  subheadline:
    "Done-for-you AI chatbots, Facebook & Messenger automation, and high-converting websites. Built in days, not months. Owned by you, not us.",
  trustLine: "Reply in 1 hour · Written plan in 48 hrs · 2 spots left this month",
  scarcityPill: "Booking 2 clients this month · Free 30-min audit",
  primaryCTA: { label: "Get my free 30-min audit", href: "/book" },
  secondaryCTA: { label: "See how it works", href: "#services" },
};

export const FALLBACK_SKILLS: SkillCategoryDoc[] = [
  {
    _id: "skill.automation-platforms",
    iconName: "workflow",
    category: "Automation Platforms",
    items: ["n8n", "Zapier", "Make (Integromat)", "GoHighLevel"],
    order: 0,
  },
  {
    _id: "skill.ai-llm-tools",
    iconName: "brain",
    category: "AI / LLM Tools",
    items: [
      "LangChain",
      "LangFlow",
      "OpenAI API",
      "Anthropic Claude",
      "Prompt Engineering",
      "RAG / Vector DBs",
    ],
    order: 1,
  },
  {
    _id: "skill.programming",
    iconName: "terminal",
    category: "Programming",
    items: ["Python", "JavaScript", "TypeScript", "Node.js", "REST APIs"],
    order: 2,
  },
  {
    _id: "skill.currently-learning",
    iconName: "rocket",
    category: "Currently Learning",
    items: ["LLM Engineering", "Fine-tuning", "Evaluation & Observability"],
    order: 3,
  },
];

export const FALLBACK_PROJECTS: ProjectDoc[] = [
  {
    _id: "project.lead-qualification",
    title: "AI Lead Qualification Agent",
    slug: "ai-lead-qualification-agent",
    summary:
      "An LLM-powered agent that ingests inbound leads, enriches them with public data, scores them, and routes hot ones to the sales team via Slack.",
    outcome: "Cut response time 4h → 6 min, lifted lead-to-meeting 45%.",
    stack: ["LangChain", "n8n", "OpenAI", "Slack API"],
    iconName: "agent",
    category: "Agent",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.gohighlevel-bot",
    title: "GoHighLevel Booking Bot",
    slug: "gohighlevel-booking-bot",
    summary:
      "Conversational SMS and email bot built on GoHighLevel that books appointments, answers FAQs, and hands off to a human when the conversation requires it.",
    outcome: "Booked 60% of qualified inbound conversations with no human in the loop.",
    stack: ["GoHighLevel", "OpenAI", "Twilio"],
    iconName: "chart",
    category: "Bot",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.content-pipeline",
    title: "Content Repurposing Pipeline",
    slug: "content-repurposing-pipeline",
    summary:
      "A Make.com workflow that turns one long-form video into 10+ pieces of social content using LLM summarization and templated rendering.",
    outcome: "1 hour of video → 12 ready-to-post pieces in under 15 minutes.",
    stack: ["Make", "OpenAI", "FFmpeg"],
    iconName: "layers",
    category: "Pipeline",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.kb-chatbot",
    title: "Internal Knowledge-Base Chatbot",
    slug: "internal-knowledge-base-chatbot",
    summary:
      "A retrieval-augmented chatbot over a company's docs, SOPs and Notion workspace — answers staff questions in seconds with source citations.",
    outcome: "Reduced internal SOP questions by ~70% in the first month.",
    stack: ["LangFlow", "Pinecone", "OpenAI", "Python"],
    iconName: "bookmark",
    category: "RAG",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.ecom-autoreply",
    title: "E-commerce Auto-Reply Agent",
    slug: "e-commerce-auto-reply-agent",
    summary:
      "Zapier and OpenAI automation that drafts and sends personalized customer support replies, escalating complex tickets to humans.",
    outcome: "Auto-resolved ~55% of Tier-1 tickets with brand-tone replies.",
    stack: ["Zapier", "OpenAI", "Gmail API"],
    iconName: "spark",
    category: "Agent",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.cold-outreach",
    title: "AI Cold-Outreach System",
    slug: "ai-cold-outreach-system",
    summary:
      "Multi-step sequence that researches each prospect, generates a personalized opener, and sends through a warmed-up inbox at scale.",
    outcome: "350+ personalized openers per day per sender, 11% reply rate.",
    stack: ["n8n", "OpenAI", "Apollo", "SMTP"],
    iconName: "rocket",
    category: "Outreach",
    featured: false,
    thumbnail: null,
  },
];

export const FALLBACK_POSTS: PostListItem[] = [
  {
    _id: "post.ai-automation-no-longer-optional",
    title: "AI automation is no longer optional",
    slug: "why-every-business-needs-ai-automation",
    excerpt:
      "The companies winning right now aren't the ones with the most headcount. They're the ones whose teams stopped doing repetitive work years ago.",
    date: "2025-04-12",
    readingTime: "5 min read",
    category: "Strategy",
    tags: ["AI", "Automation", "Business"],
    coverImage: null,
  },
  {
    _id: "post.n8n-vs-zapier-vs-make",
    title: "n8n vs Zapier vs Make: an honest comparison",
    slug: "n8n-vs-zapier-vs-make",
    excerpt:
      "I've shipped production workflows on all three. The right choice depends on three variables — complexity, volume, and who's going to maintain it.",
    date: "2025-03-28",
    readingTime: "7 min read",
    category: "Tools",
    tags: ["n8n", "Zapier", "Make"],
    coverImage: null,
  },
  {
    _id: "post.gohighlevel-vs-custom",
    title: "GoHighLevel vs custom build: when each one wins",
    slug: "gohighlevel-vs-custom-build",
    excerpt:
      "Most agencies and service businesses are choosing between GoHighLevel and a custom system. The right answer is GoHighLevel about 70% of the time. Here's how to tell which side you're on.",
    date: "2025-03-04",
    readingTime: "6 min read",
    category: "Tools",
    tags: ["GoHighLevel", "Custom", "Strategy"],
    coverImage: null,
  },
];
