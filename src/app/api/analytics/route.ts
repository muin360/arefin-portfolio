import { type NextRequest, NextResponse } from "next/server";
import { insertAnalyticsEvent } from "@/lib/analytics-db";
import type { AnalyticsEventType } from "@/lib/db/types";

const ALLOWED_EVENTS: AnalyticsEventType[] = [
  "page_view",
  "project_view",
  "project_demo_click",
  "project_github_click",
  "cta_click",
  "whatsapp_click",
  "email_click",
  "contact_start",
  "contact_submit",
  "blog_view",
  "scroll_50",
  "scroll_90",
  "ai_open",
  "ai_prompt",
  "ai_project_click",
  "build_explorer_open",
  "build_step_click",
  "blueprint_copy_specs",
];

// Simple in-memory rate limiter (per session within the same serverless instance)
const rateLimitStore = new Map<string, { count: number; window: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

function cleanupRateLimitStore(now: number) {
  if (rateLimitStore.size > 200) {
    for (const [key, val] of rateLimitStore.entries()) {
      if (now - val.window > RATE_WINDOW_MS) {
        rateLimitStore.delete(key);
      }
    }
  }
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  cleanupRateLimitStore(now);
  const record = rateLimitStore.get(key);
  if (!record || now - record.window > RATE_WINDOW_MS) {
    rateLimitStore.set(key, { count: 1, window: now });
    return false;
  }
  if (record.count >= RATE_LIMIT) return true;
  record.count++;
  return false;
}

function parseUserAgent(ua?: string | null): {
  deviceCategory?: "desktop" | "mobile" | "tablet";
  browser?: string;
  os?: string;
} {
  if (!ua) return { deviceCategory: "desktop", browser: "Other", os: "Other" };
  const u = ua.toLowerCase();

  let deviceCategory: "desktop" | "mobile" | "tablet" = "desktop";
  if (/ipad|tablet|(android(?!.*mobile))/i.test(u)) {
    deviceCategory = "tablet";
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(u)) {
    deviceCategory = "mobile";
  }

  let browser = "Other";
  if (u.includes("edg/")) browser = "Edge";
  else if (u.includes("chrome") && !u.includes("edg/")) browser = "Chrome";
  else if (u.includes("safari") && !u.includes("chrome")) browser = "Safari";
  else if (u.includes("firefox")) browser = "Firefox";
  else if (u.includes("opera") || u.includes("opr/")) browser = "Opera";

  let os = "Other";
  if (u.includes("windows")) os = "Windows";
  else if (u.includes("mac os") || u.includes("macintosh")) os = "macOS";
  else if (u.includes("android")) os = "Android";
  else if (u.includes("iphone") || u.includes("ipad") || u.includes("ios")) os = "iOS";
  else if (u.includes("linux")) os = "Linux";

  return { deviceCategory, browser, os };
}

export async function POST(req: NextRequest) {
  try {
    // Payload size guard
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 2048) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await req.json();

    // Validate event type
    const { event, path, projectSlug, postSlug, label, sessionId } = body;
    if (!event || !ALLOWED_EVENTS.includes(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }
    if (typeof path !== "string" || path.length > 500) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    // Rate limit by session or IP
    const rateLimitKey = sessionId ?? (req.headers.get("x-forwarded-for") ?? "unknown");
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ ok: true }); // Silently drop
    }

    // Anonymize: never store raw IP
    const anonymousId = sessionId ? sessionId.slice(0, 16) : undefined;
    const referrer = req.headers.get("referer") ?? undefined;
    const userAgent = req.headers.get("user-agent");
    const { deviceCategory, browser, os } = parseUserAgent(userAgent);

    await insertAnalyticsEvent({
      event,
      path: path.slice(0, 500),
      projectSlug: typeof projectSlug === "string" ? projectSlug.slice(0, 100) : undefined,
      postSlug: typeof postSlug === "string" ? postSlug.slice(0, 100) : undefined,
      label: typeof label === "string" ? label.slice(0, 100) : undefined,
      sessionId: typeof sessionId === "string" ? sessionId.slice(0, 64) : undefined,
      anonymousId,
      referrer: referrer ? referrer.slice(0, 500) : undefined,
      deviceCategory,
      browser,
      os,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Never expose errors to clients
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { "Access-Control-Allow-Methods": "POST, OPTIONS" },
  });
}
