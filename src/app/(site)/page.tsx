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
import { ArrowRight, Code } from "lucide-react";

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
      {/* 01 HERO — Personal Identity + Editorial LIVE LAB Support Card */}
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

      {/* 02 WHAT I BUILD — Functional Capability System */}
      <section
        id="services"
        className="v2-section py-16 sm:py-20"
        aria-label="Capabilities"
      >
        <div className="v2-container">
          <Reveal delay={100}>
            <BentoServices />
          </Reveal>
        </div>
      </section>

      {/* 03 SELECTED WORK — Dynamic MongoDB Projects & Filter Controller */}
      <section className="v2-section py-16 sm:py-20" aria-label="Selected projects">
        <div className="v2-container">
          <Reveal delay={100} y={16}>
            <ProjectsGridV2 projects={projects} limit={5} />
          </Reveal>
        </div>
      </section>

      {/* 04 HOW I BUILD — Flowing Build Process Pipeline */}
      <section className="v2-section v2-section--dark py-16 sm:py-20" aria-label="How it works">
        <div className="v2-container">
          <Reveal delay={100} y={16}>
            <SprintTimeline />
          </Reveal>
        </div>
      </section>

      {/* 05 ABOUT / LEARNING JOURNEY — Human Anchor */}
      <section className="v2-section py-16 sm:py-20" aria-label="About Arefin Mueen">
        <div className="v2-container">
          <SectionPlate
            index="05"
            title="ABOUT"
            meta="Arefin Mueen · Dhaka · GMT+6"
          />
          <div className="rounded-2xl bg-[#090c16] border border-white/[0.08] p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                  I learn and solve problems by{" "}
                  <span className="serif text-violet-300 italic">building practical AI systems.</span>
                </h2>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl font-sans">
                  {about.bio || "Independent developer specializing in practical AI workflows, tool-calling agents, and API integrations. Based in Dhaka, working globally."}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-mono text-white/50">
                  <Code className="w-4 h-4 text-violet-400" />
                  <span>n8n · LangChain · Python · REST APIs · MongoDB</span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-white/90 font-mono text-xs font-bold transition-all shadow-md"
                >
                  <span>Read Full Story</span>
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
      <section className="v2-section py-16 sm:py-20" aria-label="Journal">
        <div className="v2-container">
          <Reveal delay={100}>
            <JournalGridV2 posts={posts} limit={3} />
          </Reveal>
        </div>
      </section>

      {/* 07 FINAL CTA */}
      <FinalCtaV2 />
    </>
  );
}
