"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Workflow, Brain, Layers, GitBranch } from "lucide-react";
import type { Project } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";
import BuildExplorer from "@/components/BuildExplorer";

interface FlagshipShowcaseProps {
  projects?: Project[];
}

export default function FlagshipShowcase({ projects = [] }: FlagshipShowcaseProps) {
  // Select top 3 flagship projects (featured first, published only, maximum 3)
  const flagshipProjects = useMemo(() => {
    const published = projects.filter((p) => p.published !== false);
    const featured = published.filter((p) => p.featured);
    const nonFeatured = published.filter((p) => !p.featured);
    return [...featured, ...nonFeatured].slice(0, 3);
  }, [projects]);

  const [selectedSlug, setSelectedSlug] = useState<string>(
    flagshipProjects[0]?.slug || "",
  );

  const activeProject =
    flagshipProjects.find((p) => p.slug === selectedSlug) ||
    flagshipProjects[0];

  if (flagshipProjects.length === 0) return null;

  const project1 = flagshipProjects[0];
  const project2 = flagshipProjects[1];
  const project3 = flagshipProjects[2];

  const handleExploreBuild = (slug: string) => {
    setSelectedSlug(slug);
    const el = document.getElementById("build-explorer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full space-y-16 sm:space-y-20">
      {/* ─── 02 / FLAGSHIP WORK SECTION ──────────────────────────────────── */}
      <div className="w-full space-y-8">
        <SectionPlate
          index="02"
          title="FLAGSHIP WORK"
          sectionId="work"
          meta={`${flagshipProjects.length} curated production architectures`}
          action={
            <Link
              href="/projects"
              className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
            >
              <span>Project archive ({projects.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          }
        />

        {/* ─── PROJECT 1: DOMINANT HERO CASE STUDY (LARGEST & MOST VISUAL) ─── */}
        {project1 && (
          <article className="rounded-2xl bg-[#090c15] border border-white/[0.08] hover:border-violet-500/40 p-5 sm:p-7 lg:p-9 space-y-6 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            {/* Ambient subtle glow */}
            <div
              className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity"
              aria-hidden="true"
            />

            {/* Cinematic Media Container (16:9) */}
            <div className="relative w-full h-64 sm:h-80 md:h-[420px] rounded-xl overflow-hidden border border-white/10 bg-[#05070d]">
              {project1.coverImage ? (
                <Image
                  src={project1.coverImage}
                  alt={project1.altText || `${project1.title} cover architecture`}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0e1322] to-[#060810] text-center">
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
                    <Workflow className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-mono text-white/80 font-bold uppercase tracking-wider">
                    {project1.category} · Core Architecture
                  </span>
                  <p className="mt-1 text-xs text-white/40 max-w-md font-sans">
                    {project1.title}
                  </p>
                </div>
              )}

              {/* Media Floating Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-white/15 backdrop-blur-md font-mono text-[10px] font-bold text-white tracking-wider uppercase shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  <span>Flagship 01</span>
                </span>
              </div>
            </div>

            {/* Content & Metadata */}
            <div className="space-y-4 relative z-10">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-white/50">
                <span className="text-violet-400 font-bold uppercase tracking-wider text-[11px]">
                  [ {project1.category.toUpperCase()} ]
                </span>
                <span className="opacity-30">·</span>
                <span>{project1.projectType || "AI Automation System"}</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  <Link
                    href={`/projects/${project1.slug}`}
                    className="hover:text-violet-300 transition-colors"
                  >
                    {project1.title}
                  </Link>
                </h3>

                <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans max-w-3xl">
                  {project1.summary}
                </p>
              </div>

              {/* AI Role / Automation Logic Note */}
              {project1.aiRole && (
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-start gap-3 max-w-3xl">
                  <Brain className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-white/70 leading-relaxed font-sans">
                    <strong className="text-white font-mono text-[11px] block mb-0.5 uppercase tracking-wider">
                      AI &amp; Automation Role:
                    </strong>
                    {project1.aiRole}
                  </div>
                </div>
              )}

              {/* Tech Stack + Actions Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.06]">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(project1.stack || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-[#101524] border border-white/5 text-[11px] font-mono text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {/* Primary CTA: Explore Architecture Blueprint */}
                  <button
                    type="button"
                    onClick={() => handleExploreBuild(project1.slug)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold transition-all shadow-md shadow-violet-600/30 hover:shadow-violet-600/50 cursor-pointer"
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    <span>Explore Build ↓</span>
                  </button>

                  {/* Secondary CTA: View Full Case Study */}
                  <Link
                    href={`/projects/${project1.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/10 text-xs font-mono transition-colors"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/50" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* ─── PROJECTS 2 & 3: ASYMMETRIC EDITORIAL ROWS ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* ─── PROJECT 2: IMAGE LEFT (42%) / CONTENT RIGHT (58%) ─────────── */}
          {project2 && (
            <article className="rounded-2xl bg-[#090c15] border border-white/[0.08] hover:border-violet-500/30 p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all duration-300 shadow-xl group">
              <div className="space-y-4">
                {/* Media Preview */}
                <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-white/10 bg-[#05070d]">
                  {project2.coverImage ? (
                    <Image
                      src={project2.coverImage}
                      alt={project2.altText || `${project2.title} preview`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 600px"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0e1322] to-[#060810] text-center">
                      <Layers className="w-8 h-8 text-sky-400 mb-2 opacity-80" />
                      <span className="text-xs font-mono text-white/70 font-semibold uppercase">
                        {project2.category}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/75 border border-white/15 backdrop-blur-md font-mono text-[9px] font-bold text-white uppercase">
                      Flagship 02
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="font-mono text-[11px] text-sky-400 font-bold uppercase tracking-wider">
                    [ {project2.category.toUpperCase()} ]
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    <Link
                      href={`/projects/${project2.slug}`}
                      className="hover:text-sky-300 transition-colors"
                    >
                      {project2.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans line-clamp-3">
                    {project2.summary}
                  </p>
                </div>
              </div>

              {/* Stack & CTAs */}
              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <div className="flex flex-wrap items-center gap-1">
                  {(project2.stack || []).slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-[#101524] border border-white/5 text-[10px] font-mono text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleExploreBuild(project2.slug)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    <Workflow className="w-3 h-3 text-sky-400" />
                    <span>Explore Build ↓</span>
                  </button>

                  <Link
                    href={`/projects/${project2.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-white/60 hover:text-white transition-colors"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          )}

          {/* ─── PROJECT 3: ASYMMETRIC ROW ─────────────────────────────────── */}
          {project3 && (
            <article className="rounded-2xl bg-[#090c15] border border-white/[0.08] hover:border-violet-500/30 p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all duration-300 shadow-xl group">
              <div className="space-y-4">
                {/* Media Preview */}
                <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-white/10 bg-[#05070d]">
                  {project3.coverImage ? (
                    <Image
                      src={project3.coverImage}
                      alt={project3.altText || `${project3.title} preview`}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 600px"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0e1322] to-[#060810] text-center">
                      <GitBranch className="w-8 h-8 text-emerald-400 mb-2 opacity-80" />
                      <span className="text-xs font-mono text-white/70 font-semibold uppercase">
                        {project3.category}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/75 border border-white/15 backdrop-blur-md font-mono text-[9px] font-bold text-white uppercase">
                      Flagship 03
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="font-mono text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    [ {project3.category.toUpperCase()} ]
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    <Link
                      href={`/projects/${project3.slug}`}
                      className="hover:text-emerald-300 transition-colors"
                    >
                      {project3.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans line-clamp-3">
                    {project3.summary}
                  </p>
                </div>
              </div>

              {/* Stack & CTAs */}
              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <div className="flex flex-wrap items-center gap-1">
                  {(project3.stack || []).slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-[#101524] border border-white/5 text-[10px] font-mono text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleExploreBuild(project3.slug)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    <Workflow className="w-3 h-3 text-emerald-400" />
                    <span>Explore Build ↓</span>
                  </button>

                  <Link
                    href={`/projects/${project3.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-white/60 hover:text-white transition-colors"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          )}
        </div>

        {/* View All Work Action */}
        <div className="text-center pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-white/70 hover:text-white font-mono text-xs transition-colors"
          >
            <span>View complete engineering archive ({projects.length} builds)</span>
            <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
          </Link>
        </div>
      </div>

      {/* ─── 03 / CONNECTED SYSTEM BLUEPRINT / BUILD EXPLORER ────────────── */}
      <section
        id="build-explorer"
        className="w-full pt-4 scroll-mt-24 space-y-6"
        aria-label="Connected Build Explorer"
      >
        {/* Project Switcher Bar for Blueprint */}
        <div className="p-4 rounded-2xl bg-[#090c14] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] font-bold text-violet-400 uppercase tracking-wider block">
              Active Architecture Blueprint
            </span>
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {activeProject.title}
            </h4>
          </div>

          {/* Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {flagshipProjects.map((p, idx) => {
              const isSelected = p.slug === activeProject.slug;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedSlug(p.slug)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-violet-600/30 text-white border border-violet-500/40 shadow-sm font-semibold"
                      : "bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.08] border border-white/5"
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-60">0{idx + 1}</span>
                  <span className="max-w-[120px] sm:max-w-[160px] truncate">{p.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Project-Linked Interactive System Blueprint */}
        <BuildExplorer
          key={activeProject.slug}
          workflowSteps={activeProject.workflowSteps}
          projectTitle={activeProject.title}
          projectSlug={activeProject.slug}
        />
      </section>
    </div>
  );
}
