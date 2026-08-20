import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { executeAI } from "@/lib/ai/providers";
import { getAIConfig } from "@/lib/db";
import type { AIConfig } from "@/lib/db/types";
import { validatePlaygroundPayload, validatePlaygroundSecurityPolicy } from "@/lib/ai/validators";
import { checkRateLimit, extractClientIp } from "@/lib/rate-limit";
import { captureSanitizedAIError, sanitizeSensitiveText } from "@/lib/ai/monitoring";

export const runtime = "nodejs";

const MAX_PLAYGROUND_PAYLOAD_BYTES = 100 * 1024; // 100KB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Admin Playground Rate Limit: max 30/min
  const ip = extractClientIp(req);
  const rl = await checkRateLimit({ key: ip, limit: 30, bucket: "admin_playground" });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Playground rate limit reached. Please wait before testing again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.resetInSeconds),
          "X-RateLimit-Limit": String(rl.totalLimit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // 2. Content Length Guard
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_PLAYGROUND_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // 3. Deep Schema Validation
    const validation = validatePlaygroundPayload(body);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message || "Invalid playground request schema";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { prompt, targetMode, systemPromptOverride, configOverride } = validation.data;

    const baseConfig: AIConfig = await getAIConfig(targetMode === "draft" ? "draft" : "active");

    // 4. Server-Side Security Policy Validation (prevents unallowlisted models & escalation)
    const policyCheck = validatePlaygroundSecurityPolicy(configOverride, baseConfig);
    if (!policyCheck.ok) {
      return NextResponse.json({ error: policyCheck.error || "Security policy violation" }, { status: 400 });
    }

    const mergedOverride: Partial<AIConfig> = {
      ...baseConfig,
      ...(configOverride || {}),
      brain: { ...baseConfig.brain, ...(configOverride?.brain || {}) },
      model: { ...baseConfig.model, ...(configOverride?.model || {}) },
      knowledge: {
        ...baseConfig.knowledge,
        ...(configOverride?.knowledge || {}),
        enabledCollections: {
          ...baseConfig.knowledge?.enabledCollections,
          ...(configOverride?.knowledge?.enabledCollections || {}),
        },
      },
      safety: {
        ...baseConfig.safety,
        ...(configOverride?.safety || {}),
        // Enforce strictly that tool permissions remain public_read_only
        toolPermissions: "public_read_only",
      },
      limits: { ...baseConfig.limits, ...(configOverride?.limits || {}) },
    };

    const result = await executeAI({
      messages: [{ role: "user", content: prompt }],
      systemPromptOverride: systemPromptOverride?.trim() || undefined,
      configOverride: mergedOverride,
      requestType: "playground",
    });

    return NextResponse.json({
      reply: result.reply,
      citations: result.citations,
      providerUsed: result.providerUsed,
      modelUsed: result.modelUsed,
      latencyMs: result.latencyMs,
      tokens: result.tokens,
    });
  } catch (err) {
    captureSanitizedAIError(err, { errorCategory: "playground_execution_failure" });
    const rawError = err instanceof Error ? err.message : "Execution failed";
    return NextResponse.json(
      {
        error: "Playground execution failed",
        message: sanitizeSensitiveText(rawError),
      },
      { status: 500 },
    );
  }
}
