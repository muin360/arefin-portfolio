import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAIVersions, restoreAIVersion } from "@/lib/db";
import { checkRateLimit, extractClientIp } from "@/lib/rate-limit";
import { captureSanitizedAIError, sanitizeSensitiveText } from "@/lib/ai/monitoring";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = extractClientIp(req);
  const rl = await checkRateLimit({ key: ip, limit: 60, bucket: "admin_ai" });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
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

  const ip = extractClientIp(req);
  const rl = await checkRateLimit({ key: ip, limit: 20, bucket: "admin_ai" });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
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

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

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
    const rawError = err instanceof Error ? err.message : "Failed to restore version";
    const isNotFound = rawError.includes("not found");
    const isValidation = rawError.includes("fails current schema") || rawError.includes("allowlisted");

    let status = 500;
    if (isNotFound) status = 404;
    else if (isValidation) status = 400;

    return NextResponse.json(
      { error: sanitizeSensitiveText(rawError) },
      { status },
    );
  }
}
