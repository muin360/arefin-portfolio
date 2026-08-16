"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * PageTransition
 *
 * Detects route changes via usePathname and applies a smooth
 * fade-out → fade-in transition between pages.
 *
 * Exit: main slides up + fades (240ms)
 * Enter: main slides up from below + fades in (650ms)
 *
 * Respects prefers-reduced-motion — skips animation entirely if set.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = document.querySelector("main");
    if (!main) return;

    // Step 1: Exit animation
    main.classList.add("page-exiting");
    document.body.classList.remove("is-loaded");

    const t = window.setTimeout(() => {
      // Step 2: Remove exit, trigger entrance
      main.classList.remove("page-exiting");

      // Double rAF ensures the class removal is painted before re-adding is-loaded
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.add("is-loaded");
        });
      });
    }, 240);

    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
