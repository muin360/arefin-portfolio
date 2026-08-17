import React from "react";

export type SectionPlateVariant = "system" | "work" | "process" | "about" | "journal" | "cta";

interface SectionPlateProps {
  variant: SectionPlateVariant;
  indexOverride?: string;
  titleOverride?: string;
  metaOverride?: string | React.ReactNode;
  markerOverride?: string;
  className?: string;
}

const VARIANT_CONFIGS: Record<
  SectionPlateVariant,
  {
    index: string;
    title: string;
    meta: string;
    marker: string;
    accentColor: string;
    markerDotColor: string;
  }
> = {
  system: {
    index: "02",
    title: "CAPABILITY SYSTEM",
    meta: "06 active areas · AI AUTOMATION · AI AGENTS · RAG · MULTI-AGENT",
    marker: "SYSTEM TOPOLOGY",
    accentColor: "text-violet-400",
    markerDotColor: "bg-violet-400",
  },
  work: {
    index: "03",
    title: "WORK LOG",
    meta: "10 practical systems · featured / archive",
    marker: "PRODUCTION PROVEN",
    accentColor: "text-emerald-400",
    markerDotColor: "bg-emerald-400",
  },
  process: {
    index: "04",
    title: "BUILD LOOP",
    meta: "MAP → BUILD → TEST → SHIP",
    marker: "DETERMINISTIC FLOW",
    accentColor: "text-cyan-400",
    markerDotColor: "bg-cyan-400",
  },
  about: {
    index: "05",
    title: "THE BUILDER",
    meta: "Arefin Mueen · Dhaka · GMT+6",
    marker: "HUMAN IN THE LOOP",
    accentColor: "text-amber-400",
    markerDotColor: "bg-amber-400",
  },
  journal: {
    index: "06",
    title: "FIELD NOTES",
    meta: "notes from building AI systems",
    marker: "SYSTEM REFLECTIONS",
    accentColor: "text-indigo-400",
    markerDotColor: "bg-indigo-400",
  },
  cta: {
    index: "07",
    title: "INITIALIZE",
    meta: "start a project · direct scoping",
    marker: "READY TO SCALE",
    accentColor: "text-emerald-400",
    markerDotColor: "bg-emerald-400",
  },
};

export default function SectionPlate({
  variant,
  indexOverride,
  titleOverride,
  metaOverride,
  markerOverride,
  className = "",
}: SectionPlateProps) {
  const config = VARIANT_CONFIGS[variant];
  const index = indexOverride || config.index;
  const title = titleOverride || config.title;
  const meta = metaOverride || config.meta;
  const marker = markerOverride || config.marker;

  return (
    <div
      className={`relative w-full mb-8 sm:mb-10 pb-3 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs select-none ${className}`}
      aria-label={`${index} ${title}`}
    >
      {/* Left: Index + Title + Accent Line */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-white/40 tracking-wider">
            {index}
          </span>
          <span className="text-white/20">/</span>
          <span className={`text-xs font-bold tracking-widest uppercase ${config.accentColor}`}>
            {title}
          </span>
        </div>

        {/* Micro Technical Separator */}
        <span className="hidden sm:inline-block w-4 h-[1px] bg-white/20" aria-hidden="true" />

        {/* Meta details (desktop inline, mobile wrapped) */}
        <div className="text-[10px] sm:text-[11px] text-white/50 tracking-wider">
          {meta}
        </div>
      </div>

      {/* Right: Technical System Marker Badge */}
      <div className="flex items-center gap-2 self-start sm:self-auto px-2.5 py-1 rounded-md bg-[#0a0d18] border border-white/[0.08] shadow-inner shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${config.markerDotColor} animate-pulse`} aria-hidden="true" />
        <span className="text-[9px] sm:text-[10px] tracking-widest text-white/70 uppercase font-semibold">
          {marker}
        </span>
      </div>
    </div>
  );
}
