import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getProviderAdapter, resolveProviderCredentials } from "@/lib/ai/providers";
import { updateAIProviderStatus } from "@/lib/db";
import type { AIProviderName } from "@/lib/db/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { provider, testSecret, baseUrl, organizationId } = body;

    if (!provider || !["openai", "anthropic", "google", "local_grounded"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider specified" }, { status: 400 });
    }

    const adapter = getProviderAdapter(provider as AIProviderName);

    // If testSecret provided in payload (e.g. testing new key before saving), use it.
    // Otherwise resolve server-side stored encrypted key.
    let apiKey = testSecret;
    if (!apiKey) {
      const resolved = await resolveProviderCredentials(provider as AIProviderName);
      apiKey = resolved.apiKey;
    }

    const result = await adapter.healthCheck({
      apiKey,
      baseUrl,
      organizationId,
    });

    if (provider !== "local_grounded") {
      await updateAIProviderStatus(
        provider as "openai" | "anthropic" | "google",
        result.status,
        result.ok ? undefined : result.message,
      );
    }

    return NextResponse.json({
      ok: result.ok,
      status: result.status,
      message: result.message,
      latencyMs: result.latencyMs,
    });
  } catch (err) {
    console.error("[API/admin/ai/providers/test] Error testing provider:", err);
    return NextResponse.json(
      {
        ok: false,
        status: "unavailable",
        message: err instanceof Error ? err.message : "Health check error",
      },
      { status: 200 },
    );
  }
}
