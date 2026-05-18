"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Observe an element and report whether it has entered the viewport.
 *
 * Used to gate scroll-driven reveal animations and trigger one-shot
 * effects (CountUp, terminal log, etc.) the first time a section is
 * visible. The hook respects `prefers-reduced-motion` by reporting
 * "in view" immediately so users with motion preferences disabled still
 * see the final state without any transition.
 */
export type UseInViewOptions = {
  /** IntersectionObserver threshold (0–1). Defaults to 0.15. */
  threshold?: number;
  /** Margin string forwarded to IntersectionObserver. */
  rootMargin?: string;
  /** Detach the observer after the first hit. Defaults to true. */
  once?: boolean;
};

export function useInView<T extends Element = HTMLElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.15, rootMargin = "0px 0px -80px 0px", once = true } =
    options;
  const reduced = useReducedMotion();
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Reduced-motion visitors skip the observer entirely — the final
    // state is reported via the `reduced || inView` return below.
    if (reduced) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, reduced]);

  // When the visitor opted out of motion, never gate the children on
  // visibility — pretend they're always in view so reveal animations
  // resolve to their final state instantly.
  return [ref, reduced || inView];
}
