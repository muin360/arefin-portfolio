import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAboutData, getSiteSettings, getProjects } from "@/lib/db";
import { PageHeader } from "@/components/Section";
import { IconArrow } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import Reveal from "@/components/Reveal";
import ProfilePortrait from "@/components/ProfilePortrait";
import { ArrowRight, Sparkles, CheckCircle2, Workflow, Code, Bot, Zap, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Arefin Mueen",
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
  const [about, settings, projects] = await Promise.all([
    getAboutData(),
    getSiteSettings(),
    getProjects({ publishedOnly: true }),
  ]);

  const skillsList = [
    {
      category: "AI & Autonomous Agents",
      icon: Bot,
      items: ["LangChain", "Langflow", "OpenAI & Anthropic APIs", "RAG Systems", "Vector Embeddings", "Multi-Agent Systems"],
    },
    {
      category: "Workflow Automation",
      icon: Workflow,
      items: ["n8n (Self-hosted & Cloud)", "Make / Integromat", "Zapier", "Webhooks & HTTP Nodes", "Error Handling & Retry Loops"],
    },
    {
      category: "Development & Data",
      icon: Code,
      items: ["Python", "JavaScript / TypeScript", "REST APIs & JSON", "MongoDB Atlas", "Pinecone", "Git & CI/CD"],
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Arefin Mueen · About"
        index="05"
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

      {/* PORTRAIT & STORY CHAPTER */}
      <section className="hero-dark relative overflow-hidden border-b border-white/5 py-16 sm:py-24">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          {/* Left: Orbital Portrait System */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <ProfilePortrait
              profileImage={settings.profileImage}
              name={settings.name}
              role={settings.role}
              availabilityNote={settings.availabilityNote}
            />
          </div>

          {/* Right: Narrative Story */}
          <div className="lg:col-span-7 space-y-6 text-base sm:text-lg leading-relaxed text-white/80">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
              My story &amp; <span className="serif text-violet-300 italic">engineering philosophy.</span>
            </h3>
            {about.story.map((p, idx) => (
              <p key={idx} className="leading-relaxed font-sans">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* NOW BUILDING & CURRENT FOCUS */}
      {settings.nowBuildingTitle && (
        <section className="hero-dark relative overflow-hidden border-b border-white/5 py-16">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-[#0e1326] via-[#090c18] to-[#070911] border border-violet-500/30 p-8 sm:p-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-violet-300 uppercase">
                  CURRENT ACTIVE FOCUS
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {settings.nowBuildingTitle}
              </h3>
              <p className="mt-2 text-sm text-white/70 max-w-3xl leading-relaxed">
                {settings.nowBuildingDescription}
              </p>

              {settings.nowBuildingFocus && settings.nowBuildingFocus.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {settings.nowBuildingFocus.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-xs font-mono text-violet-400 font-bold block mb-1">
                        Focus 0{i + 1}
                      </span>
                      <p className="text-xs text-white/80 leading-snug">{f}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* INTEGRATED TECHNICAL SKILLS */}
      <section className="hero-dark relative overflow-hidden border-b border-white/5 py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-3">
                [ Toolchain ] Core Technical Stack
              </p>
              <h2 className="display text-3xl md:text-5xl text-white">
                Technologies I <span className="serif iridescent">engineer with.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillsList.map((sk, idx) => {
              const Icon = sk.icon;
              return (
                <Reveal key={sk.category} delay={idx * 80}>
                  <BentoCard className="h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-violet-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{sk.category}</h3>
                    </div>
                    <ul className="space-y-2 text-xs font-mono text-white/70">
                      {sk.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </BentoCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CORE PRINCIPLES */}
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

      {/* FINAL CTA */}
      <section className="hero-dark relative overflow-hidden py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="display text-3xl md:text-5xl text-white">
            Let&rsquo;s talk about <span className="serif iridescent">your workflows.</span>
          </h2>
          <p className="mt-4 text-white/65 max-w-xl mx-auto text-sm sm:text-base">
            Free 30-min discovery scoping conversation — let&rsquo;s map what we can automate.
          </p>
          <div className="mt-8">
            <Link href="/contact" className="btn-primary shimmer">
              Let&rsquo;s Build an Automation
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
