import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { executeAI } from "@/lib/ai/providers";
import { getAIConfig } from "@/lib/db";
import type { AIConfig } from "@/lib/db/types";
import { validatePlaygroundPayload } from "@/lib/ai/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureSanitizedAIError } from "@/lib/ai/monitoring";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin Playground Rate Limit: max 30/min
  const ip = req.headers.get("x-forwarded-for") || "admin";
  const rl = await checkRateLimit({ key: ip, limit: 30, bucket: "admin_playground" });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Playground rate limit reached. Please wait before testing again." },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const validation = validatePlaygroundPayload(body);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message || "Invalid playground request schema";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { prompt, targetMode, systemPromptOverride, configOverride } = validation.data;

    let baseConfig: AIConfig;
    if (targetMode === "draft") {
      baseConfig = await getAIConfig("draft");
    } else {
      baseConfig = await getAIConfig("active");
    }

    const mergedOverride: Partial<AIConfig> = {
      ...baseConfig,
      ...(configOverride || {}),
      brain: { ...baseConfig.brain, ...(configOverride?.brain || {}) },
      model: { ...baseConfig.model, ...(configOverride?.model || {}) },
      knowledge: { ...baseConfig.knowledge, ...(configOverride?.knowledge || {}) },
      safety: { ...baseConfig.safety, ...(configOverride?.safety || {}) },
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
    return NextResponse.json(
      {
        error: "Playground execution failed",
        message: err instanceof Error ? err.message : "Execution failed",
      },
      { status: 500 },
    );
  }
}
