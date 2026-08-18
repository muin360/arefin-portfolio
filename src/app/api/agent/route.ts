import { NextRequest, NextResponse } from "next/server";
import { executeAI } from "@/lib/ai/providers";
import { getAIConfig } from "@/lib/db";
import { sanitizeString } from "@/lib/validators";
import crypto from "crypto";

export const runtime = "nodejs";

// In-memory sliding window rate limiter
interface RateLimitRecord {
  timestamps: number[];
}
const ipRateLimits = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(ip: string, maxPerMin: number): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ip) || { timestamps: [] };
  const validTimestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= maxPerMin) {
    ipRateLimits.set(ip, { timestamps: validTimestamps });
    return true;
  }

  validTimestamps.push(now);
  ipRateLimits.set(ip, { timestamps: validTimestamps });
  return false;
}

// Clean up stale rate limit entries periodically
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
    const activeConfig = await getAIConfig("active");
    const rateLimit = activeConfig.limits?.rateLimitPerMin || 15;
    const maxPromptLen = activeConfig.limits?.maxPromptLength || 1000;

    // 1. Extract IP for rate limiting & anonymous hashing
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const ipHash = crypto.createHash("sha256").update(rawIp).digest("hex").slice(0, 12);

    if (isRateLimited(rawIp, rateLimit)) {
      return NextResponse.json(
        {
          error: "Rate limit reached.",
          reply:
            "You've sent several queries in a short time. Please wait a minute before asking your next question.",
          citations: [{ title: "Contact Directly", url: "/contact", type: "contact" }],
        },
        { status: 429 },
      );
    }

    // 2. Validate request payload
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Please provide a valid messages array." }, { status: 400 });
    }

    // Sanitize messages (max 10 recent messages)
    const sanitizedMessages = [];
    const recentMessages = messages.slice(-10);

    for (const m of recentMessages) {
      if (typeof m !== "object" || !m) continue;
      const role = m.role === "assistant" ? ("assistant" as const) : ("user" as const);
      const rawContent = typeof m.content === "string" ? m.content : "";
      const content = sanitizeString(rawContent, maxPromptLen);
      if (content.trim().length > 0) {
        sanitizedMessages.push({ role, content });
      }
    }

    if (sanitizedMessages.length === 0) {
      return NextResponse.json({ error: "No valid message content provided." }, { status: 400 });
    }

    // 3. Execute AI through Provider Abstraction Engine
    const result = await executeAI({
      messages: sanitizedMessages,
      requestType: "chat",
      clientIpHash: ipHash,
    });

    return NextResponse.json({
      reply: result.reply,
      citations: result.citations,
      provider: result.providerUsed,
      model: result.modelUsed,
    });
  } catch (err) {
    console.error("[API/agent] Error processing AI chat:", err);
    return NextResponse.json(
      {
        reply:
          "Arefin AI is temporarily unavailable. Please explore projects directly at /projects or reach out at /contact!",
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
