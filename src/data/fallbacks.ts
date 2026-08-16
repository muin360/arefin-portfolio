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
  role: "AI Automation & AI Agent Developer",
  email: process.env.CONTACT_EMAIL ?? "hello@tensorix.me",
  phone: process.env.CONTACT_PHONE ?? "+880 1994-605717",
  phoneE164: process.env.CONTACT_PHONE_E164 ?? "8801994605717",
  tagline:
    "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
  siteDescription:
    "Arefin Mueen is an AI Automation & AI Agent Developer based in Dhaka. I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
  availability: "Open to new projects",
  availabilityNote: "Open to AI automation & agent projects",
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
    tag: "Scoping",
    name: "Workflow Discovery & Scoping",
    price: "Free · 30 minutes",
    cadence: "One call · no obligation",
    summary:
      "A focused conversation to understand the repetitive tasks in your business and explore what can be automated with AI agents, n8n, or APIs.",
    deliverables: [
      "Review of your current manual workflow steps",
      "Identification of feasible automation opportunities",
      "Clear technical recommendation and proposed workflow architecture",
      "No obligation — you keep the scoping notes",
    ],
    ideal: "Start here to explore what AI automation can do for your business.",
    featured: false,
    order: 0,
  },
  {
    _id: "engagement.sprint",
    tag: "Workflow",
    name: "Custom AI Workflow Build",
    price: "Project-based",
    cadence: "1–2 weeks · defined scope",
    summary:
      "Design and implementation of an automated workflow connecting your tools, forms, CRM, or email with AI processing and webhooks.",
    deliverables: [
      "Fully configured n8n or Zapier workflow with error handling",
      "AI prompt engineering and tool integration",
      "Complete workflow documentation and walkthrough video",
      "Post-launch testing and verification",
    ],
    ideal: "When you have a specific workflow ready to be automated.",
    featured: true,
    ctaLabel: "Let's build an automation",
    order: 1,
  },
  {
    _id: "engagement.build",
    tag: "Agent / RAG",
    name: "AI Agent & Knowledge System",
    price: "Project-based",
    cadence: "2–4 weeks · milestone-based",
    summary:
      "Development of an autonomous AI agent, multi-agent research pipeline, or document-grounded RAG assistant tailored to your specific use case.",
    deliverables: [
      "Custom AI agent with tool-calling and API connections",
      "RAG document parsing, embedding, and vector search setup",
      "Web, WhatsApp, or Slack interface connection",
      "Complete code/workflow handover with setup instructions",
    ],
    ideal: "For teams needing intelligent assistants or automated research workflows.",
    featured: false,
    order: 2,
  },
  {
    _id: "engagement.retainer",
    tag: "Support",
    name: "Automation Support & Maintenance",
    price: "Monthly",
    cadence: "Ongoing support",
    summary:
      "Ongoing maintenance, monitoring, and iterative improvements for your active AI workflows, webhooks, and agent integrations.",
    deliverables: [
      "Workflow health checks and error troubleshooting",
      "Prompt updates and model performance tuning",
      "Iterative additions and new integrations as needed",
      "Direct communication channel for support",
    ],
    ideal: "For businesses wanting reliable ongoing maintenance of their automation stack.",
    featured: false,
    order: 3,
  },
];

