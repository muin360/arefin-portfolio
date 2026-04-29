"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

// CSS-based seamless marquee (transform-only, no JS scheduling). The content
// is duplicated and translated -50% to give a perfectly looping ribbon.
//
// Two API styles supported:
//   1. <Marquee>{children}</Marquee>            — wraps already-formed strip
//   2. <Marquee items={[...]} separator="·" />  — builds the strip for you
export default function Marquee({
  children,
  items,
  duration = 30,
  className = "",
  separator = "·",
  reverse = false,
}: {
  children?: ReactNode;
  items?: ReactNode[];
  duration?: number;
  className?: string;
  separator?: string;
  reverse?: boolean;
}) {
  const row = items ? (
    <div className="flex shrink-0 items-center gap-12 px-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span>{item}</span>
          <span className="text-white/30" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  ) : (
    <div className="flex shrink-0 items-center gap-12 px-6">{children}</div>
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ ease: "linear", duration, repeat: Infinity }}
      >
        {row}
        {row}
      </motion.div>
    </div>
  );
}
