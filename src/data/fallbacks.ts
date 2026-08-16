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
  name: "Arefin Mueen",
  role: "AI-Powered Full-Stack Developer & Web Designer",
  email: process.env.CONTACT_EMAIL ?? "hello@tensorix.me",
  phone: process.env.CONTACT_PHONE ?? "+880 1994-605717",
  phoneE164: process.env.CONTACT_PHONE_E164 ?? "8801994605717",
  tagline:
    "I design and build intelligent web applications, conversion-driven websites, AI agents, and production automation systems.",
  siteDescription:
    "Arefin Mueen is an AI-Powered Full-Stack Developer and Web Designer based in Dhaka. I design and build intelligent websites, web applications, AI agents, and automated workflows.",
  availability: "Accepting new projects",
  availabilityNote: "Direct engineering · Free 30-min discovery call",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61588840534814",
    whatsapp: process.env.WHATSAPP_URL ?? "https://wa.me/8801994605717",
    email: `mailto:${process.env.CONTACT_EMAIL ?? "hello@tensorix.me"}`,
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
    tag: "Discovery",
    name: "Discovery & Architecture Call",
    price: "Free · 30 minutes",
    cadence: "One call · no obligation",
    summary:
      "A focused conversation to map your product roadmap or workflows, identify high-leverage full-stack/AI opportunities, and agree on next steps in writing.",
    deliverables: [
      "System/architecture map of your application or workflow",
      "Shortlist of highest-ROI web/AI build opportunities",
      "Written proposal with scope and delivery milestones",
      "No obligation — you keep the blueprint either way",
    ],
    ideal: "Start here if you have a product vision or operational bottleneck.",
    featured: false,
    order: 0,
  },
  {
    _id: "engagement.sprint",
    tag: "Sprint",
    name: "Product / Automation Sprint",
    price: "Quoted after call",
    cadence: "2 weeks · fixed scope",
    summary:
      "A time-boxed build for a key feature, conversion landing system, AI agent, or custom workflow integration — with clear acceptance criteria.",
    deliverables: [
      "One full feature, web system, or AI pipeline shipped end-to-end",
      "Acceptance criteria agreed before build starts",
      "Loom walkthrough + complete handoff documentation",
      "30-day post-launch support included",
    ],
    ideal: "When you need a high-impact product milestone shipped fast.",
    featured: false,
    order: 1,
  },
  {
    _id: "engagement.build",
    tag: "Build",
    name: "Full-Stack & AI Systems Build",
    price: "Quoted after call",
    cadence: "4–8 weeks · milestone-based",
    summary:
      "End-to-end design and engineering of a full-stack web application, custom website, or multi-agent automation platform with production observability.",
    deliverables: [
      "Full-stack frontend, backend, and database architecture",
      "Bespoke UI/UX design with responsive interactions",
      "Integrated AI capabilities and automated backend pipelines",
      "Documentation, code repository handover, and deployment support",
    ],
    ideal: "For founders and teams building serious web apps and digital products.",
    featured: true,
    ctaLabel: "Start a project",
    order: 2,
  },
  {
    _id: "engagement.retainer",
    tag: "Partner",
    name: "Dedicated Engineering Partner",
    price: "Quoted after call",
    cadence: "Monthly · ongoing capacity",
    summary:
      "Ongoing senior product engineering capacity for your web application, AI agents, and automations — feature releases, monitoring, and scaling.",
    deliverables: [
      "Continuous feature engineering and UI/UX refinement",
      "Live monitoring and error handling across web and AI flows",
      "Monthly roadmap alignment and priority execution",
      "Direct communication via Slack / WhatsApp",
    ],
    ideal: "When web engineering and AI are core to your ongoing business growth.",
    featured: false,
    order: 3,
  },
];

