import Link from "next/link";
import { getSiteSettings, getProjects, getAboutData } from "@/lib/db";

import SectionLabel from "@/components/SectionLabel";
import SprintTimeline from "@/components/SprintTimeline";
import Reveal from "@/components/Reveal";

import HeroSectionV2 from "@/components/v2/HeroSectionV2";
import TechTicker from "@/components/v2/TechTicker";
import BentoServices from "@/components/v2/BentoServices";
import StatsBar from "@/components/v2/StatsBar";
import ProjectsGridV2 from "@/components/v2/ProjectsGridV2";
import JournalGridV2 from "@/components/v2/JournalGridV2";
import FaqAccordionV2 from "@/components/v2/FaqAccordionV2";
import FinalCtaV2 from "@/components/v2/FinalCtaV2";
import { ArrowRight, Sparkles, User, Brain, Code } from "lucide-react";

export default async function HomePage() {
  const [settings, projects, about] = await Promise.all([
    getSiteSettings(),
    getProjects({ publishedOnly: true }),
    getAboutData(),
  ]);

  const availabilityNote =
    settings.availabilityNote || "Open to automation & agent projects";

  return (
    <>
      {/* 01 HERO — Human + AI Technical Anchor + NOW BUILDING Module */}
      <HeroSectionV2
        availabilityNote={availabilityNote}
        profileImage={settings.profileImage}
        name={settings.name}
        role={settings.role}
        nowBuildingTitle={settings.nowBuildingTitle}
        nowBuildingStatus={settings.nowBuildingStatus}
        nowBuildingDescription={settings.nowBuildingDescription}
        nowBuildingStack={settings.nowBuildingStack}
        nowBuildingFocus={settings.nowBuildingFocus}
        nowBuildingLink={settings.nowBuildingLink}
      />

      {/* TECH TICKER */}
      {settings.showLiveTicker && <TechTicker />}

      {/* 02 WHAT I BUILD — Bento Capabilities */}
      <section
        id="services"
        className="v2-section"
        aria-label="Capabilities"
      >
        <div className="v2-container">
          <SectionLabel index="02" hint="what i build and automate">
            Capabilities
          </SectionLabel>
          <h2 className="v2-section__head">
            Core capabilities,{" "}
            <em className="v2-section__head-em">focused on real work.</em>
          </h2>
          <p className="v2-section__sub">
            Practical AI automation workflows, autonomous agents, RAG knowledge bases, and multi-agent systems designed to solve real business bottlenecks.
          </p>
          <div className="v2-section__body">
            <Reveal delay={120}>
              <BentoServices />
            </Reveal>
          </div>
        </div>
      </section>

      {/* STATS BAR — Live activity metrics */}
      {settings.showLive30Days && <StatsBar />}

      {/* 03 FEATURED WORK — 3-Tier Editorial Projects Hierarchy */}
      <section className="v2-section" aria-label="Selected projects">
        <div className="v2-container">
          <div className="v2-section__top">
            <div>
              <SectionLabel index="03" hint="practical automated systems">
                Selected Work
              </SectionLabel>
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

      {/* 04 HOW I BUILD — Sprint Timeline */}
      <section className="v2-section v2-section--dark" aria-label="How it works">
        <div className="v2-container">
          <SectionLabel index="04" hint="from workflow map to working automation">
            How I Work
          </SectionLabel>
          <h2 className="v2-section__head">
            From first message
            <br />
            <em className="v2-section__head-em">to working automation.</em>
          </h2>
          <p className="v2-section__sub">
            A transparent step-by-step process: mapping the workflow, designing the automation architecture, connecting APIs and prompts, testing edge cases, and handover under your accounts.
          </p>
          <div className="v2-section__body">
            <Reveal delay={100} y={24}>
              <SprintTimeline />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 ABOUT / LEARNING JOURNEY — Personal Anchor */}
      <section className="v2-section" aria-label="About Arefin Mueen">
        <div className="v2-container">
          <div className="rounded-3xl bg-gradient-to-br from-[#0e1326] via-[#090c18] to-[#070911] border border-white/10 p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="flex-1">
                <SectionLabel index="05" hint="personal anchor & philosophy">
                  About &amp; Mindset
                </SectionLabel>
                <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mt-2 leading-tight">
                  I learn and solve problems by{" "}
                  <span className="serif text-violet-300 italic">building practical AI systems.</span>
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
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

      {/* 06 JOURNAL — Build Notes */}
      <section className="v2-section" aria-label="Journal">
        <div className="v2-container">
          <div className="v2-section__top">
            <div>
              <SectionLabel index="06" hint="recent notes & experiments">
                Journal
              </SectionLabel>
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
              <JournalGridV2 />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="v2-section" aria-label="FAQ">
        <div className="v2-container v2-container--narrow">
          <SectionLabel index="07" hint="common questions">
            FAQ
          </SectionLabel>
          <h2 className="v2-section__head">
            Direct answers{" "}
            <em className="v2-section__head-em">to common questions.</em>
          </h2>
          <div className="v2-section__body">
            <Reveal delay={80} y={16}>
              <FaqAccordionV2 />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 07 FINAL CTA */}
      <FinalCtaV2 />
    </>
  );
}
