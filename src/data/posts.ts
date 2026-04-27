export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  category: string;
  tags: string[];
  content: string;
};

export const posts: Post[] = [
  {
    slug: "why-every-business-needs-ai-automation",
    title: "AI automation is no longer optional",
    date: "2025-04-12",
    excerpt:
      "The companies winning right now aren't the ones with the most headcount. They're the ones whose teams stopped doing repetitive work years ago.",
    readingTime: "5 min read",
    category: "Strategy",
    tags: ["AI", "Automation", "Business"],
    content: `
The biggest misconception about automation is that it replaces people. In practice, the businesses I work with use automation to remove the work nobody should be doing — repetitive data entry, copy-pasting between tools, sending the same five emails a hundred times — so the team can spend their hours on the work that actually moves revenue.

## What "AI automation" actually means

Plain automation moves data between systems. **AI automation** adds judgement. Instead of "if X then Y", you can now say "if X, figure out the right Y, draft it in our voice, and only ping a human if you're not sure." Three examples I've shipped recently:

- A workflow that triages inbound support tickets, decides if they're urgent, drafts a reply in the brand's tone of voice and queues it for human review.
- An agent that researches each prospect's website, summarizes what they do, and writes a personalized cold-email opener — at scale.
- A system that watches Stripe for new customers and runs a tailored 30-day onboarding sequence based on the plan they purchased.

## Where to start

Don't try to automate everything at once. Pick **one** repetitive task that takes your team more than an hour a week and start there. The compounding ROI is what matters, not the size of the first build.

If you'd like an honest audit of your current workflow, [reach out](/contact). No pitch — I'll tell you what's worth automating and what isn't.
    `.trim(),
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
    content: `
After shipping production automations across Zapier, Make and n8n, I've stopped recommending a single "best" platform. The right choice depends on three variables: **complexity**, **volume**, and **who maintains it day-to-day**.

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

Most of my clients end up running **n8n + a couple of Zapier connectors** for the long-tail apps n8n hasn't integrated yet.
    `.trim(),
  },
  {
    slug: "from-automation-to-llm-engineering",
    title: "From automation expert to LLM engineer",
    date: "2025-04-20",
    excerpt:
      "Why I'm spending the next phase of my career going deeper on the engineering side of LLMs — evaluation, observability and retrieval quality.",
    readingTime: "4 min read",
    category: "Notebook",
    tags: ["Career", "LLM", "Personal"],
    content: `
For years, the limiting factor in automation was the "decide" step. You had to hard-code every branch, anticipate every edge case, and accept that anything truly judgement-based had to stay manual.

LLMs collapsed that limitation overnight. Suddenly the decision step in a workflow could be a paragraph of natural language, and the system could reason about it. I started weaving model calls into n8n flows, then graduated to **LangChain** for more structured agent logic and **LangFlow** for visualizing complex chains.

## Where I'm headed next

The next phase for me is going deeper on the engineering side of LLMs:

- **Evaluation** — how do you actually measure if an agent is good?
- **Observability** — tracing what an agent did, and why.
- **Retrieval quality** — chunking, retrievers, rerankers, hybrid search.
- **Fine-tuning** — when it's worth the cost vs. simply better prompting.

The bar for "production-ready agent" keeps rising. I want to be on the right side of that line.

If you're on the same path, [let's connect](/contact).
    `.trim(),
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
