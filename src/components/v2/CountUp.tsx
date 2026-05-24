"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Animate a number from 0 → target the first time the element is visible.
 *
 * Uses `requestAnimationFrame` with an easeOutExpo curve for a calm,
 * confident counter motion. Supports decimals (set `decimals` > 0) and
 * an optional prefix/suffix (e.g. `<`, `+`, `%`). Respects
 * `prefers-reduced-motion` by rendering the target instantly.
 */
export type CountUpProps = {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export default function CountUp({
  target,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CountUpProps) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  // Run the rAF count-up whenever the element is in view and motion is
  // allowed. Cleanup cancels the in-flight rAF — in Strict Mode the
  // effect is mounted twice in dev; both mounts run to completion
  // (second mount overwrites the first, ending on `target`), so the
  // counter never gets stuck at 0. Reduced-motion users render the
  // final number via the conditional below — we never call setState
  // in this effect for that branch.
  useEffect(() => {
    if (reduced || !inView) return;

    let rafId = 0;
    let cancelled = false;
    const start = performance.now();
    const animate = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutExpo(progress);
      setValue(eased * target);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };
    rafId = requestAnimationFrame(animate);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [reduced, inView, target, duration]);

  // When reduced motion is on (or before the element is in view), the
  // visible number is the target. Otherwise it tracks the animated
  // value as it ticks toward the target.
  const liveValue = reduced ? target : value;
  const display =
    decimals > 0
      ? liveValue.toFixed(decimals)
      : Math.round(liveValue).toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
