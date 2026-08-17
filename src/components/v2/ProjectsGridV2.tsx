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
  limit = 4,
}: {
  projects?: Project[];
  limit?: number;
}) {
  const source = propProjects && propProjects.length > 0 ? propProjects : fallbackProjects;
  const items = source.slice(0, limit);
  const [selected, setSelected] = useState<(typeof source)[number] | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((p, i) => {
          const key = "slug" in p && p.slug ? p.slug : p.title;
          return (
            <Card 
              key={key} 
              index={i} 
              project={p} 
              onClick={() => setSelected(p)} 
            />
          );
        })}
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

function Card({
  index,
  project,
  onClick,
}: {
  index: number;
  project: Project | (typeof fallbackProjects)[number];
  onClick: () => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const isFeatured = index === 0;
  const slug = "slug" in project && project.slug ? project.slug : undefined;
  const outcome = "outcome" in project ? project.outcome : undefined;

  return (
    <div
      ref={ref}
      className={`group relative rounded-3xl bg-[#090c16] border border-white/10 hover:border-violet-500/40 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-violet-950/20 overflow-hidden ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${isFeatured ? "md:col-span-2 bg-gradient-to-br from-[#0e1222] via-[#090c16] to-[#070911]" : ""}`}
      style={{ transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <SpotlightCursor size={400} color="rgba(139, 92, 246, 0.12)" />

      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-violet-600/15 border border-violet-500/30 text-violet-300 text-[11px] font-mono font-semibold tracking-wide">
              {project.category}
            </span>
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">
              {project.projectType ?? "Automation System"}
            </span>
          </div>
          <span className="text-xs font-mono text-white/30 font-bold">
            / {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
          <Link href={slug ? `/projects/${slug}` : "/projects"} className="focus:outline-none">
            {project.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="mt-3 text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl">
          {project.summary}
        </p>

        {/* Outcome Accent */}
        {outcome && (
          <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-white/80 italic font-serif leading-snug">
              {outcome}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Row: Tech Stack + Action Links */}
      <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-md bg-[#13182b] border border-white/5 text-[11px] font-mono text-white/50"
            >
              {s}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="px-2 py-0.5 rounded-md bg-[#13182b] border border-white/5 text-[11px] font-mono text-white/40">
              +{project.stack.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={slug ? `/projects/${slug}` : "/projects"}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-violet-300 hover:text-white transition-colors"
          >
            <span>Case Study</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={onClick}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-white/40 hover:text-white/80 transition-colors p-1"
            title="Quick preview"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
