import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured, useCdn } from "./env";

// Read client for fetching public content from server components and
// route handlers.
//
// If SANITY_API_READ_TOKEN is set, we authenticate with it. This is the
// right setup for a *private* dataset (the default for new Sanity projects).
// The token never leaves the server because every consumer of `sanityClient`
// runs only in server contexts.
//
// If projectId / dataset aren't configured at all, the export is `null` and
// every `sanityFetch` short-circuits to a fallback — see ./fetch.ts.
export const sanityClient: SanityClient | null = sanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset: dataset!,
      apiVersion,
      useCdn,
      perspective: "published",
      stega: false,
      token: process.env.SANITY_API_READ_TOKEN,
    })
  : null;

// Write client — used only inside server-side scripts (e.g. seed) and the
// /api/revalidate route. The token is never sent to the browser.
export function writeClient(token = process.env.SANITY_API_WRITE_TOKEN) {
  if (!sanityConfigured) {
    throw new Error(
      "Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
    );
  }
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is required for write operations.");
  }
  return createClient({
    projectId: projectId!,
    dataset: dataset!,
    apiVersion,
    useCdn: false,
    token,
    perspective: "raw",
  });
}
