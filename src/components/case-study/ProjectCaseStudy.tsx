"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Workflow,
  Brain,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Maximize2,
  ShieldCheck,
} from "lucide-react";
import type { Project, Service } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";
import BuildExplorer from "@/components/BuildExplorer";
import ProjectLightbox from "@/components/ProjectLightbox";
import {
  trackCaseStudyView,
  trackProofOpen,
  trackCaseStudyCta,
  trackExternalProjectLink,
} from "@/lib/track-event";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface ProjectCaseStudyProps {
  project: Project;
  relatedProjects?: Project[];
  relatedService?: Service | null;
  isPreview?: boolean;
}

export default function ProjectCaseStudy({
  project,
  relatedProjects = [],
  relatedService,
  isPreview = false,
}: ProjectCaseStudyProps) {
  const caseStudy = project.caseStudy;

  useEffect(() => {
    trackCaseStudyView(project.slug);
  }, [project.slug]);

  // Normalize gallery and proof items for lightbox viewing
  const lightboxImages = useMemo(() => {
    const proofList = project.caseStudy?.proofItems || [];
    if (proofList.length > 0) {
      return proofList.map((item) => ({
        src: item.mediaUrl,
        alt: `${project.title} — ${item.title}`,
        caption: item.caption || item.description || item.title,
      }));
    }
    return (project.gallery || []).map((src, idx) => ({
      src,
      alt: `${project.title} proof evidence ${idx + 1}`,
      caption: project.captions?.[idx] || `${project.title} execution trace ${idx + 1}`,
    }));
  }, [project.caseStudy?.proofItems, project.gallery, project.captions, project.title]);

  const [activeProofIndex, setActiveProofIndex] = useState<number | null>(null);

  const proofItems = project.caseStudy?.proofItems || [];
  const heroProofImage =
    caseStudy?.featuredProof ||
    proofItems.find((p) => p.featured)?.mediaUrl ||
    proofItems[0]?.mediaUrl ||
    project.coverImage ||
    project.workflowImage;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full space-y-20 sm:space-y-28">
      {/* ─── DRAFT PREVIEW BANNER (ADMIN ONLY) ────────────────────────────── */}
      {isPreview && (
        <div className="sticky top-20 z-40 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 backdrop-blur-md flex items-center justify-between text-xs font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <strong>AUTHENTICATED DRAFT PREVIEW:</strong>
            <span>This case study is not publicly published.</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20">
            Preview Mode
          </span>
        </div>
      )}

      {/* ─── 01 HERO SECTION: EDITORIAL HEADLINE & FEATURED PROOF ─────────── */}
      <section className="space-y-8 pt-4" aria-label="Case study hero">
        {/* Eyebrow + Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-white/50 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <Link
              href="/projects"
              className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
            >
              Projects
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-violet-400 font-bold uppercase tracking-widest text-[11px]">
              {caseStudy?.eyebrow || `Case Study · ${project.category}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/40">
              Published {caseStudy?.publishedAt || new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/[0.04] text-white/60 border border-white/5 text-[10px]">
              {project.projectType || "Engineering Case Study"}
            </span>
          </div>
        </div>

        {/* Main Title & Executive Summary */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            {project.title}
          </h1>

          <p className="text-base sm:text-xl text-white/75 leading-relaxed font-sans font-normal">
            {caseStudy?.shortSummary || project.summary}
          </p>
        </div>

        {/* Technical Metadata Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-white/40 text-[10px] uppercase tracking-wider block">
                Primary Architecture
              </span>
              <strong className="text-white font-semibold">
                {project.category}
              </strong>
            </div>

            {relatedService && (
              <div>
                <span className="text-white/40 text-[10px] uppercase tracking-wider block">
                  Service Capability
                </span>
                <Link
                  href="/services"
                  className="text-violet-300 hover:text-white transition-colors"
                >
                  {relatedService.title}
                </Link>
              </div>
            )}

            <div>
              <span className="text-white/40 text-[10px] uppercase tracking-wider block">
                Toolchain
              </span>
              <span className="text-white/80">
                {(project.stack || []).slice(0, 4).join(" · ")}
              </span>
            </div>
          </div>

          {/* Jump Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollToSection("system-blueprint")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Blueprint ↓</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("engineering-proof")}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Evidence ↓</span>
            </button>

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackExternalProjectLink("Live Demo", project.slug)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-colors"
              >
                <span>Demo</span>
                <ExternalLink className="w-3 h-3 text-white/50" />
              </a>
            )}
          </div>
        </div>

        {/* Featured Hero Proof Visual */}
        {heroProofImage && (
          <div className="relative w-full h-72 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden border border-white/10 bg-[#070912] group shadow-2xl">
            <Image
              src={heroProofImage}
              alt={project.altText || `${project.title} primary engineering proof visual`}
              fill
              priority
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10 font-mono text-xs">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-violet-600/80 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Primary Architectural Proof
                </span>
                <p className="text-white/80 font-sans text-xs sm:text-sm max-w-xl">
                  {caseStudy?.featuredProof ? "Production execution trace and integration verification." : (project.summary || "System pipeline verified in production environment.")}
                </p>
              </div>

              {lightboxImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveProofIndex(0);
                    trackProofOpen("Featured Hero Proof", project.slug);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center gap-1.5 text-xs font-mono transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Inspect Evidence ({lightboxImages.length})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ─── 02 PROBLEM & OPERATIONAL CONTEXT ─────────────────────────────── */}
      <section id="problem-context" className="space-y-6 scroll-mt-24" aria-label="Problem and context">
        <SectionPlate
          index="01"
          title="PROBLEM & CONTEXT"
          sectionId="problem-context"
          meta="Operational bottlenecks & constraints"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Problem Narrative */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              The Operational Friction
            </h2>

            <div className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-3">
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
                {caseStudy?.problem || project.problem}
              </p>
            </div>
          </div>

          {/* Right Column: Context & Environment */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Operational Context
            </h3>

            <div className="p-6 rounded-2xl bg-[#090c15] border border-white/[0.06] space-y-3 font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
              <p>
                {caseStudy?.context ||
                  "E-commerce stores and customer workflows frequently encounter delays due to disconnected communication channels, fragmented record management, and lack of real-time operational feedback."}
              </p>
              <div className="pt-2 flex items-center gap-2 text-violet-400 font-mono text-[11px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>Zero-to-One Automation Architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 03 SOLUTION ARCHITECTURE & TECHNICAL STRATEGY ─────────────────── */}
      <section id="solution" className="space-y-6 scroll-mt-24" aria-label="Solution architecture">
        <SectionPlate
          index="02"
          title="SOLUTION STRATEGY"
          sectionId="solution"
          meta="Engineering paradigm & approach"
        />

        <div className="rounded-2xl bg-[#0c101d] border border-white/[0.08] p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Architectural Approach
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">
              {caseStudy?.solution || project.goal}
            </p>
          </div>

          {caseStudy?.implementationNotes && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-violet-400 font-bold block">
                Implementation Notes:
              </span>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                {caseStudy.implementationNotes}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─── 04 DUAL AI ROLE & AUTOMATION ORCHESTRATION ────────────────────── */}
      <section id="ai-automation" className="space-y-6 scroll-mt-24" aria-label="AI and automation breakdown">
        <SectionPlate
          index="03"
          title="AI & AUTOMATION ROLES"
          sectionId="ai-automation"
          meta="Reasoning layer vs orchestration engine"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* AI Reasoning Core */}
          <div className="rounded-2xl bg-[#0c101d] border border-violet-500/30 p-6 sm:p-8 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xl">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 font-mono text-xs text-violet-400">
                <Brain className="w-4 h-4" />
                <span className="font-bold uppercase tracking-widest text-[11px]">
                  AI Reasoning &amp; Intelligence
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Cognitive Function
              </h3>

              <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
                {caseStudy?.aiRole || project.aiRole}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] font-mono text-[10px] text-violet-300/60 uppercase tracking-widest">
              Schema Validation · Guardrails · Zero Hallucination
            </div>
          </div>

          {/* Deterministic Automation Orchestration */}
          <div className="rounded-2xl bg-[#0c101d] border border-sky-500/30 p-6 sm:p-8 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xl">
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 font-mono text-xs text-sky-400">
                <Workflow className="w-4 h-4" />
                <span className="font-bold uppercase tracking-widest text-[11px]">
                  Deterministic Orchestration
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Workflow Execution
              </h3>

              <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
                {caseStudy?.automationRole || project.automationLogic}
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] font-mono text-[10px] text-sky-300/60 uppercase tracking-widest">
              Event Webhooks · REST APIs · Document Pipeline
            </div>
          </div>
        </div>
      </section>

      {/* ─── 05 INTERACTIVE SYSTEM BLUEPRINT (BUILD EXPLORER) ──────────────── */}
      <section id="system-blueprint" className="space-y-6 scroll-mt-24" aria-label="System execution blueprint">
        <SectionPlate
          index="04"
          title="SYSTEM BLUEPRINT"
          sectionId="system-blueprint"
          meta={`${(caseStudy?.architectureSteps || project.workflowSteps || []).length} connected execution stages`}
        />

        <BuildExplorer
          workflowSteps={caseStudy?.architectureSteps || project.workflowSteps}
          projectTitle={project.title}
          projectSlug={project.slug}
        />
      </section>

      {/* ─── 06 INTEGRATIONS & TOOLCHAIN MATRIX ────────────────────────────── */}
      {(caseStudy?.integrations && caseStudy.integrations.length > 0) || (project.integrations && project.integrations.length > 0) ? (
        <section id="integrations" className="space-y-6 scroll-mt-24" aria-label="Integrations and toolchain">
          <SectionPlate
            index="05"
            title="INTEGRATIONS & TOOLCHAIN"
            sectionId="integrations"
            meta="External connectors & APIs"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(caseStudy?.integrations || []).length > 0
              ? caseStudy?.integrations?.map((item) => (
                  <div
                    key={item.name}
                    className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-violet-500/30 transition-colors flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {item.name}
                        </span>
                        {item.category && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-white/50 border border-white/5">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed font-sans">
                        {item.purpose}
                      </p>
                    </div>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-violet-400 hover:text-violet-300 transition-colors pt-2 border-t border-white/[0.04]"
                      >
                        <span>Official Spec</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))
              : (project.integrations || []).map((name) => (
                  <div
                    key={name}
                    className="p-4 rounded-xl bg-[#0c101d] border border-white/[0.06] flex items-center justify-between"
                  >
                    <span className="font-mono text-xs text-white font-medium">
                      {name}
                    </span>
                    <span className="text-[10px] font-mono text-violet-400">
                      Verified Connector
                    </span>
                  </div>
                ))}
          </div>
        </section>
      ) : null}

      {/* ─── 07 ENGINEERING EVIDENCE & PROOF WALL ──────────────────────────── */}
      {lightboxImages.length > 0 && (
        <section id="engineering-proof" className="space-y-6 scroll-mt-24" aria-label="Engineering evidence wall">
          <SectionPlate
            index="06"
            title="EVIDENCE & PROOF"
            sectionId="engineering-proof"
            meta="Production artifacts & execution logs"
          />

          {/* Proof Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {proofItems.length > 0
              ? proofItems.map((proof, idx) => (
                  <div
                    key={proof.id || proof.title + idx}
                    onClick={() => {
                      setActiveProofIndex(idx);
                      trackProofOpen(proof.title, project.slug);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveProofIndex(idx);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open proof image: ${proof.title}`}
                    className="group rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-violet-500/40 p-4 flex flex-col justify-between space-y-3 cursor-pointer transition-all shadow-xl"
                  >
                    <div className="space-y-3">
                      {/* Media container */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-[#070912]">
                        <Image
                          src={proof.mediaUrl}
                          alt={proof.title}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="p-2 rounded-xl bg-black/70 text-white backdrop-blur-md">
                            <Maximize2 className="w-4 h-4 text-violet-300" />
                          </span>
                        </div>

                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded bg-black/80 border border-white/15 text-[9px] font-mono text-white/80 uppercase font-bold">
                            {proof.type}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                          {proof.title}
                        </h4>
                        {proof.caption && (
                          <p className="text-xs text-white/60 font-sans line-clamp-2">
                            {proof.caption}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-white/40">
                      <span>Click to inspect</span>
                      <ArrowRight className="w-3 h-3 text-violet-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))
              : (
                <div className="col-span-full">
                  <ProjectLightbox images={lightboxImages} />
                </div>
              )}
          </div>

          {/* Fullscreen Lightbox for proof items */}
          {proofItems.length > 0 && activeProofIndex !== null && (
            <ProjectLightbox
              images={lightboxImages}
              className="hidden"
            />
          )}
        </section>
      )}

      {/* ─── 08 VERIFIED METRICS & OBSERVED BENCHMARKS ─────────────────────── */}
      {caseStudy?.metrics && caseStudy.metrics.length > 0 && (
        <section id="metrics" className="space-y-6 scroll-mt-24" aria-label="Observed metrics">
          <SectionPlate
            index="07"
            title="METRICS & BENCHMARKS"
            sectionId="metrics"
            meta="Tested telemetry & performance"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {caseStudy.metrics.map((metric, i) => (
              <div
                key={metric.label + i}
                className="p-6 rounded-2xl bg-[#0c101d] border border-white/[0.08] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                      {metric.label}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                        metric.isVerified
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold"
                          : "bg-white/[0.04] text-white/50 border border-white/5"
                      }`}
                    >
                      {metric.isVerified ? "Verified Production" : "Observed Prototype"}
                    </span>
                  </div>

                  <div className="text-3xl font-bold font-mono text-white tracking-tight pt-2">
                    {metric.value}
                  </div>
                </div>

                {metric.context && (
                  <p className="text-xs text-white/60 font-sans leading-relaxed pt-2 border-t border-white/[0.04]">
                    {metric.context}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 09 LEARNINGS & ARCHITECTURAL LIMITATIONS ─────────────────────── */}
      <section id="learnings-limitations" className="space-y-6 scroll-mt-24" aria-label="Learnings and limitations">
        <SectionPlate
          index="08"
          title="LEARNINGS & LIMITATIONS"
          sectionId="learnings-limitations"
          meta="Engineering reflections & constraints"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Learnings */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-bold uppercase tracking-widest text-[11px]">
                Engineering Insights
              </span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              What Was Learned
            </h3>

            <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
              {caseStudy?.learnings || project.learningOutcome}
            </p>
          </div>

          {/* Limitations */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0c101d] border border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-bold uppercase tracking-widest text-[11px]">
                Architectural Boundaries
              </span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              Current Limitations &amp; Edge Cases
            </h3>

            <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
              {caseStudy?.limitations ||
                "Operating in staged development environments with webhook retry queues; requires rate-limit monitoring under extreme concurrent order surges."}
            </p>
          </div>
        </div>
      </section>

      {/* ─── 10 RESOURCE LINKS & REPOSITORY ────────────────────────────────── */}
      {((caseStudy?.links && caseStudy.links.length > 0) || project.repoUrl || project.demoUrl) && (
        <section id="resources" className="space-y-6 scroll-mt-24" aria-label="Resources and repository links">
          <SectionPlate
            index="09"
            title="RESOURCES & LINKS"
            sectionId="resources"
            meta="Open-source repositories & artifacts"
          />

          <div className="flex flex-wrap items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackExternalProjectLink("GitHub Repo", project.slug)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs transition-colors"
              >
                <GithubIcon className="w-4 h-4 text-white/70" />
                <span>View Source Repository</span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackExternalProjectLink("Live Demo", project.slug)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 hover:text-white font-mono text-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Interactive Demo</span>
              </a>
            )}

            {caseStudy?.links?.map((link) => (
              <a
                key={link.label + link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackExternalProjectLink(link.label, project.slug)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white font-mono text-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-violet-400" />
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3 text-white/40" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ─── 11 RELATED WORK & SYSTEMS ─────────────────────────────────────── */}
      {relatedProjects.length > 0 && (
        <section id="related-systems" className="space-y-6 scroll-mt-24" aria-label="Related systems">
          <SectionPlate
            index="10"
            title="RELATED ARCHITECTURES"
            sectionId="related-systems"
            meta="Other production builds"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedProjects.map((rel) => (
              <Link
                key={rel.id}
                href={`/projects/${rel.slug}`}
                className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.08] hover:border-violet-500/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-violet-400 uppercase font-bold tracking-wider">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    {rel.title}
                  </h4>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-white/50 group-hover:text-white transition-colors">
                  <span>Explore Build</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── 12 FINAL CASE STUDY CTA ───────────────────────────────────────── */}
      <section className="rounded-3xl bg-gradient-to-br from-[#0e1322] to-[#070912] border border-violet-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs font-bold text-violet-400 uppercase tracking-widest">
            Ready to Build a Resilient System?
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Let&apos;s engineer a customized AI automation workflow for your business.
          </h3>
          <p className="text-sm text-white/70 font-sans">
            Clear deliverables, deterministic execution logic, and full source code ownership.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            onClick={() => trackCaseStudyCta("Start a Project", project.slug)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-violet-600/30"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs transition-colors"
          >
            <span>Browse All Builds</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
