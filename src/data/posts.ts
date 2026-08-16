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
      "Teams that remove repetitive work free up their time to focus on creative and high-leverage tasks.",
    readingTime: "5 min read",
    category: "Strategy",
    tags: ["AI", "Automation", "Workflows"],
    content: `
The biggest misconception about automation is that it replaces people. In practice, workflow automation is about removing the work nobody should be doing manually — repetitive data entry, copy-pasting between tools, and sending standard confirmation emails.

## What AI automation adds

Plain automation moves data between systems when fixed triggers happen. **AI automation** adds reasoning. Instead of rigid "if X then Y", you can classify unstructured text, extract key entities, summarize context, and make dynamic routing decisions.

Three practical examples:

- A workflow that triages inbound emails, classifies urgency, drafts a contextual reply, and notifies Slack.
- An agent that searches documents in a vector store and answers technical questions with citations.
- A multi-agent crew that researches a topic, synthesizes key points, and drafts a formatted brief.

## Where to start

Pick **one** repetitive task that takes more than an hour a week and start there. Solving small bottlenecks reliably is where compounding value begins.

If you have a workflow you'd like to automate, [let's connect](/contact).
    `.trim(),
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
    content: `
After building automations across Zapier, Make, and n8n, each platform has clear trade-offs based on three variables: **complexity**, **volume**, and **who maintains it day-to-day**.

## Zapier — best for quick, simple integrations

Zapier is the easiest to learn. If you need to wire up Typeform → Google Sheets → Gmail in fifteen minutes, nothing beats it. The trade-off is pricing — task-based billing gets expensive at scale, and complex branching logic is harder to manage.

## Make — best for visual, multi-step scenarios

Make's scenario editor is intuitive for visualizing data flow. It handles arrays and iteration cleanly, with operation-based pricing that is generally cost-effective for medium volumes.

## n8n — best for developer control and custom logic

n8n is open-source, supports self-hosting, and lets you drop into custom JavaScript and Python nodes whenever needed. For developers and complex AI agent workflows, it offers unmatched flexibility and ownership.

## Summary

- **Quick simple integrations** → Zapier
- **Visual multi-step branching** → Make
- **Developer control, custom logic & self-hosting** → n8n
    `.trim(),
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
    content: `
For years, traditional automation was bounded by rigid rules. You had to account for every branch manually.

LLMs made it possible to reason over unstructured inputs, extract parameters dynamically, and draft intelligent outputs. I started adding model calls into n8n workflows, then expanded to **LangChain** for structured agent logic and **Langflow** for building retrieval flows.

## Where I'm focusing next

- **Evaluation** — testing prompts and outputs against structured test sets.
- **Observability** — tracing agent reasoning steps, tool calls, and latency.
- **Retrieval quality** — optimizing chunking, embeddings, and vector search in RAG.
- **Multi-agent collaboration** — orchestrating specialized agent roles with clear boundaries.

I learn best by building real workflows and testing their edge cases hands-on.

If you're on the same path, [let's connect](/contact).
    `.trim(),
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
