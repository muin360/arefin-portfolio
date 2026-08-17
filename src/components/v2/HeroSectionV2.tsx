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
    <section className="relative overflow-hidden pt-10 pb-16 sm:py-16 lg:py-20" aria-label="Hero">
      {/* Subtle Atmospheric Backdrop */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ─── LEFT COL: IDENTITY & NARRATIVE (55% ON DESKTOP) ─────────── */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 order-2 lg:order-1">
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

            {/* Core Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
              I build intelligent systems that{" "}
              <span className="serif italic text-violet-300">automate real work.</span>
            </h1>

            {/* Supporting Context */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl font-sans font-normal">
              Specializing in practical AI agents, RAG knowledge retrieval, multi-agent systems, and event-driven workflow integrations under your complete ownership.
            </p>

            {/* Two Primary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
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
            <div className="pt-2 text-xs font-mono text-white/40">
              <span>n8n · LangChain · Langflow · Python · REST APIs · MongoDB</span>
            </div>
          </div>

          {/* ─── RIGHT COL: PORTRAIT, WORKFLOW & LIVE LAB (45% ON DESKTOP) ─── */}
          <div className="lg:col-span-5 flex justify-center items-center w-full order-1 lg:order-2">
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
            />
          </div>
        </div>
      </div>
    </section>
  );
}
