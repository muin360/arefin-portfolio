import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getAIUsageStats, getAILogs, getAIAuditLogs } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [stats, logs, auditLogs] = await Promise.all([
      getAIUsageStats(7),
      getAILogs(50),
      getAIAuditLogs(30),
    ]);

    return NextResponse.json({ stats, logs, auditLogs });
  } catch (err) {
    console.error("[API/admin/ai/usage] Error fetching usage data:", err);
    return NextResponse.json({ error: "Failed to load usage data" }, { status: 500 });
  }
}
