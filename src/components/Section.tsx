import { ReactNode } from "react";
import Reveal from "./Reveal";
import LiveClock from "./LiveClock";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  meta,
  index,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: string;
  index?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:py-20 lg:py-24 border-b border-white/[0.08]" aria-label="Page Header">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 sm:mb-10">
          {eyebrow && (
            <p className="font-mono text-xs font-semibold tracking-wider text-violet-400 uppercase">
              {index ? `[ ${index} ] ` : ""}
              {eyebrow}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs">
            {meta && (
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-[#0c0f18] border border-white/10 font-mono text-[11px] text-white/60">
                {meta}
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0c0f18] border border-white/10 font-mono text-[11px] text-white/70">
              <LiveClock />
            </span>
          </div>
        </div>

        <Reveal>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.14] max-w-4xl">
            {title}
          </h1>
        </Reveal>

        {subtitle && (
          <Reveal delay={120}>
            <p className="mt-5 text-sm sm:text-base md:text-lg text-white/70 max-w-3xl leading-relaxed font-sans">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  link,
  invert,
}: {
  eyebrow: string;
  title: ReactNode;
  link?: { href: string; label: string };
  invert?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 sm:mb-14">
      <div>
        <p className={`font-mono text-xs font-semibold uppercase tracking-wider mb-2 ${invert ? "text-violet-300" : "text-violet-400"}`}>
          {eyebrow}
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight max-w-2xl">
          {title}
        </h2>
      </div>
      {link && (
        <a
          href={link.href}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-violet-300 hover:text-white transition-colors shrink-0 group"
        >
          <span>{link.label}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      )}
    </div>
  );
}
