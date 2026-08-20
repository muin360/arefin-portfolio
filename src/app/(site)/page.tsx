import {
  getSiteSettings,
  getProjects,
  getServices,
  getAboutData,
  getBlogPosts,
} from "@/lib/db";

import SectionPlate from "@/components/SectionPlate";
import SprintTimeline from "@/components/SprintTimeline";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";

import HeroSectionV2 from "@/components/v2/HeroSectionV2";
import FlagshipShowcase from "@/components/v2/FlagshipShowcase";
import BentoServices from "@/components/v2/BentoServices";
import JournalGridV2 from "@/components/v2/JournalGridV2";
import FinalCtaV2 from "@/components/v2/FinalCtaV2";
import { Code } from "lucide-react";

export default async function HomePage() {
  const [settings, services, projects, about, posts] = await Promise.all([
    getSiteSettings(),
    getServices({ publishedOnly: true }),
    getProjects({ publishedOnly: true }),
    getAboutData(),
    getBlogPosts({ publishedOnly: true }),
  ]);

  const availabilityNote =
    settings.availabilityNote || "Available for projects";

  return (
    <>
      {/* 01 HERO — Personal Identity + Workflow + Editorial LIVE LAB */}
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

      {/* 02 FLAGSHIP WORK & INTERACTIVE SYSTEM BLUEPRINT — Top 3 Production Architectures */}
      <section id="work" className="v2-section py-16 sm:py-20" aria-label="Flagship work and system blueprints">
        <div className="v2-container">
          <Reveal delay={100} y={16}>
            <FlagshipShowcase projects={projects} />
          </Reveal>
        </div>
      </section>

      {/* 03 CAPABILITIES — Functional Capability Selector Plate */}
      <section
        id="services"
        className="v2-section py-16 sm:py-20"
        aria-label="Capabilities"
      >
        <div className="v2-container">
          <Reveal delay={100}>
            <BentoServices services={services} projects={projects} />
          </Reveal>
        </div>
      </section>

      {/* 04 HOW I BUILD — Flowing 6-Stage Process Pipeline Plate */}
      <section id="process" className="v2-section v2-section--dark py-16 sm:py-20" aria-label="How I build">
        <div className="v2-container">
          <Reveal delay={100} y={16}>
            <SprintTimeline />
          </Reveal>
        </div>
      </section>

      {/* 05 JOURNAL — Quiet Editorial Build Notes Controller Plate */}
      <section id="journal" className="v2-section py-16 sm:py-20" aria-label="Journal">
        <div className="v2-container">
          <Reveal delay={100}>
            <JournalGridV2 posts={posts} limit={3} />
          </Reveal>
        </div>
      </section>

      {/* 06 ABOUT — Editorial Human & Mindset Anchor */}
      <section id="about" className="v2-section py-16 sm:py-20" aria-label="About Arefin Mueen">
        <div className="v2-container">
          <SectionPlate
            index="06"
            title="ABOUT"
            sectionId="about"
            meta={`${settings.name || "Arefin Mueen"} · Dhaka · GMT+6 · ${settings.role || "AI Automation & Agents"}`}
          />
          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-12">
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
                <Button href="/about" variant="primary" size="md">
                  <span>Read Full Story</span>
                </Button>
                <p className="text-xs font-mono text-white/40">
                  Dhaka, Bangladesh · Remote Worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07 START A PROJECT — Direct Scoping Call To Action */}
      <FinalCtaV2 />
    </>
  );
}
