import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getAIProviderCredentials,
  saveAIProviderCredential,
  disableAIProviderCredential,
} from "@/lib/db";
import { validateProviderCredentialPayload } from "@/lib/ai/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { captureSanitizedAIError } from "@/lib/ai/monitoring";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") || "admin";
  await checkRateLimit({ key: ip, limit: 60, bucket: "admin_ai" });

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
    captureSanitizedAIError(err, { errorCategory: "admin_get_providers_failure" });
    return NextResponse.json({ error: "Failed to load provider credentials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Key mutation rate limit: max 10/min
  const ip = req.headers.get("x-forwarded-for") || "admin";
  const rl = await checkRateLimit({ key: ip, limit: 10, bucket: "admin_keys" });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many key mutation requests. Please wait." },
      { status: 429 },
    );
  }

  try {
    const body = await req.json();
    const validation = validateProviderCredentialPayload(body);
    if (!validation.success) {
      const issue = validation.error.issues[0]?.message || "Invalid provider credential payload";
      return NextResponse.json({ error: issue }, { status: 400 });
    }

    const { provider, secret, baseUrl, organizationId } = validation.data;

    const saved = await saveAIProviderCredential({
      provider,
      secret,
      baseUrl: baseUrl || undefined,
      organizationId: organizationId || undefined,
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
    captureSanitizedAIError(err, { errorCategory: "admin_save_provider_key_failure" });
    return NextResponse.json(
      { error: "Failed to save provider credential. Verify encryption keys are configured." },
      { status: 500 },
    );
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
    captureSanitizedAIError(err, { errorCategory: "admin_disable_provider_failure" });
    return NextResponse.json({ error: "Failed to disable provider" }, { status: 500 });
  }
}
