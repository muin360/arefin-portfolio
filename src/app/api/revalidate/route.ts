/**
 * Sanity webhook → on-demand ISR revalidation.
 *
 * Configure once in https://www.sanity.io/manage:
 *   Project → API → Webhooks → Create webhook
 *     URL:        https://YOUR_DOMAIN/api/revalidate
 *     Trigger on: Create, Update, Delete
 *     Filter:     _type in ["post","project","service","skillCategory","siteConfig"]
 *     Projection: { "_type": _type, "slug": slug.current }
 *     HTTP method: POST
 *     API version: v2024-10-01
 *     Secret:     <paste the value of SANITY_REVALIDATE_SECRET>
 *
 * The handler validates the signed payload, then revalidates exactly the
 * tags affected by the change — no full-site rebuild needed.
 */

import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type Body = { _type?: string; slug?: string };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: "Missing SANITY_REVALIDATE_SECRET on the server." },
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<Body>(req, secret);
    if (!isValidSignature) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ ok: false, error: "Bad payload — missing _type" }, { status: 400 });
    }

    // Revalidate the broad type tag so any list query that depends on it
    // (e.g. the homepage projects list) refetches.
    // Next 16 takes a cache profile name as the second arg; "default" uses
    // the default profile defined by Next.js.
    revalidateTag(body._type, "default");

    // Plus a slug-specific tag for detail pages, when we have one.
    if (body.slug) revalidateTag(`${body._type}:${body.slug}`, "default");

    return NextResponse.json({ ok: true, revalidated: body._type, slug: body.slug ?? null });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
