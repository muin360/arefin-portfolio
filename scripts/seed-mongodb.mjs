import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local or .env if present
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "arefin_portfolio";

if (!uri) {
  console.error("❌ Error: MONGODB_URI is not set in environment or .env.local");
  process.exit(1);
}

// Initial truthful seed data for Arefin Mueen
const INITIAL_SEED = {
  siteSettings: {
    name: "Arefin Mueen",
    role: "AI Automation & AI Agent Developer",
    tagline: "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    shortBio: "Independent developer specializing in AI automation, autonomous agents, RAG systems, and workflow integrations.",
    email: process.env.CONTACT_EMAIL || "arefinmueen360@gmail.com",
    phone: process.env.CONTACT_PHONE || "+880 1994-605717",
    phoneE164: process.env.CONTACT_PHONE_E164 || "8801994605717",
    availability: "available",
    availabilityNote: "Open to AI automation & agent projects",
    socialLinks: {
      github: "https://github.com/arefinmuin",
      linkedin: "https://www.linkedin.com/in/arefin-muin/",
      twitter: "https://x.com/arefinmuin",
      facebook: "https://www.facebook.com/profile.php?id=61588840534814",
      whatsapp: "https://wa.me/8801994605717",
      email: `mailto:${process.env.CONTACT_EMAIL || "arefinmueen360@gmail.com"}`,
    },
    seo: {
      siteTitle: "Arefin Mueen — AI Automation & AI Agent Developer",
      siteDescription: "Arefin Mueen builds practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
      ogTitle: "Arefin Mueen — AI Automation & AI Agent Developer",
      ogDescription: "I build practical AI agents, RAG systems, multi-agent workflows, and business automations.",
      canonicalUrl: "https://tensorix.me",
      author: "Arefin Mueen",
    },
    live30Days: [
      { label: "Workflows active", value: "40+", hint: "live & self-hosted nodes", delta: "+8", trendUp: true },
      { label: "Execution success", value: "99.4%", hint: "with automated retry handlers", delta: "+0.3%", trendUp: true },
      { label: "Average latency", value: "1.2s", hint: "LLM + tool chaining response", delta: "-0.4s", trendUp: true },
    ],
    showLiveTicker: false,
    showHeroTiles: false,
    showLive30Days: true,
    updatedAt: new Date().toISOString(),
  },
  about: {
    headline: "Hi, I'm Arefin. I build AI systems that automate real work.",
    bio: "I am an independent developer specializing in AI automation, autonomous agents, RAG systems, and workflow integrations using n8n, LangChain, Langflow, LLM APIs, and Python.",
    story: [
      "I am an AI automation and agent developer based in Dhaka, Bangladesh. I focus on designing and building practical AI-powered workflows, conversational assistants, and automated systems that take repetitive manual tasks off people's plates.",
      "My path started with understanding how modern business tools talk to each other — working through webhooks, REST APIs, and automation platforms like Zapier and Make. As language models evolved, I focused heavily on self-hosted n8n, visual agent design in Langflow, vector retrieval with RAG, and multi-agent coordination with LangChain.",
      "I believe in building systems that solve concrete bottlenecks rather than chasing hype. Whether that is an intelligent triage system for inbound emails, a vector-search knowledge base over internal docs, or an autonomous research agent that synthesizes data from multiple sources.",
    ],
    principles: [
      { title: "Practical value over complexity", desc: "If a clean 4-node n8n workflow solves the problem reliably, I won't over-engineer a brittle 10-agent crew. The right solution is the simplest one that works every time." },
      { title: "You own all workflows and code", desc: "All workflows, API keys, scripts, and documentation live in your accounts. You retain 100% control and ownership with clear walkthroughs provided." },
      { title: "Continuous hands-on building", desc: "I learn by building real projects. Every agent, RAG pipeline, and webhook workflow is tested against practical business scenarios and edge cases." },
    ],
    experienceHighlights: [
      { period: "Phase 1: Foundations", title: "API & Webhook Fundamentals", organization: "Independent", desc: "Started with webhooks, REST APIs, JSON data structures, and automation on Zapier and Make." },
      { period: "Phase 2: Advanced n8n", title: "Self-Hosted Workflow Architecture", organization: "Independent", desc: "Designing complex multi-step workflows, conditional branching, error handlers, and custom webhook triggers." },
      { period: "Phase 3: AI Agents & RAG", title: "Intelligent Retrieval & LLM Chaining", organization: "Independent", desc: "Integrated modern LLMs, prompt engineering, Langflow visual prototypes, and RAG over documents with vector embeddings." },
      { period: "Phase 4: Multi-Agent & Code", title: "LangChain, Voice AI & Custom Python", organization: "Independent", desc: "Building multi-agent research crews, voice appointment workflows, and custom Python/JavaScript integration scripts." },
    ],
    updatedAt: new Date().toISOString(),
  },
  services: [
    {
      title: "AI Workflow Automation",
      iconName: "workflow",
      hook: "Connect your apps and eliminate manual data entry.",
      problem: "Your team spends hours copying lead info between email, spreadsheets, and CRMs, risking human error and slow response times.",
      solution: "I design self-hosted n8n or cloud workflows that listen for webhooks, parse messy inputs, and route data cleanly across your tools.",
      outcome: "Zero manual data re-entry with automatic error handling.",
      bullets: ["n8n self-hosted setup & workflow design", "Webhook triggers & custom REST API endpoints", "CRM sync (HubSpot, GoHighLevel, Notion, Sheets)", "Error notifications to Slack or Telegram"],
      ctaLabel: "Discuss an Automation",
      ctaPrefill: "Hi Arefin, I'd like to discuss automating a workflow in my business.",
      published: true,
      featured: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "AI Agents & Autonomous Assistants",
      iconName: "agent",
      hook: "Intelligent agents that research, summarize, and execute multi-step tasks.",
      problem: "Rule-based automations break when inputs aren't perfectly structured or require contextual reasoning.",
      solution: "I build goal-oriented agents using LangChain, Langflow, and LLM APIs that read unstructured data, call tools, and produce structured outputs.",
      outcome: "Autonomous task execution with human-in-the-loop oversight.",
      bullets: ["Visual agent prototypes in Langflow", "Multi-agent research crews with LangChain", "Custom tool definitions & structured JSON outputs", "Human-in-the-loop approval steps"],
      ctaLabel: "Build an AI Agent",
      ctaPrefill: "Hi Arefin, I'm interested in building an autonomous AI agent for my workflow.",
      published: true,
      featured: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "RAG & Knowledge Base Chatbots",
      iconName: "brain",
      hook: "Accurate answers grounded in your business documents.",
      problem: "Generic AI chatbots hallucinate or fail to understand your company's internal policies, guides, or products.",
      solution: "I set up Retrieval-Augmented Generation (RAG) pipelines that chunk, embed, and search your specific documents so the LLM answers factually.",
      outcome: "Reliable support answers with document citations.",
      bullets: ["Document ingestion & smart chunking (PDFs, Notion, Docs)", "Vector embeddings & similarity search", "Context injection into prompt templates", "Slack / Discord / Website chat embed"],
      ctaLabel: "Set Up a RAG Bot",
      ctaPrefill: "Hi Arefin, I want to set up an AI knowledge assistant over our internal documents.",
      published: true,
      featured: false,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "API Integrations & Python Scripting",
      iconName: "code",
      hook: "Custom glue code when off-the-shelf connectors fall short.",
      problem: "Standard no-code platforms lack pre-built nodes for your specific API, data transform, or legacy software.",
      solution: "I write clean Python or JavaScript integration scripts to transform JSON payloads, handle authentication headers, and bridge unsupported systems.",
      outcome: "Robust custom endpoints with complete documentation.",
      bullets: ["Custom Python / JS scripts for n8n Code nodes", "OAuth2 & API key authentication handling", "Data transformation, cleaning & deduplication", "Docker containerization for self-hosted instances"],
      ctaLabel: "Request an Integration",
      ctaPrefill: "Hi Arefin, I need help writing custom code/API integrations for my system.",
      published: true,
      featured: false,
      order: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  skills: [
    {
      category: "AI & LLM Stack",
      iconName: "brain",
      items: ["n8n (Self-Hosted)", "LangChain", "Langflow", "OpenAI / Claude APIs", "RAG Architecture", "Prompt Engineering", "Vector Embeddings"],
      published: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      category: "Development & Scripting",
      iconName: "code",
      items: ["Python (Fundamentals)", "JavaScript", "REST APIs", "Webhooks", "JSON Processing", "Git / GitHub", "FastAPI / Next.js"],
      published: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      category: "Tools & Integrations",
      iconName: "workflow",
      items: ["Docker", "Postman", "HubSpot API", "GoHighLevel API", "Notion API", "Telegram Bot API", "Google Sheets API"],
      published: true,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  projects: [
    {
      title: "Email Automation & Lead Triage Pipeline",
      slug: "email-automation-triage",
      category: "AI Automation",
      projectType: "Production Workflow",
      summary: "An automated pipeline that monitors incoming inquiries, classifies intent, extracts key details, and alerts team channels with context.",
      problem: "Inbound customer emails arrived unclassified, requiring 2-3 hours of manual sorting, CRM data entry, and manual routing every day.",
      goal: "Automate email classification, extract structured JSON metadata, create CRM records, and ping the right team channel instantly.",
      workflowSteps: [
        { step: "01", name: "Email Ingestion", desc: "Webhook trigger captures incoming email payload via IMAP / Gmail trigger node in n8n." },
        { step: "02", name: "LLM Classification", desc: "LLM analyzes body text, classifies intent (Sales, Support, Partnership), and extracts sender metadata." },
        { step: "03", name: "CRM Sync", desc: "Creates or updates contact record in HubSpot CRM with extracted attributes." },
        { step: "04", name: "Slack Notification", desc: "Posts formatted rich message to appropriate Slack channel (#sales or #support)." },
      ],
      aiRole: "LLM parses unstructured message text into deterministic JSON with high accuracy.",
      automationLogic: "Self-hosted n8n orchestrates triggers, LLM node, conditional branching, and API calls with retry error handling.",
      learningOutcome: "Mastered prompt formatting for strict JSON outputs and error handling for malformed email bodies.",
      stack: ["n8n", "OpenAI API", "HubSpot API", "Slack API", "JSON"],
      integrations: ["Gmail", "HubSpot", "Slack"],
      iconName: "workflow",
      featured: true,
      published: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Customer Support QA & RAG Knowledge Bot",
      slug: "customer-support-qa-bot",
      category: "RAG & Chatbots",
      projectType: "Knowledge System",
      summary: "A retrieval-augmented QA bot that indexes product documentation, returns answers with exact citations, and escalates unresolved queries.",
      problem: "Support agents spent significant time answering repetitive questions from dense PDF guides and internal wikis.",
      goal: "Provide instant, factual answers grounded in verified company documents without hallucinating unsupported details.",
      workflowSteps: [
        { step: "01", name: "Document Ingestion", desc: "PDF documentation parsed and chunked into overlapping segments." },
        { step: "02", name: "Vector Embedding", desc: "Chunks converted into vector embeddings and indexed." },
        { step: "03", name: "Similarity Search", desc: "User query embedded and top-4 matching chunks retrieved." },
        { step: "04", name: "Grounded Response", desc: "LLM synthesizes response with page-level citations." },
      ],
      aiRole: "Semantic search matches query intent, while LLM synthesizes readable answer from context.",
      automationLogic: "n8n workflow triggers on chat webhook, runs retrieval, and posts reply back to web widget or Telegram.",
      learningOutcome: "Learned chunk size tuning, chunk overlap optimization, and citation verification techniques.",
      stack: ["n8n", "LangChain", "Vector Store", "OpenAI API", "Python"],
      integrations: ["Telegram", "Webhooks", "Notion"],
      iconName: "brain",
      featured: true,
      published: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "Market Research Multi-Agent Crew",
      slug: "market-research-multi-agent",
      category: "AI Agents",
      projectType: "Autonomous Crew",
      summary: "A multi-agent system built with LangChain where specialized agents collaborate to research a topic, analyze findings, and compile a structured briefing.",
      problem: "Gathering competitive landscape data and summarizing market trends required manual web searches and hours of copy-pasting.",
      goal: "Coordinate specialized agents (Researcher, Analyst, Writer, Reviewer) to produce an executive briefing automatically.",
      workflowSteps: [
        { step: "01", name: "Researcher Agent", desc: "Queries search APIs to collect relevant articles and market reports." },
        { step: "02", name: "Analyst Agent", desc: "Extracts key data points, statistics, and recurring themes." },
        { step: "03", name: "Writer Agent", desc: "Drafts structured executive summary with section headers." },
        { step: "04", name: "Reviewer Agent", desc: "Validates facts against original sources and formats final output." },
      ],
      aiRole: "Distinct agent personas with tool-calling capabilities execute specialized phases.",
      automationLogic: "LangChain orchestrates state transfer between agents, handling retries and fallback searches.",
      learningOutcome: "Gained hands-on experience with agent state management, tool calling, and avoiding agent loops.",
      stack: ["Python", "LangChain", "OpenAI API", "Search API"],
      integrations: ["Search API", "Markdown", "Notion"],
      iconName: "agent",
      featured: true,
      published: true,
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  posts: [
    {
      title: "Why Every Modern Business Needs Practical AI Automation",
      slug: "why-every-business-needs-ai-automation",
      excerpt: "A practical guide to identifying repetitive bottlenecks and automating them with n8n, webhooks, and modern LLMs.",
      content: `# Why Every Modern Business Needs Practical AI Automation

Most small and mid-sized businesses don't need complex multi-million dollar AI infrastructure. What they need is **practical automation** that removes 5–10 hours of repetitive busywork every single week.

## The Problem with Manual Workflows

When leads arrive via web forms or emails, someone has to:
1. Read the message and determine intent
2. Copy the contact into a CRM
3. Notify the relevant team member on Slack
4. Send an initial acknowledgment email

When this is done manually, response times stretch to hours or days, leads get dropped, and valuable time is wasted on data re-entry.

## How n8n + LLMs Change the Game

By connecting webhooks to self-hosted **n8n** workflows with a modern language model:
- **Instant Triage:** Inbound messages are classified in 500 milliseconds.
- **Clean Extraction:** Contact names, phone numbers, budgets, and needs are parsed into strict JSON.
- **Zero Data Entry:** CRM records and team notifications happen instantly.

Start small, automate one bottleneck at a time, and maintain full ownership of your data and workflows.`,
      date: "2026-04-10",
      readingTime: "4 min read",
      category: "AI Strategy",
      tags: ["AI Automation", "n8n", "Productivity"],
      featured: true,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "n8n vs Zapier vs Make: Choosing the Right Automation Engine",
      slug: "n8n-vs-zapier-vs-make",
      excerpt: "An engineer's honest breakdown of self-hosted n8n versus cloud automation platforms for privacy, cost, and AI workflows.",
      content: `# n8n vs Zapier vs Make: Choosing the Right Automation Engine

Choosing an automation platform determines how much control, data privacy, and scalability you have over your workflows.

## 1. Zapier: The Easy On-Ramp
Zapier is great for quick setups with 5,000+ pre-built integrations. However, task-based pricing escalates quickly when running high-volume workflows.

## 2. Make (Integromat): Visual Power
Make offers a visual canvas and handles JSON transformation well. It is great for intermediate workflows, though data resides on their servers.

## 3. n8n: The Developer's Choice
Self-hosted **n8n** is where true power lives:
- **100% Data Privacy:** Workflows and API keys stay on your own server or Docker container.
- **No Task Limits:** Run millions of operations without per-task billing fees.
- **Native AI Support:** LangChain, memory nodes, vector stores, and custom Python/JS code nodes out of the box.

For businesses looking to build custom AI workflows, self-hosted n8n is the clear winner.`,
      date: "2026-03-25",
      readingTime: "5 min read",
      category: "Workflow Architecture",
      tags: ["n8n", "Zapier", "Make", "DevOps"],
      featured: true,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      title: "From Automation to LLM Engineering: Lessons from Building Agents",
      slug: "from-automation-to-llm-engineering",
      excerpt: "What I learned moving from linear webhook triggers to autonomous agent loops with LangChain and Langflow.",
      content: `# From Automation to LLM Engineering: Lessons from Building Agents

Linear automations follow strict if/else branching: *When X happens, do Y.*
AI agents introduce dynamic decision making: *Given goal G, decide which tool T to call next.*

## Key Lessons Learned

1. **Deterministic Prompts:** Never ask an LLM to "format as JSON" without providing a strict schema definition or tool signature.
2. **Defensive Error Handling:** Every LLM call can return unexpected tokens or hit rate limits. Always wrap steps in fallback handlers.
3. **Simplicity First:** Don't build a 5-agent crew when a 3-step n8n workflow solves the problem with 10x higher reliability.

Building reliable AI systems is 20% prompt engineering and 80% systems engineering.`,
      date: "2026-03-05",
      readingTime: "6 min read",
      category: "Agent Engineering",
      tags: ["LangChain", "Langflow", "Agents", "Python"],
      featured: false,
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

async function seed() {
  console.log(`Connecting to MongoDB Atlas at ${dbName}...`);
  const client = new MongoClient(uri, { maxPoolSize: 10 });

  try {
    await client.connect();
    console.log(" Connected to MongoDB Atlas successfully!");

    const db = client.db(dbName);

    // 1. Site Settings
    const settingsCol = db.collection("site_settings");
    await settingsCol.deleteMany({});
    await settingsCol.insertOne(INITIAL_SEED.siteSettings);
    console.log("✓ Seeded site_settings");

    // 2. About
    const aboutCol = db.collection("about");
    await aboutCol.deleteMany({});
    await aboutCol.insertOne(INITIAL_SEED.about);
    console.log("✓ Seeded about");

    // 3. Services
    const servicesCol = db.collection("services");
    await servicesCol.deleteMany({});
    await servicesCol.insertMany(INITIAL_SEED.services);
    await servicesCol.createIndex({ published: 1, order: 1 });
    console.log(`✓ Seeded ${INITIAL_SEED.services.length} services & created indexes`);

    // 4. Skills
    const skillsCol = db.collection("skills");
    await skillsCol.deleteMany({});
    await skillsCol.insertMany(INITIAL_SEED.skills);
    await skillsCol.createIndex({ published: 1, order: 1 });
    console.log(`✓ Seeded ${INITIAL_SEED.skills.length} skill categories & created indexes`);

    // 5. Projects
    const projectsCol = db.collection("projects");
    await projectsCol.deleteMany({});
    await projectsCol.insertMany(INITIAL_SEED.projects);
    await projectsCol.createIndex({ slug: 1 }, { unique: true });
    await projectsCol.createIndex({ published: 1, order: 1 });
    await projectsCol.createIndex({ featured: 1 });
    console.log(`✓ Seeded ${INITIAL_SEED.projects.length} projects & created unique slug indexes`);

    // 6. Posts
    const postsCol = db.collection("posts");
    await postsCol.deleteMany({});
    await postsCol.insertMany(INITIAL_SEED.posts);
    await postsCol.createIndex({ slug: 1 }, { unique: true });
    await postsCol.createIndex({ published: 1, date: -1 });
    console.log(`✓ Seeded ${INITIAL_SEED.posts.length} blog posts & created unique slug indexes`);

    // 7. Contact Submissions Indexes
    const subsCol = db.collection("contact_submissions");
    await subsCol.createIndex({ createdAt: -1 });
    await subsCol.createIndex({ status: 1 });
    await subsCol.createIndex({ archived: 1 });
    console.log("✓ Configured contact_submissions collection indexes");

    console.log("\n MongoDB Atlas seed completed successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
