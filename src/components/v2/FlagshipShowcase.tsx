"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Workflow,
  Brain,
  Bot,
  Send,
  ShoppingCart,
  FileText,
  TrendingUp,
  Database,
} from "lucide-react";
import type { Project } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";
import BuildExplorer from "@/components/BuildExplorer";

interface FlagshipShowcaseProps {
  projects?: Project[];
}

export default function FlagshipShowcase({ projects = [] }: FlagshipShowcaseProps) {
  // Select top 3 flagship projects strictly based on technical depth and tier
  const flagshipProjects = useMemo(() => {
    const published = projects.filter((p) => p.published !== false);

    return published
      .sort((a, b) => {
        // Priority 1: WooCommerce AI Store Automation is always Flagship #1
        const aIsWoo = a.slug === "woocommerce-ai-store-automation";
        const bIsWoo = b.slug === "woocommerce-ai-store-automation";
        if (aIsWoo && !bIsWoo) return -1;
        if (!aIsWoo && bIsWoo) return 1;

        // Priority 2: Tier === "flagship"
        const aIsFlagship = a.tier === "flagship";
        const bIsFlagship = b.tier === "flagship";
        if (aIsFlagship && !bIsFlagship) return -1;
        if (!aIsFlagship && bIsFlagship) return 1;

        // Priority 3: Explicit featuredOrder or order
        const aOrder = a.featuredOrder ?? a.order ?? 99;
        const bOrder = b.featuredOrder ?? b.order ?? 99;
        return aOrder - bOrder;
      })
      .slice(0, 3);
  }, [projects]);

  const [selectedSlug, setSelectedSlug] = useState<string>(
    flagshipProjects[0]?.slug || "",
  );

  const activeProject =
    flagshipProjects.find((p) => p.slug === selectedSlug) ||
    flagshipProjects[0];

  if (flagshipProjects.length === 0) return null;

  const primaryFlagship = flagshipProjects[0];
  const secondaryFlagship = flagshipProjects[1];
  const tertiaryFlagship = flagshipProjects[2];

  const handleExploreBuild = (slug: string) => {
    setSelectedSlug(slug);
    const el = document.getElementById("build-explorer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full space-y-16 sm:space-y-20">
      {/* ─── 02 / FLAGSHIP SYSTEMS SECTION ───────────────────────────────── */}
      <div className="w-full space-y-8">
        <SectionPlate
          index="02"
          title="FLAGSHIP SYSTEMS"
          sectionId="work"
          meta="3 multi-system production architectures"
          action={
            <Link
              href="/projects"
              className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
            >
              <span>Full project archive ({projects.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          }
        />

        {/* ─── PRIMARY FLAGSHIP: WOOCOMMERCE AI STORE AUTOMATION ───────────── */}
        {primaryFlagship && (
          <article className="rounded-2xl bg-[#090c15] border border-white/[0.09] hover:border-violet-500/40 p-5 sm:p-8 lg:p-10 space-y-8 transition-all duration-300 shadow-2xl relative overflow-hidden group">
            {/* Ambient subtle glow */}
            <div
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none opacity-50 group-hover:opacity-75 transition-opacity"
              aria-hidden="true"
            />

            {/* Top Bar: Flagship #1 Label + Category */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4 relative z-10 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-violet-500/15 border border-violet-500/30 text-violet-300 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Primary Flagship · 01
                </span>
                <span className="text-white/40 uppercase tracking-widest text-[11px]">
                  [ {primaryFlagship.category.toUpperCase()} ]
                </span>
              </div>

              <span className="text-[11px] text-white/50 hidden sm:inline-block">
                Multi-System E-Commerce Architecture
              </span>
            </div>

            {/* Architecture Preview Visual */}
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#060810] p-4 sm:p-6 lg:p-8">
              {/* If real cover media exists, show media; otherwise render real architectural pipeline diagram */}
              {primaryFlagship.coverImage ? (
                <div className="relative w-full h-64 sm:h-80 md:h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={primaryFlagship.coverImage}
                    alt={primaryFlagship.altText || `${primaryFlagship.title} architecture`}
                    fill
                    priority
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
                    sizes="(max-width: 1024px) 100vw, 1200px"
                  />
                </div>
              ) : (
                /* Bespoke Live Architectural DAG Preview */
                <div className="space-y-5">
                  <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs text-white/40 border-b border-white/[0.06] pb-2.5">
                    <span className="uppercase tracking-widest text-violet-400 font-bold flex items-center gap-1.5">
                      <Workflow className="w-3.5 h-3.5" />
                      Live System Execution Topology
                    </span>
                    <span>6 Orchestrated Services</span>
                  </div>

                  {/* Flow Trace Graph */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                    {/* Node 1: Telegram */}
                    <div className="p-3.5 rounded-xl bg-[#0c101d] border border-amber-500/30 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-amber-400 font-mono text-[10px] font-bold">
                        <span>[ TRIGGER ]</span>
                        <Send className="w-3.5 h-3.5 opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs leading-tight">Telegram Bot</div>
                        <div className="text-[10px] text-white/50 font-sans mt-0.5">Admin command intake</div>
                      </div>
                    </div>

                    {/* Node 2: AI Agent */}
                    <div className="p-3.5 rounded-xl bg-[#0c101d] border border-violet-500/30 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-violet-400 font-mono text-[10px] font-bold">
                        <span>[ AI REASON ]</span>
                        <Bot className="w-3.5 h-3.5 opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs leading-tight">OpenAI GPT-4o</div>
                        <div className="text-[10px] text-white/50 font-sans mt-0.5">Intent &amp; tool calling</div>
                      </div>
                    </div>

                    {/* Node 3: WooCommerce */}
                    <div className="p-3.5 rounded-xl bg-[#0c101d] border border-sky-500/30 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-sky-400 font-mono text-[10px] font-bold">
                        <span>[ STORE API ]</span>
                        <ShoppingCart className="w-3.5 h-3.5 opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs leading-tight">WooCommerce</div>
                        <div className="text-[10px] text-white/50 font-sans mt-0.5">Stock &amp; orders mutate</div>
                      </div>
                    </div>

                    {/* Node 4: Invoice PDF */}
                    <div className="p-3.5 rounded-xl bg-[#0c101d] border border-emerald-500/30 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-emerald-400 font-mono text-[10px] font-bold">
                        <span>[ INVOICE ]</span>
                        <FileText className="w-3.5 h-3.5 opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs leading-tight">PDF Engine</div>
                        <div className="text-[10px] text-white/50 font-sans mt-0.5">Dynamic bill rendering</div>
                      </div>
                    </div>

                    {/* Node 5: Dispatch & Sync */}
                    <div className="p-3.5 rounded-xl bg-[#0c101d] border border-cyan-500/30 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-cyan-400 font-mono text-[10px] font-bold">
                        <span>[ MULTI-SYNC ]</span>
                        <Database className="w-3.5 h-3.5 opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs leading-tight">Drive &amp; Sheets</div>
                        <div className="text-[10px] text-white/50 font-sans mt-0.5">Archive &amp; customer email</div>
                      </div>
                    </div>

                    {/* Node 6: AI Sales Intelligence */}
                    <div className="p-3.5 rounded-xl bg-[#0c101d] border border-purple-500/30 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between text-purple-400 font-mono text-[10px] font-bold">
                        <span>[ ANALYTICS ]</span>
                        <TrendingUp className="w-3.5 h-3.5 opacity-80" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs leading-tight">AI Sales Core</div>
                        <div className="text-[10px] text-white/50 font-sans mt-0.5">Daily revenue digest</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Narrative & Specification */}
            <div className="space-y-5 relative z-10">
              <div className="space-y-2.5">
                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  <Link
                    href={`/projects/${primaryFlagship.slug}`}
                    className="hover:text-violet-300 transition-colors"
                  >
                    {primaryFlagship.title}
                  </Link>
                </h3>

                <p className="text-sm sm:text-base text-white/75 leading-relaxed font-sans max-w-3xl">
                  {primaryFlagship.summary}
                </p>
              </div>

              {/* Problem / AI Role Dual Specification Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                {/* Problem Solved */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 font-bold block">
                    Problem Addressed:
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {primaryFlagship.problem}
                  </p>
                </div>

                {/* AI & Automation Role */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-violet-400 font-bold flex items-center gap-1.5">
                    <Brain className="w-3 h-3" />
                    AI &amp; Automation Role:
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed font-sans">
                    {primaryFlagship.aiRole}
                  </p>
                </div>
              </div>

              {/* Stack + Primary / Secondary CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.06]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-1">
                    Key Stack:
                  </span>
                  {(primaryFlagship.stack || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-md bg-[#101524] border border-white/10 text-[11px] font-mono text-white/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {/* Primary CTA: Explore Architecture Blueprint */}
                  <button
                    type="button"
                    onClick={() => handleExploreBuild(primaryFlagship.slug)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 cursor-pointer"
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    <span>Explore Build ↓</span>
                  </button>

                  {/* Secondary CTA: View Full Case Study */}
                  <Link
                    href={`/projects/${primaryFlagship.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/10 text-xs font-mono transition-colors"
                  >
                    <span>Full Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/50" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* ─── SUPPORTING FLAGSHIPS: #2 (EDITORIAL ROW) & #3 (COMPACT CARD) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* ─── FLAGSHIP #2: MULTI-AGENT COLLABORATIVE INTELLIGENCE ────────── */}
          {secondaryFlagship && (
            <article className="rounded-2xl bg-[#090c15] border border-white/[0.08] hover:border-violet-500/30 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl group">
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between font-mono text-xs border-b border-white/[0.06] pb-3">
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                    Flagship · 02
                  </span>
                  <span className="text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                    [ {secondaryFlagship.category.toUpperCase()} ]
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    <Link
                      href={`/projects/${secondaryFlagship.slug}`}
                      className="hover:text-purple-300 transition-colors"
                    >
                      {secondaryFlagship.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                    {secondaryFlagship.summary}
                  </p>
                </div>

                {/* AI Capability Note */}
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-purple-400 font-bold block">
                    Autonomous Architecture:
                  </span>
                  <p className="text-xs text-white/60 leading-relaxed font-sans line-clamp-2">
                    {secondaryFlagship.aiRole}
                  </p>
                </div>
              </div>

              {/* Stack & Actions */}
              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(secondaryFlagship.stack || []).slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-[#101524] border border-white/5 text-[10px] font-mono text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleExploreBuild(secondaryFlagship.slug)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    <Workflow className="w-3 h-3 text-purple-400" />
                    <span>Explore Build ↓</span>
                  </button>

                  <Link
                    href={`/projects/${secondaryFlagship.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-white/60 hover:text-white transition-colors"
                  >
                    <span>Case Study</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          )}

          {/* ─── FLAGSHIP #3: ENTERPRISE RAG KNOWLEDGE SUPPORT SYSTEM ──────── */}
          {tertiaryFlagship && (
            <article className="rounded-2xl bg-[#090c15] border border-white/[0.08] hover:border-violet-500/30 p-6 flex flex-col justify-between space-y-6 transition-all duration-300 shadow-xl group">
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between font-mono text-xs border-b border-white/[0.06] pb-3">
                  <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 text-[10px] font-bold uppercase tracking-wider">
                    Flagship · 03
                  </span>
                  <span className="text-sky-400 font-bold uppercase tracking-wider text-[11px]">
                    [ {tertiaryFlagship.category.toUpperCase()} ]
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    <Link
                      href={`/projects/${tertiaryFlagship.slug}`}
                      className="hover:text-sky-300 transition-colors"
                    >
                      {tertiaryFlagship.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                    {tertiaryFlagship.summary}
                  </p>
                </div>

                {/* AI Capability Note */}
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-sky-400 font-bold block">
                    Retrieval &amp; Safety Guardrails:
                  </span>
                  <p className="text-xs text-white/60 leading-relaxed font-sans line-clamp-2">
                    {tertiaryFlagship.aiRole}
                  </p>
                </div>
              </div>

              {/* Stack & Actions */}
              <div className="pt-3 border-t border-white/[0.06] space-y-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(tertiaryFlagship.stack || []).slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-[#101524] border border-white/5 text-[10px] font-mono text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleExploreBuild(tertiaryFlagship.slug)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-mono font-medium transition-colors cursor-pointer"
                  >
                    <Workflow className="w-3 h-3 text-sky-400" />
                    <span>Explore Build ↓</span>
                  </button>

                  <Link
                    href={`/projects/${tertiaryFlagship.slug}`}
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

        {/* View Complete Engineering Archive Action */}
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
        aria-label="Connected System Blueprint"
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
                  <span className="max-w-[140px] sm:max-w-[180px] truncate">{p.title}</span>
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
