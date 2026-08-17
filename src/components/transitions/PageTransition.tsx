"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Phase 6 Route Transition
 *
 * Lightweight, fast, non-blocking page transition.
 * Total perceived transition < 300ms.
 * Respects prefers-reduced-motion.
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

    // Fast 100ms exit
    main.classList.add("page-exiting");
    document.body.classList.remove("is-loaded");

    const t = window.setTimeout(() => {
      main.classList.remove("page-exiting");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.add("is-loaded");
        });
      });
    }, 100);

    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
