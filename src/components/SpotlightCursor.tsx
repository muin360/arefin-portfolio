"use client";

import { useEffect, useRef } from "react";

// A radial gradient that follows the cursor across a section, like the
// spotlight on Linear / Apple / Vercel marketing pages. Pure CSS variable
// updates — no React state, so no re-renders. Disabled on touch.
export default function SpotlightCursor({
  size = 600,
  color = "rgba(124, 58, 237, 0.18)", // violet-600 with alpha
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let nextX = 0;
    let nextY = 0;
    const apply = () => {
      el.style.setProperty("--mx", `${nextX}px`);
      el.style.setProperty("--my", `${nextY}px`);
      raf = 0;
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      nextX = e.clientX - r.left;
      nextY = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", `-9999px`);
      el.style.setProperty("--my", `-9999px`);
    };
    const parent = el.parentElement ?? el;
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background: `radial-gradient(${size}px circle at var(--mx, -9999px) var(--my, -9999px), ${color}, transparent 60%)`,
        transition: "background 80ms linear",
      }}
    />
  );
}
