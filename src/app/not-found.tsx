import type { Metadata } from "next";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import { ArrowRight, Compass, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The requested workflow route could not be found.",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto space-y-8 text-center sm:text-left">
        <SectionPlate
          index="404"
          title="ROUTE NOT FOUND"
          sectionId="404"
          meta="System exception · Target undefined"
        />

        <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-12 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              This route is{" "}
              <span className="serif text-violet-300 italic">not in the workflow.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans max-w-xl">
              The page you are looking for may have been restructured, renamed, or retired. Return to the home feed or explore selected case studies.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-3">
            <Button
              href="/"
              variant="primary"
              size="md"
              icon={<Home className="w-4 h-4" />}
              iconPosition="left"
            >
              Back to Home
            </Button>

            <Button
              href="/projects"
              variant="secondary"
              size="md"
              icon={<Compass className="w-4 h-4" />}
              iconPosition="left"
            >
              View Work
            </Button>

            <Button
              href="/contact"
              variant="text"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Contact Me
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
