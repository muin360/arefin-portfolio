import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/db";
import type { IconName } from "@/lib/db/types";
import { createElement } from "react";
import { iconFor } from "@/components/IconRegistry";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import BentoCard from "@/components/BentoCard";
import { IconArrow } from "@/components/icons";

function renderIcon(name: IconName, size: number, className?: string) {
  return createElement(iconFor(name), { width: size, height: size, className });
}

export async function generateStaticParams() {
  const projects = await getProjects({ publishedOnly: true });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, { publishedOnly: true });
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — Arefin Mueen`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, { publishedOnly: true });
  if (!project) notFound();

  const allProjects = await getProjects({ publishedOnly: true });
  const related = allProjects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const defaultWorkflowSteps = [
    { step: "01", name: "Trigger", desc: "Webhook or scheduled event initiates the pipeline" },
    { step: "02", name: "Data Input", desc: "Payload parsing, schema validation, and normalization" },
    { step: "03", name: "AI Processing", desc: "LLM reasoning, classification, or context vector retrieval" },
    { step: "04", name: "Agent Decision", desc: "Confidence check and conditional routing logic" },
    { step: "05", name: "Tool / API", desc: "External service execution and structured data update" },
    { step: "06", name: "Output / Handoff", desc: "Notification dispatch or human-in-the-loop review" },
  ];

  const workflow =
    project.workflowSteps && project.workflowSteps.length > 0
      ? project.workflowSteps
      : defaultWorkflowSteps;

  return (
    <>
      <PageHeader
        eyebrow={`${project.projectType ?? "Personal AI Automation Project"} · ${project.category}`}
        index="05"
        meta={project.stack.join(" · ")}
        title={<>{project.title}</>}
        subtitle={project.summary}
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 section relative space-y-12">
          
          {/* PROBLEM & GOAL OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal>
              <BentoCard className="h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-pink-400" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                    The Problem
                  </p>
                </div>
                <p className="text-white/85 leading-relaxed">
                  {project.problem ||
                    "Repetitive manual tasks, delayed responses, or fragmented data across tools causing operational friction."}
                </p>
              </BentoCard>
            </Reveal>

            <Reveal delay={80}>
              <BentoCard className="h-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                    Project Goal
                  </p>
                </div>
                <p className="text-white/85 leading-relaxed">
                  {project.goal ||
                    "Build a reliable, automated pipeline to handle data transformations, reasoning, and tool execution automatically."}
                </p>
              </BentoCard>
            </Reveal>
          </div>

          {/* SIGNATURE WORKFLOW ARCHITECTURE */}
          <Reveal delay={120}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 mb-1">
                    System Architecture
                  </p>
                  <h3 className="display text-xl md:text-2xl text-white">
                    Workflow Execution Flow
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-white/40 tracking-wider">
                  TRIGGER → AI → TOOLS → DECISION → OUTPUT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflow.map((st, idx) => (
                  <div
                    key={st.step}
                    className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] relative group hover:border-violet-400/30 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-violet-300/80">
                        Step {st.step}
                      </span>
                      {idx < workflow.length - 1 && (
                        <span className="text-white/20 text-xs hidden lg:inline" aria-hidden="true">
                          →
                        </span>
                      )}
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1.5">{st.name}</h4>
                    <p className="text-white/60 text-xs leading-relaxed">{st.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* AI ROLE & AUTOMATION LOGIC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Reveal delay={160}>
              <BentoCard className="h-full">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3">
                  AI Role &amp; Processing
                </p>
                <p className="text-white/80 leading-relaxed text-sm">
                  {project.aiRole ||
                    "LLM handles intent parsing, unstructured context extraction, and dynamic output formatting with structured schema guardrails."}
                </p>
              </BentoCard>
            </Reveal>

            <Reveal delay={200}>
              <BentoCard className="h-full">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3">
                  Automation Logic &amp; Connectors
                </p>
                <p className="text-white/80 leading-relaxed text-sm">
                  {project.automationLogic || project.summary}
                </p>
              </BentoCard>
            </Reveal>
          </div>

          {/* LEARNING OUTCOME */}
          <Reveal delay={240}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-3">
                    What I Learned
                  </p>
                  <p className="display text-xl md:text-2xl text-white leading-snug">
                    <span className="serif text-white/90">
                      {project.learningOutcome ||
                        project.outcome ||
                        "Mastered end-to-end workflow debugging, edge case management, and API error resilience."}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 mb-2">
                    Technologies Used
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/70"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      View GitHub Repo →
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/40 text-white transition-colors"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* RELATED PROJECTS */}
      {related.length > 0 && (
        <section className="border-b border-line">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 section">
            <Reveal>
              <div className="flex items-end justify-between gap-6 mb-10">
                <h2 className="display text-3xl md:text-4xl">
                  More <span className="serif">practical projects.</span>
                </h2>
                <Link
                  href="/projects"
                  className="hover-arrow text-sm text-muted hover:text-foreground"
                >
                  <span className="link-underline">All projects</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Reveal key={p.id}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="block h-full rounded-3xl border border-line bg-surface p-8 transition-all duration-300 hover:border-foreground/30"
                  >
                    <div className="flex items-start justify-between">
                      {renderIcon(p.iconName, 28, "text-foreground")}
                      <span className="chip">{p.category}</span>
                    </div>
                    <h3 className="mt-8 text-xl md:text-2xl tracking-tight font-medium">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3">
                      {p.summary}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BOTTOM CTA */}
      <section className="hero-dark relative overflow-hidden">
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 relative text-center">
          <h2 className="display text-3xl md:text-5xl text-white">
            Have a workflow{" "}
            <span className="serif iridescent">you&rsquo;d like to automate?</span>
          </h2>
          <p className="mt-5 text-white/65 max-w-2xl mx-auto leading-relaxed">
            Free discovery scoping conversation — let&rsquo;s explore what we can automate.
          </p>
          <div className="mt-8">
            <Link href="/contact" className="btn-primary shimmer">
              Let&rsquo;s build an automation
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
