import { createElement } from "react";
import Reveal from "@/components/Reveal";
import { iconFor } from "@/components/IconRegistry";
import type { IconName } from "@/lib/db/types";
import { whatsappHref, WA_MESSAGES } from "@/lib/cta";

export type ServiceCardLargeProps = {
  index: number;
  title: string;
  iconName: IconName;
  hook?: string;
  problem?: string;
  solution?: string;
  outcome?: string;
  bullets?: string[];
  description?: string;
  ctaLabel?: string;
  ctaPrefill?: string;
  badge?: string;
  isFeatured?: boolean;
};

const FALLBACK_PREFILL = WA_MESSAGES.generic;

export default function ServiceCardLarge({
  index,
  title,
  iconName,
  hook,
  problem,
  solution,
  outcome,
  bullets,
  description,
  ctaLabel,
  ctaPrefill,
  badge,
  isFeatured = false,
}: ServiceCardLargeProps) {
  const cta = ctaLabel ?? "Talk on WhatsApp";
  const prefill = ctaPrefill ?? FALLBACK_PREFILL;
  const waHref = whatsappHref(prefill);
  const visibleBadge = badge ?? (isFeatured ? "Most Popular" : null);
  const showLongDescription = !problem && !solution && !!description;

  return (
    <Reveal delay={index * 90}>
      <article
        className={[
          "group relative h-full rounded-3xl border bg-white/[0.03] backdrop-blur-md",
          "p-6 sm:p-7 md:p-8 flex flex-col overflow-hidden",
          "transition-all duration-500 will-change-transform",
          "hover:-translate-y-1 hover:scale-[1.015]",
          isFeatured
            ? "border-white/25 ring-1 ring-white/15 shadow-[0_0_60px_-20px_rgba(168,85,247,0.55)] hover:shadow-[0_0_80px_-15px_rgba(168,85,247,0.7)]"
            : "border-white/10 hover:border-white/30 hover:shadow-[0_0_60px_-25px_rgba(255,255,255,0.4)]",
        ].join(" ")}
      >
        {/* Glow halo on hover */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500",
            "bg-gradient-to-br",
            isFeatured
              ? "from-fuchsia-500/15 via-violet-500/10 to-cyan-400/10 opacity-100"
              : "from-white/8 via-white/3 to-transparent group-hover:opacity-100",
          ].join(" ")}
        />

        <div className="relative flex-1 flex flex-col">
          {/* Top row: icon + index, badge top-right */}
          <div className="flex items-start justify-between">
            <span
              className={[
                "inline-flex items-center justify-center w-14 h-14 rounded-2xl",
                "bg-white/5 border border-white/10",
                "transition-transform duration-500 group-hover:scale-110 group-hover:border-white/30",
              ].join(" ")}
            >
              {createElement(iconFor(iconName), { width: 26, height: 26, className: "text-white" })}
            </span>
            <div className="flex flex-col items-end gap-2">
              {visibleBadge && (
                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]",
                    isFeatured
                      ? "bg-gradient-to-r from-fuchsia-400 to-violet-400 text-[#04040a] font-medium"
                      : "border border-white/15 text-white/70",
                  ].join(" ")}
                >
                  {isFeatured && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#04040a]/80" />
                  )}
                  {visibleBadge}
                </span>
              )}
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                / {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Title + hook */}
          <h3 className="mt-7 text-2xl md:text-[1.7rem] font-medium tracking-tight text-white leading-tight">
            {title}
          </h3>
          {hook && (
            <p className="mt-3 text-base md:text-[1rem] text-white/85 leading-snug font-medium">
              {hook}
            </p>
          )}

          {/* Problem / Solution */}
          {showLongDescription ? (
            <p className="mt-5 text-sm md:text-[0.95rem] text-white/65 leading-relaxed">
              {description}
            </p>
          ) : (
            <div className="mt-6 space-y-4 text-sm md:text-[0.95rem] leading-relaxed">
              {problem && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-1.5">
                    Problem
                  </p>
                  <p className="text-white/70">{problem}</p>
                </div>
              )}
              {solution && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-1.5">
                    Solution
                  </p>
                  <p className="text-white/70">{solution}</p>
                </div>
              )}
            </div>
          )}

          {/* Outcome — bold */}
          {outcome && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/85 mb-1.5">
                Outcome
              </p>
              <p className="text-white text-[0.98rem] font-medium leading-snug">
                {outcome}
              </p>
            </div>
          )}

          {/* Bullets */}
          {bullets && bullets.length > 0 && (
            <ul className="mt-5 space-y-2.5 text-sm text-white/70">
              {bullets.slice(0, 3).map((b, i) => (
                <li key={`${i}-${b}`} className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"
                  />
                  <span className="leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Spacer pushes mini CTA + button to bottom */}
          <div className="mt-auto pt-7 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/45">
              Want this for your business? Message me now ↓
            </p>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "group/cta inline-flex w-full items-center justify-between gap-3 rounded-full px-5 py-3.5 text-sm font-medium transition-all",
                isFeatured
                  ? "bg-[#25D366] hover:bg-[#1ebe57] text-white"
                  : "bg-white text-[#04040a] hover:bg-white/90",
              ].join(" ")}
            >
              <span className="flex items-center gap-2">
                <svg
                  viewBox="0 0 32 32"
                  width="16"
                  height="16"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M19.11 17.21c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16s-.81 1-.99 1.21c-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.83-1.55-1.84-1.73-2.15-.18-.31-.02-.48.13-.63.13-.13.31-.36.46-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.69-.95-2.32-.25-.6-.51-.52-.7-.53l-.59-.01c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.39 4.75.75.32 1.34.51 1.8.66.75.24 1.44.21 1.98.13.6-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.29-.21-.6-.36zM16 4C9.37 4 4 9.37 4 16c0 2.12.55 4.11 1.5 5.84L4 28l6.32-1.45A11.93 11.93 0 0 0 16 28c6.63 0 12-5.37 12-12S22.63 4 16 4z" />
                </svg>
                {cta}
              </span>
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover/cta:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
