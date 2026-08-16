import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

function getFallbackResponse(userMessage: string): string {
  const query = userMessage.toLowerCase();

  if (query.includes("pricing") || query.includes("cost") || query.includes("rate") || query.includes("charge")) {
    return "Projects are scoped based on the specific workflow requirements. We can explore your needs during a free 30-minute scoping conversation.";
  }

  if (query.includes("stack") || query.includes("tech") || query.includes("tool") || query.includes("language") || query.includes("python")) {
    return "Arefin specializes in n8n, Zapier, Langflow, LangChain, OpenAI & Claude APIs, vector search (Pinecone), webhooks, REST APIs, and Python/JavaScript fundamentals.";
  }

  if (query.includes("book") || query.includes("contact") || query.includes("call") || query.includes("hire") || query.includes("schedule")) {
    return "You can get in touch directly via the contact form at /contact or via WhatsApp.";
  }

  if (query.includes("project") || query.includes("case study") || query.includes("portfolio") || query.includes("work")) {
    return "Arefin has built practical projects including Email Triage Automation (n8n + OpenAI), Customer Support Q&A Bots (Langflow), and Market Research Multi-Agent systems. Check /projects for details.";
  }

  if (query.includes("who") || query.includes("arefin") || query.includes("about") || query.includes("experience")) {
    return "Arefin Mueen is an AI Automation & AI Agent Developer based in Dhaka. He builds practical AI workflows, autonomous agents, RAG systems, and custom webhook integrations.";
  }

  return "I'm Arefin's AI assistant. I can answer questions about AI automation workflows, n8n integrations, tech stacks, and how to get in touch!";
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

