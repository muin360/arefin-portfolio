import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getProjects } from "@/lib/db";
import { iconFor } from "@/components/IconRegistry";
import { PageHeader } from "@/components/Section";
import { IconArrow, IconCheck } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import Reveal from "@/components/Reveal";
import { ArrowRight, Sparkles, Workflow } from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description:
    "AI automation, autonomous agents, RAG knowledge retrieval, and multi-agent workflows built with n8n, LangChain, Langflow, and APIs.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Capabilities — Arefin Mueen",
    description:
      "AI automation, autonomous agents, RAG systems, and multi-agent workflows.",
    url: "/services",
  },
};

const engagements = [
  {
    tag: "Audit",
    name: "Discovery & Scoping",
    cadence: "1–2 days",
    summary:
      "30-min call + written automation roadmap identifying bottlenecks and potential AI implementations.",
    price: "Free",
    deliverables: [
      "Workflow bottleneck review",
      "Feasibility and toolchain assessment",
      "Architecture diagram & written scope",
    ],
    ideal: "For teams exploring whether a workflow can be automated.",
    ctaLabel: "Book Free Audit",
    featured: false,
  },
  {
    tag: "Workflow Sprint",
    name: "Single Workflow Build",
    cadence: "1–2 weeks",
    summary:
      "One end-to-end automation built, tested, and handed over under your accounts.",
    price: "Project-based",
    deliverables: [
      "Custom n8n / Make / Python pipeline",
      "API connections & prompt tuning",
      "Error handling and Slack alerts",
      "Handover video + docs",
    ],
    ideal: "For a single high-priority manual process that needs automation.",
    ctaLabel: "Discuss a Workflow",
    featured: true,
  },
  {
    tag: "Custom System",
    name: "AI Agent / RAG System",
    cadence: "2–4 weeks",
    summary:
      "Custom tool-calling agent, RAG knowledge retrieval pipeline, or multi-agent system.",
    price: "Custom quote",
    deliverables: [
      "Full agent / RAG architecture",
      "Vector indexing & chunking logic",
      "Evaluation against test queries",
      "Complete deployment & ownership",
    ],
    ideal: "For businesses wanting an intelligent assistant over internal knowledge.",
    ctaLabel: "Explore Agent Build",
    featured: false,
  },
  {
    tag: "Ongoing Support",
    name: "Maintenance & Iteration",
    cadence: "Monthly",
    summary:
      "Ongoing monitoring, edge-case fixes, and incremental workflow updates.",
    price: "Custom quote",
    deliverables: [
      "Workflow health monitoring",
      "Prompt tweaks & LLM updates",
      "Direct async developer access",
      "Monthly performance review",
    ],
    ideal: "For businesses wanting ongoing support as workflows expand.",
    ctaLabel: "Inquire on Support",
    featured: false,
  },
];

const process = [
  {
    step: "01",
    title: "Discovery & Scoping — free 30 min",
    body: "A focused conversation to understand your workflow, map repetitive tasks, and identify what can be automated.",
  },
  {
    step: "02",
    title: "Workflow Blueprint",
    body: "Architecture, trigger events, LLM prompts, and tool connections written down clearly before building.",
  },
  {
    step: "03",
    title: "Build & Test",
    body: "Configuring workflows in n8n/LangChain, setting up prompts and error handlers, and running test payloads.",
  },
  {
    step: "04",
    title: "Handover & Walkthrough",
    body: "Full video walkthrough, documentation, and handover under your own accounts so you own 100% of the setup.",
  },
];

const engagement = [
  "All workflows, scripts, and accounts hosted in your name — you own 100%",
  "Clear workflow logic and error handling configured",
  "Documented setup instructions and walkthrough video included",
  "Post-launch testing and verification",
  "Direct, responsive communication throughout the build",
  "Practical focus on solving real operational bottlenecks",
];

