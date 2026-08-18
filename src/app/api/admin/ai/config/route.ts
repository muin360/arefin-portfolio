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

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [activeConfig, draftConfig, credentials, versions, stats] = await Promise.all([
      getAIConfig("active"),
      getAIConfig("draft"),
      getAIProviderCredentials(),
      getAIVersions(5),
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
    console.error("[API/admin/ai/config] Error fetching AI config:", err);
    return NextResponse.json({ error: "Failed to load AI configuration" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid configuration payload" }, { status: 400 });
    }

    const updated = await saveDraftAIConfig(body, session.user.name || "Admin");
    return NextResponse.json({ success: true, draftConfig: updated });
  } catch (err) {
    console.error("[API/admin/ai/config] Error saving draft:", err);
    return NextResponse.json({ error: "Failed to save draft configuration" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const changeSummary = body.changeSummary || "Configuration activated from Admin Control Center";
    const result = await activateAIConfig(session.user.name || "Admin", changeSummary);

    return NextResponse.json({
      success: true,
      activeConfig: result.activeConfig,
      version: result.version,
    });
  } catch (err) {
    console.error("[API/admin/ai/config] Error activating config:", err);
    return NextResponse.json({ error: "Failed to activate configuration" }, { status: 500 });
  }
}
