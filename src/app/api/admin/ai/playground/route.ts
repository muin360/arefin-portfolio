import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { executeAI } from "@/lib/ai/providers";
import { getAIConfig } from "@/lib/db";
import type { AIConfig } from "@/lib/db/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      prompt,
      systemPromptOverride,
      configOverride,
      targetMode = "active", // "active" | "draft" | "custom"
    } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

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
      messages: [{ role: "user", content: prompt.trim() }],
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
    console.error("[API/admin/ai/playground] Error running playground test:", err);
    return NextResponse.json(
      {
        error: "Playground execution failed",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
