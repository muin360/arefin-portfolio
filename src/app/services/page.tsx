import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import { allEngagementsQuery, allServicesQuery } from "@/sanity/queries";
import type { EngagementDoc, ServiceDoc } from "@/sanity/types";
import { FALLBACK_ENGAGEMENTS, FALLBACK_SERVICES } from "@/data/fallbacks";
import { iconFor } from "@/components/IconRegistry";
import { PageHeader } from "@/components/Section";
import { IconArrow, IconCheck } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "AI engineering services from Tensor: AI agents, workflow automation, GoHighLevel setup, custom LLM solutions and engineering audits. Engagement models, scope and pricing — operated by Arefin Muin.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Pricing — Tensor",
    description:
      "AI agents, workflow automation, GoHighLevel setup, custom LLM solutions and engineering audits. Engagement models and pricing.",
    url: "/services",
  },
};



const process = [
  {
    step: "01",
    title: "Discovery",
    body: "A short call to understand the business, the tools, and the bottleneck. Free, no pitch.",
  },
  {
    step: "02",
    title: "Audit & proposal",
    body: "I map the current workflow, identify the highest-ROI opportunities, and send a clear scope and price.",
  },
  {
    step: "03",
    title: "Build & test",
    body: "I build the system, share progress as I go, and run it against real data before going live.",
  },
  {
    step: "04",
    title: "Launch & support",
    body: "Once it's live, I document everything, train the team and stay reachable for iteration.",
  },
];

const engagement = [
  "Weekly progress updates with live links",
  "All work delivered in your accounts (you own everything)",
  "Documentation and Loom handoff at the end of every project",
  "Source code under a clear license, in your repo",
];

export default async function ServicesPage() {
  const [servicesRaw, engagementsRaw] = await Promise.all([
    sanityFetch<ServiceDoc[]>({
      query: allServicesQuery,
      tags: ["service"],
    }),
    sanityFetch<EngagementDoc[]>({
      query: allEngagementsQuery,
      tags: ["engagement"],
    }),
  ]);
  const services = servicesRaw && servicesRaw.length > 0 ? servicesRaw : FALLBACK_SERVICES;
  const engagements =
    engagementsRaw && engagementsRaw.length > 0 ? engagementsRaw : FALLBACK_ENGAGEMENTS;

  return (
    <>
      <PageHeader
        eyebrow="Tensor · Services"
        index="03"
        meta="Capabilities · Engagement models · Transparent pricing"
        title={
          <>
            Studio engagements for teams that want{" "}
            <span className="serif">leverage,</span> not headcount.
          </>
        }
        subtitle="Three ways to work with Tensor — sprint, build, or retainer. Pick what fits, or tell us what's slowing you down."
      />

      {/* ENGAGEMENTS — Sprint / Build / Retainer pricing tiers */}
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
                  Three ways to work{" "}
                  <span className="serif iridescent">with Tensor.</span>
                </h2>
              </div>
              <p className="text-white/60 max-w-sm leading-relaxed">
                Every engagement starts with a free 30-min discovery call.
                Pricing is transparent, scope is fixed, and you own everything.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {engagements.map((e, i) => (
              <Reveal key={e._id ?? e.tag} delay={i * 90}>
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
                      {(e.deliverables ?? []).map((d) => (
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

                    <Link
                      href="/contact"
                      className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all ${
                        e.featured
                          ? "bg-white text-foreground hover:bg-white/90 shimmer"
                          : "border border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      {e.ctaLabel ?? (e.featured ? "Start an engagement" : "Discuss this tier")}
                      <IconArrow width={14} height={14} />
                    </Link>
                  </div>
                </BentoCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES — what Tensor builds */}
      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section relative">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-5">
                  [ 02 ] Capabilities
                </p>
                <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                  What we{" "}
                  <span className="serif iridescent">build.</span>
                </h2>
              </div>
              <p className="text-white/60 max-w-sm leading-relaxed">
                Mix-and-match capabilities inside any engagement model.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map(({ iconName, title, description }, i) => {
              const Icon = iconFor(iconName);
              return (
              <Reveal key={title} delay={i * 60}>
                <BentoCard className="h-full">
                  <div className="h-full flex flex-col group">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 transition-all duration-500 group-hover:scale-110 group-hover:border-white/30">
                        <Icon width={24} height={24} className="text-white" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                        / {(i + 1).toString().padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-7 text-2xl tracking-tight font-medium text-white">
                      {title}
                    </h3>
                    <p className="mt-3 text-white/65 leading-relaxed flex-1">
                      {description}
                    </p>
                  </div>
                </BentoCard>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="hero-dark border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              Process
            </p>
            <h2 className="display text-3xl md:text-5xl text-white">
              Simple, deliberate,{" "}
              <span className="serif text-[1.04em] iridescent">no surprises.</span>
            </h2>
            <p className="mt-5 text-white/60 leading-relaxed">
              The same lightweight loop every project — built around clarity
              and tight feedback.
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

      <section className="hero-dark relative overflow-hidden">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-24 relative">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border border-white/10 bg-white/[0.03] backdrop-blur-md">
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
                Get started
              </p>
              <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                Tell us what&apos;s on{" "}
                <span className="serif text-[1.04em] iridescent">your plate.</span>
              </h2>
            </div>
            <Link
              href="/contact"
              className="btn-primary shimmer relative z-10 bg-white text-foreground border-white hover:bg-accent-1 hover:text-white hover:border-accent-1"
            >
              Start a project
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
