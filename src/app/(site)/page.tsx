import Link from "next/link";
import { getSiteSettings, getProjects, getAboutData, getBlogPosts } from "@/lib/db";

import SectionPlate from "@/components/SectionPlate";
import SprintTimeline from "@/components/SprintTimeline";
import Reveal from "@/components/Reveal";

import HeroSectionV2 from "@/components/v2/HeroSectionV2";
import BentoServices from "@/components/v2/BentoServices";
import ProjectsGridV2 from "@/components/v2/ProjectsGridV2";
import JournalGridV2 from "@/components/v2/JournalGridV2";
import FinalCtaV2 from "@/components/v2/FinalCtaV2";
import { ArrowRight, Sparkles, Code } from "lucide-react";

export default async function HomePage() {
  const [settings, projects, about, posts] = await Promise.all([
    getSiteSettings(),
    getProjects({ publishedOnly: true }),
    getAboutData(),
    getBlogPosts({ publishedOnly: true }),
  ]);

  const availabilityNote =
    settings.availabilityNote || "Open to automation & agent projects";

  return (
    <>
      {/* 01 HERO — Personal + Orbital Topology + LIVE LAB Support Card */}
      <HeroSectionV2
        availabilityNote={availabilityNote}
        profileImage={settings.profileImage}
        name={settings.name}
        role={settings.role}
        labTitle={settings.labTitle}
        labStatus={settings.labStatus}
        labInput={settings.labInput}
        labProcess={settings.labProcess}
        labOutput={settings.labOutput}
        labStack={settings.labStack}
        labLink={settings.labLink}
      />

      {/* 02 WHAT I BUILD — Capability System Pipeline */}
      <section
        id="services"
        className="v2-section py-16 sm:py-24"
        aria-label="Capabilities"
      >
        <div className="v2-container">
          <SectionPlate variant="system" />
          <h2 className="v2-section__head">
            Core capabilities,{" "}
            <em className="v2-section__head-em">focused on real work.</em>
          </h2>
          <p className="v2-section__sub">
            Practical AI automation workflows, autonomous agents, RAG knowledge bases, and multi-agent systems designed to solve real business bottlenecks.
          </p>
          <div className="v2-section__body mt-8">
            <Reveal delay={120}>
              <BentoServices />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 FEATURED WORK — 3-Tier Editorial Projects Hierarchy */}
      <section className="v2-section py-16 sm:py-24" aria-label="Selected projects">
        <div className="v2-container">
          <SectionPlate variant="work" />
          <div className="v2-section__top mb-8">
            <div>
              <h2 className="v2-section__head">
                AI automations that{" "}
                <em className="v2-section__head-em">do the work,</em>
                <br />
                so you don&rsquo;t.
              </h2>
            </div>
            <Link href="/projects" className="v2-section__more">
              <span>View all projects</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="v2-section__body">
            <Reveal delay={100} y={20}>
              <ProjectsGridV2 projects={projects} limit={5} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 04 HOW I BUILD — Flowing 6-Stage Process Pipeline */}
      <section className="v2-section v2-section--dark py-16 sm:py-24" aria-label="How it works">
        <div className="v2-container">
          <SectionPlate variant="process" />
          <h2 className="v2-section__head">
            From first message
            <br />
            <em className="v2-section__head-em">to working automation.</em>
          </h2>
          <p className="v2-section__sub">
            A transparent step-by-step process: mapping the workflow, designing the automation architecture, connecting APIs and prompts, testing edge cases, and handover under your accounts.
          </p>
          <div className="v2-section__body mt-8">
            <Reveal delay={100} y={24}>
              <SprintTimeline />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 ABOUT / LEARNING JOURNEY — Human Pause Anchor */}
      <section className="v2-section py-16 sm:py-24" aria-label="About Arefin Mueen">
        <div className="v2-container">
          <SectionPlate variant="about" />
          <div className="rounded-3xl bg-gradient-to-br from-[#0e1326] via-[#090c18] to-[#070911] border border-white/10 p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  I learn and solve problems by{" "}
                  <span className="serif text-violet-300 italic">building practical AI systems.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl font-sans">
                  {about.bio || "Independent developer specializing in practical AI workflows, tool-calling agents, and API integrations. Based in Dhaka, working globally."}
                </p>
                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                    <Code className="w-4 h-4 text-violet-400" />
                    <span>n8n · LangChain · Python · REST APIs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                    <span>100% Client Workflow Ownership</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end justify-between gap-4 shrink-0">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-black hover:bg-white/90 font-mono text-xs font-bold transition-all shadow-lg"
                >
                  <span>Read Full Story &amp; Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <p className="text-xs font-mono text-white/40">
                  Dhaka, Bangladesh · Remote Worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 JOURNAL — Quiet Editorial Build Notes */}
      <section className="v2-section py-16 sm:py-24" aria-label="Journal">
        <div className="v2-container">
          <SectionPlate variant="journal" />
          <div className="v2-section__top mb-8">
            <div>
              <h2 className="v2-section__head">
                Notes on building{" "}
                <em className="v2-section__head-em">AI automations &amp; agents.</em>
              </h2>
            </div>
            <Link href="/blog" className="v2-section__more">
              <span>All entries</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="v2-section__body">
            <Reveal delay={100}>
              <JournalGridV2 posts={posts} limit={3} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 07 FINAL CTA */}
      <FinalCtaV2 />
    </>
  );
}
