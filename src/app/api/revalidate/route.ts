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
 *
 * Defense-in-depth on this endpoint:
 *   1. HMAC signature validation — only Sanity-signed payloads pass.
 *   2. _type allowlist — even with a valid signature we reject unknown types.
 *   3. Lightweight in-memory rate limit per IP — blunts a stolen-secret
 *      attacker who tries to revalidate aggressively.
 */

import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { headers } from "next/headers";

type Body = { _type?: string; slug?: string };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Allowlist of document types we know how to handle. Receiving anything
// outside this list is treated as a misconfigured / malicious payload.
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

// In-memory rate limit. Process-local. Good enough at portfolio scale; for
// multi-region prod, swap with Upstash or Vercel KV.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30; // 30 webhook hits per IP per minute is plenty
const rateLog = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (rateLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_MAX) return false;
  arr.push(now);
  rateLog.set(ip, arr);
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: "Missing SANITY_REVALIDATE_SECRET on the server." },
        { status: 500 },
      );
    }

    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const { isValidSignature, body } = await parseBody<Body>(req, secret);
    if (!isValidSignature) {
      return NextResponse.json(
        { ok: false, error: "Invalid signature" },
        { status: 401 },
      );
    }
    if (!body?._type) {
      return NextResponse.json(
        { ok: false, error: "Bad payload — missing _type" },
        { status: 400 },
      );
    }
    if (!ALLOWED_TYPES.has(body._type)) {
      return NextResponse.json(
        { ok: false, error: "Unknown document type" },
        { status: 400 },
      );
    }

    // Revalidate the broad type tag so any list query that depends on it
    // (e.g. the homepage projects list) refetches.
    // Next 16 takes a cache profile name as the second arg; "default" uses
    // the default profile defined by Next.js.
    revalidateTag(body._type, "default");

    // Plus a slug-specific tag for detail pages, when we have one. Slug
    // values must look like a slug — defense-in-depth in case the
    // projection ever changes.
    if (body.slug && /^[a-z0-9][a-z0-9-/]{0,80}$/i.test(body.slug)) {
      revalidateTag(`${body._type}:${body.slug}`, "default");
    }

    return NextResponse.json({
      ok: true,
      revalidated: body._type,
      slug: body.slug ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}

// Reject every other HTTP verb explicitly so misconfigured probes get a
// proper 405 instead of a generic 500.
export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