export const FALLBACK_SERVICES: ServiceDoc[] = [
  {
    _id: "service.workflow-automation",
    title: "AI Workflow Automation",
    iconName: "workflow",
    hook: "Automate repetitive operational tasks across your business apps.",
    problem:
      "Teams spend countless hours manually copying data between email inboxes, spreadsheets, CRMs, and internal communication channels.",
    solution:
      "I design and build automated workflows on n8n and Zapier that connect your apps, process data with LLMs, and handle tasks automatically with structured error handling.",
    outcome: "Hours saved every week and reliable execution of repetitive operational tasks.",
    bullets: [
      "n8n and Zapier automated workflow design",
      "CRM sync, automated email triage, and notifications",
      "Webhook triggers, data transformations, and error handling",
    ],
    ctaLabel: "Discuss an automation",
    ctaPrefill:
      "Hi Arefin! I'd like to automate a repetitive workflow. Here's what we currently do manually: ",
    isFeatured: true,
    badge: "Specialization",
    description:
      "Automate manual business processes using n8n, Zapier, APIs, and LLMs — from inbox triage to CRM sync and automated notifications.",
    order: 0,
  },
  {
    _id: "service.agent-chatbot",
    title: "AI Agents & Autonomous Assistants",
    iconName: "agent",
    hook: "Intelligent assistants that reason, use tools, and execute multi-step actions.",
    problem:
      "Standard chatbots are limited to rigid canned replies, while team members get bogged down answering repetitive questions and performing simple lookup tasks.",
    solution:
      "I build AI agents with tool-calling capabilities using LangChain, Langflow, and OpenAI/Claude APIs that can query databases, perform research, and trigger actions.",
    outcome: "Autonomous task handling with contextual reasoning and clear human handoff.",
    bullets: [
      "Custom tool-calling agents and task execution",
      "Web, WhatsApp, and Slack conversational assistants",
      "Prompt engineering and structured output validation",
    ],
    ctaLabel: "Build an AI agent",
    ctaPrefill:
      "Hi Arefin! I want to build an AI agent for our business. Here's what it should do: ",
    isFeatured: true,
    order: 1,
  },
  {
    _id: "service.rag-systems",
    title: "RAG & Knowledge Retrieval Systems",
    iconName: "brain",
    hook: "Give your AI assistant access to your company's actual documents and SOPs.",
    problem:
      "General LLMs hallucinate or lack the specific internal knowledge needed to answer questions about your company's products, policies, or documentation.",
    solution:
      "I implement retrieval-augmented generation (RAG) pipelines that vectorize and index your internal docs, allowing assistants to cite exact source references.",
    outcome: "Accurate, citation-backed answers grounded in your verified company data.",
    bullets: [
      "Document ingestion, chunking, and vector database indexing",
      "Semantic search and context-aware answer generation",
      "Source citation tracking and hallucination reduction",
    ],
    ctaLabel: "Explore RAG setup",
    ctaPrefill:
      "Hi Arefin! We have internal documentation we'd like our AI assistant to reference: ",
    isFeatured: false,
    order: 2,
  },
  {
    _id: "service.multi-agent",
    title: "Multi-Agent Research & Data Workflows",
    iconName: "layers",
    hook: "Coordinated crews of specialized agents working together on complex tasks.",
    problem:
      "Complex research and synthesis tasks require multiple perspectives — searching, analyzing, drafting, and reviewing — which single prompts struggle to do well.",
    solution:
      "I build multi-agent architectures where distinct agents collaborate sequentially to gather data, analyze insights, and produce structured reports.",
    outcome: "Comprehensive, structured research reports generated from simple initial inputs.",
    bullets: [
      "Role-based agent orchestration (Researcher, Analyst, Writer, Critic)",
      "Automated web search and data extraction pipelines",
      "Structured output formatting in markdown, JSON, or Google Docs",
    ],
    ctaLabel: "Build a multi-agent flow",
    ctaPrefill:
      "Hi Arefin! I'd like to explore a multi-agent workflow for our research/analysis needs: ",
    isFeatured: false,
    order: 3,
  },
];

export const FALLBACK_FAQS: FaqDoc[] = [
  {
    _id: "faq.technical",
    question: "What tools and platforms do you specialize in?",
    answer:
      "I specialize in n8n, Zapier, Langflow, LangChain, OpenAI & Anthropic Claude APIs, vector databases (Pinecone), webhooks, and REST APIs. I also write custom Python and JavaScript scripts for custom data transformations and integration glue.",
    order: 0,
  },
  {
    _id: "faq.approach",
    question: "How do you approach a new automation project?",
    answer:
      "We start by mapping the exact manual steps of your workflow from trigger to output. I then design a clean, testable automation prototype, connect the required APIs and LLM prompts, add error handling, and walk you through how it operates.",
    order: 1,
  },
  {
    _id: "faq.integrations",
    question: "Can you connect with my existing business tools?",
    answer:
      "Yes. As long as a tool provides an API, webhook support, or a connector in n8n or Zapier (such as Gmail, Slack, Google Sheets, Airtable, Typeform, Shopify, or CRMs), I can integrate it into an automated workflow.",
    order: 2,
  },
  {
    _id: "faq.timeline",
    question: "How long does it take to build an automation?",
    answer:
      "Focused single-workflow automations typically take 1–2 weeks to build, test, and document. Multi-agent research systems or custom RAG assistants generally take 2–4 weeks depending on the scope.",
    order: 3,
  },
  {
    _id: "faq.ownership",
    question: "Who owns the workflows and configurations?",
    answer:
      "You own 100% of everything. All workflows, API keys, scripts, and documentation are hosted in your accounts and handed over with clear setup instructions.",
    order: 4,
  },
  {
    _id: "faq.post-launch",
    question: "What happens after the workflow is set up?",
    answer:
      "I provide full walkthrough videos and documentation so you understand how everything works. I also provide post-launch verification to ensure everything runs smoothly.",
    order: 5,
  },
];

export const FALLBACK_TESTIMONIALS: TestimonialDoc[] = [];

