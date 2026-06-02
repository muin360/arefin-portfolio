"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A subtle cursor-following radial gradient. Designed to live inside a
 * `position: relative` container — the spotlight is absolutely positioned
 * inside it. Disabled on touch devices and when prefers-reduced-motion.
 */
export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const parent = el.parentElement;
    if (!parent) return;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      el.style.opacity = "1";
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 transition-opacity duration-500 opacity-0"
      style={{
        background:
          "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(109, 40, 217, 0.10), transparent 60%)",
      }}
    />
  );
}