export default async function ServicesPage() {
  const [services, projects] = await Promise.all([
    getServices({ publishedOnly: true }),
    getProjects({ publishedOnly: true }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Arefin Mueen · Capabilities"
        index="03"
        meta="AI Automation · AI Agents · RAG · Workflows"
        title={
          <>
            Practical AI automations,
            <br />
            <span className="serif">built to solve real work.</span>
          </>
        }
        subtitle="I design and build AI-powered workflows, autonomous agents, RAG knowledge assistants, and custom integrations using n8n, LangChain, Langflow, and LLM APIs."
      />

      {/* ENGAGEMENTS */}
      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section relative">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-5">
                  [ 01 ] Engagement models
                </p>
                <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                  Four ways to{" "}
                  <span className="serif iridescent">engage me.</span>
                </h2>
              </div>
              <p className="text-white/60 max-w-sm leading-relaxed">
                Every engagement starts with a free 30-min systems audit.
                Scope and pricing are quoted in writing before any build.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {engagements.map((e, i) => (
              <Reveal key={e.name} delay={i * 90}>
                <BentoCard className={`h-full ${e.featured ? "bento-spin" : ""}`}>
                  <div className="h-full flex flex-col">
                    <div className="flex items-start justify-between">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border ${
                          e.featured
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-white/15 bg-white/[0.03] text-white/70"
                        }`}
                      >
                        {e.tag}
                        {e.featured && " · most popular"}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                        / {(i + 1).toString().padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="mt-7 text-2xl tracking-tight font-medium text-white">
                      {e.name}
                    </h3>
                    <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                      {e.cadence}
                    </p>

                    <p className="mt-5 text-sm text-white/65 leading-relaxed">
                      {e.summary}
                    </p>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="display text-3xl md:text-4xl text-white tracking-tight">
                        {e.price}
                      </p>
                    </div>

                    <ul className="mt-6 space-y-2.5 text-sm text-white/75 flex-1">
                      {e.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2.5">
                          <IconCheck width={16} height={16} className="text-white/55 mt-1 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    {e.ideal && (
                      <p className="mt-6 pt-5 border-t border-white/10 text-xs text-white/50 leading-relaxed italic">
                        {e.ideal}
                      </p>
                    )}

                    <a
                      href={`https://wa.me/8801994605717?text=${encodeURIComponent(
                        `Hi Arefin! I'd like to discuss the "${e.name}" workflow. Here's a quick overview of what I need: `,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all ${
                        e.featured
                          ? "bg-white text-[#04040a] hover:bg-white/90 shimmer"
                          : "border border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      {e.ctaLabel}
                      <IconArrow width={14} height={14} />
                    </a>
                  </div>
                </BentoCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES (FROM DB) */}
      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section relative">
          <Reveal>
            <div className="mb-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-3">
                [ 02 ] Core Capabilities
              </p>
              <h2 className="display text-3xl md:text-5xl text-white">
                What I <span className="serif iridescent">build.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc, i) => {
              const Icon = iconFor(svc.iconName);
              // Find matching projects for this service
              const matchingProjects = projects.filter(
                (p) =>
                  p.category.toLowerCase().includes(svc.title.toLowerCase()) ||
                  svc.title.toLowerCase().includes(p.category.toLowerCase()) ||
                  (p.stack && p.stack.some((s) => svc.bullets.some((b) => b.includes(s)))),
              ).slice(0, 2);

              return (
                <Reveal key={svc.id} delay={i * 80}>
                  <BentoCard className="h-full">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                        <Icon width={24} height={24} />
                      </div>
                      <span className="font-mono text-xs text-white/40">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{svc.title}</h3>
                    <p className="text-white/70 text-sm mb-4 leading-relaxed">{svc.hook}</p>
                    
                    <div className="text-xs text-white/60 space-y-2 pt-4 border-t border-white/10">
                      <p>
                        <strong className="text-white/80">Problem:</strong> {svc.problem}
                      </p>
                      <p>
                        <strong className="text-white/80">Solution:</strong> {svc.solution}
                      </p>
                      <p>
                        <strong className="text-white/80">Outcome:</strong> {svc.outcome}
                      </p>
                    </div>

                    <ul className="mt-4 space-y-1.5 text-xs text-white/70">
                      {svc.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="text-violet-400">✓</span> {b}
                        </li>
                      ))}
                    </ul>

                    {/* RELATED CASE STUDIES LINK */}
                    {matchingProjects.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-white/10">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-violet-300 mb-2 font-semibold">
                          Live Examples
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {matchingProjects.map((mp) => (
                            <Link
                              key={mp.id}
                              href={`/projects/${mp.slug}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-violet-600/20 border border-white/10 text-[11px] font-mono text-white/70 hover:text-white transition-colors"
                            >
                              <span>{mp.title}</span>
                              <ArrowRight className="w-3 h-3 text-violet-400" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <a
                        href={`https://wa.me/8801994605717?text=${encodeURIComponent(
                          svc.ctaPrefill || `Hi Arefin! I'd like to discuss ${svc.title}: `,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono text-violet-400 hover:text-violet-300 font-semibold"
                      >
                        {svc.ctaLabel || "Let's build an automation"} →
                      </a>
                    </div>
                  </BentoCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="hero-dark border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              Process
            </p>
            <h2 className="display text-3xl md:text-5xl text-white">
              Audit → Blueprint{" "}
              <span className="serif text-[1.04em] iridescent">→ Build → Launch.</span>
            </h2>
            <p className="mt-5 text-white/60 leading-relaxed">
              The same four-step loop on every engagement. Acceptance
              criteria up-front and launch support after go-live.
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 70}>
                <BentoCard className="h-full">
                  <div>
                    <p className="font-mono text-[11px] tabular-nums text-white/45 tracking-[0.16em]">
                      {p.step}
                    </p>
                    <h3 className="mt-2 text-lg font-medium tracking-tight text-white">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/65 leading-relaxed">
                      {p.body}
                    </p>
                  </div>
                </BentoCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <p className="eyebrow mb-5">What you get</p>
          <h2 className="display text-3xl md:text-5xl">
            Every engagement{" "}
            <span className="serif text-[1.04em]">includes.</span>
          </h2>
        </div>
        <div className="md:col-span-8">
          <ul className="divide-y divide-line border-y border-line">
            {engagement.map((line) => (
              <li
                key={line}
                className="flex items-start gap-4 py-5 text-foreground/85"
              >
                <IconCheck
                  width={20}
                  height={20}
                  className="text-foreground mt-0.5 shrink-0"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="hero-dark relative overflow-hidden">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-24 relative">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border border-white/10 bg-white/[0.03] backdrop-blur-md">
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
                Get started
              </p>
              <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                Start with a{" "}
                <span className="serif text-[1.04em] iridescent">free systems audit.</span>
              </h2>
              <p className="mt-4 text-white/65 max-w-md">
                30 minutes. I&rsquo;ll map your workflows and share a written
                recommendation. No obligation either way.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-primary shimmer relative z-10 bg-white text-[#04040a] border-white hover:bg-accent-1 hover:text-white hover:border-accent-1"
            >
              Book a free systems audit
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
