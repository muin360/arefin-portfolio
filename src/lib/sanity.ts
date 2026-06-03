/**
 * @deprecated This file is kept for backwards compatibility only.
 * For all Sanity operations, import directly from:
 *   - @/sanity/client   → the configured Next.js Sanity client
 *   - @/sanity/fetch    → sanityFetch with built-in caching
 *   - @/sanity/queries  → GROQ query strings
 *
 * The old hardcoded client that lived here has been removed to avoid
 * conflicts with the env-based configuration in @/sanity/client.
 */
export { sanityClient as client } from "@/sanity/client";
export { sanityFetch } from "@/sanity/fetch";
