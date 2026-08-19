import { NextRequest, NextResponse } from "next/server";
import { executeAI } from "@/lib/ai/providers";
import { getAIConfig } from "@/lib/db";
import { validateChatPayload } from "@/lib/ai/validators";
import { checkRateLimit, extractClientIp } from "@/lib/rate-limit";
import { captureSanitizedAIError } from "@/lib/ai/monitoring";
import { saveUserSessionMemory } from "@/lib/ai/memory";
import crypto from "crypto";

export const runtime = "nodejs";

// Max raw request body size: 100 KB
const MAX_PAYLOAD_BYTES = 100 * 1024;

export async function POST(req: NextRequest) {
  try {
    const activeConfig = await getAIConfig("active");
    const rateLimit = activeConfig.limits?.rateLimitPerMin || 15;
    const maxPromptLen = activeConfig.limits?.maxPromptLength || 1000;

    // 1. Extract IP for rate limiting & anonymous hashing
    const rawIp = extractClientIp(req);
    const ipHash = crypto.createHash("sha256").update(rawIp).digest("hex").slice(0, 12);

    // Multi-tier Rate Limiter
    const rateLimitResult = await checkRateLimit({
      key: rawIp,
      limit: rateLimit,
      windowSeconds: 60,
      bucket: "public_chat",
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit reached.",
          reply:
            "You've sent several queries in a short time. Please wait a minute before asking your next question.",
          citations: [{ title: "Contact Directly", url: "/contact", type: "contact" }],
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitResult.resetInSeconds),
            "X-RateLimit-Limit": String(rateLimitResult.totalLimit),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }

    // 2. Check content-length header
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        { error: "Payload Too Large. Max request size is 100KB." },
        { status: 413 },
      );
    }

    // 3. Parse and strictly validate payload with Zod
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload. Expected JSON object." },
        { status: 400 },
      );
    }

    const validation = validateChatPayload(body);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message || "Invalid chat request schema";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const { messages, sessionId } = validation.data;

    // Filter, clean control characters, and sanitize messages against active maxPromptLen
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
        .trim()
        .slice(0, maxPromptLen),
    }));

    // 4. Execute AI through Provider Abstraction Engine
    const result = await executeAI({
      messages: sanitizedMessages,
      requestType: "chat",
      clientIpHash: ipHash,
    });

    // 5. Deduplicate citations by URL
    const seenUrls = new Set<string>();
    const deduplicatedCitations = (result.citations || []).filter((c) => {
      if (!c.url || seenUrls.has(c.url)) return false;
      seenUrls.add(c.url);
      return true;
    });

    // 6. Asynchronously persist encrypted user memory for Admin Intelligence (0 latency impact)
    const rawSession = sessionId || `session_${ipHash}`;
    const cleanSessionId = rawSession.replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 64);

    const allSessionMessages = [
      ...sanitizedMessages,
      { role: "assistant" as const, content: result.reply },
    ];
    saveUserSessionMemory(cleanSessionId, allSessionMessages).catch((err) => {
      console.warn("[AI Agent Memory] Async session encryption notice:", err);
    });

    return NextResponse.json(
      {
        reply: result.reply,
        citations: deduplicatedCitations,
        provider: result.providerUsed,
        model: result.modelUsed,
        sessionId: cleanSessionId,
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimitResult.totalLimit),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        },
      },
    );
  } catch (err) {
    captureSanitizedAIError(err, { errorCategory: "public_chat_error" });
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
