"use client";

import { ReactNode, useRef, MouseEvent } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * 3D parallax tilt card. Tracks the cursor position and tilts the card
 * around X/Y axes with a smooth lerp. Disabled on touch / reduced-motion.
 */
export default function TiltCard({
  children,
  className = "",
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (
      reduced ||
      (typeof window !== "undefined" &&
        window.matchMedia("(hover: none)").matches)
    ) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${(-py * intensity).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * intensity).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(e.clientX - rect.left).toFixed(0)}px`);
    el.style.setProperty("--my", `${(e.clientY - rect.top).toFixed(0)}px`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt ${className}`}
    >
      {children}
    </div>
  );
}
