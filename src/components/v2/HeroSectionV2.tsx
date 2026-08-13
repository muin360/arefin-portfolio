import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AgentDashboard from "./AgentDashboard";

/**
 * Hero section (v2, upgraded for v3).
 *
 * Two-column layout. Left side carries the editorial voice — a top
 * status bar with a live dot, a two-line display headline (geometric
 * sans + italic serif accent), a single-sentence subheadline, the
 * primary + secondary CTAs, and a foot row with founder + coverage
 * trust marks.
 *
 * The headline pairs Syne (--f-display) with Instrument Serif
 * (--font-instrument-serif) for the second line; the accent word
 * ("systems") picks up the brand a2 colour so the eye lands on the
 * value prop, not the verb. Per-word stagger animation respects
 * `prefers-reduced-motion`.
 *
 * Right side hosts the `<AgentDashboard />` widget. On mobile the
 * widget stacks underneath the copy so the headline owns the first
 * viewport.
 *
 * Alternative headlines for easy A/B swapping (uncomment one to use):
 *   A — bold promise:      "Stop doing work / machines can do."
 *   B — outcome-first:     "14 days from first call / to a live AI system."
 *   C — current (default): "Your team does the work. / Your systems should too."
 *   D — challenger:        "The tools exist. / Most teams never use them."
 */
export default function HeroSectionV2({
  availabilityNote = "Free 30-min audit",
}: {
  availabilityNote?: string;
}) {
  const line1 = "Your team does the work.".split(" ");
  const line2Pre = ["Your"];
  const line2Accent = "systems";
  const line2Post = "should too.".split(" ");

  // Compute word delays continuously across both lines so the
  // animation reads as one phrase, not two independently-revealing
  // chunks.
  let wordIdx = 0;
  const delay = () => `${wordIdx++ * 55}ms`;

  return (
    <section className="v2-hero" aria-label="Hero">
      <div className="v2-hero__grain" aria-hidden="true" />
      <div className="v2-hero__mesh" aria-hidden="true" />

      <div className="v2-hero__inner">
        <div className="v2-hero__grid">
          {/* LEFT COL */}
          <div className="v2-hero__left">
            <span className="v2-hero__pill">
              <span className="v2-hero__pill-dot" aria-hidden="true" />
              <span className="v2-hero__pill-text">
                {availabilityNote}
              </span>
              <span aria-hidden="true" className="v2-hero__pill-sep">·</span>
              <span className="v2-hero__pill-meta">DHK · GMT+6 · live</span>
            </span>

            <h1 className="v2-hero__headline">
              {/* Line 1 — geometric sans (Syne via --f-display) */}
              <span className="v2-hero__line">
                {line1.map((w, i) => (
                  <span
                    key={`l1-${i}`}
                    className="v2-hero__word"
                    style={{ ["--word-delay" as string]: delay() }}
                  >
                    {w}{" "}
                  </span>
                ))}
              </span>
              {/* Line 2 — italic serif (Instrument Serif) with accent word */}
              <span className="v2-hero__line v2-hero__line--serif">
                {line2Pre.map((w, i) => (
                  <span
                    key={`l2p-${i}`}
                    className="v2-hero__word"
                    style={{ ["--word-delay" as string]: delay() }}
                  >
                    {w}{" "}
                  </span>
                ))}
                <span
                  className="v2-hero__word v2-hero__accent"
                  style={{ ["--word-delay" as string]: delay() }}
                >
                  {line2Accent}{" "}
                </span>
                {line2Post.map((w, i) => (
                  <span
                    key={`l2s-${i}`}
                    className="v2-hero__word"
                    style={{ ["--word-delay" as string]: delay() }}
                  >
                    {w}{" "}
                  </span>
                ))}
              </span>
            </h1>

            <p className="v2-hero__sub">
              I build AI agents and automation systems — voice bots that handle calls,
              multi-agent pipelines that do research, RAG systems that answer from your
              own docs. Python when code is needed, n8n when speed matters.
              <span className="v2-hero__sub-em"> No fluff. Fixed price. You own the build.</span>
            </p>

            <div className="v2-hero__cta">
              <Link href="/book" className="v2-hero__btn v2-hero__btn--primary group">
                <span>Book free audit</span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="v2-hero__btn-arrow"
                />
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
