import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAIVersions, restoreAIVersion } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const versions = await getAIVersions(50);
    return NextResponse.json({ versions });
  } catch (err) {
    console.error("[API/admin/ai/versions] Error fetching versions:", err);
    return NextResponse.json({ error: "Failed to load version history" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { versionNumber, activateNow } = body;

    if (typeof versionNumber !== "number") {
      return NextResponse.json({ error: "Valid versionNumber required" }, { status: 400 });
    }

    const restored = await restoreAIVersion(
      versionNumber,
      session.user.name || "Admin",
      !!activateNow,
    );

    return NextResponse.json({ success: true, config: restored });
  } catch (err) {
    console.error("[API/admin/ai/versions] Error restoring version:", err);
    return NextResponse.json({ error: "Failed to restore version" }, { status: 500 });
  }
}
