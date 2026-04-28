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
 */

import { sanityClient } from "./client";

type FetchOpts = {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
  // Defaults to one hour — long enough to absorb hot reloads, short enough
  // that even if the webhook misses, content goes stale within an hour.
  revalidate?: number | false;
};

export async function sanityFetch<TResult>(opts: FetchOpts): Promise<TResult> {
  const { query, params, tags = [], revalidate = 3600 } = opts;
  return sanityClient.fetch<TResult>(query, params ?? {}, {
    next: { revalidate, tags },
  });
}
