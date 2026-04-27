"use client";

import { ReactNode } from "react";
import ParticleNetwork from "./ParticleNetwork";

/**
 * Reusable dark luxe hero shell — particles + aurora + grid + content.
 * Used at the top of every page.
 */
export default function DarkHero({
  children,
  className = "",
  density = 50,
  showOrbs = true,
}: {
  children: ReactNode;
  className?: string;
  density?: number;
  showOrbs?: boolean;
}) {
  return (
    <section className={`hero-dark relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <ParticleNetwork density={density} linkDistance={140} />
      </div>
      <div className="aurora" aria-hidden="true" />
      {showOrbs && (
        <>
          <div className="orb orb-violet" aria-hidden="true" />
          <div className="orb orb-pink" aria-hidden="true" />
          <div className="orb orb-cyan" aria-hidden="true" />
        </>
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
