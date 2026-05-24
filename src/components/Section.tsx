import { ReactNode } from "react";
import Reveal from "./Reveal";
import DarkHero from "./DarkHero";
import LiveClock from "./LiveClock";
import LiveTicker from "./LiveTicker";
import { sanityFetch } from "@/sanity/fetch";
import { siteConfigQuery } from "@/sanity/queries";
import type { SiteConfig } from "@/sanity/types";

export async function PageHeader({
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
  const cfg = await sanityFetch<SiteConfig>({
    query: siteConfigQuery,
    tags: ["siteConfig"],
  });
  // Defaults to off — the ticker is decorative; only show it once an editor
  // explicitly opts in from /studio.
  const showLiveTicker = cfg?.showLiveTicker ?? false;

  return (
    <DarkHero density={45}>
      {showLiveTicker && <LiveTicker />}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-20 md:pt-28 md:pb-24 relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-10 md:mb-14">
          {eyebrow && (
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              {index ? `[ ${index} ] ` : ""}
              {eyebrow}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs">
            {meta && (
              <span className="tag-pill hidden md:inline-flex">{meta}</span>
            )}
            <span className="tag-pill inline-flex items-center gap-2">
              <LiveClock />
              <span className="text-white/40">·</span>
              <span>GMT+6</span>
            </span>
          </div>
        </div>
        <Reveal>
          <h1 className="display text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] max-w-5xl text-white">
            {title}
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={120}>
            <p className="mt-8 text-lg md:text-xl text-white/65 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </DarkHero>
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
