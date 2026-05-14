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
  role: "AI Automation Engineer & Agent Developer",
  email: process.env.CONTACT_EMAIL ?? "hello@tensorix.ai",
  phone: process.env.CONTACT_PHONE ?? "+880 1994-605717",
  phoneE164: process.env.CONTACT_PHONE_E164 ?? "8801994605717",
  tagline:
    "AI systems that turn repetitive work into reliable workflows. Practical agents, automation, and web systems for small teams.",
  siteDescription:
    "Tensorix is a founder-led AI systems studio run by Arefin Muin. We design and build reliable AI agents, workflow automation, API integrations, and conversion-focused web systems for small teams.",
  availability: "Accepting new engagements",
  availabilityNote: "Limited project capacity · Free 30-min systems audit",
  social: {
    // TODO: replace with branded /tensorix page once it exists.
    facebook: "https://www.facebook.com/profile.php?id=61588840534814",
    whatsapp: process.env.WHATSAPP_URL ?? "https://wa.me/8801994605717",
    email: `mailto:${process.env.CONTACT_EMAIL ?? "hello@tensorix.ai"}`,
  },
  heroTiles: [],
  live30Days: [],
  showLiveTicker: false,
  showHeroTiles: false,
  showLive30Days: false,
};

export const FALLBACK_ENGAGEMENTS: EngagementDoc[] = [
  {
    _id: "engagement.audit",
    tag: "Audit",
    name: "Systems audit",
    price: "Free · 30 minutes",
    cadence: "One call · no obligation",
    summary:
      "A focused conversation to map your current workflows, surface the highest-leverage automation opportunities, and agree on next steps in writing.",
    deliverables: [
      "Workflow map of where time is being lost",
      "Shortlist of the 2–3 highest-ROI automations",
      "Written recommendation + indicative scope",
      "No obligation — you keep the notes either way",
    ],
    ideal: "Start here if you're not yet sure what to automate or where to begin.",
    featured: false,
    order: 0,
  },
  {
    _id: "engagement.sprint",
    tag: "Sprint",
    name: "Focused automation sprint",
    price: "Quoted after audit",
    cadence: "2 weeks · fixed scope",
    summary:
      "A time-boxed build for one tightly-scoped workflow, agent, or integration — with acceptance criteria agreed up-front.",
    deliverables: [
      "One workflow, agent, or integration shipped end-to-end",
      "Acceptance criteria defined before build",
      "Loom walkthrough + written handoff documentation",
      "30-day launch support after go-live",
    ],
    ideal: "When you know exactly which workflow needs to be automated.",
    featured: false,
    order: 1,
  },
  {
    _id: "engagement.build",
    tag: "Build",
    name: "AI systems build",
    price: "Quoted after audit",
    cadence: "4–8 weeks · milestone-based",
    summary:
      "End-to-end design and build of a multi-workflow agent system or integration, with documentation and observability built in.",
    deliverables: [
      "Architecture + integration map",
      "Custom code where the no-code stack stops",
      "Real-data testing, logging, and error handling",
      "Documentation, handoff training, source under your repo",
    ],
    ideal: "For teams replacing brittle tools with one durable system.",
    featured: true,
    ctaLabel: "Book a free systems audit",
    order: 2,
  },
  {
    _id: "engagement.retainer",
    tag: "Retainer",
    name: "Ongoing automation partner",
    price: "Quoted after audit",
    cadence: "Monthly · ongoing capacity",
    summary:
      "Ongoing engineering capacity for your live AI and automation stack — monitoring, improvements, and new flows as you grow.",
    deliverables: [
      "Monitoring and incident response on existing flows",
      "Monthly roadmap + improvement reporting",
      "New automations and agents as priorities shift",
      "Direct WhatsApp / email channel for the team",
    ],
    ideal: "When automation is a real part of your operation, not a side project.",
    featured: false,
    order: 3,
  },
];

