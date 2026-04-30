"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

export type FaqItem = { q: string; a: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q} delay={i * 50}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-start justify-between gap-6 py-6 md:py-7 text-left group"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-4 md:gap-5 flex-1">
                <span className="font-mono text-xs text-muted tabular-nums tracking-[0.16em] mt-1.5 shrink-0">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg md:text-xl tracking-tight font-medium pr-4">
                  {f.q}
                </span>
              </div>
              <span
                className={`shrink-0 mt-2 w-8 h-8 rounded-full border border-line grid place-items-center transition-all duration-300 ${
                  isOpen
                    ? "bg-foreground text-background border-foreground rotate-45"
                    : "bg-transparent text-foreground group-hover:border-foreground/40"
                }`}
                aria-hidden="true"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100 pb-6 md:pb-8"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pl-12 md:pl-14 pr-12 text-muted leading-relaxed max-w-3xl">
                  {f.a}
                </p>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
