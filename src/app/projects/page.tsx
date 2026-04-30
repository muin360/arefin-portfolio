import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import { allProjectsQuery } from "@/sanity/queries";
import type { ProjectDoc } from "@/sanity/types";
import { FALLBACK_PROJECTS } from "@/data/fallbacks";
import { iconFor } from "@/components/IconRegistry";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { IconArrow } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import TiltCard from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected automation and AI-agent systems built by Tensor for clients and engagements across the US, EU and APAC — lead qualification, booking bots, content pipelines, knowledge bases and outreach systems.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Selected Work — Tensor",
    description:
      "Selected automation and AI-agent systems built by Tensor for clients across the US, EU and APAC.",
    url: "/projects",
  },
};

export default async function ProjectsPage() {
  const raw = await sanityFetch<ProjectDoc[]>({
    query: allProjectsQuery,
    tags: ["project"],
  });
  const projects = raw && raw.length > 0 ? raw : FALLBACK_PROJECTS;

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        index="05"
        meta="Case studies · Editorial"
        title={
          <>
            Systems that{" "}
            <span className="serif">do the work,</span>
            <br />
            so the team doesn&apos;t.
          </>
        }
        subtitle="A selection of automations and AI agents Tensor has put into production. Case studies are anonymized — we share specifics on a call."
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {projects.map(({ iconName, title, summary, stack, category, outcome }, i) => {
              const Icon = iconFor(iconName);
              // Asymmetric editorial layout
              const spans = [
                "md:col-span-7",
                "md:col-span-5",
                "md:col-span-5",
                "md:col-span-7",
                "md:col-span-7",
                "md:col-span-5",
              ];
              const span = spans[i] || "md:col-span-6";
              return (
                <Reveal key={title} delay={i * 70} className={span}>
                  <TiltCard className="h-full rounded-3xl">
                    <BentoCard className="h-full">
                      <Link href="/contact" className="block h-full">
                        <div className="h-full flex flex-col group">
                          <div className="flex items-start justify-between gap-4">
                            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10">
                              <Icon width={24} height={24} className="text-white" />
                            </span>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="font-mono uppercase tracking-[0.18em] text-white/40">
                                / {(i + 1).toString().padStart(2, "0")}
                              </span>
                              <span className="tag-pill">{category}</span>
                            </div>
                          </div>
                          <h2 className="display text-2xl md:text-3xl tracking-tight text-white mt-7 line-draw inline-block pb-1">
                            {title}
                          </h2>
                          <p className="mt-4 text-white/65 max-w-xl leading-relaxed flex-1">
                            {summary}
                          </p>
                          {outcome && (
                            <p className="mt-4 inline-flex items-start gap-2 text-sm">
                              <span className="w-6 h-px bg-[var(--accent-1)] mt-2.5" />
                              <span className="text-white/85 italic serif text-base">
                                {outcome}
                              </span>
                            </p>
                          )}
                          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono text-white/45">
                            {stack.map((s) => (
                              <span key={s}>· {s}</span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </BentoCard>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="mt-20 relative rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden="true">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(800px circle at 30% 20%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(700px circle at 80% 80%, rgba(236,72,153,0.30), transparent 60%)",
                  }}
                />
              </div>
              <div className="relative">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
                  [ Next project ]
                </p>
                <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                  Want a system like one of{" "}
                  <span className="serif iridescent">these?</span>
                </h2>
              </div>
              <Link href="/contact" className="btn-primary shimmer relative z-10 bg-white text-foreground border-white">
                Start a project
                <IconArrow width={16} height={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