export const FALLBACK_SERVICES: ServiceDoc[] = [
  {
    _id: "service.agent-chatbot",
    title: "AI Agent & Chatbot Systems",
    iconName: "agent",
    hook: "Capture and respond to more qualified leads, even outside business hours.",
    problem:
      "Inbound messages on your website, WhatsApp, and Messenger pile up faster than your team can reply, and qualified leads go cold while waiting for a response.",
    solution:
      "We design and ship AI chat agents that handle lead qualification, FAQs, appointment booking, and human handoff — trained on your real content and integrated with the tools you already use.",
    outcome: "Faster replies, fewer lost leads, and a clear audit trail on every conversation.",
    bullets: [
      "Web, WhatsApp, and Messenger chatbots",
      "Lead qualification + appointment booking",
      "Human handoff with full context",
    ],
    ctaLabel: "Book a free systems audit",
    ctaPrefill:
      "Hi Tensorix team! I'd like to talk about an AI agent or chatbot for my business. Here's the channel and the kind of questions it would handle: ",
    isFeatured: true,
    badge: "Most requested",
    description:
      "AI chat agents for your website, WhatsApp, and Messenger. We design them around your real content, integrate them with your existing CRM and tools, and build clear human handoff for the cases that matter.",
    order: 0,
  },
  {
    _id: "service.workflow-automation",
    title: "Workflow Automation",
    iconName: "workflow",
    hook: "Remove the repetitive operations work that doesn't need a human.",
    problem:
      "Your team spends hours every week on the same handoffs — CRM updates, follow-up emails, invoicing, internal notifications, and weekly reporting.",
    solution:
      "We build production workflows on n8n, Make, Zapier, and GoHighLevel with proper error handling, retries, and documentation so the automations keep running when you're not watching.",
    outcome: "Hours saved every week and consistent execution on the steps that used to slip.",
    bullets: [
      "n8n, Make, Zapier, GoHighLevel",
      "CRM updates, follow-ups, invoicing, reporting",
      "Error handling, logging, written documentation",
    ],
    ctaLabel: "Book a free systems audit",
    ctaPrefill:
      "Hi Tensorix team! I'd like to look at a workflow automation for my team. Here's what we do manually today: ",
    isFeatured: false,
    description:
      "Reliable workflow automation on n8n, Make, Zapier, and GoHighLevel — CRM updates, follow-ups, invoices, notifications, reporting — with error handling and documentation so things keep running when you stop watching.",
    order: 1,
  },
  {
    _id: "service.api-integrations",
    title: "API & System Integrations",
    iconName: "layers",
    hook: "Make the tools you already pay for talk to each other.",
    problem:
      "Data lives in too many places — Airtable, Notion, your CRM, Slack, Sheets, payment tools — and your team copies between them by hand.",
    solution:
      "We build REST APIs, webhooks, and SaaS-to-SaaS integrations that keep your systems in sync, with proper auth, retries, and observability.",
    outcome: "Single source of truth across tools, with fewer manual updates and fewer data mistakes.",
    bullets: [
      "REST APIs, webhooks, event-driven sync",
      "Airtable, Notion, Slack, Sheets, CRM, email, payments",
      "Auth, retries, monitoring built in",
    ],
    ctaLabel: "Book a free systems audit",
    ctaPrefill:
      "Hi Tensorix team! I'd like to integrate some of our tools. Here's what we use and what isn't talking to what: ",
    isFeatured: false,
    description:
      "REST APIs, webhooks, and SaaS-to-SaaS integrations between Airtable, Notion, Slack, Sheets, CRM, email, and payment tools — with auth, retries, and observability so the data stays clean.",
    order: 2,
  },
  {
    _id: "service.conversion-websites",
    title: "Conversion Websites with Automation",
    iconName: "code",
    hook: "Web systems, not generic web design — built to convert and run themselves.",
    problem:
      "A site that only looks good doesn't help if the forms, follow-ups, bookings, and chat don't actually work together.",
    solution:
      "We design and build fast websites with forms, WhatsApp, booking, analytics, AI chat, and CMS-editable content wired into your CRM and automation stack from day one.",
    outcome: "A site that captures, qualifies, and routes leads on its own — not just a brochure.",
    bullets: [
      "Fast, mobile-first websites with editable content",
      "Forms, WhatsApp, booking, payments, AI chat",
      "Wired into your CRM and automation stack",
    ],
    ctaLabel: "Book a free systems audit",
    ctaPrefill:
      "Hi Tensorix team! I'd like a website that ties into our automations and CRM. Here's our current site (or what we're starting from): ",
    isFeatured: false,
    description:
      "Conversion-focused websites built as web systems — with forms, WhatsApp, booking, analytics, AI chat, and CMS-editable content, wired into your CRM and automations from day one.",
    order: 3,
  },
];

