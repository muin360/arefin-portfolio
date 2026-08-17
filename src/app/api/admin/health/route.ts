import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkMongoHealth } from "@/lib/analytics-db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mongo = await checkMongoHealth();

  const authConfigured = Boolean(
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  );
  const mongoConfigured = Boolean(process.env.MONGODB_URI);
  const githubConfigured = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );
  const googleConfigured = Boolean(
    process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
  );
  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tensorstudio.vercel.app";

  void mongoConfigured;

  return NextResponse.json({
    mongodb: {
      status: mongo.connected ? "connected" : "error",
      dbName: mongo.dbName,
      latencyMs: mongo.latencyMs,
    },
    auth: {
      status: authConfigured ? "ready" : "missing_secret",
      githubOAuth: githubConfigured ? "configured" : "not_configured",
      googleOAuth: googleConfigured ? "configured" : "not_configured",
    },
    email: {
      status: resendConfigured ? "configured" : "not_configured",
    },
    site: {
      url: siteUrl,
      status: "live",
    },
    checkedAt: new Date().toISOString(),
  });
}

