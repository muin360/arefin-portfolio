"use client";

import { useCountUp } from "@/hooks/useCountUp";

/**
 * Odometer-style digit roll. Each digit lives in its own column and
 * scrolls vertically into place when the value changes (or on first
 * scroll into view).
 */
export default function DigitRoll({
  to,
  duration = 1600,
  suffix = "",
  prefix = "",
  className = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const [ref, value] = useCountUp<HTMLSpanElement>({ to, duration });
  const digits = String(Math.max(value, 0)).padStart(String(to).length, "0").split("");

  return (
    <span ref={ref} className={`inline-flex items-center counter ${className}`}>
      {prefix}
      {digits.map((d, i) => (
        <span
          key={`${i}-${digits.length}`}
          className="inline-block overflow-hidden"
          style={{ height: "1em", lineHeight: 1 }}
        >
          <span
            className="block transition-transform duration-700 ease-out"
            style={{ transform: `translateY(-${parseInt(d, 10)}em)` }}
          >
            {Array.from({ length: 10 }).map((_, n) => (
              <span key={n} className="block" style={{ height: "1em", lineHeight: 1 }}>
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
      {suffix}
    </span>
  );
}