export const FALLBACK_FAQS: FaqDoc[] = [
  {
    _id: "faq.technical",
    question: "Do I need technical knowledge to work with you?",
    answer:
      "No. Most of our clients are founders and small teams without engineering backgrounds. We translate between your business workflow and the technical implementation, and hand everything over with plain-language documentation and Loom walkthroughs.",
    order: 0,
  },
  {
    _id: "faq.tools",
    question: "What tools do you work with?",
    answer:
      "For automation: n8n, Make, Zapier, GoHighLevel. For agents and chat: OpenAI, Anthropic Claude, LangChain, LangFlow, web/Messenger/WhatsApp channels. For integrations: REST APIs, webhooks, Airtable, Notion, Slack, Google Sheets, common CRMs, email, and payment tools. For websites: Next.js, Sanity, Tailwind, Vercel.",
    order: 1,
  },
  {
    _id: "faq.integrations",
    question: "Can you integrate with my existing tools?",
    answer:
      "Almost always, yes. If a tool exposes a REST API, webhooks, or a Zapier/Make connector, we can integrate it. As part of the systems audit, we map your current stack and confirm what's possible before any build.",
    order: 2,
  },
  {
    _id: "faq.timeline",
    question: "How long does a project take?",
    answer:
      "A focused automation sprint is typically 2 weeks. A multi-workflow AI systems build is usually 4–8 weeks, milestone-based. We agree on the timeline and acceptance criteria in writing before the build starts.",
    order: 3,
  },
  {
    _id: "faq.ownership",
    question: "Who owns the system after launch?",
    answer:
      "You do. All accounts, source code, automations, agents, and documentation live in your accounts and your repositories. We hand everything over and walk your team through it on a recorded call.",
    order: 4,
  },
  {
    _id: "faq.post-launch",
    question: "What happens after launch?",
    answer:
      "Every engagement includes 30 days of launch support — we fix anything that doesn't meet the agreed acceptance criteria and answer questions while your team gets comfortable. After that, ongoing support is optional via the Automation Partner engagement.",
    order: 5,
  },
  {
    _id: "faq.industries",
    question: "Can you work with my industry?",
    answer:
      "If your business has customers, messages, leads, or repetitive operations, the answer is usually yes. Past work spans e-commerce, clinics, coaches, real estate, agencies, and local services across Bangladesh, the GCC, and North America. We'll tell you up-front if your industry has constraints we can't meet.",
    order: 6,
  },
];

// Anonymized example engagements — illustrative of the kind of work Tensorix
// ships, not real named-client quotes. Replace with real testimonials
// (with permission) as soon as they're available.
export const FALLBACK_TESTIMONIALS: TestimonialDoc[] = [
  {
    _id: "testimonial.example.beauty",
    name: "Example engagement",
    role: "Beauty studio · Dhaka",
    content:
      "A Messenger qualification bot trained on the studio's services and FAQs, integrated with their booking calendar and a clear human handoff for complex enquiries. After-hours leads now get an instant reply and a tentative time before the team opens the next morning.",
    rating: 5,
    image: null,
  },
  {
    _id: "testimonial.example.realestate",
    name: "Example engagement",
    role: "Real-estate brokerage · Dubai",
    content:
      "An inbound lead workflow that captures enquiries from the website and WhatsApp, qualifies them with a short AI conversation, and routes hot leads into the agent's calendar with full context. Manual lead-intake time on the brokerage side dropped substantially.",
    rating: 5,
    image: null,
  },
  {
    _id: "testimonial.example.dental",
    name: "Example engagement",
    role: "Dental clinic · Toronto",
    content:
      "A conversion-focused website with online intake forms and automated appointment reminders, wired into their existing practice-management system. New-patient enquiries now arrive pre-qualified with the right context for the front desk.",
    rating: 5,
    image: null,
  },
];

export const FALLBACK_HERO: HeroDoc = {
  _id: "hero.fallback",
  eyebrow: "Tensorix · AI Automation & Agent Engineering",
  headline:
    "AI systems that turn repetitive work into reliable workflows.",
  subheadline:
    "I help small teams automate lead handling, customer replies, CRM updates, reporting, and internal operations with practical AI agents, workflow automation, and integrated web systems.",
  trustLine:
    "Founder-led · n8n / Make / GoHighLevel · APIs · LLM agents · Websites",
  scarcityPill: "Limited project capacity · Free 30-min systems audit",
  primaryCTA: { label: "Book a free systems audit", href: "/book" },
  secondaryCTA: { label: "See services", href: "#services" },
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
