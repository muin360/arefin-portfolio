"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#@%&*+-=<>";

/**
 * Decrypt-style text effect. Renders the final string from a stream
 * of randomized characters that lock into place letter by letter.
 * Triggered once on mount (or when scrolled into view).
 */
export default function ScrambleText({
  text,
  speed = 35,
  delay = 0,
  className = "",
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [out, setOut] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const t = window.setTimeout(() => setOut(text), 0);
      return () => window.clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            let i = 0;
            const startedAt = performance.now() + delay;
            const tick = (now: number) => {
              if (now < startedAt) {
                requestAnimationFrame(tick);
                return;
              }
              const lockSteps = 3; // how many random frames before lock
              const elapsed = (now - startedAt) / speed;
              const targetLock = Math.floor(elapsed / lockSteps);
              i = Math.min(text.length, targetLock);
              const locked = text.slice(0, i);
              const noise = text
                .slice(i)
                .split("")
                .map((ch) =>
                  ch === " " || ch === "\n"
                    ? ch
                    : CHARS[Math.floor(Math.random() * CHARS.length)]
                )
                .join("");
              setOut(locked + noise);
              if (i < text.length) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, speed, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {out || "\u00A0"}
    </span>
  );
}
