import { ReactNode } from "react";
import Reveal from "./Reveal";

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
    <section className="relative bg-paper border-b border-line overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-16 md:pt-32 md:pb-24 relative">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          {eyebrow && (
            <p className="eyebrow">
              {index ? `[ ${index} ] ` : ""}
              {eyebrow}
            </p>
          )}
          {meta && (
            <span className="mono uppercase tracking-[0.16em] text-muted text-xs hidden md:inline">
              {meta}
            </span>
          )}
        </div>
        <Reveal>
          <h1 className="display text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] max-w-5xl">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={120}>
            <p className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
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
    <div className="max-w-7xl mx-auto px-6 sm:px-8 section">{children}</div>
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
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
      <div>
        <p className={`eyebrow mb-5 ${invert ? "text-white/60" : ""}`}>
          {eyebrow}
        </p>
        <h2 className="display text-3xl md:text-5xl max-w-2xl">{title}</h2>
      </div>
      {link && (
        <a
          href={link.href}
          className={`text-sm hover-arrow ${
            invert ? "text-white/80" : "text-muted hover:text-foreground"
          }`}
        >
          <span className="link-underline">{link.label}</span>
          <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}
