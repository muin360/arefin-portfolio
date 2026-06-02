"use client";

import { useCountUp } from "@/hooks/useCountUp";

type CounterProps = {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
};

/**
 * Animated number that counts from 0 to `to` once it scrolls into view.
 * Respects prefers-reduced-motion (instantly shows the final value).
 */
export default function Counter({
  to,
  duration = 1400,
  suffix = "",
  prefix = "",
  className = "",
}: CounterProps) {
  const [ref, value] = useCountUp<HTMLSpanElement>({ to, duration });

  return (
    <span ref={ref} className={`counter ${className}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
