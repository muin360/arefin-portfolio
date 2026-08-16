import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/fetch";
import {
  allProjectsQuery,
  projectBySlugQuery,
  projectSlugsQuery,
} from "@/sanity/queries";
import type { ProjectDoc } from "@/sanity/types";
import { FALLBACK_PROJECTS } from "@/data/fallbacks";
import { createElement } from "react";
import { iconFor } from "@/components/IconRegistry";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import BentoCard from "@/components/BentoCard";
import { IconArrow } from "@/components/icons";
import type { IconName } from "@/sanity/schemaTypes/shared";

// Render an icon by name without ever binding the looked-up component to
// a local variable — `react-hooks/static-components` flags variable
// assignment, but `createElement` is fine here because we never alias the
// component itself.
function renderIcon(name: IconName, size: number, className?: string) {
  return createElement(iconFor(name), { width: size, height: size, className });
}

// Pre-render every project at build time, then revalidate on webhook.
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: projectSlugsQuery,
    tags: ["project"],
  });
  const live = slugs ?? [];
  const fallback = FALLBACK_PROJECTS.map((p) => p.slug);
  // Union so the fallback projects also pre-render at build time when
  // Sanity is empty / not configured. Dedup keeps the array tight.
  const all = Array.from(new Set([...live, ...fallback]));
  return all.map((slug) => ({ slug }));
}

async function getProject(slug: string): Promise<ProjectDoc | null> {
  const live = await sanityFetch<ProjectDoc | null>({
    query: projectBySlugQuery,
    params: { slug },
    tags: ["project", `project:${slug}`],
  });
  if (live) return live;
  // Fallback to in-repo data so /projects/<slug> always renders.
  return FALLBACK_PROJECTS.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
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
  const [project, allProjectsLive] = await Promise.all([
    getProject(slug),
    sanityFetch<ProjectDoc[]>({
      query: allProjectsQuery,
      tags: ["project"],
    }),
  ]);
  if (!project) notFound();

  const all =
    allProjectsLive && allProjectsLive.length > 0
      ? allProjectsLive
      : FALLBACK_PROJECTS;
  const related = all
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow={`Project Breakdown · ${project.category}`}
        index="05"
        meta={project.stack.join(" · ")}
        title={<>{project.title}</>}
        subtitle={project.summary}
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 section relative">
          {project.outcome && (
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10 mb-12">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-3">
                  Project Goal &amp; Learning Focus
                </p>
                <p className="display text-2xl md:text-4xl text-white leading-tight">
                  <span className="serif iridescent">{project.outcome}</span>
                </p>
              </div>
            </Reveal>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Reveal>
              <BentoCard className="h-full">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3">
                  Use Case &amp; Problem
                </p>
                <p className="text-white/80 leading-relaxed">
                  Repetitive manual tasks, delayed responses, or fragmented data across tools causing operational friction.
                </p>
              </BentoCard>
            </Reveal>
            <Reveal delay={80}>
              <BentoCard className="h-full">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3">
                  Automation Logic
                </p>
                <p className="text-white/80 leading-relaxed">{project.summary}</p>
              </BentoCard>
            </Reveal>
            <Reveal delay={160}>
              <BentoCard className="h-full">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3">
                  Key Takeaway
                </p>
                <p className="text-white/80 leading-relaxed">
                  {project.outcome ??
                    "Tested and verified workflow logic with error handling."}
                </p>
              </BentoCard>
            </Reveal>
          </div>

          <Reveal delay={240}>
            <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3">
                    Technologies Used
                  </p>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-mono text-white/65">
                    {project.stack.map((s) => (
                      <span key={s}>· {s}</span>
                    ))}
                  </div>
                </div>
                {renderIcon(project.iconName, 48, "text-white/70 shrink-0")}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

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
              {related.map((p) => {
                return (
                  <Reveal key={p._id}>
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
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="hero-dark relative overflow-hidden">
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 relative text-center">
          <h2 className="display text-3xl md:text-5xl text-white">
            Have a workflow{" "}
            <span className="serif iridescent">you&rsquo;d like to automate?</span>
          </h2>
          <p className="mt-5 text-white/65 max-w-2xl mx-auto leading-relaxed">
            Free 30-min scoping conversation — let&rsquo;s explore what we can automate.
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
