import type {
  AIProviderAdapter,
  AIProviderRequest,
  AIProviderResponse,
  ProviderHealthCheckResult,
} from "./types";

export class LocalGroundedProviderAdapter implements AIProviderAdapter {
  name = "local_grounded" as const;

  async generate(req: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const lastUserMessage =
      [...req.messages].reverse().find((m) => m.role === "user")?.content || "";
    const q = lastUserMessage.toLowerCase().trim();

    let reply = "";

    if (
      q.includes("rag") ||
      q.includes("retrieval") ||
      q.includes("vector") ||
      q.includes("knowledge") ||
      q.includes("pinecone")
    ) {
      reply = `Arefin builds context-aware **RAG (Retrieval-Augmented Generation)** knowledge systems. 

Key capabilities include:
- Vector search indexing with **Pinecone** and chunking pipelines.
- Multi-document retrieval with structured output guardrails.
- Tool-calling Q&A bots engineered using **Langflow** and **LangChain**.

Explore his case studies at **/projects** or capability blueprints at **/services**.`;
    } else if (
      q.includes("agent") ||
      q.includes("multi-agent") ||
      q.includes("crew") ||
      q.includes("langchain") ||
      q.includes("autonomy")
    ) {
      reply = `Arefin specializes in **autonomous AI agents and multi-agent workflows**.

Key architectures:
- Tool-calling agent decision loops with confidence checks and fallback routing.
- Multi-agent research and data synthesis pipelines.
- Event-driven orchestration with **n8n**, **LangChain**, and **Python**.

Check out featured projects like the Market Research Multi-Agent system at **/projects**.`;
    } else if (
      q.includes("build") ||
      q.includes("service") ||
      q.includes("offer") ||
      q.includes("what can you") ||
      q.includes("capability")
    ) {
      reply = `Arefin builds end-to-end intelligent automation systems under your complete ownership:

1. **Autonomous AI Agents & Multi-Agent Workflows** — Tool-calling agents with deterministic error handling.
2. **RAG & Knowledge Retrieval Systems** — Vector search and dynamic document retrieval.
3. **Event-Driven Workflow Automation** — Webhook pipelines in n8n, Zapier, and custom Python.
4. **Interactive AI Assistants & Chatbots** — Custom API integrations with schema validation.

View all active capability blueprints at **/services** and case studies at **/projects**.`;
    } else if (
      q.includes("tool") ||
      q.includes("stack") ||
      q.includes("tech") ||
      q.includes("language") ||
      q.includes("framework")
    ) {
      reply = `Arefin's core production tech stack comprises:

- **Orchestration**: n8n, LangChain, Langflow, Zapier
- **AI Models**: OpenAI GPT-4o, Anthropic Claude 3.5, Gemini
- **Data & Vector**: MongoDB, Pinecone, Redis
- **Code & Integration**: Python, TypeScript, REST APIs, Webhooks, Next.js

See the complete skill matrix at **/skills**.`;
    } else if (
      q.includes("contact") ||
      q.includes("hire") ||
      q.includes("rate") ||
      q.includes("price") ||
      q.includes("cost") ||
      q.includes("reach") ||
      q.includes("book") ||
      q.includes("call")
    ) {
      reply = `You can get in touch with Arefin directly through:

- **Contact Form**: Send your project details via **/contact**
- **Discovery Call**: Schedule a 30-minute scoping call at **/book**
- **Direct WhatsApp**: Available worldwide (based in Dhaka, GMT+6)
- **Direct Email**: arefinmueen360@gmail.com`;
    } else if (
      q.includes("about") ||
      q.includes("who is") ||
      q.includes("background") ||
      q.includes("location") ||
      q.includes("bio")
    ) {
      reply = `**Arefin Mueen** is an AI Automation & AI Agent Developer based in Dhaka (GMT+6) working with teams globally.

He builds production-grade automations, LLM tool integrations, and RAG knowledge pipelines using modern AI frameworks.

Read his complete engineering philosophy at **/about**.`;
    } else {
      reply = `**Arefin AI**: Arefin Mueen is an AI Automation & AI Agent Developer who builds practical AI agents, RAG knowledge systems, and end-to-end automation pipelines using n8n, LangChain, Python, and modern LLMs.

Browse his case studies at **/projects**, services at **/services**, or schedule a scoping call at **/book**.`;
    }

    const latencyMs = Date.now() - startTime;
    return {
      reply,
      citations: req.citations || [],
      providerUsed: "local_grounded",
      modelUsed: "local-grounded-v1",
      tokens: {
        promptTokens: Math.round(lastUserMessage.length / 4),
        completionTokens: Math.round(reply.length / 4),
        totalTokens: Math.round((lastUserMessage.length + reply.length) / 4),
      },
      latencyMs,
    };
  }

  async healthCheck(): Promise<ProviderHealthCheckResult> {
    return {
      ok: true,
      status: "connected",
      message: "Local Grounded Engine active & healthy (0ms)",
      latencyMs: 0,
    };
  }
}
