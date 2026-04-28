/**
 * Embedded Sanity Studio.
 *
 * Visit /studio in the browser. Sign in with the Google/GitHub account that
 * owns the Sanity project (you'll be prompted on first visit).
 *
 * This route is force-dynamic and noindex'd — it must never be cached or
 * appear in search results.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
