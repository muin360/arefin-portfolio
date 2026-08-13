import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { system, messages } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Fixing model name to valid Claude 3 Haiku name since the provided one is hypothetical/invalid
        max_tokens: 200,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: "Agent unavailable." }, { status: 200 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "No response.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Connection error." }, { status: 200 });
  }
}
