"use client";

import { useEffect, useRef, useState } from "react";

// Renders text that "scrambles" through random characters before resolving
// to the real string. Used sparingly — eye-catching, so reserved for
// hero accents and key moments. Honors prefers-reduced-motion.
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+-/<>?{}[]";

export default function ScrambleText({
  text,
  duration,
  speed,
  delay = 0,
  className,
  triggerOnView = true,
}: {
  text: string;
  duration?: number;
  speed?: number; // legacy alias for total animation time (ms)
  delay?: number; // ms before starting
  className?: string;
  triggerOnView?: boolean;
}) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);
  const total = duration ?? speed ?? 800;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Skip animation; the initial state already matches `text`.
      return;
    }

    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      timeout = setTimeout(() => {
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / total);
          const reveal = Math.floor(t * text.length);
          let result = "";
          for (let i = 0; i < text.length; i++) {
            if (i < reveal) result += text[i];
            else if (text[i] === " ") result += " ";
            else result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
          setOut(result);
          if (t < 1) raf = requestAnimationFrame(step);
          else setOut(text);
        };
        raf = requestAnimationFrame(step);
      }, delay);
    };

    if (!triggerOnView) {
      play();
      return () => {
        if (timeout) clearTimeout(timeout);
        if (raf) cancelAnimationFrame(raf);
      };
    }

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            play();
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timeout) clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text, total, delay, triggerOnView]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {out}
    </span>
  );
}
