// Centralized Sanity environment configuration.
//
// Required (when Sanity is wired up):
//   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
// Optional:
//   NEXT_PUBLIC_SANITY_API_VERSION (defaults to a known-stable date)
// Server-only:
//   SANITY_API_WRITE_TOKEN     — used by seed scripts + revalidation
//   SANITY_REVALIDATE_SECRET   — shared secret for the webhook
//
// If projectId / dataset are missing the site still builds and runs — every
// `sanityFetch` simply returns null/[] and the calling component falls back
// to its built-in defaults. This makes local previews and first-deploy
// before wiring Sanity work out of the box.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const useCdn = false;

export const studioUrl = "/studio";

export const sanityConfigured = Boolean(projectId && dataset);