export const FALLBACK_SERVICES: ServiceDoc[] = [
  {
    _id: "service.conversion-websites",
    title: "AI-Powered Websites & Web Design",
    iconName: "code",
    hook: "Bespoke, high-performance web systems engineered to convert.",
    problem:
      "Generic template websites look bland, load slowly, and fail to capture, qualify, or route inbound visitors effectively.",
    solution:
      "I design and engineer custom Next.js websites with polished UI design, fluid animations, dynamic CMS content, and integrated AI chat and booking workflows.",
    outcome: "A memorable digital flagship that converts visitors and automates lead capture.",
    bullets: [
      "Next.js, React, Tailwind CSS, and Sanity CMS",
      "Interactive UI/UX design with mobile-first responsiveness",
      "Embedded AI assistants, WhatsApp routing, and booking flows",
    ],
    ctaLabel: "Start a web project",
    ctaPrefill:
      "Hi Arefin! I'd like to build or redesign a website. Here's what we need: ",
    isFeatured: true,
    badge: "Flagship",
    description:
      "Custom web design and modern frontend engineering with Next.js, Tailwind CSS, CMS architecture, and seamless AI agent integrations.",
    order: 0,
  },
  {
    _id: "service.fullstack-apps",
    title: "Full-Stack Web Applications & SaaS",
    iconName: "layers",
    hook: "Scalable web apps, internal tools, and dashboards built end-to-end.",
    problem:
      "Building a software product requires juggling UI, databases, backend logic, auth, and APIs — and disjointed teams cause delays and technical debt.",
    solution:
      "I build full-stack web applications with Next.js/React on the frontend, Node.js/Python on the backend, PostgreSQL/Supabase databases, and secure authentication.",
    outcome: "Production-ready web applications with fast interfaces and robust data pipelines.",
    bullets: [
      "Frontend (React, Next.js, TypeScript, Tailwind)",
      "Backend & Database (Node.js, Python, PostgreSQL, REST/GraphQL)",
      "Auth, permissions, payment gateways, and cloud deployment",
    ],
    ctaLabel: "Discuss your app",
    ctaPrefill:
      "Hi Arefin! I'm planning a web application / SaaS product. Here's the concept: ",
    isFeatured: true,
    order: 1,
  },
  {
    _id: "service.agent-chatbot",
    title: "AI Agents & Intelligent Assistants",
    iconName: "agent",
    hook: "Autonomous AI agents that reason, take actions, and handle complex queries.",
    problem:
      "Traditional chatbots give robotic static answers, while human teams get overwhelmed with repetitive inquiries and after-hours support tickets.",
    solution:
      "I build AI agents powered by Claude and OpenAI that connect to your database, qualify leads, schedule meetings, and execute tasks with reliable human handoff.",
    outcome: "24/7 intelligent customer interaction with measurable conversion impact.",
    bullets: [
      "Autonomous web, WhatsApp, and Messenger agents",
      "Tool-calling, CRM integration, and calendar scheduling",
      "Contextual reasoning with graceful human escalation",
    ],
    ctaLabel: "Build an AI agent",
    ctaPrefill:
      "Hi Arefin! I want to build an AI agent for our business. Here's what it should do: ",
    isFeatured: false,
    order: 2,
  },
  {
    _id: "service.workflow-automation",
    title: "Business Automation Systems",
    iconName: "workflow",
    hook: "Eliminate repetitive manual operations across your entire software stack.",
    problem:
      "Teams lose dozens of hours every week manually copying data between CRMs, spreadsheets, email inboxes, and internal project tools.",
    solution:
      "I engineer robust event-driven workflows on n8n, Make, and custom Python microservices with comprehensive error handling, retries, and logging.",
    outcome: "Hours saved each week and reliable operational execution that never drops the ball.",
    bullets: [
      "n8n, Make, custom Python scripts, and webhooks",
      "CRM sync, automated invoicing, and multi-app reporting",
      "Enterprise error handling, alerts, and complete documentation",
    ],
    ctaLabel: "Automate operations",
    ctaPrefill:
      "Hi Arefin! We have repetitive manual workflows we'd like to automate. Here are our current tools: ",
    isFeatured: false,
    order: 3,
  },
];

