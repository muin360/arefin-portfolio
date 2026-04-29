"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, MouseEvent } from "react";

// A button that subtly "magnetizes" toward the cursor when hovered. Used on
// primary CTAs to add tactile feel without overdoing it. Disabled on
// pointer-coarse devices (touch) where it's pointless and a perf cost.
export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  type = "button",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  // Children move slightly more than the wrapper for a subtle parallax.
  const cx = useTransform(sx, (v) => v * 0.6);
  const cy = useTransform(sy, (v) => v * 0.6);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span style={{ x: cx, y: cy }} className="block">
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        ref={ref as unknown as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ x: sx, y: sy }}
        className={className}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref as unknown as React.RefObject<HTMLButtonElement>}
      type={type}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {inner}
    </motion.button>
  );
}
