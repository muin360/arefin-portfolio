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
  const coverImage = "coverImage" in project && project.coverImage ? project.coverImage : undefined;

  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl bg-gradient-to-br from-[#0e1326] via-[#090c18] to-[#070911] border border-white/10 hover:border-violet-500/40 p-6 sm:p-8 transition-all duration-300 overflow-hidden ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <SpotlightCursor size={500} color="rgba(139, 92, 246, 0.12)" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Priority 1: Cover Image or SVG Blueprint */}
        <div className="lg:col-span-5 relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-white/10 bg-[#060810] shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#10142a] to-[#080b14] relative">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-3 shadow-inner">
                <Sparkles className="w-7 h-7 text-violet-400" />
              </div>
              <span className="text-xs font-mono font-bold text-white/80 uppercase tracking-widest text-center">
                {project.category}
              </span>
              <span className="text-[10px] font-mono text-white/40 mt-1">
                Verified Architecture Blueprint
              </span>
            </div>
          )}
        </div>

        {/* Narrative & Action Priority */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="px-3 py-0.5 rounded-full bg-violet-600/25 border border-violet-500/40 text-violet-200 text-[11px] font-mono font-bold tracking-wider uppercase">
                Featured Flagship · {project.category}
              </span>
              <span className="text-[11px] font-mono text-white/40 uppercase">
                {project.projectType ?? "Automation System"}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight group-hover:text-violet-100 transition-colors">
              <Link href={slug ? `/projects/${slug}` : "/projects"}>
                {project.title}
              </Link>
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              {project.summary}
            </p>

            {outcome && (
              <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-white/90 italic font-serif leading-relaxed">
                  &ldquo;{outcome}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Tech Stack + CTAs */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider mr-1">
                Stack:
              </span>
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-[#141a2e] border border-white/10 text-[11px] font-mono text-white/70"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={slug ? `/projects/${slug}` : "/projects"}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-mono text-xs font-bold transition-all shadow-md shadow-violet-600/20 group/btn"
              >
                <span>Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={onClick}
                className="p-2 text-white/40 hover:text-white transition-colors"
                title="Quick Technical Log"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
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
  const coverImage = "coverImage" in project && project.coverImage ? project.coverImage : undefined;

  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl bg-[#090c16] border border-white/10 hover:border-violet-500/40 p-6 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <SpotlightCursor size={350} color="rgba(139, 92, 246, 0.10)" />

      <div>
        {coverImage && (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 bg-[#060810] mb-4">
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-[10px] font-mono font-semibold tracking-wide uppercase">
            {project.category}
          </span>
          <span className="text-xs font-mono text-white/30 font-bold">
            0{index + 1}
          </span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
          <Link href={slug ? `/projects/${slug}` : "/projects"}>
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-3">
          {project.summary}
        </p>

        {outcome && (
          <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2">
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
            type="button"
            onClick={onClick}
            className="p-1 text-white/40 hover:text-white transition-colors"
            title="Quick preview"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
