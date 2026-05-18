"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Type out a string character by character.
 *
 * Used inside the hero agent dashboard for the AI chat bubble. Caret
 * keeps blinking after typing completes (looks like an active session).
 * Respects `prefers-reduced-motion` by rendering the full string
 * immediately.
 */
export type TypewriterTextProps = {
  text: string;
  /** ms per character. Defaults to 36ms. */
  speed?: number;
  /** Wait this many ms before typing starts. Defaults to 0. */
  startDelay?: number;
  className?: string;
  cursorClassName?: string;
};

export default function TypewriterText({
  text,
  speed = 36,
  startDelay = 0,
  className = "",
  cursorClassName = "v2-blink",
}: TypewriterTextProps) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.3 });
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView || reduced) return;

    let cancelled = false;
    let timeoutId: number;
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setTyped(text.slice(0, i));
      if (i < text.length) {
        timeoutId = window.setTimeout(tick, speed);
      }
    };

    timeoutId = window.setTimeout(tick, startDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [inView, reduced, text, speed, startDelay]);

  // For reduced-motion visitors we just render the full string and skip
  // the typing animation entirely.
  const display = reduced ? text : typed;

  return (
    <span ref={ref} className={className}>
      {display}
      <span className={cursorClassName} aria-hidden="true">
        ▍
      </span>
    </span>
  );
}
