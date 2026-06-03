/**
 * Sanity webhook → on-demand ISR revalidation.
 *
 * Configure once in https://www.sanity.io/manage:
 *   Project → API → Webhooks → Create webhook
 *     URL:        https://YOUR_DOMAIN/api/revalidate
 *     Trigger on: Create, Update, Delete
 *     Filter:     _type in ["post","project","service","skillCategory","siteConfig","faq","testimonial","hero","engagement"]
 *     Projection: { "_type": _type, "slug": slug.current }
 *     HTTP method: POST
 *     API version: v2024-10-01
 *     Secret:     <paste the value of SANITY_REVALIDATE_SECRET>
 */

import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { headers } from "next/headers";
import * as Sentry from "@sentry/nextjs";

type Body = { _type?: string; slug?: string };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set([
  "post",
  "project",
  "service",
  "skillCategory",
  "siteConfig",
  "engagement",
  "faq",
  "testimonial",
  "hero",
]);

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 15;
const rateLog = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (rateLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) return false;
  arr.push(now);
  rateLog.set(ip, arr);

  if (Math.random() < 0.1) {
    for (const [key, times] of rateLog.entries()) {
      const fresh = times.filter((t) => now - t < RATE_WINDOW_MS * 10);
      if (fresh.length === 0) {
        rateLog.delete(key);
      } else {
        rateLog.set(key, fresh);
      }
    }
  }

  return true;
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      Sentry.captureMessage(
        "Webhook endpoint called but SANITY_REVALIDATE_SECRET not configured",
        "warning",
      );
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "unknown";
    if (!rateLimit(ip)) {
      Sentry.captureMessage(
        `Webhook rate limit exceeded for IP: ${ip}`,
        "warning",
      );
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const { isValidSignature, body } = await parseBody<Body>(req, secret);
    if (!isValidSignature) {
      Sentry.captureMessage(
        `Webhook received with invalid signature from IP: ${ip}`,
        "warning",
      );
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    if (!body?._type) {
      Sentry.captureMessage(
        `Webhook payload missing _type field from IP: ${ip}`,
        "warning",
      );
      return NextResponse.json(
        { ok: false, error: "Bad payload" },
        { status: 400 },
      );
    }
    if (!ALLOWED_TYPES.has(body._type)) {
      Sentry.captureMessage(
        `Webhook received for unknown document type: ${body._type} from IP: ${ip}`,
        "warning",
      );
      return NextResponse.json(
        { ok: false, error: "Unknown document type" },
        { status: 400 },
      );
    }

    // Next.js 16: revalidateTag requires (tag, type) — "default" covers
    // all cached data associated with the tag.
    revalidateTag(body._type, "default");

    if (body.slug && /^[a-z0-9][a-z0-9-/]{0,80}$/i.test(body.slug)) {
      revalidateTag(`${body._type}:${body.slug}`, "default");
    }

    return NextResponse.json({
      ok: true,
      revalidated: body._type,
      slug: body.slug ?? null,
    });
  } catch (err) {
    Sentry.captureException(err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 },
  );
}
