"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Render a Bloomberg-terminal-style agent log.
 *
 * Lines arrive one at a time on a short stagger so the widget feels
 * "alive" — like a real production observability stream — but settle to
 * a static block once the section has scrolled into view. Respects
 * `prefers-reduced-motion` by rendering all lines instantly.
 */
export type TerminalLogLine = {
  time: string;
  type: "info" | "ok" | "warn" | "err" | "agent";
  message: string;
  status?: string;
};

export type TerminalLogProps = {
  lines: TerminalLogLine[];
  /** ms between line reveals. Defaults to 140ms. */
  stagger?: number;
  className?: string;
};

export default function TerminalLog({
  lines,
  stagger = 140,
  className = "",
}: TerminalLogProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 });
  const reduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const intervalId = window.setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= lines.length) window.clearInterval(intervalId);
    }, stagger);
    return () => window.clearInterval(intervalId);
  }, [inView, reduced, lines.length, stagger]);

  // For reduced-motion visitors we skip the stagger entirely and show
  // every line as soon as the widget mounts. Same end-state, just no
  // motion in front of it.
  const visible = reduced ? lines : lines.slice(0, visibleCount);

  return (
    <div ref={ref} className={`v2-termlog ${className}`} aria-live="polite">
      {visible.map((line, i) => (
        <div
          key={`${line.time}-${i}`}
          className="v2-termlog__line v2-float-up"
          style={{ ["--float-delay" as string]: `${i * 40}ms` }}
        >
          <span className="v2-termlog__time">{line.time}</span>
          <span className={`v2-termlog__type v2-termlog__type--${line.type}`}>
            {line.type}
          </span>
          <span className="v2-termlog__msg">{line.message}</span>
          {line.status && (
            <span className="v2-termlog__status">{line.status}</span>
          )}
        </div>
      ))}
    </div>
  );
}
