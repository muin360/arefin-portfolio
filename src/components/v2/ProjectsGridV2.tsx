"use client";

import { useState } from "react";
import Link from "next/link";
import { projects as fallbackProjects } from "@/data/site";
import type { Project } from "@/lib/db/types";
import { useInView } from "@/hooks/useInView";
import SpotlightCursor from "@/components/SpotlightCursor";
import ProjectModal from "@/components/masterpiece/ProjectModal";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";

export default function ProjectsGridV2({
  projects: propProjects,
  limit = 5,
}: {
  projects?: Project[];
  limit?: number;
}) {
  const source = propProjects && propProjects.length > 0 ? propProjects : fallbackProjects;
  const items = source.slice(0, limit);
  const [selected, setSelected] = useState<(typeof source)[number] | null>(null);

  const flagship = items[0];
  const secondary = items.slice(1, 3);
  const compact = items.slice(3);

  return (
    <>
      <div className="space-y-6">
        {/* TIER 1: FLAGSHIP PROJECT SHOWCASE */}
        {flagship && (
          <FlagshipCard
            project={flagship}
            onClick={() => setSelected(flagship)}
          />
        )}

        {/* TIER 2: SECONDARY PROJECTS GRID */}
        {secondary.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondary.map((p, i) => (
              <SecondaryCard
                key={"slug" in p && p.slug ? p.slug : p.title}
                index={i + 1}
                project={p}
                onClick={() => setSelected(p)}
              />
            ))}
          </div>
        )}

        {/* TIER 3: COMPACT ADDITIONAL LIST */}
        {compact.length > 0 && (
          <div className="rounded-2xl bg-[#090c16] border border-white/10 p-4 sm:p-5 divide-y divide-white/5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-3 px-2">
              Additional Automated Systems
            </p>
            {compact.map((p, i) => {
              const slug = "slug" in p && p.slug ? p.slug : undefined;
              return (
                <div
                  key={slug || p.title}
                  className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.02] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/30 font-semibold">
                      0{i + 4}
                    </span>
                    <div>
                      <Link
                        href={slug ? `/projects/${slug}` : "/projects"}
                        className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-white/50 line-clamp-1 mt-0.5">
                        {p.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">
                      {p.category}
                    </span>
                    <Link
                      href={slug ? `/projects/${slug}` : "/projects"}
                      className="inline-flex items-center gap-1 text-xs font-mono text-violet-400 hover:text-white transition-colors"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <ProjectModal
          project={{
            title: selected.title,
            summary: selected.summary,
            stack: selected.stack,
            category: selected.category,
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function FlagshipCard({
  project,
  onClick,
}: {
  project: Project | (typeof fallbackProjects)[number];
  onClick: () => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const slug = "slug" in project && project.slug ? project.slug : undefined;
  const outcome = "outcome" in project ? project.outcome : undefined;

  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl bg-gradient-to-br from-[#0e1326] via-[#090c18] to-[#070911] border border-violet-500/30 hover:border-violet-500/60 p-6 sm:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-950/30 overflow-hidden ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <SpotlightCursor size={500} color="rgba(139, 92, 246, 0.15)" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="px-3 py-1 rounded-full bg-violet-600/25 border border-violet-500/40 text-violet-200 text-xs font-mono font-bold tracking-wider uppercase">
              Featured Flagship · {project.category}
            </span>
            <span className="text-xs font-mono text-white/40 uppercase">
              {project.projectType ?? "Automation System"}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight group-hover:text-violet-100 transition-colors">
            <Link href={slug ? `/projects/${slug}` : "/projects"}>
              {project.title}
            </Link>
          </h3>

          <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
            {project.summary}
          </p>

          {outcome && (
            <div className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-white/90 italic font-serif leading-relaxed">
                &ldquo;{outcome}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:items-end justify-between gap-6 shrink-0 md:min-w-[200px]">
          <span className="text-xs font-mono text-violet-400/80 font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10">
            01 / SHOWCASE
          </span>

          <div className="flex flex-col sm:items-end gap-3 w-full">
            <Link
              href={slug ? `/projects/${slug}` : "/projects"}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-violet-600/25 group/btn"
            >
              <span>Read Full Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={onClick}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Quick Technical Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tech Stack Row */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2 relative z-10">
        <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider mr-2">
          Toolchain:
        </span>
        {project.stack.map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-lg bg-[#141a2e] border border-white/10 text-xs font-mono text-white/70"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function SecondaryCard({
  index,
  project,
  onClick,
}: {
  index: number;
  project: Project | (typeof fallbackProjects)[number];
  onClick: () => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const slug = "slug" in project && project.slug ? project.slug : undefined;
  const outcome = "outcome" in project ? project.outcome : undefined;

  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl bg-[#090c16] border border-white/10 hover:border-violet-500/40 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/20 overflow-hidden ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <SpotlightCursor size={350} color="rgba(139, 92, 246, 0.12)" />

      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="px-2.5 py-0.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-[10px] font-mono font-semibold tracking-wide uppercase">
            {project.category}
          </span>
          <span className="text-xs font-mono text-white/30 font-bold">
            0{index + 1}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
          <Link href={slug ? `/projects/${slug}` : "/projects"}>
            {project.title}
          </Link>
        </h3>

        <p className="mt-2.5 text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-3">
          {project.summary}
        </p>

        {outcome && (
          <div className="mt-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-white/80 italic font-serif leading-snug">
              {outcome}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {project.stack.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded bg-[#13182b] border border-white/5 text-[10px] font-mono text-white/50"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={slug ? `/projects/${slug}` : "/projects"}
            className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-violet-300 hover:text-white transition-colors"
          >
            <span>Case Study</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={onClick}
            className="p-1 text-white/40 hover:text-white transition-colors"
            title="Quick preview"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