export const FALLBACK_HERO: HeroDoc = {
  _id: "hero.fallback",
  eyebrow: "Arefin Mueen · AI Automation & AI Agent Developer",
  headline:
    "I build AI systems that automate real work.",
  subheadline:
    "I build AI agents, RAG assistants, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
  trustLine:
    "n8n · LangChain · Langflow · LLM APIs · Webhooks · Python",
  scarcityPill: "Open to AI automation & agent projects",
  primaryCTA: { label: "Let's build an automation", href: "/contact" },
  secondaryCTA: { label: "View my projects", href: "/projects" },
};

export const FALLBACK_SKILLS: SkillCategoryDoc[] = [
  {
    _id: "skill.ai-agents",
    iconName: "brain",
    category: "AI & Agents",
    items: [
      "AI Agents",
      "RAG Systems",
      "Multi-Agent Systems",
      "Prompt Engineering",
      "OpenAI & Claude APIs",
      "LangChain",
    ],
    order: 0,
  },
  {
    _id: "skill.automation-workflows",
    iconName: "workflow",
    category: "Automation & Workflows",
    items: [
      "n8n",
      "Zapier",
      "Langflow",
      "Workflow Design",
      "Webhooks",
      "API Integrations",
    ],
    order: 1,
  },
  {
    _id: "skill.development-fundamentals",
    iconName: "terminal",
    category: "Development Fundamentals",
    items: [
      "Python",
      "JavaScript",
      "JSON",
      "Git & GitHub",
      "REST APIs",
      "Web Fundamentals",
    ],
    order: 2,
  },
];

