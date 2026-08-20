import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug, getServices } from "@/lib/db";
import ProjectLightbox from "@/components/ProjectLightbox";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import BuildExplorer from "@/components/BuildExplorer";
import {
  Workflow,
  Layers,
  ArrowRight,
  ExternalLink,
  Code2,
  Brain,
  CheckCircle2,
} from "lucide-react";

export async function generateStaticParams() {
  const projects = await getProjects({ publishedOnly: true });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : undefined;
  const isPreview = sParams?.preview === "true";

  const project = await getProjectBySlug(slug, { publishedOnly: !isPreview });
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.title}${isPreview ? " (Draft Preview)" : ""}`,
    description: project.summary,
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — Arefin Mueen`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      type: "article",
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const sParams = searchParams ? await searchParams : undefined;
  const isPreview = sParams?.preview === "true";

  const project = await getProjectBySlug(slug, { publishedOnly: !isPreview });
  if (!project) notFound();

  const [allProjects, allServices] = await Promise.all([
    getProjects({ publishedOnly: true }),
    getServices({ publishedOnly: true }),
  ]);

  const relatedProjects = allProjects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const relatedService = allServices.find((s) =>
    project.relatedServiceIds?.includes(s.id)
  );

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

  const galleryImages = (project.gallery || []).map((src, i) => ({
    src,
    alt: `${project.title} interface log ${i + 1}`,
    caption: project.captions?.[i] || `${project.title} execution trace ${i + 1}`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.summary,
    author: {
      "@type": "Person",
      name: "Arefin Mueen",
      url: "https://tensorstudio.vercel.app",
    },
    publisher: {
      "@type": "Person",
      name: "Arefin Mueen",
    },
    about: {
      "@type": "SoftwareApplication",
      name: project.title,
      applicationCategory: project.category,
    },
  };

  return (
    <article className="min-h-screen pb-24">
      {isPreview && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-300 py-2.5 px-4 text-center font-mono text-xs font-semibold flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>ADMIN PREVIEW MODE — This draft is not indexed and is visible only in preview.</span>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── 01 HERO SECTION ─────────────────────────────────────────────── */}
      <section className="pt-10 pb-16 sm:py-20 border-b border-white/[0.08]" aria-label="Project Hero">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionPlate
            index="CASE STUDY"
            title={project.category.toUpperCase()}
            meta={project.projectType || "AI Automation System"}
            action={
              <Link
                href="/projects"
                className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
              >
                <span>← All Work</span>
              </Link>
            }
          />

          <div className="max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans max-w-3xl">
              {project.summary}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs text-white/50">
              <span className="text-violet-400 font-semibold uppercase">Role:</span>
              <span>End-to-End System Architecture, AI Prompts &amp; API Integration</span>
            </div>
          </div>

          {/* COVER MEDIA (Cinematic 16:9) */}
          <div className="relative w-full h-64 sm:h-96 md:h-[500px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0f18] shadow-2xl">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.altText || `${project.title} cover architecture`}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#121622] to-[#07090e] text-center">
                <Workflow className="w-12 h-12 text-violet-400 mb-3 opacity-80" />
                <span className="text-sm font-mono text-white/70 tracking-wider">
                  {project.category} · System Visualization
                </span>
                <p className="mt-1 text-xs text-white/40 max-w-md">
                  {project.title}
                </p>
              </div>
            )}
          </div>

          {/* Action Links + Tech Stack */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {(project.stack || []).map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded bg-[#121622] border border-white/5 text-[11px] text-white/70"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {workflow.length > 0 && (
                <a
                  href="#execution-pipeline"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-white border border-white/10 transition-colors"
                >
                  <Workflow className="w-3.5 h-3.5 text-violet-400" />
                  <span>Explore Architecture</span>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121622] hover:bg-[#181e2e] text-white border border-white/10 transition-colors"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/50" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-white border border-violet-400/40 transition-colors"
                >
                  <span>Live Interactive Demo</span>
                  <ExternalLink className="w-3.5 h-3.5 text-violet-300" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 CONTEXT, PROBLEM & SOLUTION ──────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]" aria-label="Problem and Solution">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionPlate
            index="01"
            title="THE PROBLEM &amp; SOLUTION"
            meta="operational friction vs automated architecture"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* The Operational Problem */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="uppercase tracking-widest">The Problem</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Manual friction &amp; operational lag
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                  {project.problem ||
                    "Manual data re-entry, delayed inquiry resolution, and lack of structured validation causing operational overhead."}
                </p>
              </div>
            </div>

            {/* The Engineered Solution */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0f18] border border-violet-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-semibold mb-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400" />
                  <span className="uppercase tracking-widest">The Solution</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Automated reasoning &amp; execution pipeline
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                  {project.goal ||
                    "An event-driven pipeline orchestrating LLM reasoning, schema validation, and tool execution with deterministic fallbacks."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 03 WORKFLOW SYSTEM ARCHITECTURE / BUILD EXPLORER ───────────── */}
      <section
        id="execution-pipeline"
        className="py-16 sm:py-20 border-b border-white/[0.08]"
        aria-label="Workflow Architecture"
      >
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionPlate
            index="02"
            title="EXECUTION PIPELINE"
            meta="interactive node-by-node architecture trace"
          />

          <BuildExplorer
            workflowSteps={workflow}
            projectTitle={project.title}
            projectSlug={project.slug}
          />

          {/* Workflow Diagram Image if available */}
          {project.workflowImage && (
            <div className="mt-6 rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-violet-400">
                <Workflow className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider">
                  Visual Workflow Map
                </span>
              </div>
              <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden border border-white/10 bg-[#060810]">
                <Image
                  src={project.workflowImage}
                  alt={`${project.title} workflow diagram`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 04 AI ROLE & AUTOMATION LOGIC ───────────────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]" aria-label="AI Role">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionPlate
            index="03"
            title="AI ROLE &amp; LOGIC"
            meta="where intelligence is applied"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-violet-400 mb-2">
                <Brain className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider">
                  AI Role &amp; Processing
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                {project.aiRole ||
                  "LLM handles intent parsing, unstructured context extraction, and dynamic output formatting with structured schema guardrails."}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-violet-400 mb-2">
                <Code2 className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider">
                  Automation Logic &amp; Connectors
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                {project.automationLogic || project.summary}
              </p>
            </div>
          </div>

          {/* Architecture Diagram if available */}
          {project.architectureImage && (
            <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-6 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-violet-400">
                <Layers className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider">
                  Infrastructure &amp; Tool Architecture
                </span>
              </div>
              <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden border border-white/10 bg-[#060810]">
                <Image
                  src={project.architectureImage}
                  alt={`${project.title} architecture diagram`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 05 MEDIA SHOWCASE / GALLERY ─────────────────────────────────── */}
      {galleryImages.length > 0 && (
        <section className="py-16 sm:py-20 border-b border-white/[0.08]" aria-label="Gallery">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <SectionPlate
              index="04"
              title="MEDIA SHOWCASE"
              meta="interface logs &amp; execution traces (click to enlarge)"
            />

            <ProjectLightbox images={galleryImages} />
          </div>
        </section>
      )}

      {/* ─── 06 WHAT I LEARNED / ENGINEERING OUTCOME ─────────────────────── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]" aria-label="Learnings">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionPlate
            index="05"
            title="WHAT I LEARNED"
            meta="developer reflections &amp; edge case insights"
          />

          <div className="p-6 sm:p-10 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-violet-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold uppercase tracking-wider">
                Engineering Takeaways
              </span>
            </div>

            <p className="text-base sm:text-xl text-white/90 leading-relaxed font-serif italic max-w-3xl">
              &ldquo;{project.learningOutcome ||
                project.outcome ||
                "Mastered end-to-end workflow debugging, edge case management, rate-limiting recoveries, and schema validation resilience."}&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ─── 07 CONNECTED SYSTEM BLUEPRINTS & RELATED WORK ───────────────── */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]" aria-label="Related Work">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionPlate
            index="06"
            title="CONNECTED WORK"
            meta="related capability blueprints &amp; projects"
          />

          {/* Related Capability Blueprint Banner */}
          {relatedService && (
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0f18] border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-semibold block mb-1">
                  Related Capability
                </span>
                <h4 className="text-lg font-bold text-white">
                  {relatedService.title}
                </h4>
                <p className="text-xs text-white/60 mt-1 max-w-xl font-sans">
                  {relatedService.hook || relatedService.solution}
                </p>
              </div>
              <Button href="/services" variant="secondary" size="md">
                <span>Explore Capabilities</span>
              </Button>
            </div>
          )}

          {/* 3 Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p, idx) => (
                <div
                  key={p.slug || p.id}
                  className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 p-6 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                      <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">
                        {p.category}
                      </span>
                      <span className="text-white/30 font-bold">0{idx + 1}</span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                      <Link href={`/projects/${p.slug}`}>
                        {p.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed font-sans">
                      {p.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <span className="text-[10px] text-white/40">
                      {p.stack?.[0] || "AI System"}
                    </span>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 text-violet-300 hover:text-white transition-colors"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 08 FINAL PROJECT CTA ────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 text-center" aria-label="Scoping CTA">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-14 relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Have a similar workflow{" "}
                <span className="serif italic text-violet-300">worth automating?</span>
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans font-normal">
                Let&rsquo;s map your manual processes and build autonomous AI agents or reliable API pipelines under your 100% ownership.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Let&rsquo;s Build an Automation
                </Button>

                <Button href="/projects" variant="secondary" size="lg">
                  View More Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
