"use client";

import { Fragment } from "react";

/**
 * Two-row scrolling tech stack ticker.
 *
 * Top row drifts left, bottom row drifts right (or vice versa). Each
 * row repeats its items twice so the marquee can seam back to 0 without
 * a visible jump. Hovering anywhere on the ticker pauses both tracks
 * via CSS (`v2-ticker:hover .v2-ticker__track`).
 */

const ROW_A = [
  "n8n",
  "Make",
  "Zapier",
  "GoHighLevel",
  "LangChain",
  "LangFlow",
  "OpenAI",
  "Anthropic Claude",
  "Pinecone",
  "Supabase",
];

const ROW_B = [
  "Python",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Tailwind",
  "Slack API",
  "Twilio",
  "Apollo",
  "Notion",
  "Airtable",
];

function Track({
  items,
  direction,
}: {
  items: string[];
  direction: "forward" | "reverse";
}) {
  // Duplicate items so the marquee can loop seamlessly at -50% offset.
  const doubled = [...items, ...items];
  return (
    <div className="v2-ticker py-3">
      <div
        className={`v2-ticker__track v2-ticker__track--${direction}`}
        aria-hidden="true"
      >
        {doubled.map((item, i) => (
          <Fragment key={`${item}-${i}`}>
            <span className="v2-ticker__item">{item}</span>
            <span className="v2-ticker__sep" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default function TechTicker() {
  return (
    <section
      aria-label="Tools and stack we work with"
      className="border-y"
      style={{
        borderColor: "var(--border-2)",
        background: "linear-gradient(180deg, var(--base), var(--void))",
      }}
    >
      <Track items={ROW_A} direction="forward" />
      <div className="h-px" style={{ background: "var(--border-1)" }} />
      <Track items={ROW_B} direction="reverse" />
    </section>
  );
}
