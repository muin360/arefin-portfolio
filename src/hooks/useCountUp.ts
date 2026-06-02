"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "./useInView";
import { useReducedMotion } from "./useReducedMotion";

export type UseCountUpOptions = {
  to: number;
  duration?: number;
  threshold?: number;
};

/**
 * Scroll-triggered count-up animation from 0 to `to`.
 *
 * Returns `[ref, value]` — attach the ref to any element and the hook
 * handles IntersectionObserver gating, easeOutCubic animation, and
 * `prefers-reduced-motion` (instantly reports `to`).
 */
export function useCountUp<T extends Element = HTMLElement>({
  to,
  duration = 1400,
  threshold = 0.4,
}: UseCountUpOptions): [React.RefObject<T | null>, number] {
  const [ref, inView] = useInView<T>({ threshold, once: true });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || reduced) return;

    started.current = true;
    let raf = 0;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, duration]);

  return [ref, reduced ? to : value];
}
