"use client";

import { useInView } from "@/hooks/useInView";
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
  { target: 10, suffix: "+", label: "Practical AI projects built" },
  { target: 100, suffix: "%", label: "Code & workflow ownership" },
  { prefix: "0", target: 4, suffix: " Areas", label: "Automation · Agents · RAG · Voice" },
  { target: 6, suffix: "+", label: "Core tools: n8n, LangChain, APIs, Python" },
];

export default function StatsBar() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      aria-label="Engineering metrics at a glance"
      className="v2-stats border-y"
      style={{ borderColor: "var(--border-2)" }}
    >
      <div ref={ref} className="v2-stats__grid">
        {STATS.map((s, i) => (
          <div 
            key={`${s.label}-${i}`} 
            className={`v2-stats__cell reveal-up ${inView ? "is-in" : ""}`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
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
