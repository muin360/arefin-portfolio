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
    projectType: "Personal Automation Project",
    summary:
      "Automated inbox triage workflow built with n8n and OpenAI that categorizes incoming emails, drafts context-aware replies, and routes priority notifications.",
    problem:
      "Manual inbox triage takes hours of scanning, tagging, and writing repetitive initial responses for standard queries.",
    goal:
      "Automatically classify incoming messages by urgency and topic, draft context-aware replies, and notify team channels for high-priority items.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "Gmail webhook detects new incoming email payload" },
      { step: "02", name: "Data Input", desc: "Extract subject, sender, and clean email body text" },
      { step: "03", name: "AI Processing", desc: "LLM analyzes intent, sentiment, urgency, and category" },
      { step: "04", name: "Agent Decision", desc: "If urgent → alert Slack; if standard → generate draft reply" },
      { step: "05", name: "Tool / API", desc: "Save drafted response in Gmail drafts folder and update Notion log" },
      { step: "06", name: "Human Review", desc: "Human reviews draft with one click before sending" },
    ],
    aiRole:
      "Classifies unstructured email text into structured categories (Sales, Support, Urgent, Spam) and drafts contextual responses matching defined brand guidelines.",
    automationLogic:
      "Event-driven webhook in n8n triggers JSON parsing, sends prompt to OpenAI API with JSON schema enforcement, branches on urgency score, and calls Gmail & Slack APIs.",
    integrations: ["n8n", "OpenAI API", "Gmail API", "Slack Webhooks", "Notion API"],
    learningOutcome:
      "Learned structured output enforcement with LLMs, robust email MIME parsing, and webhook rate limiting in n8n.",
    outcome: "Classified incoming emails with structured metadata and created review-ready drafts.",
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
    projectType: "Learning Project",
    summary:
      "Automated pipeline that takes a core article or topic, generates tailored cross-platform posts via LLMs, and organizes draft schedules in Google Sheets.",
    problem:
      "Adapting one piece of core research or content across multiple social platforms requires manual reformatting and tedious scheduling.",
    goal:
      "Create a multi-format pipeline that transforms a single topic into platform-specific drafts (LinkedIn, X/Twitter, Newsletter summary) and logs them into a content calendar.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "New row or article URL entered into Airtable/Google Sheets" },
      { step: "02", name: "Data Input", desc: "Fetch article text or parse topic bullet points" },
      { step: "03", name: "AI Processing", desc: "Prompt chain generates LinkedIn post, Twitter thread, and summary" },
      { step: "04", name: "Agent Decision", desc: "Review character limits and hashtag formatting rules" },
      { step: "05", name: "Output", desc: "Push formatted copy into scheduled calendar columns with status 'Ready for Review'" },
    ],
    aiRole:
      "Transforms raw article concepts into tailored hooks, body points, and calls-to-action specific to each social media format.",
    automationLogic:
      "Make/n8n scenario watches spreadsheet row updates, runs iterative prompt transformations via OpenAI/Claude API, and writes structured outputs back to spreadsheet columns.",
    integrations: ["Make", "OpenAI", "Claude API", "Google Sheets", "Airtable"],
    learningOutcome:
      "Explored prompt chaining techniques, managing token context windows, and structuring multi-platform content templates.",
    outcome: "Generates multi-platform post drafts from single topic briefs ready for human editing.",
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
    projectType: "AI Agent Project",
    summary:
      "Conversational support assistant built in Langflow that parses customer questions against product knowledge data with structured human escalation.",
    problem:
      "Customers ask repetitive product and policy questions that tie up support resources while waiting for basic answers.",
    goal:
      "Provide instantaneous, accurate answers from a structured FAQ knowledge base while gracefully routing unknown questions to human agents.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "User submits query via web chat interface" },
      { step: "02", name: "Data Input", desc: "Normalize query and retrieve relevant FAQ chunks from vector index" },
      { step: "03", name: "AI Processing", desc: "LLM evaluates retrieved context to formulate accurate answer" },
      { step: "04", name: "Agent Decision", desc: "Check confidence score: if confident → send reply; if low → trigger escalation" },
      { step: "05", name: "Output & Handoff", desc: "Display answer with source reference or create support ticket for human follow-up" },
    ],
    aiRole:
      "Synthesizes retrieved FAQ chunks into natural, helpful answers while strictly adhering to provided reference material to avoid hallucinations.",
    automationLogic:
      "Langflow visual graph connects vector similarity search, system prompt guardrails, threshold evaluation, and webhook routing for ticket generation.",
    integrations: ["Langflow", "OpenAI Embeddings", "Pinecone", "Webhooks", "JSON"],
    learningOutcome:
      "Gained deep understanding of vector similarity thresholds, prompt guardrails against hallucinations, and graceful human-in-the-loop fallback mechanisms.",
    outcome: "Accurate citation-backed answers retrieved from indexed product docs with fallback escalation.",
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
    projectType: "Multi-Agent Project",
    summary:
      "Orchestrated crew of 4 specialized agents (Researcher, Data Analyst, Writer, Critic) that collaborate to generate structured market research briefs from keyword inputs.",
    problem:
      "Market research involves distinct cognitive phases — discovering data, validating numbers, drafting summaries, and quality checking — that a single prompt cannot reliably execute.",
    goal:
      "Build a multi-agent pipeline where specialized agents review and refine each other's outputs to produce coherent, cited market briefs.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "User submits research topic and target parameters" },
      { step: "02", name: "Researcher Agent", desc: "Queries search APIs, gathers articles, and extracts key facts" },
      { step: "03", name: "Analyst Agent", desc: "Identifies trends, categorizes competitor data, and spots gaps" },
      { step: "04", name: "Writer Agent", desc: "Drafts structured executive summary with clear headings" },
      { step: "05", name: "Critic Agent", desc: "Reviews report against facts; requests revisions if citations are missing" },
      { step: "06", name: "Output", desc: "Generates final Markdown report and saves to Notion workspace" },
    ],
    aiRole:
      "Each agent operates with a specialized system prompt, distinct role boundaries, and dedicated tool access (search, analysis, synthesis, review).",
    automationLogic:
      "Python and LangChain orchestrate sequential and iterative agent loops with intermediate state passing and validation gates.",
    integrations: ["LangChain", "Python", "Tavily Search API", "Claude API", "Notion API"],
    learningOutcome:
      "Mastered multi-agent state passing, role-based system prompting, supervisor loops, and avoiding infinite agent debate cycles.",
    outcome: "Structured multi-agent research synthesis with automated fact checking and report generation.",
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
    projectType: "Personal Project",
    summary:
      "Financial research agent built in Python with LangChain that queries live stock data, evaluates quarterly earnings metrics, and outputs structured summaries.",
    problem:
      "Gathering stock fundamentals, historical price trends, and earnings data across multiple tickers is time-consuming when done manually.",
    goal:
      "Build an autonomous tool-calling agent in Python that retrieves ticker fundamentals, computes basic financial ratios, and summarizes recent news sentiment.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "CLI prompt with stock symbol (e.g. AAPL, NVDA)" },
      { step: "02", name: "Tool Calling", desc: "Agent calls Yahoo Finance API tools to pull price, P/E, revenue, and cash flow" },
      { step: "03", name: "News Fetch", desc: "Agent retrieves latest headline data and runs sentiment analysis" },
      { step: "04", name: "Synthesis", desc: "LLM organizes metrics into comparison tables and drafts overview" },
      { step: "05", name: "Output", desc: "Outputs clean markdown summary with key financial indicators" },
    ],
    aiRole:
      "Decides which API tools to invoke based on user questions, parses tabular financial data, and writes objective factual summaries.",
    automationLogic:
      "LangChain agent with custom Python tool bindings for yfinance, structured schema validation, and markdown table rendering.",
    integrations: ["Python", "LangChain", "Yahoo Finance API", "OpenAI API"],
    learningOutcome:
      "Gained practical experience implementing LangChain tool-calling decorators, managing structured API responses, and financial data wrangling.",
    outcome: "Autonomous tool-calling agent that fetches financial indicators and produces structured reports.",
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
    projectType: "Learning Project",
    summary:
      "Real-time multilingual chat workflow that automatically detects incoming language, translates inquiries, and provides localized responses from standard FAQs.",
    problem:
      "Global users submit inquiries in multiple languages, but support documentation is often written only in English.",
    goal:
      "Build a pipeline that detects query language, translates it for internal retrieval, fetches the right FAQ response, and replies in the user's native language.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "User submits message in any language (Spanish, Arabic, French, Bengali, etc.)" },
      { step: "02", name: "Language Detection", desc: "LLM identifies ISO language code and intent" },
      { step: "03", name: "Query Translation", desc: "Translate query to English for semantic knowledge retrieval" },
      { step: "04", name: "Context Retrieval", desc: "Fetch relevant product answers from documentation" },
      { step: "05", name: "Output Translation", desc: "Translate English answer back into user's original language with correct tone" },
    ],
    aiRole:
      "Handles language classification, natural translation preserving domain terminology, and culturally appropriate response formatting.",
    automationLogic:
      "Langflow and n8n webhook nodes chained with translation and retrieval stages, passing language state throughout the execution trace.",
    integrations: ["Langflow", "OpenAI API", "Webhooks", "JSON"],
    learningOutcome:
      "Learned internationalization prompt techniques, preserving technical terms across translations, and handling non-Latin character encodings.",
    outcome: "Multi-language intent detection and localized response generation from unified English documentation.",
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
    projectType: "Automation Project",
    summary:
      "Interactive lead qualification workflow connecting website forms, AI scoring logic, and instant notifications to Slack and spreadsheets.",
    problem:
      "Static contact forms collect unqualified leads with missing details, leading to slow follow-up and wasted sales outreach time.",
    goal:
      "Create an automated qualification pipeline that parses lead submissions, calculates an intent score with AI, and notifies team channels in real time.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "Lead submits interactive form on website" },
      { step: "02", name: "Data Extraction", desc: "Extract budget, timeline, project scope, and company details" },
      { step: "03", name: "AI Scoring", desc: "LLM analyzes fit against ideal customer profile (ICP) and assigns score" },
      { step: "04", name: "CRM Sync", desc: "Create or update contact record in CRM with qualification notes" },
      { step: "05", name: "Notification", desc: "Send formatted Slack card with quick-action buttons to sales team" },
    ],
    aiRole:
      "Analyzes open-ended project descriptions to evaluate scope, timeline urgency, and match against defined qualification criteria.",
    automationLogic:
      "n8n webhook triggers OpenAI API analysis, updates Google Sheets/CRM, and posts rich markdown blocks to Slack webhook.",
    integrations: ["n8n", "OpenAI API", "Typeform", "Slack API", "Google Sheets"],
    learningOutcome:
      "Practiced webhook payload validation, building resilient error handling for external API drops, and formatting Slack Block Kit messages.",
    outcome: "Automated lead intake with AI fit scoring and instant team notifications.",
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
    projectType: "Automation Project",
    summary:
      "E-commerce assistant integrating Shopify order lookups and OpenAI to resolve tracking queries and draft customer service responses automatically.",
    problem:
      "Online store owners spend significant time answering 'Where is my order?' (WISMO) tickets and standard return policy questions.",
    goal:
      "Build an automation that looks up order IDs against store webhooks, summarizes tracking status, and handles common store policy FAQs.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "Customer submits order number or question via chat widget" },
      { step: "02", name: "Intent Check", desc: "AI classifies query: Order Status vs FAQ vs Refund Request" },
      { step: "03", name: "API Lookup", desc: "If order query → fetch fulfillment status and tracking URL from store API" },
      { step: "04", name: "Draft Response", desc: "Generate friendly, concise status update with direct tracking link" },
      { step: "05", name: "Escalation", desc: "If missing order or refund issue → tag ticket for human support" },
    ],
    aiRole:
      "Extracts order numbers and email addresses from natural conversation, routes to API lookup, and drafts empathetic customer updates.",
    automationLogic:
      "Zapier / n8n workflow listening to chat webhooks, performing authenticated API requests, and generating dynamic reply payloads.",
    integrations: ["Zapier", "OpenAI API", "Shopify API", "Gmail API"],
    learningOutcome:
      "Learned e-commerce REST API authentication, rate limiting considerations, and handling edge cases like missing or partial orders.",
    outcome: "Order status lookup automation with intelligent policy FAQ handling.",
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
    projectType: "RAG Project",
    summary:
      "RAG assistant indexed over mobile application documentation, enabling fast search and citation-backed troubleshooting for common user questions.",
    problem:
      "Users struggle to navigate long documentation pages or help centers on mobile screens when encountering app errors.",
    goal:
      "Provide an in-app conversational search interface that indexes user guides and returns direct, step-by-step troubleshooting instructions.",
    workflowSteps: [
      { step: "01", name: "Trigger", desc: "User types query or pastes error message into help search" },
      { step: "02", name: "Vector Search", desc: "Generate embedding and retrieve top matching documentation chunks from Pinecone" },
      { step: "03", name: "AI Synthesis", desc: "LLM extracts exact step-by-step instructions from relevant chunks" },
      { step: "04", name: "Citation", desc: "Include direct link to official doc section for full details" },
      { step: "05", name: "Feedback", desc: "Log whether user found the response helpful for index tuning" },
    ],
    aiRole:
      "Parses technical user guides into concise mobile-friendly troubleshooting bullet points without omitting critical steps.",
    automationLogic:
      "Python scripts chunk markdown docs, generate vector embeddings, store in Pinecone, and query via LangChain retrieval chain.",
    integrations: ["LangChain", "Pinecone", "Python", "OpenAI Embeddings"],
    learningOutcome:
      "Explored optimal document chunking sizes, overlap strategies, metadata filtering, and embedding model comparisons.",
    outcome: "Indexed markdown documentation for semantic query matching and step-by-step troubleshooting.",
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
    projectType: "Voice AI Project",
    summary:
      "Conversational voice agent integrating Twilio Voice and OpenAI to handle incoming call inquiries, verify calendar availability, and confirm bookings.",
    problem:
      "Service businesses miss calls outside office hours, losing potential appointment bookings to competitors.",
    goal:
      "Build a voice automation prototype that answers phone calls, gathers booking preferences, checks Google Calendar for open slots, and books meetings.",
    workflowSteps: [
      { step: "01", name: "Inbound Call", desc: "Twilio Voice webhook receives incoming phone call" },
      { step: "02", name: "Speech-to-Text", desc: "Transcribe caller audio using Whisper STT" },
      { step: "03", name: "Slot Extraction", desc: "LLM extracts requested date, time, and service type" },
      { step: "04", name: "Calendar Check", desc: "Query Google Calendar API for slot availability" },
      { step: "05", name: "Voice Response", desc: "Synthesize natural audio reply via TTS and create calendar event" },
      { step: "06", name: "SMS Confirmation", desc: "Send automated SMS confirmation with meeting details" },
    ],
    aiRole:
      "Manages conversation flow, extracts appointment parameters from natural spoken dialogue, and handles date/time parsing.",
    automationLogic:
      "n8n webhook pipeline coordinating Twilio TwiML voice responses, OpenAI Whisper / GPT-4o-mini, and Google Calendar API.",
    integrations: ["n8n", "OpenAI API", "Twilio Voice & SMS", "Google Calendar API"],
    learningOutcome:
      "Gained experience handling voice latency, managing asynchronous audio stream webhooks, and parsing temporal expressions.",
    outcome: "Working voice transcription, calendar slot checking, and meeting booking workflow.",
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
    projectType: "Automation Project",
    summary:
      "Automated lead qualification workflow that ingests form submissions, evaluates prospect fit with LLMs, and sends formatted briefs to Slack.",
    problem: "Manual review of inbound leads creates delays in routing high-fit prospects.",
    goal: "Evaluate prospect fit automatically and dispatch instant notifications.",
    aiRole: "Analyzes form inputs against qualification parameters.",
    automationLogic: "Webhook trigger in n8n, OpenAI evaluation, Slack notification.",
    learningOutcome: "Learned webhook data sanitization and scoring schemas.",
    outcome: "Automated lead intake with AI fit scoring and instant team notifications.",
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
    projectType: "Automation Project",
    summary:
      "Automated booking assistant connecting conversation channels with calendar availability and automated SMS confirmation.",
    problem: "Back-and-forth messaging to find suitable meeting times.",
    goal: "Automate calendar availability queries and booking confirmation.",
    aiRole: "Parses requested time slots from messages.",
    automationLogic: "Webhook integration with calendar API and messaging triggers.",
    learningOutcome: "Practiced conversational flow design and calendar sync.",
    outcome: "Automated booking workflow with instant confirmation.",
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
    projectType: "Learning Project",
    summary:
      "Automated workflow that takes long-form text or video transcripts and generates multi-platform social snippets using LLM prompt templates.",
    problem: "Manual reformatting of long content into different channel formats.",
    goal: "Generate multi-platform snippets from source transcripts automatically.",
    aiRole: "Adapts tone and length for various social platforms.",
    automationLogic: "Make scenario with prompt chaining and spreadsheet output.",
    learningOutcome: "Explored prompt templating for multi-format text generation.",
    outcome: "Automated content adaptation across platforms.",
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
    projectType: "RAG Project",
    summary:
      "Retrieval-augmented chatbot over documentation and Notion notes to answer queries with direct source citations.",
    problem: "Finding specific answers across scattered internal documentation.",
    goal: "Provide instant, citation-backed answers from indexed notes.",
    aiRole: "Answers questions using retrieved documentation chunks.",
    automationLogic: "Vector search in Pinecone with LangChain QA chain.",
    learningOutcome: "Practiced embedding generation, chunking, and similarity search.",
    outcome: "Citation-backed answer retrieval over indexed documentation.",
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
    projectType: "Automation Project",
    summary:
      "Automated workflow that categorizes support emails, checks order status against store APIs, and drafts personalized customer replies.",
    problem: "Repetitive order tracking and policy questions taking up support time.",
    goal: "Check store APIs automatically and draft customer replies.",
    aiRole: "Extracts order details and generates contextual status responses.",
    automationLogic: "Zapier webhook to store API and draft creation.",
    learningOutcome: "Learned API authentication and error fallback handling.",
    outcome: "Order status lookup and automated support drafting.",
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
    projectType: "Automation Project",
    summary:
      "Automated research pipeline that ingests company names, researches key business details via web data, and drafts personalized intros.",
    problem: "Manual prospect research is slow and difficult to standardize.",
    goal: "Gather company info and draft relevant introductory notes.",
    aiRole: "Summarizes company focus and drafts tailored opening lines.",
    automationLogic: "n8n workflow querying search APIs and generating text.",
    learningOutcome: "Learned automated web search querying and structured data extraction.",
    outcome: "Automated data extraction and structured lead enrichment.",
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
      "Teams that remove repetitive work free up their time to focus on creative and high-leverage tasks.",
    date: "2025-04-12",
    readingTime: "5 min read",
    category: "Strategy",
    tags: ["AI", "Automation", "Workflows"],
    coverImage: null,
  },
  {
    _id: "post.n8n-vs-zapier-vs-make",
    title: "n8n vs Zapier vs Make: an honest comparison",
    slug: "n8n-vs-zapier-vs-make",
    excerpt:
      "Hands-on comparison of the three major automation platforms based on complexity, control, and maintenance.",
    date: "2025-03-28",
    readingTime: "7 min read",
    category: "Tools",
    tags: ["n8n", "Zapier", "Make"],
    coverImage: null,
  },
  {
    _id: "post.from-automation-to-llm-engineering",
    title: "From workflow automation to LLM & agent engineering",
    slug: "from-automation-to-llm-engineering",
    excerpt:
      "Why I'm focusing on the engineering side of LLMs — evaluation, observability, and retrieval quality.",
    date: "2025-04-20",
    readingTime: "4 min read",
    category: "Notes",
    tags: ["Career", "LLM", "Personal"],
    coverImage: null,
  },
];
