"use client";

import { useEffect } from "react";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import { RotateCcw, Home } from "lucide-react";

/**
 * Global error boundary for the App Router.
 *
 * Renders whenever an uncaught error happens inside any route.
 * Keeps navigation consistent and provides clean recovery options.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("App route error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto space-y-8 text-center sm:text-left">
        <SectionPlate
          index="500"
          title="SYSTEM ERROR"
          sectionId="error"
          meta={error.digest ? `Reference: ${error.digest}` : "Unexpected runtime fault"}
        />

        <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-12 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Something broke in{" "}
              <span className="serif text-violet-300 italic">this workflow segment.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans max-w-xl">
              An unexpected execution error occurred while rendering this page. You can attempt to re-mount the component or navigate back to the home page.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={() => reset()}
              variant="primary"
              size="md"
              icon={<RotateCcw className="w-4 h-4" />}
              iconPosition="left"
            >
              Try Again
            </Button>

            <Button
              href="/"
              variant="secondary"
              size="md"
              icon={<Home className="w-4 h-4" />}
              iconPosition="left"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
