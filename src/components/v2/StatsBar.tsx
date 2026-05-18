"use client";

import CountUp from "./CountUp";

/**
 * Stats bar — 4 hard numbers that anchor the claims on the page.
 *
 * Rendered as a bordered band between the services bento and the
 * project case studies. Each cell uses `CountUp` for the headline
 * value so the section feels "alive" the first time it scrolls into
 * view, then quiets down.
 */

type Stat = {
  prefix?: string;
  target: number;
  suffix?: string;
  decimals?: number;
  label: string;
};

const STATS: Stat[] = [
  { target: 47, suffix: "+", label: "Workflows shipped" },
  { prefix: "<", target: 14, suffix: "d", label: "Avg delivery time" },
  { target: 3, label: "Countries served" },
  { target: 100, suffix: "%", label: "You own the build" },
];

export default function StatsBar() {
  return (
    <section
      aria-label="Tensorix at a glance"
      className="v2-stats border-y"
      style={{ borderColor: "var(--border-2)" }}
    >
      <div className="v2-stats__grid">
        {STATS.map((s, i) => (
          <div key={`${s.label}-${i}`} className="v2-stats__cell">
            <div className="v2-stats__index">[ {String(i + 1).padStart(2, "0")} ]</div>
            <div className="v2-stats__value">
              <CountUp
                prefix={s.prefix}
                target={s.target}
                suffix={s.suffix}
                decimals={s.decimals}
                duration={1600}
              />
            </div>
            <div className="v2-stats__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
