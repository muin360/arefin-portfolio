"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/db/types";
import { iconFor } from "@/components/IconRegistry";
import Reveal from "@/components/Reveal";
import BentoCard from "@/components/BentoCard";
import TiltCard from "@/components/TiltCard";
import SpotlightCursor from "@/components/SpotlightCursor";
import { ArrowRight, Sparkles, Workflow, Layers, ExternalLink } from "lucide-react";

interface Props {
  projects: Project[];
}

const CATEGORIES = [
  "All",
  "AI Automation",
  "AI Agent",
  "RAG Assistant",
  "Multi-Agent",
  "AI Chatbot",
  "Voice AI",
];

export default function ProjectsFilterArchive({ projects }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter(
      (p) =>
        p.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        activeCategory.toLowerCase().includes(p.category.toLowerCase()),
    );
  }, [projects, activeCategory]);

  const flagship = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="space-y-12">
      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                isActive
                  ? "bg-violet-600 text-white font-bold shadow-lg shadow-violet-600/25 border border-violet-500"
                  : "bg-[#0c1020] text-white/60 hover:text-white hover:bg-white/5 border border-white/10"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* FLAGSHIP SHOWCASE CARD (IF AVAILABLE) */}
      {flagship && (
        <Reveal>
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0e1326] via-[#090c18] to-[#070911] border border-violet-500/30 hover:border-violet-500/60 p-6 sm:p-10 transition-all duration-500 overflow-hidden shadow-2xl group">
            <SpotlightCursor size={500} color="rgba(139, 92, 246, 0.15)" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="px-3 py-1 rounded-full bg-violet-600/25 border border-violet-500/40 text-violet-200 text-xs font-mono font-bold tracking-wider uppercase">
                    Featured Flagship · {flagship.category}
                  </span>
                  <span className="text-xs font-mono text-white/40 uppercase">
                    {flagship.projectType ?? "Automation System"}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight group-hover:text-violet-100 transition-colors">
                  <Link href={`/projects/${flagship.slug}`}>
                    {flagship.title}
                  </Link>
                </h2>

                <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
                  {flagship.summary}
                </p>

                {flagship.outcome && (
                  <div className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-white/90 italic font-serif leading-relaxed">
                      &ldquo;{flagship.outcome}&rdquo;
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {flagship.stack.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-[#141a2e] border border-white/10 text-xs font-mono text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <Link
                    href={`/projects/${flagship.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-violet-600/25 group/btn"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Flagship Visual Box / Cover */}
              <div className="lg:col-span-5">
                {flagship.coverImage ? (
                  <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#090c16]">
                    <Image
                      src={flagship.coverImage}
                      alt={flagship.altText || `${flagship.title} architecture preview`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 sm:h-80 rounded-2xl border border-white/10 bg-[#0c1020] p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-violet-300 uppercase tracking-widest">
                        System Workflow Blueprint
                      </span>
                      <Workflow className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-white/40 uppercase">Execution Loop</p>
                      <p className="text-xs font-mono text-violet-300">
                        TRIGGER → DATA → AI AGENT → TOOL CALL → OUTPUT
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-white/50 border-t border-white/5 pt-3">
                      <span>Status: Verified Build</span>
                      <span>100% Client Ownership</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* SECONDARY & REMAINING PROJECTS GRID */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rest.map((p, idx) => {
            const Icon = iconFor(p.iconName);
            return (
              <Reveal key={p.id} delay={idx * 60}>
                <TiltCard className="h-full rounded-3xl">
                  <BentoCard className="h-full">
                    <Link href={`/projects/${p.slug}`} className="block h-full">
                      <div className="h-full flex flex-col justify-between group">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white">
                              <Icon width={22} height={22} />
                            </span>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="font-mono uppercase tracking-wider text-white/40">
                                0{idx + 2}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 font-mono font-semibold uppercase">
                                {p.category}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                            {p.title}
                          </h3>

                          <p className="mt-3 text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-3">
                            {p.summary}
                          </p>

                          {p.outcome && (
                            <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <p className="text-xs text-white/80 italic font-serif leading-snug">
                                {p.outcome}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-1">
                            {p.stack.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded bg-[#13182b] border border-white/5 text-[10px] font-mono text-white/50"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-violet-300 group-hover:text-white transition-colors shrink-0">
                            <span>Case Study</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </BentoCard>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#090c16] border border-white/10">
          <p className="text-white/60 text-sm font-mono">
            No projects found in category &ldquo;{activeCategory}&rdquo;.
          </p>
          <button
            onClick={() => setActiveCategory("All")}
            className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white font-mono text-xs font-bold"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
