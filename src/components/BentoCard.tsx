"use client";

import { ReactNode, useRef, MouseEvent } from "react";

/**
 * Glass bento card with cursor-tracked spotlight + animated gradient
 * border-on-hover. Drop in any content as children.
 */
export default function BentoCard({
  children,
  className = "",
  span = "",
}: {
  children: ReactNode;
  className?: string;
  span?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(e.clientX - rect.left).toFixed(0)}px`);
    el.style.setProperty("--my", `${(e.clientY - rect.top).toFixed(0)}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`bento bento-spin ${span} ${className}`}
    >
      <div className="bento-inner">{children}</div>
    </div>
  );
}
