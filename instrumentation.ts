// Next.js calls this once per worker so SDKs can boot before any user code.
// We import the appropriate Sentry config based on runtime; each one is a
// no-op when SENTRY_DSN isn't set.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

import * as Sentry from "@sentry/nextjs";

// Next.js calls this on every request that errors. When DSN is absent the
// Sentry init() call above was a no-op, so this is effectively a no-op too.
export const onRequestError: typeof Sentry.captureRequestError = Sentry.captureRequestError;
