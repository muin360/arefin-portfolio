import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getAIProviderCredentials,
  saveAIProviderCredential,
  disableAIProviderCredential,
} from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const credentials = await getAIProviderCredentials();
    const sanitized = credentials.map((c) => ({
      provider: c.provider,
      keyFingerprint: c.keyFingerprint,
      baseUrl: c.baseUrl,
      organizationId: c.organizationId,
      status: c.status,
      lastRotatedAt: c.lastRotatedAt,
      lastTestedAt: c.lastTestedAt,
      lastError: c.lastError,
    }));

    return NextResponse.json({ credentials: sanitized });
  } catch (err) {
    console.error("[API/admin/ai/providers] Error:", err);
    return NextResponse.json({ error: "Failed to load provider credentials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { provider, secret, baseUrl, organizationId } = body;

    if (!provider || !["openai", "anthropic", "google"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider specified" }, { status: 400 });
    }

    if (!secret || typeof secret !== "string" || secret.trim().length === 0) {
      return NextResponse.json({ error: "Valid API secret required" }, { status: 400 });
    }

    const saved = await saveAIProviderCredential({
      provider,
      secret,
      baseUrl,
      organizationId,
      actor: session.user.name || "Admin",
    });

    return NextResponse.json({
      success: true,
      credential: {
        provider: saved.provider,
        keyFingerprint: saved.keyFingerprint,
        status: saved.status,
        lastRotatedAt: saved.lastRotatedAt,
      },
    });
  } catch (err) {
    console.error("[API/admin/ai/providers] Error saving credential:", err);
    return NextResponse.json({ error: "Failed to save provider credential" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get("provider");

    if (!provider || !["openai", "anthropic", "google"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider specified" }, { status: 400 });
    }

    const disabled = await disableAIProviderCredential(
      provider as "openai" | "anthropic" | "google",
      session.user.name || "Admin",
    );

    return NextResponse.json({ success: disabled });
  } catch (err) {
    console.error("[API/admin/ai/providers] Error disabling provider:", err);
    return NextResponse.json({ error: "Failed to disable provider" }, { status: 500 });
  }
}
