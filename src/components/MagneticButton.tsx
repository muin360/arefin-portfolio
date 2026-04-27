"use client";

import { useRef, ReactNode, MouseEvent } from "react";
import Link from "next/link";

/**
 * Magnetic button — drifts toward the cursor as it approaches.
 * Wraps a Next.js <Link>. Disabled on touch / reduced-motion.
 */
export default function MagneticButton({
  href,
  children,
  className = "",
  strength = 18,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0, 0)";
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`magnetic ${className}`}
    >
      {children}
    </Link>
  );
}
