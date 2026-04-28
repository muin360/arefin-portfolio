import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, useCdn } from "./env";

// Read client for fetching public content from server components and
// route handlers.
//
// If SANITY_API_READ_TOKEN is set, we authenticate with it. This is the
// right setup for a *private* dataset (the default for new Sanity projects).
// The token never leaves the server because every consumer of `sanityClient`
// runs only in server contexts.
//
// If no token is set, we fall back to anonymous reads — works only for
// *public* datasets.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
  stega: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

// Write client — used only inside server-side scripts (e.g. seed) and the
// /api/revalidate route. The token is never sent to the browser.
export function writeClient(token = process.env.SANITY_API_WRITE_TOKEN) {
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is required for write operations.");
  }
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
    perspective: "raw",
  });
}
