// Sentry client-side init. No-op when SENTRY_DSN isn't set, so the SDK can
// stay wired up without spamming a non-existent project. Drop in
// NEXT_PUBLIC_SENTRY_DSN later (Settings → Vercel env vars) to enable.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
  });
}
