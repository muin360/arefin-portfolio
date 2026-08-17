"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappHref, WA_MESSAGES } from "@/lib/cta";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";

export default function FinalCtaV2() {
  return (
    <section className="py-16 sm:py-24" id="contact" aria-label="Start a project">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionPlate
          index="07"
          title="START A PROJECT"
          sectionId="contact"
          meta="direct scoping · 100% client ownership"
        />

        <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Let&rsquo;s build an{" "}
              <span className="serif italic text-violet-300">automation.</span>
            </h2>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans font-normal">
              Have a repetitive workflow worth automating? Let&rsquo;s map your process and engineer practical AI agents, RAG pipelines, or workflow integrations under your complete ownership.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Let&rsquo;s Build an Automation
              </Button>

              <Button
                href="/projects"
                variant="secondary"
                size="lg"
              >
                View My Work
              </Button>

              <a
                href={whatsappHref(WA_MESSAGES.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#121622] hover:bg-[#181e2e] text-white border border-white/10 font-mono text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] font-mono text-white/40 pt-2">
              Free 30-min scoping call · Direct architecture review · 100% Client ownership
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
