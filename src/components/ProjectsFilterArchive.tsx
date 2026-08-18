"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import { ArrowRight, Workflow, Search, X } from "lucide-react";

interface Props {
  projects: Project[];
}

export default function ProjectsFilterArchive({ projects }: Props) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { categories, displayedProjects } = useMemo(() => {
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

    let result = projects;

    // Filter by tab category
    if (filter === "featured") {
      result = projects.filter((p) => p.featured);
      if (result.length === 0) result = projects.slice(0, 3);
    } else if (filter !== "all") {
      const match = categoryList.find((c) => c.id === filter);
      if (match) {
        result = projects.filter((p) => p.category === match.originalCat);
      }
    }

    // Filter by search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.stack && p.stack.some((s) => s.toLowerCase().includes(q))),
      );
    }

    return {
      categories: categoryList,
      displayedProjects: result,
    };
  }, [projects, filter, searchQuery]);

  const featuredCount = projects.filter((p) => p.featured).length;

  const tabs = [
    { id: "all", label: "All", count: projects.length },
    { id: "featured", label: "Featured", count: featuredCount },
    ...categories.map((c) => ({ id: c.id, label: c.label, count: c.count })),
  ];

  const flagship = displayedProjects[0];
  const secondary = displayedProjects.slice(1, 3);
  const archive = displayedProjects.slice(3);

  return (
    <div className="space-y-8">
      {/* ─── WORK CONTROLLER PLATE ───────────────────────────────────────── */}
      <SectionPlate
        index="03"
        title="SELECTED BUILDS"
        tabs={tabs}
        activeTab={filter}
        onTabChange={setFilter}
        meta={`${projects.length} verified builds`}
      />

      {/* ─── SEARCH FILTER INPUT ─────────────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search builds by stack (n8n, LangChain), title, or category..."
          className="w-full pl-10 pr-10 py-2.5 bg-[#0c101d] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors font-mono"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {displayedProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-3">
          <Workflow className="w-10 h-10 text-violet-400/60 mx-auto" />
          <p className="text-white/60 font-mono text-xs">
            No projects matched your active filters.
          </p>
          {(filter !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 rounded-xl text-xs font-mono transition-colors"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* ─── 01 DOMINANT FEATURED PROJECT ────────────────────────────── */}
          {flagship && (
            <div className="group relative rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 p-6 sm:p-10 transition-all overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Media Container (16:9 priority) */}
                <div className="lg:col-span-6 relative w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-white/10 bg-[#060810] shrink-0">
                  {flagship.coverImage ? (
                    <Image
                      src={flagship.coverImage}
                      alt={flagship.altText || flagship.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#121622] to-[#07090e] text-center">
                      <Workflow className="w-12 h-12 text-violet-400 mb-3 opacity-80" />
                      <span className="text-sm font-mono text-white/70 tracking-wider">
                        {flagship.category} · Architecture
                      </span>
                    </div>
                  )}
                </div>

                {/* Narrative Info */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 font-mono text-xs text-white/50">
                      <span className="text-violet-400 font-bold uppercase">
                        {flagship.category}
                      </span>
                      <span>·</span>
                      <span>{flagship.projectType || "AI Automation"}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight group-hover:text-violet-200 transition-colors">
                      <Link href={`/projects/${flagship.slug}`}>
                        {flagship.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-white/70 leading-relaxed font-sans">
                      {flagship.summary}
                    </p>

                    {flagship.outcome && (
                      <div className="p-4 rounded-xl bg-[#121622] border border-white/5 text-xs text-white/90 italic font-serif leading-relaxed">
                        &ldquo;{flagship.outcome}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(flagship.stack || []).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-[#121622] border border-white/5 text-[10px] text-white/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <Button
                      href={`/projects/${flagship.slug}`}
                      variant="primary"
                      size="md"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Read Case Study
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── 02 SECONDARY BUILDS (2-COLUMN GRID) ──────────────────────── */}
          {secondary.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondary.map((p, idx) => (
                <div
                  key={p.slug || p.id}
                  className="group relative rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 p-6 flex flex-col justify-between transition-all overflow-hidden"
                >
                  <div>
                    {/* Media Container (4:3 aspect) */}
                    <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-white/10 bg-[#060810] mb-4">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.altText || p.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#121622] to-[#07090e]">
                          <Workflow className="w-8 h-8 text-violet-400 mb-2 opacity-80" />
                          <span className="text-xs font-mono text-white/60">
                            {p.category}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                      <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">
                        {p.category}
                      </span>
                      <span className="text-white/30 font-bold">0{idx + 2}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                      <Link href={`/projects/${p.slug}`}>
                        {p.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2 font-sans">
                      {p.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3 font-mono text-xs">
                    <div className="flex flex-wrap gap-1">
                      {(p.stack || []).slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-[#121622] border border-white/5 text-[10px] text-white/50"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-white transition-colors"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── 03 ARCHIVE BUILDS (COMPACT DIVIDED LIST) ─────────────────── */}
          {archive.length > 0 && (
            <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-4 sm:p-6 divide-y divide-white/5">
              <div className="pb-3 px-3 font-mono text-xs text-white/40 uppercase tracking-wider font-semibold">
                Additional Pipeline Archives
              </div>

              {archive.map((p, i) => (
                <div
                  key={p.slug || p.id}
                  className="py-4 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-white/[0.02] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/30 font-semibold w-6">
                      0{i + 4}
                    </span>
                    <div>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-white/50 line-clamp-1 mt-0.5 font-sans">
                        {p.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#121622] border border-white/5 text-white/50">
                      {p.category}
                    </span>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 text-violet-300 hover:text-white transition-colors"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
