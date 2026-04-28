/**
 * One-time content seeder for Sanity.
 *
 * Migrates the contents of src/data/site.ts and src/data/posts.ts into
 * matching Sanity documents. Idempotent — re-running it updates existing
 * documents (matched by their deterministic _id) instead of duplicating.
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

// ---------- Source data (mirrors src/data/site.ts and src/data/posts.ts) ----------

const siteConfig = {
  _id: "siteConfig",
  _type: "siteConfig",
  name: "Arefin Muin",
  role: "AI Automation & Agent Engineer",
  email: "arefinmuin@gmail.com",
  tagline:
    "I build AI agents and automation workflows that take repetitive work off your plate so you can focus on growth.",
  siteDescription:
    "Tensor Studio is an independent AI engineering studio. We design and ship AI agents, automation workflows and LLM-powered systems with n8n, Zapier, Make, LangChain, LangFlow, GoHighLevel, Python and TypeScript — quietly, reliably.",
};

const services = [
  {
    iconName: "agent",
    title: "AI Agents",
    description:
      "Custom autonomous and semi-autonomous agents that research, write, summarize, qualify leads or operate other tools — built with LangChain, LangFlow and modern LLMs.",
  },
  {
    iconName: "workflow",
    title: "Workflow Automation",
    description:
      "End-to-end business automations that connect your apps, databases and APIs across n8n, Zapier and Make — CRM sync, lead routing, AI-enriched workflows and more.",
  },
  {
    iconName: "chart",
    title: "GoHighLevel Setup",
    description:
      "Sub-account configuration, funnels, calendars, pipelines, SMS and email automations and AI-powered conversation flows tailored to your agency or business.",
  },
  {
    iconName: "brain",
    title: "Custom LLM Solutions",
    description:
      "Retrieval-augmented systems, knowledge-base chatbots, prompt engineering and integrating OpenAI, Anthropic and open-source models into your product.",
  },
  {
    iconName: "code",
    title: "Python & JavaScript",
    description:
      "Custom scripts and small services to glue systems together, scrape data, batch-process content or extend a no-code workflow with real code.",
  },
  {
    iconName: "compass",
    title: "Audit & Consultation",
    description:
      "Not sure what to automate first? I review your current workflow and recommend the highest-ROI automations and AI integrations.",
  },
];

const skillCategories = [
  {
    iconName: "workflow",
    category: "Automation Platforms",
    items: ["n8n", "Zapier", "Make (Integromat)", "GoHighLevel"],
  },
  {
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
  },
  {
    iconName: "terminal",
    category: "Programming",
    items: ["Python", "JavaScript", "TypeScript", "Node.js", "REST APIs"],
  },
  {
    iconName: "rocket",
    category: "Currently Learning",
    items: ["LLM Engineering", "Fine-tuning", "Evaluation & Observability"],
  },
];

const projects = [
  {
    title: "AI Lead Qualification Agent",
    summary:
      "An LLM-powered agent that ingests inbound leads, enriches them with public data, scores them, and routes hot ones to the sales team via Slack.",
    outcome: "Cut response time 4h → 6 min, lifted lead-to-meeting 45%.",
    stack: ["LangChain", "n8n", "OpenAI", "Slack API"],
    iconName: "agent",
    category: "Agent",
  },
  {
    title: "GoHighLevel Booking Bot",
    summary:
      "Conversational SMS and email bot built on GoHighLevel that books appointments, answers FAQs, and hands off to a human when the conversation requires it.",
    outcome: "Booked 60% of qualified inbound conversations with no human in the loop.",
    stack: ["GoHighLevel", "OpenAI", "Twilio"],
    iconName: "chart",
    category: "Bot",
  },
  {
    title: "Content Repurposing Pipeline",
    summary:
      "A Make.com workflow that turns one long-form video into 10+ pieces of social content using LLM summarization and templated rendering.",
    outcome: "1 hour of video → 12 ready-to-post pieces in under 15 minutes.",
    stack: ["Make", "OpenAI", "FFmpeg"],
    iconName: "layers",
    category: "Pipeline",
  },
  {
    title: "Internal Knowledge-Base Chatbot",
    summary:
      "A retrieval-augmented chatbot over a company's docs, SOPs and Notion workspace — answers staff questions in seconds with source citations.",
    outcome: "Reduced internal SOP questions by ~70% in the first month.",
    stack: ["LangFlow", "Pinecone", "OpenAI", "Python"],
    iconName: "bookmark",
    category: "RAG",
  },
  {
    title: "E-commerce Auto-Reply Agent",
    summary:
      "Zapier and OpenAI automation that drafts and sends personalized customer support replies, escalating complex tickets to humans.",
    outcome: "Auto-resolved ~55% of Tier-1 tickets with brand-tone replies.",
    stack: ["Zapier", "OpenAI", "Gmail API"],
    iconName: "spark",
    category: "Agent",
  },
  {
    title: "AI Cold-Outreach System",
    summary:
      "Multi-step sequence that researches each prospect, generates a personalized opener, and sends through a warmed-up inbox at scale.",
    outcome: "350+ personalized openers per day per sender, 11% reply rate.",
    stack: ["n8n", "OpenAI", "Apollo", "SMTP"],
    iconName: "rocket",
    category: "Outreach",
  },
];

const posts = [
  {
    slug: "why-every-business-needs-ai-automation",
    title: "AI automation is no longer optional",
    date: "2025-04-12",
    excerpt:
      "The companies winning right now aren't the ones with the most headcount. They're the ones whose teams stopped doing repetitive work years ago.",
    readingTime: "5 min read",
    category: "Strategy",
    tags: ["AI", "Automation", "Business"],
    content: `The biggest misconception about automation is that it replaces people. In practice, the businesses I work with use automation to remove the work nobody should be doing — repetitive data entry, copy-pasting between tools, sending the same five emails a hundred times — so the team can spend their hours on the work that actually moves revenue.

## What "AI automation" actually means

Plain automation moves data between systems. **AI automation** adds judgement. Instead of "if X then Y", you can now say "if X, figure out the right Y, draft it in our voice, and only ping a human if you're not sure." Three examples I've shipped recently:

- A workflow that triages inbound support tickets, decides if they're urgent, drafts a reply in the brand's tone of voice and queues it for human review.
- An agent that researches each prospect's website, summarizes what they do, and writes a personalized cold-email opener — at scale.
- A system that watches Stripe for new customers and runs a tailored 30-day onboarding sequence based on the plan they purchased.

## Where to start

Don't try to automate everything at once. Pick **one** repetitive task that takes your team more than an hour a week and start there. The compounding ROI is what matters, not the size of the first build.

If you'd like an honest audit of your current workflow, [reach out](/contact). No pitch — I'll tell you what's worth automating and what isn't.`,
  },
  {
    slug: "n8n-vs-zapier-vs-make",
    title: "n8n vs Zapier vs Make: an honest comparison",
    date: "2025-03-28",
    excerpt:
      "I've shipped production workflows on all three. The right choice depends on three variables — complexity, volume, and who's going to maintain it.",
    readingTime: "7 min read",
    category: "Tools",
    tags: ["n8n", "Zapier", "Make"],
    content: `After shipping production automations across Zapier, Make and n8n, I've stopped recommending a single "best" platform. The right choice depends on three variables: **complexity**, **volume**, and **who maintains it day-to-day**.

## Zapier — best for non-technical teams

Zapier is the easiest to learn. If your operations manager needs to wire up Typeform → Google Sheets → Gmail in fifteen minutes, nothing beats it. The trade-off is pricing — task-based billing gets expensive at scale, and complex branching logic is genuinely painful to build.

## Make — best for visual, multi-step flows

Make's scenario editor is a pleasure to use for visualizing data flow. It handles arrays and iteration far more elegantly than Zapier. Operation-based pricing is usually cheaper than Zapier for high-volume workflows.

## n8n — best when you want power and ownership

n8n is open-source. You can self-host it for unlimited runs, drop into JavaScript whenever you need to, and integrate with anything that exposes an API. Steeper learning curve, but for technical teams it's a no-brainer for anything mission-critical.

## TL;DR

- **Non-technical team, low volume** → Zapier
- **Visual workflow lover, medium volume** → Make
- **Technical team, full control, high volume** → n8n

Most of my clients end up running **n8n + a couple of Zapier connectors** for the long-tail apps n8n hasn't integrated yet.`,
  },
  {
    slug: "from-automation-to-llm-engineering",
    title: "From automation expert to LLM engineer",
    date: "2025-04-20",
    excerpt:
      "Why I'm spending the next phase of my career going deeper on the engineering side of LLMs — evaluation, observability and retrieval quality.",
    readingTime: "4 min read",
    category: "Notes",
    tags: ["Career", "LLM", "Personal"],
    content: `For years, the limiting factor in automation was the "decide" step. You had to hard-code every branch, anticipate every edge case, and accept that anything truly judgement-based had to stay manual.

LLMs collapsed that limitation overnight. Suddenly the decision step in a workflow could be a paragraph of natural language, and the system could reason about it. I started weaving model calls into n8n flows, then graduated to **LangChain** for more structured agent logic and **LangFlow** for visualizing complex chains.

## Where I'm headed next

The next phase for me is going deeper on the engineering side of LLMs:

- **Evaluation** — how do you actually measure if an agent is good?
- **Observability** — tracing what an agent did, and why.
- **Retrieval quality** — chunking, retrievers, rerankers, hybrid search.
- **Fine-tuning** — when it's worth the cost vs. simply better prompting.

The bar for "production-ready agent" keeps rising. I want to be on the right side of that line.

If you're on the same path, [let's connect](/contact).`,
  },
];

// ---------- Convert markdown body → Portable Text blocks ----------

function makeKey(prefix, i) {
  return `${prefix}-${i.toString(36)}`;
}

// Parses inline **bold** and [text](href) into a list of Portable Text spans.
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

  // Tokenize sequentially.
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
    // Combine consecutive non-empty lines into one paragraph.
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

  // Use a transaction so everything either succeeds or rolls back.
  const tx = client.transaction();

  // Site config — singleton, deterministic _id.
  tx.createOrReplace(siteConfig);

  services.forEach((s, i) => {
    tx.createOrReplace({
      _id: `service.${slugify(s.title)}`,
      _type: "service",
      ...s,
      order: i,
    });
  });

  skillCategories.forEach((s, i) => {
    tx.createOrReplace({
      _id: `skill.${slugify(s.category)}`,
      _type: "skillCategory",
      ...s,
      order: i,
    });
  });

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
      featured: i < 3,
      order: i,
    });
  });

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
