"use client";

import { useEffect, useRef, useState } from "react";

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
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const t = window.setTimeout(() => setValue(to), 0);
      return () => window.clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const animate = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(eased * to));
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

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
