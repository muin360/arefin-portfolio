import Link from "next/link";
import { getSiteSettings } from "@/lib/db";

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

export default async function HomePage() {
  const settings = await getSiteSettings();

  const availabilityNote =
    settings.availabilityNote || "Open to automation & agent projects";

  return (
    <>
      {/* HERO */}
      <HeroSectionV2 availabilityNote={availabilityNote} />

      {/* TECH TICKER */}
      {settings.showLiveTicker && <TechTicker />}

      {/* SERVICES — bento */}
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

      {/* STATS BAR — at a glance numbers */}
      {settings.showLive30Days && <StatsBar />}

      {/* SELECTED WORK */}
      <section className="v2-section" aria-label="Selected projects">
        <div className="v2-container">
          <div className="v2-section__top">
            <div>
              <SectionLabel index="03" hint="practical builds">
                Selected projects
              </SectionLabel>
              <h2 className="v2-section__head">
                AI automations that{" "}
                <em className="v2-section__head-em">do the work,</em>
                <br />
                so you don&rsquo;t.
              </h2>
            </div>
            <Link href="/projects" className="v2-section__more">
              <span>View all</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="v2-section__body">
            <Reveal delay={100} y={20}>
              <ProjectsGridV2 limit={4} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* SPRINT TIMELINE — process */}
      <section className="v2-section v2-section--dark" aria-label="How it works">
        <div className="v2-container">
          <SectionLabel index="04" hint="from workflow map to working automation">
            How I work
          </SectionLabel>
          <h2 className="v2-section__head">
            From first message
            <br />
            <em className="v2-section__head-em">to working automation.</em>
          </h2>
          <p className="v2-section__sub">
            A transparent step-by-step process: mapping the workflow, designing the automation architecture, connecting APIs and prompts, testing edge cases, and handover.
          </p>
          <div className="v2-section__body">
            <Reveal delay={100} y={24}>
              <SprintTimeline />
            </Reveal>
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="v2-section" aria-label="Journal">
        <div className="v2-container">
          <div className="v2-section__top">
            <div>
              <SectionLabel index="05" hint="recent notes & experiments">
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
          <SectionLabel index="06" hint="common questions">
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

      {/* FINAL CTA */}
      <FinalCtaV2 />
    </>
  );
}
