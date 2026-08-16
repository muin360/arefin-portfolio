"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * PageTransition
 *
 * Listens to route changes via usePathname. On each change:
 * 1. Adds `page-leaving` to <body> → triggers exit animation (fade out + blur)
 * 2. After exit completes, removes `page-leaving`
 * 3. Adds `is-loaded` to re-trigger the entrance animation on <main>
 *
 * This gives a smooth fade-out → fade-in on every navigation.
 * Works with Next.js App Router without any wrapper component.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip the very first render — PageLoader handles the initial entrance
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    // Same page — no transition needed
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    const main = document.querySelector("main");
    if (!main) return;

    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Exit: quick fade out
    main.classList.add("page-exiting");

    const t = window.setTimeout(() => {
      main.classList.remove("page-exiting");

      // Entrance: remove is-loaded momentarily then re-add to retrigger animation
      document.body.classList.remove("is-loaded");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.body.classList.add("is-loaded");
        });
      });
    }, 220); // matches the exit animation duration

    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}
