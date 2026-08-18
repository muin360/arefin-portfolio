import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getProviderAdapter, resolveProviderCredentials } from "@/lib/ai/providers";
import { updateAIProviderStatus } from "@/lib/db";
import type { AIProviderName } from "@/lib/db/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureSanitizedAIError, sanitizeSensitiveText } from "@/lib/ai/monitoring";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") || "admin";
  const rl = await checkRateLimit({ key: ip, limit: 15, bucket: "admin_keys" });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
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
      baseUrl: typeof baseUrl === "string" ? baseUrl.trim() : undefined,
      organizationId: typeof organizationId === "string" ? organizationId.trim() : undefined,
    });

    if (provider !== "local_grounded") {
      await updateAIProviderStatus(
        provider as "openai" | "anthropic" | "google",
        result.status,
        result.ok ? undefined : sanitizeSensitiveText(result.message || "Connection failed"),
      );
    }

    return NextResponse.json({
      ok: result.ok,
      status: result.status,
      message: sanitizeSensitiveText(result.message || ""),
      latencyMs: result.latencyMs,
    });
  } catch (err) {
    captureSanitizedAIError(err, { errorCategory: "admin_test_provider_failure" });
    return NextResponse.json(
      {
        ok: false,
        status: "unavailable",
        message: "Provider health check failed. Please verify API key and network connectivity.",
      },
      { status: 200 },
    );
  }
}
