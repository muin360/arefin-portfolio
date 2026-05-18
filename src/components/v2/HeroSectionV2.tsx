import Link from "next/link";
import AgentDashboard from "./AgentDashboard";

/**
 * Hero section (v2).
 *
 * Two-column layout. Left side carries the editorial voice — a top
 * status bar with a live dot, a 3-line display headline (staggered
 * word reveal via `.v2-hero-word`), a single-sentence subheadline, the
 * primary + secondary CTAs, and a foot row with founder + coverage
 * trust marks.
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
  const headline =
    "AI systems that turn repetitive work into reliable workflows.".split(" ");

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
              {headline.map((w, i) => (
                <span
                  key={`${w}-${i}`}
                  className="v2-hero__word"
                  style={{ ["--word-delay" as string]: `${i * 55}ms` }}
                >
                  {w}{" "}
                </span>
              ))}
            </h1>

            <p className="v2-hero__sub">
              We help small teams automate lead handling, customer replies,
              CRM updates, reporting and internal operations with practical
              AI agents, workflow automation and integrated web systems.
              <span className="v2-hero__sub-em"> No fluff. Fixed price. You own it.</span>
            </p>

            <div className="v2-hero__cta">
              <Link href="/book" className="v2-hero__btn v2-hero__btn--primary">
                <span>Book free audit</span>
                <span aria-hidden="true">→</span>
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
