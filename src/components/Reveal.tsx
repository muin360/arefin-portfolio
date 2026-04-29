"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// A drop-in scroll-reveal wrapper. Fades + lifts content as it enters the
// viewport. Honors reduced-motion. Delay is in milliseconds.
export default function Reveal({
  children,
  delay = 0,
  y = 24,
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
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: delay / 1000,
      }}
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </Tag>
  );
}
