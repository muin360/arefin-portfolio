// Centralized Sanity environment configuration.
//
// Required: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
// Optional: NEXT_PUBLIC_SANITY_API_VERSION (defaults to a known-stable date)
// Server-only: SANITY_API_WRITE_TOKEN (used by seed scripts + revalidation),
//              SANITY_REVALIDATE_SECRET (shared secret for the webhook).

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const useCdn = false;

export const studioUrl = "/studio";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}
