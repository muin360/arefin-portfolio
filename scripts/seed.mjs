/**
 * One-time content seeder for Sanity.
 *
 * Migrates truthful personal portfolio content into Sanity documents.
 * Idempotent — re-running it updates existing documents (matched by deterministic _id).
 *
 * Run with:
 *   npx dotenv -e .env.local -- node scripts/seed.mjs
 *
 * Required env vars:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN     (Editor permission)
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

// ---------- Source data (truthful personal portfolio) ----------

const siteConfig = {
  _id: "siteConfig",
  _type: "siteConfig",
  name: "Arefin Mueen",
  role: "AI Automation & AI Agent Developer",
  email: "arefinmueen360@gmail.com",
  phone: "+880 1994-605717",
  phoneE164: "8801994605717",
  tagline:
    "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
  siteDescription:
    "Arefin Mueen is an AI Automation & AI Agent Developer based in Dhaka. He builds practical AI agents, RAG systems, multi-agent workflows, and business automations.",
  availability: "Open to selected AI automation & agent projects",
  availabilityNote: "Free 30-min scoping call",
  social: {
    github: "https://github.com/muin360",
    linkedin: "https://www.linkedin.com/in/arefin-muin",
    twitter: "https://x.com/ArefinMuin",
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

const engagements = [
  {
    _id: "engagement.sprint",
    _type: "engagement",
    tag: "Sprint",
    name: "Focused Automation Sprint",
    price: "Project-based",
    cadence: "Fixed scope · milestone delivery",
    summary:
      "A focused build for a single workflow, webhook integration, or tightly-scoped AI agent.",
    deliverables: [
      "Discovery & workflow mapping",
      "One end-to-end automation or AI agent built",
      "Loom walkthrough + documented setup",
      "Testing & verification before handoff",
    ],
    ideal: "When you have a specific bottleneck or manual task to automate.",
    featured: false,
    order: 0,
  },
  {
    _id: "engagement.build",
    _type: "engagement",
    tag: "Build",
    name: "AI Automation & Agent System",
    price: "Custom quote",
    cadence: "Milestone-based",
    summary:
      "End-to-end design and build of an AI automation workflow, RAG knowledge system, or multi-agent research pipeline.",
    deliverables: [
      "Workflow architecture & data model",
      "Custom Python/JavaScript logic & webhooks",
      "Real-payload testing & error handling",
      "Documentation, video walkthrough & full repository handover",
    ],
    ideal: "For teams connecting multiple tools into one reliable automated system.",
    featured: true,
    ctaLabel: "Let's build an automation",
    order: 1,
  },
  {
    _id: "engagement.retainer",
    _type: "engagement",
    tag: "Retainer",
    name: "Automation Support & Improvements",
    price: "Custom quote",
    cadence: "Monthly · ongoing capacity",
    summary:
      "Ongoing capacity for maintaining workflows, integrating new tools, and building new AI agent capabilities.",
    deliverables: [
      "Ongoing workflow monitoring & fixes",
      "Regular check-ins & roadmap updates",
      "Continuous automation additions",
      "Direct WhatsApp / email communication",
    ],
    ideal: "When you need continuous iteration on your automations.",
    featured: false,
    order: 2,
  },
];

const services = [
  {
    iconName: "workflow",
    title: "AI Workflow Automation",
    description:
      "Connecting business applications, webhooks, and databases into automated event-driven pipelines using n8n, Zapier, and Make.",
  },
  {
    iconName: "agent",
    title: "AI Agents & Autonomous Assistants",
    description:
      "Autonomous agents equipped with custom tools to summarize, research, categorize leads, or interact with external REST APIs.",
  },
  {
    iconName: "brain",
    title: "RAG & Knowledge Retrieval",
    description:
      "Retrieval-augmented generation systems over company documentation, SOPs, and knowledge bases using vector databases.",
  },
  {
    iconName: "layers",
    title: "Multi-Agent Systems",
    description:
      "Collaborative multi-agent workflows where specialized agents research, synthesize, and format reports.",
  },
  {
    iconName: "chart",
    title: "AI Chatbots & Lead Capture",
    description:
      "Conversational bots for websites and Messenger that capture lead details, answer FAQs, and route conversations.",
  },
  {
    iconName: "code",
    title: "API & Webhook Integrations",
    description:
      "Custom Python scripts and JavaScript functions to transform payloads, handle authentication, and glue APIs together.",
  },
];

const skillCategories = [
  {
    iconName: "brain",
    category: "AI & Agents",
    items: [
      "AI Agents",
      "LangChain",
      "Langflow",
      "OpenAI API",
      "Claude API",
      "Prompt Engineering",
      "RAG Systems",
      "Multi-Agent Systems",
    ],
  },
  {
    iconName: "workflow",
    category: "Automation & Workflows",
    items: [
      "n8n",
      "Zapier",
      "Make",
      "Webhooks",
      "REST APIs",
      "JSON",
    ],
  },
  {
    iconName: "terminal",
    category: "Dev Fundamentals",
    items: [
      "Python",
      "JavaScript",
      "Git",
      "GitHub",
      "REST APIs",
      "Web Fundamentals",
    ],
  },
];

const projects = [
  {
    title: "Email Automation & Smart Triage",
    summary:
      "An automated workflow that monitors inbound emails, classifies urgency and topic using LLMs, drafts replies, and routes high-priority messages to Slack.",
    outcome: "Classified and drafted responses for inbound emails with human review.",
    stack: ["n8n", "OpenAI API", "Gmail API", "Slack Webhooks"],
    iconName: "agent",
    category: "Automation",
  },
  {
    title: "Social Media Content Generator",
    summary:
      "A content generation pipeline that takes core topics, structures multi-platform drafts via Claude, and organizes scheduled posts in Airtable.",
    outcome: "Automated topic ideation, draft generation, and content calendar syncing.",
    stack: ["LangChain", "Claude API", "Airtable API", "Python"],
    iconName: "layers",
    category: "Content AI",
  },
  {
    title: "Customer Support Q&A Bot",
    summary:
      "A retrieval-augmented Q&A assistant built with Langflow that answers customer questions using documentation embeddings in Pinecone.",
    outcome: "Accurate citation-backed answers retrieved from indexed product docs.",
    stack: ["Langflow", "Pinecone", "OpenAI Embeddings", "FastAPI"],
    iconName: "bookmark",
    category: "RAG",
  },
  {
    title: "Market Research Multi-Agent System",
    summary:
      "A crew of specialized agents where a researcher queries public web data, an analyst synthesizes findings, and a writer formats an executive summary.",
    outcome: "Structured multi-agent synthesis from web data into markdown reports.",
    stack: ["LangChain", "Python", "Tavily Search API", "OpenAI"],
    iconName: "spark",
    category: "Multi-Agent",
  },
  {
    title: "Stock Analysis & Research Agent",
    summary:
      "An autonomous financial research agent that fetches market data via financial APIs, extracts sentiment from news articles, and drafts comparative summaries.",
    outcome: "Automated data retrieval and sentiment extraction for tracked stocks.",
    stack: ["Python", "Financial APIs", "Claude API", "Pandas"],
    iconName: "chart",
    category: "AI Agent",
  },
  {
    title: "Multilingual Customer Support Bot",
    summary:
      "A customer support assistant capable of detecting incoming languages, translating queries, fetching policy answers, and responding in the user's native tongue.",
    outcome: "Multi-language intent detection and translated response generation.",
    stack: ["n8n", "OpenAI API", "Webhooks", "Translation API"],
    iconName: "agent",
    category: "Support Bot",
  },
  {
    title: "Website Lead Generation Bot",
    summary:
      "An interactive web chatbot that qualifies visitor intent through structured questions and pushes qualified contact info directly into CRM systems.",
    outcome: "Structured lead qualification flow with automated CRM webhook syncing.",
    stack: ["JavaScript", "n8n", "HubSpot API", "OpenAI"],
    iconName: "spark",
    category: "Lead Gen",
  },
  {
    title: "E-Commerce Chatbot Integration",
    summary:
      "An automated bot integrated into an online store that looks up order tracking numbers, answers return policy FAQs, and handles order status queries.",
    outcome: "Order status lookup via API and automated FAQ handling.",
    stack: ["n8n", "Shopify API", "OpenAI", "Webhooks"],
    iconName: "workflow",
    category: "E-Commerce",
  },
  {
    title: "Mobile App FAQ & Documentation Bot",
    summary:
      "An in-app conversational assistant that indexes mobile app user guides and provides instant troubleshooting steps for common error messages.",
    outcome: "Indexed markdown documentation for semantic query matching.",
    stack: ["Langflow", "Pinecone", "OpenAI", "React"],
    iconName: "bookmark",
    category: "RAG",
  },
  {
    title: "Voice-Enabled Appointment Scheduler",
    summary:
      "A voice-enabled booking agent prototype using speech-to-text, LLM slot extraction, and Google Calendar API integration to schedule appointments.",
    outcome: "Working voice transcription, calendar slot checking, and meeting booking.",
    stack: ["Python", "Whisper API", "Google Calendar API", "Twilio"],
    iconName: "agent",
    category: "Voice AI",
  },
];

const posts = [
  {
    slug: "why-every-business-needs-ai-automation",
    title: "AI automation is no longer optional",
    date: "2025-04-12",
    excerpt:
      "Teams that remove repetitive work free up their time to focus on creative and high-leverage tasks.",
    readingTime: "5 min read",
    category: "Strategy",
    tags: ["AI", "Automation", "Workflows"],
    content: `The biggest misconception about automation is that it replaces people. In practice, workflow automation is about removing the work nobody should be doing manually — repetitive data entry, copy-pasting between tools, and sending standard confirmation emails.

## What AI automation adds

Plain automation moves data between systems when fixed triggers happen. **AI automation** adds reasoning. Instead of rigid "if X then Y", you can classify unstructured text, extract key entities, summarize context, and make dynamic routing decisions.

Three practical examples:

- A workflow that triages inbound emails, classifies urgency, drafts a contextual reply, and notifies Slack.
- An agent that searches documents in a vector store and answers technical questions with citations.
- A multi-agent crew that researches a topic, synthesizes key points, and drafts a formatted brief.

## Where to start

Pick **one** repetitive task that takes more than an hour a week and start there. Solving small bottlenecks reliably is where compounding value begins.`,
  },
  {
    slug: "n8n-vs-zapier-vs-make",
    title: "n8n vs Zapier vs Make: an honest comparison",
    date: "2025-03-28",
    excerpt:
      "Hands-on comparison of the three major automation platforms based on complexity, control, and maintenance.",
    readingTime: "7 min read",
    category: "Tools",
    tags: ["n8n", "Zapier", "Make"],
    content: `After building automations across Zapier, Make, and n8n, each tool has clear strengths depending on the use case:

## Zapier — fastest setup for simple connections

Zapier is great for quick setups and non-technical teams. Connecting Typeform → Google Sheets → Gmail takes minutes. However, advanced logic and high task volumes can become costly.

## Make — visual, multi-step scenarios

Make provides a clear visual canvas for data flow and handles complex array manipulation and iteration cleanly.

## n8n — maximum control and custom logic

n8n is open-source, supports self-hosting, and lets you drop into custom JavaScript and Python nodes whenever needed. For developers and complex AI agent workflows, it offers unmatched flexibility.

## Summary

- **Quick simple integrations** → Zapier
- **Visual multi-step branching** → Make
- **Developer control, custom logic & self-hosting** → n8n`,
  },
  {
    slug: "from-automation-to-llm-engineering",
    title: "From workflow automation to LLM & agent engineering",
    date: "2025-04-20",
    excerpt:
      "Why I'm focusing on the engineering side of LLMs — evaluation, observability, and retrieval quality.",
    readingTime: "4 min read",
    category: "Notes",
    tags: ["Career", "LLM", "Personal"],
    content: `For years, traditional automation was bounded by rigid rules. You had to account for every branch manually.

LLMs made it possible to reason over unstructured inputs, extract parameters dynamically, and draft intelligent outputs.

## Where I'm focusing next

- **Evaluation** — testing prompts and outputs against structured test sets.
- **Observability** — tracing agent reasoning steps, tool calls, and latency.
- **Retrieval quality** — optimizing chunking, embeddings, and vector search in RAG.
- **Multi-agent collaboration** — orchestrating specialized agent roles with clear boundaries.

I learn best by building real workflows and testing their edge cases hands-on.`,
  },
];

// ---------- Convert markdown body → Portable Text blocks ----------

function makeKey(prefix, i) {
  return `${prefix}-${i.toString(36)}`;
}

function parseInline(text, baseKey) {
  const parts = [];
  let i = 0;
  let cursor = 0;
  let buf = "";
  let pending = [];

  function flush(marks) {
    if (buf.length === 0) return;
    pending.push({
      _type: "span",
      _key: makeKey(`${baseKey}-s`, i++),
      text: buf,
      marks: marks ?? [],
    });
    buf = "";
  }

  let mIdx = 0;
  const markDefs = [];

  while (cursor < text.length) {
    if (text[cursor] === "*" && text[cursor + 1] === "*") {
      flush([]);
      const end = text.indexOf("**", cursor + 2);
      if (end === -1) {
        buf += text.slice(cursor);
        cursor = text.length;
        continue;
      }
      buf = text.slice(cursor + 2, end);
      flush(["strong"]);
      cursor = end + 2;
      continue;
    }
    if (text[cursor] === "[") {
      const labelEnd = text.indexOf("]", cursor + 1);
      if (labelEnd !== -1 && text[labelEnd + 1] === "(") {
        const hrefEnd = text.indexOf(")", labelEnd + 2);
        if (hrefEnd !== -1) {
          flush([]);
          const label = text.slice(cursor + 1, labelEnd);
          const href = text.slice(labelEnd + 2, hrefEnd);
          const markKey = makeKey(`${baseKey}-link`, mIdx++);
          markDefs.push({ _key: markKey, _type: "link", href });
          buf = label;
          flush([markKey]);
          cursor = hrefEnd + 1;
          continue;
        }
      }
    }
    buf += text[cursor];
    cursor++;
  }
  flush([]);

  parts.push(...pending);
  return { children: parts, markDefs };
}

function markdownToPortableText(md) {
  const lines = md.split("\n");
  const blocks = [];
  let i = 0;

  function pushBlock(style, text) {
    const baseKey = makeKey("b", blocks.length);
    const { children, markDefs } = parseInline(text, baseKey);
    blocks.push({
      _type: "block",
      _key: baseKey,
      style,
      markDefs,
      children: children.length
        ? children
        : [{ _type: "span", _key: `${baseKey}-empty`, text: "", marks: [] }],
    });
  }

  let currentList = null;

  function flushList() {
    if (currentList) {
      for (const item of currentList.items) {
        const baseKey = makeKey("li", blocks.length);
        const { children, markDefs } = parseInline(item, baseKey);
        blocks.push({
          _type: "block",
          _key: baseKey,
          style: "normal",
          listItem: "bullet",
          level: 1,
          markDefs,
          children,
        });
      }
      currentList = null;
    }
  }

  while (i < lines.length) {
    const raw = lines[i].trimEnd();
    const line = raw;

    if (!line.trim()) {
      flushList();
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      flushList();
      pushBlock("h2", line.slice(3));
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      if (!currentList) currentList = { items: [] };
      currentList.items.push(line.slice(2));
      i++;
      continue;
    }
    flushList();
    let para = line;
    while (i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].startsWith("## ") && !lines[i + 1].startsWith("- ")) {
      i++;
      para += " " + lines[i].trim();
    }
    pushBlock("normal", para);
    i++;
  }
  flushList();
  return blocks;
}

// ---------- Run seed ----------

async function run() {
  console.log("Seeding Sanity dataset:", dataset);

  const tx = client.transaction();

  // Site config
  tx.createOrReplace(siteConfig);

  // Engagement tiers
  engagements.forEach((e) => {
    tx.createOrReplace(e);
  });

  // Services
  services.forEach((s, i) => {
    tx.createOrReplace({
      _id: `service.${slugify(s.title)}`,
      _type: "service",
      ...s,
      order: i,
    });
  });

  // Skill categories
  skillCategories.forEach((s, i) => {
    tx.createOrReplace({
      _id: `skill.${slugify(s.category)}`,
      _type: "skillCategory",
      ...s,
      order: i,
    });
  });

  // Projects
  projects.forEach((p, i) => {
    tx.createOrReplace({
      _id: `project.${slugify(p.title)}`,
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: slugify(p.title) },
      summary: p.summary,
      outcome: p.outcome,
      stack: p.stack,
      iconName: p.iconName,
      category: p.category,
      featured: i < 4,
      order: i,
    });
  });

  // Posts
  posts.forEach((post) => {
    tx.createOrReplace({
      _id: `post.${post.slug}`,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
      excerpt: post.excerpt,
      publishedAt: new Date(post.date).toISOString(),
      readingTime: post.readingTime,
      category: post.category,
      tags: post.tags,
      body: markdownToPortableText(post.content),
    });
  });

  const res = await tx.commit({ visibility: "async" });
  console.log("✓ Committed", res.results.length, "documents.");
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