export const FALLBACK_FAQS: FaqDoc[] = [
  {
    _id: "faq.technical",
    question: "Do I need technical specifications before reaching out?",
    answer:
      "No. Whether you have a detailed PRD or just a clear business goal, we start with a 30-minute discovery call to map out the right architecture, user journey, and technical scope.",
    order: 0,
  },
  {
    _id: "faq.tools",
    question: "What technologies and tools do you use?",
    answer:
      "For Web & Full-Stack: Next.js, React, TypeScript, Tailwind CSS, Node.js, Python, PostgreSQL, Prisma, Supabase, Sanity CMS. For AI & Agents: OpenAI, Anthropic Claude, LangChain, Pinecone/pgvector, RAG architectures. For Automation: n8n, Make, REST APIs, and webhooks.",
    order: 1,
  },
  {
    _id: "faq.integrations",
    question: "Can you integrate with my existing backend, CRM, or APIs?",
    answer:
      "Yes. If a tool has an API, database connection, or webhook support, I can integrate it seamlessly into your website, web application, or automation workflows.",
    order: 2,
  },
  {
    _id: "faq.timeline",
    question: "How long does a typical project take?",
    answer:
      "A focused 2-week sprint covers tightly-scoped landing systems, AI agents, or specific automations. Comprehensive full-stack web applications or custom websites typically take 4–8 weeks with milestone reviews.",
    order: 3,
  },
  {
    _id: "faq.ownership",
    question: "Who owns the code and intellectual property after launch?",
    answer:
      "You own 100% of everything. All code, database schemas, CMS configurations, and deployment setups are deployed under your accounts and repositories with full handover documentation.",
    order: 4,
  },
  {
    _id: "faq.post-launch",
    question: "What support is included after launch?",
    answer:
      "Every project includes 30 days of launch support to resolve any edge cases, optimize performance, and ensure smooth team adoption. Ongoing retainer partnerships are also available.",
    order: 5,
  },
  {
    _id: "faq.industries",
    question: "What types of clients and products do you work with?",
    answer:
      "I work with founders, startups, service businesses, clinics, e-commerce brands, and agency owners across North America, the GCC, and Asia looking for premium web products and intelligent automation.",
    order: 6,
  },
  {
    _id: "faq.pricing",
    question: "How is pricing structured?",
    answer:
      "Projects are quoted with transparent, fixed-price milestones based on scope and deliverables agreed upon during our discovery call — no surprise fees or ambiguous hourly billings.",
    order: 7,
  },
];

export const FALLBACK_TESTIMONIALS: TestimonialDoc[] = [
  {
    _id: "testimonial.example.beauty",
    name: "Example engagement",
    role: "Beauty studio · Dhaka",
    content:
      "A Messenger qualification bot trained on the studio's services and FAQs, integrated with their booking calendar and a clear human handoff for complex enquiries. After-hours leads now get an instant reply and a tentative time before the team opens the next morning.",
    rating: 5,
    image: null,
    verified: false,
  },
  {
    _id: "testimonial.example.realestate",
    name: "Example engagement",
    role: "Real-estate brokerage · Dubai",
    content:
      "An inbound lead workflow that captures enquiries from the website and WhatsApp, qualifies them with a short AI conversation, and routes hot leads into the agent's calendar with full context. Manual lead-intake time on the brokerage side dropped substantially.",
    rating: 5,
    image: null,
    verified: false,
  },
  {
    _id: "testimonial.example.dental",
    name: "Example engagement",
    role: "Dental clinic · Toronto",
    content:
      "A conversion-focused website with online intake forms and automated appointment reminders, wired into their existing practice-management system. New-patient enquiries now arrive pre-qualified with the right context for the front desk.",
    rating: 5,
    image: null,
    verified: false,
  },
];

export const FALLBACK_HERO: HeroDoc = {
  _id: "hero.fallback",
  eyebrow: "Arefin Mueen · AI-Powered Full-Stack Developer & Web Designer",
  headline:
    "I build intelligent digital products with AI.",
  subheadline:
    "Websites, web apps, AI agents, and automated systems designed and engineered to solve real business problems.",
  trustLine:
    "Next.js · React · TypeScript · Python · n8n · LangChain · LLMs",
  scarcityPill: "Limited project capacity · Free 30-min discovery call",
  primaryCTA: { label: "Start a project", href: "/contact" },
  secondaryCTA: { label: "View selected work", href: "/projects" },
};

