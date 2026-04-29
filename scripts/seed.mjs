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
  name: "Tensor",
  role: "AI Automation & Agent Engineering Agency",
  email: "arefinmuin@gmail.com",
  tagline:
    "Tensor is a small AI engineering agency. We design, ship and maintain AI agents, automation workflows and LLM-powered systems for ambitious teams.",
  siteDescription:
    "Tensor is an AI engineering agency. We design, ship and maintain AI agents, automation workflows and LLM-powered systems with n8n, LangChain, LangGraph, GoHighLevel, Python and TypeScript — quietly, reliably, in production.",
  social: {
    github: "https://github.com/arefinmuin",
    linkedin: "https://www.linkedin.com/in/arefin-muin/",
    twitter: "https://x.com/arefin_muin",
    facebook: "https://www.facebook.com/Mueen360",
    email: "mailto:arefinmuin@gmail.com",
  },
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
  {
    slug: "how-we-evaluate-llms-before-shipping",
    title: "How we evaluate LLMs before shipping them to clients",
    date: "2025-04-26",
    excerpt:
      "Vibes-driven prompt engineering is fine for a demo. Production needs an evaluation harness — here's the one we run at Tensor.",
    readingTime: "8 min read",
    category: "Engineering",
    tags: ["LLM", "Evaluation", "Production"],
    content: `Most agents look great in the demo and fall apart in week two. The reason is almost always the same — there was no evaluation. The team built a prompt that worked on five examples, shipped it, and discovered the long tail of inputs the hard way.

At Tensor we won't ship an agent without a basic eval harness. Here's the one we use.

## Step 1 — write the eval set before the prompt

This sounds backwards. It isn't. Before I touch a prompt, I write 30–50 input/output pairs by hand. Real inputs from the client's data, with the output I'd want a human to produce. The eval set is the spec.

If you can't write 30 examples of what "good" looks like, **you don't understand the task well enough to ship it.**

## Step 2 — pick three metrics, not thirty

Not every task needs a custom metric. We default to three:

- **Exact match** — for tasks where there's a right answer (classification, extraction).
- **LLM-as-judge** — for open-ended outputs (summaries, drafts). A separate, stronger model grades the output against a rubric.
- **Latency p95** — measured under realistic concurrency.

Anything more sophisticated than this should be earned. If you start with **DeepEval** + **Phoenix** + **LangSmith** + a custom metric, you'll spend two weeks on infrastructure before you've shipped a single eval.

## Step 3 — run it on every change

The eval suite runs on every prompt edit, every model swap, every retrieval change. We commit the results to git so we can see regressions over time. \`pytest\` works fine for this.

The most underrated benefit: **regressions stop being a vibe.** When a stakeholder says "the new version is worse", you can show them the score on the same eval set as last week.

## Step 4 — separate the eval set from the training set

If you're tuning prompts based on the eval set, you're overfitting. Keep a held-out set you only look at right before shipping.

## What this catches in practice

In the last six months, our eval harness has caught:
- A model upgrade (3.5 → 4o) that improved most outputs but regressed on long inputs because of context-window pricing changes.
- A retrieval change that made answers prettier but factually worse.
- A prompt edit that fixed one edge case and broke seven others.

None of these would have been caught by manual testing.

## TL;DR

Ship an eval harness with the agent. It doesn't need to be fancy — 30 hand-written examples + LLM-as-judge + a CI script. The discipline of always running it is more valuable than the metric itself.`,
  },
  {
    slug: "the-tensor-agent-stack",
    title: "The agent stack we use at Tensor",
    date: "2025-04-22",
    excerpt:
      "After two years building agents in production, we've converged on a stack that's small, observable and cheap to run. Here's what's in it.",
    readingTime: "9 min read",
    category: "Engineering",
    tags: ["Agents", "Stack", "LangGraph"],
    content: `Every six months I rebuild the same parts of the agent stack from scratch. Each iteration gets shorter as the ecosystem matures. Here's what's in our current setup at Tensor and **why** — because the why ages better than the libraries.

## The stack, top to bottom

- **Orchestration:** LangGraph (Python) for stateful, branching agents. n8n for stateless workflow glue.
- **Models:** Claude 3.5 Sonnet for reasoning. GPT-4o-mini for cheap classification. Together AI for self-hosted fallbacks.
- **Retrieval:** PostgreSQL + pgvector. Hybrid search (BM25 + vector) via \`pg_search\`.
- **Storage:** PostgreSQL for everything. Redis for ephemeral state.
- **Observability:** LangSmith for traces. Sentry for errors. Plain SQL for analytics.
- **Deployment:** Vercel for the UI. Fly.io for the agent runtime. Cloudflare for routing.
- **Eval:** Custom \`pytest\` harness (see [how we evaluate LLMs](/blog/how-we-evaluate-llms-before-shipping)).

## Why LangGraph over LangChain

LangChain is excellent for prototyping. The chain abstraction breaks down for anything stateful, branching or long-running. LangGraph models agents as state machines — explicit nodes, explicit edges, explicit checkpoints. It is dramatically easier to debug.

For workflows that don't need agent state (an LLM call wrapped in retries, a triage step inside an n8n flow), I skip LangGraph entirely and call the model directly. Not every problem is an agent.

## Why two models, not one

Cost. A typical Tensor agent does 80% of its work with GPT-4o-mini at $0.15/1M tokens, then escalates to Sonnet for the hard 20%. The cost difference is 30×, the quality difference (for the right tasks) is invisible.

The trick is teaching the agent **when to escalate**. We use a confidence-scoring step: the cheap model decides if it's sure, and only routes to Sonnet when it isn't.

## Why pgvector, not Pinecone

For 95% of clients, pgvector inside Postgres is faster, cheaper and operationally simpler than running a separate vector database. You only need a dedicated vector DB once you're past ~10M embeddings or you need very high concurrent throughput. We've never hit that bar.

## What I removed

Things I was using a year ago and stopped:

- **Auto-GPT-style fully autonomous loops.** Too unpredictable. We use bounded multi-step agents with explicit supervisor checks.
- **OpenAI's Assistants API.** Vendor lock-in for features you can replicate in 50 lines.
- **Vector-only retrieval.** Hybrid search with BM25 reranking is consistently better.

## TL;DR

The boring stack wins. Postgres, two models, LangGraph, LangSmith, eval harness. Less abstraction, more observability.`,
  },
  {
    slug: "gohighlevel-vs-build-from-scratch",
    title: "GoHighLevel vs build-from-scratch: when each makes sense",
    date: "2025-04-18",
    excerpt:
      "GoHighLevel is the right answer 70% of the time. The other 30% it's a trap. Here's how to tell.",
    readingTime: "6 min read",
    category: "Strategy",
    tags: ["GoHighLevel", "SaaS", "Build vs Buy"],
    content: `Most agencies and service businesses I work with are choosing between **GoHighLevel** (or HubSpot, Close, Active Campaign — same shape) and **building a custom system**. The right answer is GoHighLevel about 70% of the time. Here's how to tell which side of the line you're on.

## When GoHighLevel is right

You should use GoHighLevel if **all** of these are true:

- Your sales process is reasonably standard (lead → qualify → book → close).
- You'll have <10 power users editing the system.
- You don't need anything that the platform doesn't already do.
- Time-to-value matters more than total-cost-of-ownership over 3 years.

In this scenario, GHL gives you funnels, pipelines, calendars, SMS/email automations, AI conversation flows and a customer portal in roughly a week. Building that from scratch is a six-month project that costs more than the platform fee will over the lifetime of the business.

## When custom makes sense

You should build custom if **any** of these are true:

- Your business model has a non-standard piece (multi-leg booking, complex pricing, an unusual handoff).
- You need integrations the platform doesn't have, and the workarounds are ugly.
- The platform's data model fights you (you're constantly using "custom fields" to fake what should be a first-class concept).
- You're at scale where the per-seat / per-contact pricing crosses build-it-yourself economics.

The trap most teams fall into: they pick GHL because it's faster, then bend the platform until it groans. Eventually they're paying SaaS fees to maintain a half-working custom build inside someone else's CRM.

## The "configure first, code second" rule

Whenever I take on a new client, I configure GoHighLevel first — even if I think we'll need custom. The configuration is the spec. Two outcomes:

1. The configuration solves the problem. Great — we're done.
2. The configuration hits a wall. Now we know exactly which piece we need to replace, and we keep GHL for the parts it does well.

This **hybrid stack** ends up being most of our long-running engagements: GHL for CRM + funnels, our custom code for the one thing it can't do.

## What I avoid

Two failure modes I've seen repeatedly:

- **Replacing GHL with a from-scratch custom CRM.** Almost always a mistake. The features you don't think you need (deliverability infra, calendar sync, SMS compliance) take months to rebuild.
- **Forcing custom logic through Zapier into GHL.** Works for a while, becomes unmaintainable past a few flows.

## TL;DR

Configure first. Code second. The hybrid stack is the boring, unglamorous, correct answer for most service businesses.`,
  },
  {
    slug: "what-production-grade-ai-means",
    title: "What 'production-grade AI' actually means in 2025",
    date: "2025-04-15",
    excerpt:
      "The term gets thrown around a lot. Here's the checklist we use at Tensor to decide if a system is actually production-ready.",
    readingTime: "5 min read",
    category: "Engineering",
    tags: ["Production", "Reliability", "Operations"],
    content: `Everyone in the AI ecosystem says they ship "production-grade" systems. Most of them ship demos that happen to live on the internet. Production means something specific. Here's the checklist we use.

## A system is production-grade if it has:

**1. An eval suite that runs in CI.** If you can't show me the score from the last commit, you don't have an eval suite, you have wishful thinking.

**2. Observability for every model call.** Inputs, outputs, latency, cost, error rate. Logged. Searchable. We use LangSmith for this; you can build it yourself in two days if you want.

**3. Graceful degradation.** What happens when OpenAI returns a 503? When Anthropic rate-limits you? When the user types nonsense? Each of these has been a 2am incident at some point — design for it from day one.

**4. A cost ceiling.** Token-based pricing means a runaway agent can rack up four-figure bills overnight. We hard-cap every agent at a per-request and per-day spend. The cap is in code, not configuration.

**5. PII handling.** What data is going into the prompt? What's coming back? Where is it logged? Most teams haven't thought about this. Auditors will.

**6. A rollback plan.** Prompts, model versions and retrieval data are all things you might need to roll back instantly. Treat them like database migrations — versioned, reviewable, reversible.

**7. Human-in-the-loop where it matters.** The agent should be confident about its uncertainty. Anywhere it isn't sure, escalate to a human. The metric is "% of cases auto-resolved", not "% of cases the agent attempted".

## What's *not* on the list

- **Fancy architecture.** Most production agents we ship are 200 lines of Python.
- **The latest model.** We default to one major version behind to avoid breakage.
- **Custom UI.** We use plain HTML email and Slack until the workflow proves it deserves more.

## How long does this take to build?

For a real agent: **six to eight weeks**. The first two weeks are scoping + eval set. The next two are the agent. The last four are everything on the list above. The agent itself is the easy part.

If a vendor tells you a production agent takes a week, what they mean is **a demo**. Demos are easy. Production is what we get paid for.

## TL;DR

Production = eval + observability + degradation + cost cap + PII + rollback + human-in-the-loop. The agent is the smallest part of the work.`,
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
