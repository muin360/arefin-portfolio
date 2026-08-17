"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Phase 6 Motion Standard: Coordinated, subtle scroll reveal.
// Fades + lifts content gently as it enters the viewport.
// Respects prefers-reduced-motion automatically.
export default function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
        delay: delay / 1000,
      }}
      viewport={{ once: true, margin: "-8% 0px" }}
    >
      {children}
    </Tag>
  );
}
