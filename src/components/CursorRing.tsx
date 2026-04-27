"use client";

import { useEffect, useRef } from "react";

/**
 * A small ring that follows the cursor, magnetizing to interactive
 * elements. Disabled on touch and for prefers-reduced-motion.
 */
export default function CursorRing() {
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let tx = rx;
    let ty = ry;
    let raf = 0;

    const interactiveSelector = "a, button, [role='button'], input, textarea, summary, label";

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      ring.style.opacity = "1";

      const target = e.target as Element | null;
      if (target && target.closest(interactiveSelector)) {
        ring.classList.add("hover-link");
      } else {
        ring.classList.remove("hover-link");
      }
    };
    const onLeave = () => {
      ring.style.opacity = "0";
    };

    const tick = () => {
      // Ease toward the target — damped follow for a soft feel.
      rx += (tx - rx) * 0.22;
      ry += (ty - ry) * 0.22;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}
