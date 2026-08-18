import { NextRequest, NextResponse } from "next/server";
import { retrievePortfolioContext } from "@/lib/ai/retrieval";
import { generateAIResponse, type ChatMessage } from "@/lib/ai/provider";
import { sanitizeString } from "@/lib/validators";

export const runtime = "nodejs";

// In-memory sliding window rate limiter
interface RateLimitRecord {
  timestamps: number[];
}
const ipRateLimits = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // 15 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ip) || { timestamps: [] };

  // Filter timestamps within the current window
  const validTimestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRateLimits.set(ip, { timestamps: validTimestamps });
    return true;
  }

  validTimestamps.push(now);
  ipRateLimits.set(ip, { timestamps: validTimestamps });
  return false;
}

// Clean up stale rate limit entries periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipRateLimits.entries()) {
      const valid = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        ipRateLimits.delete(ip);
      } else {
        ipRateLimits.set(ip, { timestamps: valid });
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export async function POST(req: NextRequest) {
  try {
    // 1. Extract IP for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a moment before asking another question.",
          reply: "You've sent several queries in a short time. Please wait a minute before asking your next question.",
          citations: [{ title: "Contact Directly", url: "/contact", type: "contact" }],
        },
        { status: 429 },
      );
    }

    // 2. Validate request payload
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 },
      );
    }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Please provide a valid messages array." },
        { status: 400 },
      );
    }

    // Sanitize and normalize messages (max 10 recent messages)
    const sanitizedMessages: ChatMessage[] = [];
    const recentMessages = messages.slice(-10);

    for (const m of recentMessages) {
      if (typeof m !== "object" || !m) continue;
      const role = m.role === "assistant" ? "assistant" : "user";
      const rawContent = typeof m.content === "string" ? m.content : "";
      const content = sanitizeString(rawContent, 600); // 600 chars limit per message
      if (content.trim().length > 0) {
        sanitizedMessages.push({ role, content });
      }
    }

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "No valid message content provided." },
        { status: 400 },
      );
    }

    const lastUserMessage =
      [...sanitizedMessages].reverse().find((m) => m.role === "user")?.content || "";

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: "User message required." },
        { status: 400 },
      );
    }

    // 3. Retrieve relevant portfolio context from MongoDB
    const { contextText, relevantCitations } = await retrievePortfolioContext(lastUserMessage);

    // 4. Generate AI response using swappable provider or grounded fallback
    const result = await generateAIResponse({
      messages: sanitizedMessages,
      contextText,
      citations: relevantCitations,
    });

    return NextResponse.json({
      reply: result.reply,
      citations: result.citations,
      provider: result.providerUsed,
    });
  } catch (err) {
    console.error("[API/agent] Error processing AI chat:", err);
    return NextResponse.json(
      {
        reply:
          "I am Arefin AI. The assistant is temporarily recovering. Feel free to explore projects directly at /projects or reach out at /contact!",
        citations: [
          { title: "View Projects", url: "/projects", type: "project" },
          { title: "Contact", url: "/contact", type: "contact" },
        ],
        error: "Internal error occurred",
      },
      { status: 200 },
    );
  }
}
