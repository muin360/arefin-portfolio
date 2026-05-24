"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Global error boundary for the App Router.
 *
 * Renders whenever an uncaught error happens inside any route under
 * `/`. Keeps the chrome (navbar, footer) consistent so the visitor
 * has a way out, and exposes a "Try again" button that calls
 * `reset()` to re-mount the segment.
 *
 * Errors are also forwarded to Sentry via the captured global handler
 * configured in `sentry.client.config.ts` / `sentry.server.config.ts`,
 * so we only need a small render here.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the browser console for local debugging. Real
    // reporting happens via Sentry's global handler.
    if (process.env.NODE_ENV !== "production") {
      console.error("App route error:", error);
    }
  }, [error]);

  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center px-6 py-24"
      aria-label="Error"
    >
      <div className="max-w-xl text-center">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
          style={{ color: "var(--t3, rgba(240,240,248,0.55))" }}
        >
          [ 500 ]  something broke
        </p>
        <h1
          className="text-3xl md:text-5xl font-medium tracking-tight"
          style={{ color: "var(--t1, #f0f0f8)" }}
        >
          Something went wrong on this page.
        </h1>
        <p
          className="mt-5 leading-relaxed"
          style={{ color: "var(--t2, rgba(240,240,248,0.75))" }}
        >
          The page hit an unexpected error and couldn&rsquo;t render. Try
          reloading the segment, or head back to the home page and try
          again from there.
        </p>
        {error.digest && (
          <p
            className="mt-4 font-mono text-[11px] tracking-[0.14em]"
            style={{ color: "var(--t4, rgba(240,240,248,0.4))" }}
          >
            ref · {error.digest}
          </p>
        )}
        <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium"
            style={{
              background: "var(--a1, #5B6EF5)",
              color: "var(--void, #04040a)",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium border"
            style={{
              borderColor: "var(--border-2, rgba(255,255,255,0.15))",
              color: "var(--t1, #f0f0f8)",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