export const FALLBACK_SKILLS: SkillCategoryDoc[] = [
  {
    _id: "skill.web-frontend",
    iconName: "code",
    category: "Web & Frontend Engineering",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "UI/UX Design", "Framer Motion"],
    order: 0,
  },
  {
    _id: "skill.fullstack-backend",
    iconName: "layers",
    category: "Full-Stack & Backend",
    items: [
      "Node.js",
      "Python",
      "PostgreSQL",
      "REST & GraphQL APIs",
      "Authentication & Security",
      "Prisma / Supabase",
    ],
    order: 1,
  },
  {
    _id: "skill.ai-agents",
    iconName: "brain",
    category: "AI Agents & LLM Systems",
    items: [
      "LangChain",
      "RAG & Vector DBs",
      "Multi-Agent Orchestration",
      "Prompt Engineering",
      "Claude & OpenAI APIs",
      "Fine-tuning & Evaluation",
    ],
    order: 2,
  },
  {
    _id: "skill.automation-ops",
    iconName: "workflow",
    category: "Automation & Infrastructure",
    items: ["n8n", "Make & Zapier", "Webhooks & Event Sync", "Docker", "Vercel", "System Monitoring"],
    order: 3,
  },
];

export const FALLBACK_PROJECTS: ProjectDoc[] = [
  {
    _id: "project.lead-qualification",
    title: "AI Lead Qualification & Web Intake Agent",
    slug: "ai-lead-qualification-agent",
    summary:
      "Full-stack lead qualification engine integrating Next.js interactive intake forms, LangChain reasoning, and real-time Slack/CRM webhook routing.",
    outcome: "Replaced manual triage with an instant, structured intake flow.",
    stack: ["Next.js", "TypeScript", "LangChain", "OpenAI", "Slack API"],
    iconName: "agent",
    category: "Full-Stack & AI",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.gohighlevel-bot",
    title: "Conversational Booking & Scheduling Bot",
    slug: "gohighlevel-booking-bot",
    summary:
      "Autonomous scheduling assistant connecting custom web booking interfaces with Twilio SMS, Google Calendar, and CRM deal pipelines.",
    outcome: "Automated calendar scheduling with instant confirmation and reminders.",
    stack: ["React", "Node.js", "GoHighLevel", "OpenAI", "Twilio"],
    iconName: "chart",
    category: "Product & AI",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.content-pipeline",
    title: "Automated Content Engine & Media Pipeline",
    slug: "content-repurposing-pipeline",
    summary:
      "Event-driven media processing system that ingests long-form video, generates multi-channel social assets via LLMs, and schedules distribution.",
    outcome: "10+ ready-to-publish assets generated from a single video in minutes.",
    stack: ["Python", "FastAPI", "Make", "OpenAI", "FFmpeg"],
    iconName: "layers",
    category: "Media Automation",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.kb-chatbot",
    title: "Internal Knowledge Base & RAG Copilot",
    slug: "internal-knowledge-base-chatbot",
    summary:
      "Retrieval-augmented assistant indexed across technical docs, Notion wikis, and SOPs with semantic vector search and source citations.",
    outcome: "Instant verifiable answers to internal queries with citations.",
    stack: ["Python", "LangChain", "Pinecone", "OpenAI", "Next.js"],
    iconName: "bookmark",
    category: "RAG & Knowledge",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.ecom-autoreply",
    title: "E-Commerce Customer Operations System",
    slug: "e-commerce-auto-reply-agent",
    summary:
      "Automated e-commerce customer support and order-tracking system integrated with Shopify API, Stripe, and brand-aligned email drafting.",
    outcome: "Instant resolution for order status and tracking inquiries.",
    stack: ["Shopify API", "Node.js", "n8n", "OpenAI", "Stripe API"],
    iconName: "spark",
    category: "E-Commerce & Ops",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.cold-outreach",
    title: "B2B Pipeline & Intelligent Outreach System",
    slug: "ai-cold-outreach-system",
    summary:
      "Automated lead enrichment, ICP scoring, and personalized communication pipeline connecting Apollo, PostgreSQL, and email dispatchers.",
    outcome: "Enriched prospect research with high-deliverability email routing.",
    stack: ["Python", "n8n", "PostgreSQL", "OpenAI", "Apollo API"],
    iconName: "rocket",
    category: "Data & Automation",
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
