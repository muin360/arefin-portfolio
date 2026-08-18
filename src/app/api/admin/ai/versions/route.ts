import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAIVersions, restoreAIVersion } from "@/lib/db";
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
    const versions = await getAIVersions(50);
    return NextResponse.json({ versions });
  } catch (err) {
    captureSanitizedAIError(err, { errorCategory: "admin_get_versions_failure" });
    return NextResponse.json({ error: "Failed to load version history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") || "admin";
  const rl = await checkRateLimit({ key: ip, limit: 20, bucket: "admin_ai" });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { versionNumber, activateNow } = body;

    if (typeof versionNumber !== "number" || isNaN(versionNumber) || versionNumber < 1) {
      return NextResponse.json({ error: "Valid positive versionNumber required" }, { status: 400 });
    }

    const restored = await restoreAIVersion(
      versionNumber,
      session.user.name || "Admin",
      !!activateNow,
    );

    return NextResponse.json({ success: true, config: restored });
  } catch (err) {
    captureSanitizedAIError(err, { errorCategory: "admin_restore_version_failure" });
    return NextResponse.json({ error: "Failed to restore version" }, { status: 500 });
  }
}
