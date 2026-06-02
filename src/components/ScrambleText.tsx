"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const [viewRef, inView] = useInView<HTMLSpanElement>({ threshold: 0.3, once: true });
  const reduced = useReducedMotion();
  const playedRef = useRef(false);
  const total = duration ?? speed ?? 800;

  useEffect(() => {
    if (reduced) return;

    const shouldPlay = triggerOnView ? inView : true;
    if (!shouldPlay || playedRef.current) return;
    playedRef.current = true;

    let raf = 0;
    const timeout = setTimeout(() => {
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

    return () => {
      clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text, total, delay, triggerOnView, inView, reduced]);

  return (
    <span ref={viewRef} className={className} aria-label={text}>
      {out}
    </span>
  );
}