export const FALLBACK_PROJECTS: ProjectDoc[] = [
  {
    _id: "project.email-automation",
    title: "Email Automation & Smart Triage",
    slug: "email-automation-triage",
    summary:
      "Automated inbox triage workflow built with n8n and OpenAI that categorizes incoming emails, drafts context-aware replies, and routes priority notifications.",
    outcome: "Built as a hands-on project to practice email parsing, LLM classification, and automated reply drafting.",
    stack: ["n8n", "OpenAI", "Gmail API", "Webhooks"],
    iconName: "workflow",
    category: "AI Automation",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.social-media-content",
    title: "Social Media Content Generator",
    slug: "social-media-content-generator",
    summary:
      "Automated pipeline that takes a core article or topic, generates tailored cross-platform posts via LLMs, and organizes draft schedules in Google Sheets.",
    outcome: "Built as a practical workflow project to explore prompt chaining and multi-format content generation.",
    stack: ["Make", "OpenAI", "Google Sheets", "Webhooks"],
    iconName: "layers",
    category: "AI Workflow",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.customer-support-qa",
    title: "Customer Support Q&A Bot",
    slug: "customer-support-qa-bot",
    summary:
      "Conversational support assistant built in Langflow that parses customer questions against product knowledge data with structured human escalation.",
    outcome: "Built as an agent experiment to test prompt conditioning, fallback rules, and structured tool routing.",
    stack: ["Langflow", "OpenAI", "Webhooks", "JSON"],
    iconName: "bookmark",
    category: "AI Chatbot",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.market-research-agent",
    title: "Market Research Multi-Agent System",
    slug: "market-research-multi-agent",
    summary:
      "Orchestrated crew of 4 specialized agents (Researcher, Data Analyst, Writer, Critic) that collaborate to generate structured market research briefs from keyword inputs.",
    outcome: "Built to practice multi-agent coordination, sequential execution, and automated report synthesis.",
    stack: ["n8n", "LangChain", "Python", "Claude API"],
    iconName: "brain",
    category: "Multi-Agent",
    featured: true,
    thumbnail: null,
  },
  {
    _id: "project.stock-analysis",
    title: "Stock Analysis & Research Agent",
    slug: "stock-analysis-agent",
    summary:
      "Financial research agent built in Python with LangChain that queries live stock data, evaluates quarterly earnings metrics, and outputs structured summaries.",
    outcome: "Built to explore Python API integrations, financial data extraction, and tool-calling with LLMs.",
    stack: ["Python", "LangChain", "Yahoo Finance API", "OpenAI"],
    iconName: "chart",
    category: "AI Agent",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.multilingual-bot",
    title: "Multilingual Customer Support Bot",
    slug: "multilingual-customer-support-bot",
    summary:
      "Real-time multilingual chat workflow that automatically detects incoming language, translates inquiries, and provides localized responses from standard FAQs.",
    outcome: "Built to test language detection, prompt routing, and translation pipelines in Langflow.",
    stack: ["Langflow", "OpenAI", "Webhooks", "Translation API"],
    iconName: "agent",
    category: "AI Chatbot",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.lead-generation-bot",
    title: "Website Lead Generation Bot",
    slug: "website-lead-generation-bot",
    summary:
      "Interactive lead qualification workflow connecting website forms, AI scoring logic, and instant notifications to Slack and spreadsheets.",
    outcome: "Built to practice webhook event handling, lead scoring logic, and team notification dispatch.",
    stack: ["n8n", "OpenAI", "Typeform", "Slack API"],
    iconName: "compass",
    category: "AI Automation",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.ecom-chatbot",
    title: "E-Commerce Chatbot Integration",
    slug: "e-commerce-chatbot-integration",
    summary:
      "E-commerce assistant integrating Shopify order lookups and OpenAI to resolve tracking queries and draft customer service responses automatically.",
    outcome: "Built as a business automation project to connect e-commerce webhooks with conversational AI.",
    stack: ["Zapier", "OpenAI", "Shopify Webhooks", "Gmail API"],
    iconName: "chart",
    category: "E-Commerce Bot",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.mobile-faq-bot",
    title: "Mobile App FAQ & Documentation Bot",
    slug: "mobile-app-faq-bot",
    summary:
      "RAG assistant indexed over mobile application documentation, enabling fast search and citation-backed troubleshooting for common user questions.",
    outcome: "Built as a RAG implementation project using LangChain and Pinecone vector store.",
    stack: ["LangChain", "Pinecone", "Python", "OpenAI"],
    iconName: "bookmark",
    category: "RAG Assistant",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.voice-scheduler",
    title: "Voice-Enabled Appointment Scheduler",
    slug: "voice-enabled-appointment-scheduler",
    summary:
      "Conversational voice agent integrating Twilio Voice and OpenAI to handle incoming call inquiries, verify calendar availability, and confirm bookings.",
    outcome: "Built to explore telephony API webhooks, voice prompts, and automated Google Calendar booking.",
    stack: ["n8n", "OpenAI", "Twilio Voice", "Google Calendar"],
    iconName: "agent",
    category: "Voice AI",
    featured: false,
    thumbnail: null,
  },
  // Aliases for backwards compatibility with earlier routes
  {
    _id: "project.lead-qualification",
    title: "AI Lead Qualification Agent",
    slug: "ai-lead-qualification-agent",
    summary:
      "Automated lead qualification workflow that ingests form submissions, evaluates prospect fit with LLMs, and sends formatted briefs to Slack.",
    outcome: "Built as a hands-on project to practice lead qualification logic and webhook routing.",
    stack: ["n8n", "LangChain", "OpenAI", "Slack API"],
    iconName: "agent",
    category: "AI Automation",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.gohighlevel-bot",
    title: "Conversational Booking Bot",
    slug: "gohighlevel-booking-bot",
    summary:
      "Automated booking assistant connecting conversation channels with calendar availability and automated SMS confirmation.",
    outcome: "Built to explore conversational appointment booking and webhook triggers.",
    stack: ["GoHighLevel", "OpenAI", "Twilio"],
    iconName: "chart",
    category: "AI Chatbot",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.content-pipeline",
    title: "Content Repurposing Pipeline",
    slug: "content-repurposing-pipeline",
    summary:
      "Automated workflow that takes long-form text or video transcripts and generates multi-platform social snippets using LLM prompt templates.",
    outcome: "Built to explore batch prompt processing and automated content pipelines.",
    stack: ["Make", "OpenAI", "Google Sheets"],
    iconName: "layers",
    category: "AI Workflow",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.kb-chatbot",
    title: "Internal Knowledge Base Chatbot",
    slug: "internal-knowledge-base-chatbot",
    summary:
      "Retrieval-augmented chatbot over documentation and Notion notes to answer queries with direct source citations.",
    outcome: "Built to practice vector embeddings, chunking strategies, and retrieval evaluation.",
    stack: ["LangChain", "Pinecone", "Python", "OpenAI"],
    iconName: "bookmark",
    category: "RAG Assistant",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.ecom-autoreply",
    title: "E-Commerce Auto-Reply Workflow",
    slug: "e-commerce-auto-reply-agent",
    summary:
      "Automated workflow that categorizes support emails, checks order status against store APIs, and drafts personalized customer replies.",
    outcome: "Built to test e-commerce API lookups and automated support drafting.",
    stack: ["Zapier", "OpenAI", "Gmail API"],
    iconName: "spark",
    category: "AI Automation",
    featured: false,
    thumbnail: null,
  },
  {
    _id: "project.cold-outreach",
    title: "AI Lead Research & Enrichment Workflow",
    slug: "ai-cold-outreach-system",
    summary:
      "Automated research pipeline that ingests company names, researches key business details via web data, and drafts personalized intros.",
    outcome: "Built to practice data extraction, prompt engineering, and structured lead enrichment.",
    stack: ["n8n", "OpenAI", "Apollo API", "Python"],
    iconName: "rocket",
    category: "AI Automation",
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
