import { ArrowRight } from "lucide-react";
import Button from "@/components/Button";
import HeroSignature from "./HeroSignature";

interface HeroSectionProps {
  availabilityNote?: string;
  profileImage?: string | null;
  name?: string;
  role?: string;
  labTitle?: string;
  labStatus?: string;
  labInput?: string;
  labProcess?: string;
  labOutput?: string;
  labStack?: string[];
  labLink?: string;
}

export default function HeroSectionV2({
  availabilityNote = "Available for projects",
  profileImage = "/pp.png",
  name = "Arefin Mueen",
  role = "AI Automation & AI Agent Developer",
  labTitle,
  labStatus,
  labProcess,
  labStack,
  labLink,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-6 pb-14 sm:py-16 lg:py-20" aria-label="Hero">
      {/* Concentrated ambient depth backdrop */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* ─── MOBILE ONLY: PORTRAIT ANCHOR TOP (< lg) ────────────────────── */}
          <div className="block lg:hidden w-full pt-2">
            <HeroSignature
              profileImage={profileImage}
              name={name}
              role={role}
              availabilityNote={availabilityNote}
              variant="portrait-only"
            />
          </div>

          {/* ─── NARRATIVE & EDITORIAL HEADLINE (58% ON DESKTOP) ─────────────── */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Identity & Technical Role Metadata */}
            <div className="space-y-1.5 font-mono text-xs select-none">
              <div className="flex items-center gap-2 text-white/50">
                <span className="font-bold tracking-widest text-violet-400 uppercase">
                  {name}
                </span>
                <span>·</span>
                <span className="text-[11px] tracking-wider uppercase">
                  {role}
                </span>
              </div>
              <p className="text-[11px] text-white/40">
                Dhaka · GMT+6 · {availabilityNote}
              </p>
            </div>

            {/* Core Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold text-white tracking-tight leading-[1.04]">
              I build intelligent systems that{" "}
              <span className="serif italic text-violet-300 font-normal">automate real work.</span>
            </h1>

            {/* Supporting Context */}
            <p className="text-base sm:text-lg text-white/70 leading-[1.65] max-w-xl font-sans">
              Specializing in practical AI agents, RAG knowledge retrieval, multi-agent systems, and event-driven workflow integrations under your complete ownership.
            </p>

            {/* Two Primary CTAs */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Let&rsquo;s Build an Automation
              </Button>

              <Button href="/projects" variant="secondary" size="lg">
                View My Work
              </Button>
            </div>

            {/* Technical Stack Indicator */}
            <div className="pt-1 text-xs font-mono text-white/40 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80" />
              <span>n8n · LangChain · Langflow · Python · REST APIs · MongoDB</span>
            </div>

            {/* ─── MOBILE ONLY: WORKFLOW & LIVE LAB BELOW CTA (< lg) ─────────── */}
            <div className="block lg:hidden w-full pt-4">
              <HeroSignature
                labTitle={labTitle}
                labStatus={labStatus}
                labProcess={labProcess}
                labStack={labStack}
                labLink={labLink}
                variant="readouts-only"
              />
            </div>
          </div>

          {/* ─── DESKTOP ONLY: FULL SIGNATURE SYSTEM (42% ON DESKTOP) ──────── */}
          <div className="hidden lg:flex lg:col-span-5 justify-center items-center w-full">
            <HeroSignature
              profileImage={profileImage}
              name={name}
              role={role}
              availabilityNote={availabilityNote}
              labTitle={labTitle}
              labStatus={labStatus}
              labProcess={labProcess}
              labStack={labStack}
              labLink={labLink}
              variant="full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
