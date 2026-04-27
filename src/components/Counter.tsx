"use client";

import { useEffect, useRef, useState } from "react";

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

  return (
    <span ref={ref} className={`counter ${className}`}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
