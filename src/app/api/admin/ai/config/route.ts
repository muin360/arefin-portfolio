import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getAIConfig,
  saveDraftAIConfig,
  activateAIConfig,
  getAIProviderCredentials,
  getAIUsageStats,
  getAIVersions,
} from "@/lib/db";
import { ALLOWED_MODELS } from "@/lib/ai/defaults";
import { aiConfigSchema } from "@/lib/ai/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureSanitizedAIError } from "@/lib/ai/monitoring";

export const runtime = "nodejs";

const MAX_CONFIG_PAYLOAD_BYTES = 100 * 1024; // 100KB

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin Rate Limit
  const ip = req.headers.get("x-forwarded-for") || "admin";
  const rl = await checkRateLimit({ key: ip, limit: 60, bucket: "admin_ai" });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const [activeConfig, draftConfig, credentials, versions, stats] = await Promise.all([
      getAIConfig("active"),
      getAIConfig("draft"),
      getAIProviderCredentials(),
      getAIVersions(10),
      getAIUsageStats(7),
    ]);

    // Strip encrypted secrets before sending to client
    const sanitizedCredentials = credentials.map((c) => ({
      provider: c.provider,
      keyFingerprint: c.keyFingerprint,
      baseUrl: c.baseUrl,
      organizationId: c.organizationId,
      status: c.status,
      lastRotatedAt: c.lastRotatedAt,
      lastTestedAt: c.lastTestedAt,
      lastError: c.lastError,
    }));

    return NextResponse.json({
      activeConfig,
      draftConfig,
      credentials: sanitizedCredentials,
      allowedModels: ALLOWED_MODELS,
      recentVersions: versions,
      stats,
    });
  } catch (err) {
    captureSanitizedAIError(err, { errorCategory: "admin_get_config_failure" });
    return NextResponse.json({ error: "Failed to load AI configuration" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin Rate Limit
  const ip = req.headers.get("x-forwarded-for") || "admin";
  const rl = await checkRateLimit({ key: ip, limit: 60, bucket: "admin_ai" });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_CONFIG_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload Too Large" }, { status: 413 });
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid configuration payload" }, { status: 400 });
    }

    const validation = aiConfigSchema.partial().safeParse(body);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message || "Invalid configuration schema";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const updated = await saveDraftAIConfig(validation.data, session.user.name || "Admin");
    return NextResponse.json({ success: true, draftConfig: updated });
  } catch (err) {
    captureSanitizedAIError(err, { errorCategory: "admin_save_draft_failure" });
    return NextResponse.json({ error: "Failed to save draft configuration" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin Rate Limit
  const ip = req.headers.get("x-forwarded-for") || "admin";
  const rl = await checkRateLimit({ key: ip, limit: 30, bucket: "admin_ai" });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const changeSummary =
      typeof body.changeSummary === "string" && body.changeSummary.trim().length > 0
        ? body.changeSummary.trim().slice(0, 200)
        : "Configuration activated from Admin Control Center";

    const result = await activateAIConfig(session.user.name || "Admin", changeSummary);

    return NextResponse.json({
      success: true,
      activeConfig: result.activeConfig,
      version: result.version,
    });
  } catch (err) {
    captureSanitizedAIError(err, { errorCategory: "admin_activate_config_failure" });
    return NextResponse.json({ error: "Failed to activate configuration" }, { status: 500 });
  }
}
