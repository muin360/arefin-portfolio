/**
 * Tag-aware wrapper around the Sanity client.
 *
 * Every server-side query goes through this helper, which:
 *   - tags the cached response with the `_type` of the query
 *   - tags it with `_type:slug` when fetching a specific document
 *
 * That way the /api/revalidate webhook can call `revalidateTag(...)` on
 * exactly the tags affected by a content change, instead of busting the
 * whole route cache.
 *
 * If Sanity is not configured (no projectId / dataset env vars), every
 * fetch resolves to `null`. Callers handle that by falling back to their
 * built-in defaults — so the site still builds and renders sensibly when
 * Sanity hasn't been wired up yet.
 *
 * IMPORTANT: All GROQ queries must be hardcoded strings, never constructed
 * dynamically from user input, to prevent GROQ injection attacks.
 */

import { sanityClient } from "./client";
import * as Sentry from "@sentry/nextjs";

type FetchOpts<TFallback = null> = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  // Defaults to one hour — long enough to absorb hot reloads, short enough
  // that even if the webhook misses, content goes stale within an hour.
  revalidate?: number | false;
  /** Returned when Sanity is not configured or a network error occurs. */
  fallback?: TFallback;
};

export async function sanityFetch<TResult>(
  opts: FetchOpts<TResult | null>,
): Promise<TResult | null> {
  const { query, params, tags = [], revalidate = 3600, fallback = null } = opts;
  if (!sanityClient) return fallback;
  try {
    return await sanityClient.fetch<TResult>(query, params ?? {}, {
      next: { revalidate, tags },
    });
  } catch (err) {
    // Network / auth error — degrade gracefully so the page still renders.
    // Report to Sentry instead of console.warn
    Sentry.captureException(err);
    return fallback;
  }
}
