import type { Metadata } from "next";
import Link from "next/link";
import { getAboutData } from "@/lib/db";
import { PageHeader } from "@/components/Section";
import { IconArrow } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hi, I'm Arefin Mueen — an AI Automation & AI Agent Developer. I build practical AI agents, RAG systems, multi-agent workflows, and business automations.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Arefin Mueen",
    description:
      "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const about = await getAboutData();

  return (
    <>
      <PageHeader
        eyebrow="Arefin Mueen · About"
        index="02"
        meta="AI Automation & AI Agent Developer"
        title={
          <>
            Hi, I&rsquo;m Arefin.
            <br />
            I build <span className="serif">AI systems</span> that automate real work.
          </>
        }
        subtitle={about.bio}
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              The developer
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Arefin Mueen<br />AI Automation &amp; AI Agent<br />Developer
            </p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg leading-relaxed text-white/80">
            {about.story.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* MINDSET & PRINCIPLES */}
      <section className="hero-dark relative overflow-hidden border-b border-white/5 py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-3">
                [ Principles ] How I work
              </p>
              <h2 className="display text-3xl md:text-5xl text-white">
                Core engineering <span className="serif iridescent">principles.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {about.principles.map((pr, idx) => (
              <Reveal key={pr.title} delay={idx * 80}>
                <BentoCard className="h-full">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-xs text-violet-400">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{pr.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{pr.desc}</p>
                </BentoCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE / MILESTONES */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 section">
        <Reveal>
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-3">Journey &amp; Milestones</p>
            <h2 className="display text-3xl md:text-5xl">
              How I got <span className="serif text-[1.04em]">here.</span>
            </h2>
          </div>
        </Reveal>

        <div className="divide-y divide-line border-y border-line">
          {about.experienceHighlights.map((m) => (
            <div key={m.title} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  {m.period}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-1">{m.title}</h3>
                <p className="text-xs text-muted mt-0.5">{m.organization}</p>
              </div>
              <div className="md:col-span-8">
                <p className="text-base text-foreground/80 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark relative overflow-hidden py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="display text-3xl md:text-5xl text-white">
            Let&rsquo;s talk about <span className="serif iridescent">your workflows.</span>
          </h2>
          <p className="mt-4 text-white/65 max-w-xl mx-auto">
            Free 30-min discovery scoping conversation — let&rsquo;s find out what we can automate.
          </p>
          <div className="mt-8">
            <Link href="/contact" className="btn-primary shimmer">
              Get in touch
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
