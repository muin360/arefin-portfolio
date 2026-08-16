import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

function getFallbackResponse(userMessage: string): string {
  const query = userMessage.toLowerCase();

  if (query.includes("pricing") || query.includes("cost") || query.includes("rate") || query.includes("charge")) {
    return "Projects typically start with a free 30-min discovery audit. Fixed-scope automation sprints range from $1.5k–$5k with 14-day turnaround and 30-day post-launch support.";
  }

  if (query.includes("stack") || query.includes("tech") || query.includes("tool") || query.includes("language") || query.includes("python")) {
    return "Arefin specializes in n8n, Python (FastAPI, LangChain, LlamaIndex), TypeScript/Next.js, vector databases (Pinecone, pgvector), and multi-agent systems with Claude 3.5 & GPT-4o.";
  }

  if (query.includes("book") || query.includes("contact") || query.includes("call") || query.includes("hire") || query.includes("schedule")) {
    return "You can book a free 30-min automation audit directly at /book or send a message via /contact or WhatsApp.";
  }

  if (query.includes("project") || query.includes("case study") || query.includes("portfolio") || query.includes("work")) {
    return "Recent shipped projects include an Autonomous CRM Lead Qualifier (n8n + GPT-4o), a Multi-Tenant RAG Knowledge Base, and automated billing reconciliation workflows. Check /projects for live demos.";
  }

  if (query.includes("who") || query.includes("arefin") || query.includes("about") || query.includes("experience")) {
    return "Arefin Muin is an AI Automation & Agent Engineer and the founder of Tensorix. He builds enterprise automation pipelines, AI agents, and custom integrations that save teams 20+ hours every week.";
  }

  return "I'm Arefin's AI assistant. I can answer questions about AI automation workflows, n8n integrations, tech stacks, project timelines, and booking a discovery call!";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { system, messages } = body ?? {};

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ reply: "Please provide a valid question." }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content ?? "";

    // If no API key configured, use our rich local knowledge fallback
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ reply: getFallbackResponse(lastMessage) });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 200,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: getFallbackResponse(lastMessage) }, { status: 200 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? getFallbackResponse(lastMessage);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "I'm Arefin's AI assistant. Feel free to explore my portfolio at /projects or book a call at /book!" },
      { status: 200 },
    );
  }
}

