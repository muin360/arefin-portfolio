import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getProviderAdapter, resolveProviderCredentials } from "@/lib/ai/providers";
import { updateAIProviderStatus } from "@/lib/db";
import type { AIProviderName } from "@/lib/db/types";
import { checkRateLimit, extractClientIp } from "@/lib/rate-limit";
import { captureSanitizedAIError, sanitizeSensitiveText } from "@/lib/ai/monitoring";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_TEST_PAYLOAD_BYTES = 10 * 1024; // 10KB

const providerTestSchema = z
  .object({
    provider: z.enum(["openai", "anthropic", "google", "local_grounded"]),
    testSecret: z.string().trim().max(500, "Secret key exceeds 500 character limit").optional(),
    baseUrl: z.string().trim().max(200).optional(),
    organizationId: z.string().trim().max(100).optional(),
  })
  .strict();

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Rate Limit
  const ip = extractClientIp(req);
  const rl = await checkRateLimit({ key: ip, limit: 15, bucket: "admin_keys" });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait before testing again." },
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
  if (contentLength > MAX_TEST_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const validation = providerTestSchema.safeParse(body);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message || "Invalid provider test schema";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { provider, testSecret, baseUrl, organizationId } = validation.data;
    const adapter = getProviderAdapter(provider as AIProviderName);

    // If testSecret provided in payload (testing new key before saving), use it ephemerally.
    // Otherwise resolve server-side stored encrypted key.
    let apiKey = testSecret;
    if (!apiKey) {
      const resolved = await resolveProviderCredentials(provider as AIProviderName);
      apiKey = resolved.apiKey;
    }

    // Execute health check with strict timeout
    const result = await Promise.race([
      adapter.healthCheck({
        apiKey,
        baseUrl: typeof baseUrl === "string" ? baseUrl.trim() : undefined,
        organizationId: typeof organizationId === "string" ? organizationId.trim() : undefined,
      }),
      new Promise<{ ok: boolean; status: "unavailable"; message: string; latencyMs: number }>((_, reject) =>
        setTimeout(() => reject(new Error("Provider health check timed out after 10 seconds")), 10000),
      ),
    ]);

    // Only update stored status if testing stored credentials (not ephemeral unsaved testSecret)
    if (provider !== "local_grounded" && !testSecret) {
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
    const rawError = err instanceof Error ? err.message : "Connection failed";
    return NextResponse.json(
      {
        ok: false,
        status: "unavailable",
        message: sanitizeSensitiveText(rawError) || "Provider health check failed. Please verify API key and network connectivity.",
      },
      { status: 200 },
    );
  }
}
