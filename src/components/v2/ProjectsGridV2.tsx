"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Project } from "@/lib/db/types";
import { ArrowRight, Workflow } from "lucide-react";
import SectionPlate from "@/components/SectionPlate";

export default function ProjectsGridV2({
  projects = [],
  limit = 5,
}: {
  projects?: Project[];
  limit?: number;
}) {
  const [filter, setFilter] = useState("all");

  // Calculate dynamic categories and counts strictly from MongoDB data
  const { categories, filteredProjects } = useMemo(() => {
    const catMap = new Map<string, number>();
    projects.forEach((p) => {
      if (p.category) {
        catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
      }
    });

    const categoryList = Array.from(catMap.entries()).map(([cat, count]) => ({
      id: cat.toLowerCase().replace(/\s+/g, "-"),
      label: cat,
      count,
      originalCat: cat,
    }));

    let filtered = projects;
    if (filter === "featured") {
      filtered = projects.filter((p) => p.featured);
    } else if (filter !== "all") {
      const match = categoryList.find((c) => c.id === filter);
      if (match) {
        filtered = projects.filter((p) => p.category === match.originalCat);
      }
    }

    return {
      categories: categoryList,
      filteredProjects: filtered.slice(0, limit),
    };
  }, [projects, filter, limit]);

  const tabs = [
    { id: "all", label: "All", count: projects.length },
    {
      id: "featured",
      label: "Featured",
      count: projects.filter((p) => p.featured).length,
    },
    ...categories.map((c) => ({ id: c.id, label: c.label, count: c.count })),
  ];

  const flagship = filteredProjects[0];
  const secondary = filteredProjects.slice(1, 3);
  const compact = filteredProjects.slice(3);

  return (
    <div className="w-full space-y-6">
      {/* ─── FUNCTIONAL WORK PLATE ──────────────────────────────────────── */}
      <SectionPlate
        index="03"
        title="WORK"
        tabs={tabs}
        activeTab={filter}
        onTabChange={setFilter}
        action={
          <Link
            href="/projects"
            className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
          >
            <span>View all ({projects.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        }
      />

      {filteredProjects.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[#090c16] border border-white/[0.08] text-white/50 font-mono text-xs">
          No projects found for the selected filter.
        </div>
      ) : (
        <div className="space-y-6">
          {/* TIER 1: FLAGSHIP PROJECT SHOWCASE */}
          {flagship && <FlagshipCard project={flagship} />}

          {/* TIER 2: SECONDARY PROJECTS */}
          {secondary.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondary.map((p, i) => (
                <SecondaryCard
                  key={p.slug || p.id || p.title}
                  index={i + 1}
                  project={p}
                />
              ))}
            </div>
          )}

          {/* TIER 3: COMPACT ADDITIONAL LIST */}
          {compact.length > 0 && (
            <div className="rounded-2xl bg-[#090c16] border border-white/[0.08] p-4 sm:p-5 divide-y divide-white/5">
              {compact.map((p, i) => {
                const slug = p.slug || "";
                return (
                  <div
                    key={slug || p.id || p.title}
                    className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.02] rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white/30 font-semibold">
                        0{i + 4}
                      </span>
                      <div>
                        <Link
                          href={`/projects/${slug}`}
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
                        href={`/projects/${slug}`}
                        className="inline-flex items-center gap-1 text-xs font-mono text-violet-300 hover:text-white transition-colors"
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
      )}
    </div>
  );
}

function FlagshipCard({ project }: { project: Project }) {
  const slug = project.slug || "";
  const coverImage = project.coverImage;

  return (
    <div className="group relative rounded-2xl bg-[#090c16] border border-white/[0.08] hover:border-violet-500/30 p-6 sm:p-8 transition-all overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual: Real Media Cover Image or Conceptual SVG Diagram */}
        <div className="lg:col-span-5 relative w-full h-52 sm:h-64 rounded-xl overflow-hidden border border-white/10 bg-[#060810] shrink-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#101426] to-[#070912]">
              <Workflow className="w-8 h-8 text-violet-400 mb-2 opacity-80" />
              <span className="text-xs font-mono text-white/60 tracking-wider">
                {project.category}
              </span>
            </div>
          )}
        </div>

        {/* Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-white/50">
              <span className="text-violet-400 font-semibold uppercase">
                {project.category}
              </span>
              <span>·</span>
              <span>{project.projectType || "Automation System"}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
              <Link href={`/projects/${slug}`}>
                {project.title}
              </Link>
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              {project.summary}
            </p>

            {project.outcome && (
              <div className="mt-3 text-xs text-white/80 italic font-serif">
                &ldquo;{project.outcome}&rdquo;
              </div>
            )}
          </div>

          {/* Tech Stack + Link */}
          <div className="pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {(project.stack || []).map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded bg-[#101426] border border-white/5 text-[10px] text-white/60"
                >
                  {s}
                </span>
              ))}
            </div>

            <Link
              href={`/projects/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-white transition-colors shrink-0 group/btn"
            >
              <span>Read Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-violet-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecondaryCard({
  index,
  project,
}: {
  index: number;
  project: Project;
}) {
  const slug = project.slug || "";
  const coverImage = project.coverImage;

  return (
    <div className="group relative rounded-2xl bg-[#090c16] border border-white/[0.08] hover:border-violet-500/30 p-6 flex flex-col justify-between transition-all overflow-hidden">
      <div>
        {coverImage && (
          <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 bg-[#060810] mb-4">
            <img
              src={coverImage}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mb-2 font-mono text-xs">
          <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">
            {project.category}
          </span>
          <span className="text-white/30 font-bold">
            0{index + 1}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
          <Link href={`/projects/${slug}`}>
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-3 font-sans">
          {project.summary}
        </p>
      </div>

      <div className="mt-6 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap gap-1">
          {(project.stack || []).slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded bg-[#101426] border border-white/5 text-[10px] text-white/50"
            >
              {s}
            </span>
          ))}
        </div>

        <Link
          href={`/projects/${slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-white transition-colors"
        >
          <span>Case Study</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
