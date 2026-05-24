import Link from "next/link";
import AgentDashboard from "./AgentDashboard";
import { IconArrow } from "@/components/icons";

/**
 * Hero section (v2).
 *
 * Two-column layout. Left side carries the editorial voice — a top
 * status bar with a live dot, a typographic-contrast headline (geometric
 * sans + serif italic on the key phrase), a subheadline, the primary +
 * secondary CTAs, and a foot row with founder + coverage trust marks.
 *
 * Right side hosts the `<AgentDashboard />` widget. On mobile the
 * widget stacks underneath the copy at 90% scale so the headline owns
 * the first viewport.
 */
export default function HeroSectionV2({
  availabilityNote = "Free 30-min audit",
}: {
  availabilityNote?: string;
}) {
  return (
    <section className="v2-hero" aria-label="Hero">
      <div className="v2-hero__grain" aria-hidden="true" />
      <div className="v2-hero__mesh" aria-hidden="true" />

      <div className="v2-hero__inner">
        <div className="v2-hero__grid">
          {/* LEFT COL */}
          <div className="v2-hero__left">
            {/* Status badge — styled pill with live dot */}
            <div className="inline-flex items-center gap-2 border border-[#1D9E75]/30 bg-[#1D9E75]/[0.08] rounded-full px-3 py-1 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5DCAA5] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D9E75]" />
              </span>
              <span className="text-xs text-[#5DCAA5] font-mono tracking-wider uppercase">
                {availabilityNote}
              </span>
            </div>

            {/* Main headline — typographic contrast */}
            <h1 className="v2-hero__headline">
              {/* Line 1: geometric sans */}
              <span className="block">Your team does the work.</span>
              {/* Line 2: serif italic + accent color on key word */}
              <span className="block mt-1 serif" style={{ fontStyle: "italic" }}>
                Your{" "}
                <span className="relative inline-block">
                  <span className="text-[#5DCAA5]">systems</span>
                  <svg
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 w-full"
                    height="4"
                    viewBox="0 0 100 4"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 3 Q25 0 50 2 Q75 4 100 1"
                      stroke="#1D9E75"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                should too.
              </span>
            </h1>

            <p className="v2-hero__sub">
              We build AI agents, workflow automations, and integrated web
              systems for small teams — scoped in a free audit, shipped in
              14 days, owned by you forever.
              <span className="v2-hero__sub-em"> No fluff. Fixed price. You own it.</span>
            </p>

            <div className="v2-hero__cta">
              <Link href="/book" className="v2-hero__btn v2-hero__btn--primary group">
                <span>Book free audit</span>
                <IconArrow width={16} height={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link href="#services" className="v2-hero__btn v2-hero__btn--ghost">
                <span>See services</span>
              </Link>
            </div>

            <ul className="v2-hero__proof" aria-label="Trust signals">
              <li>
                <span className="v2-hero__proof-dot" />
                <span>Founder-led · Arefin Muin</span>
              </li>
              <li>
                <span className="v2-hero__proof-dot" />
                <span>Working across SE Asia, EU, North America</span>
              </li>
              <li>
                <span className="v2-hero__proof-dot" />
                <span>14-day delivery · 30-day support</span>
              </li>
            </ul>
          </div>

          {/* RIGHT COL — dashboard widget */}
          <div className="v2-hero__right">
            <AgentDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
