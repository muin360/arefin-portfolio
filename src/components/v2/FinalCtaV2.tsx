"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappHref, WA_MESSAGES } from "@/lib/cta";
import SectionPlate from "@/components/SectionPlate";

export default function FinalCtaV2() {
  return (
    <section className="v2-section py-16 sm:py-24" aria-label="Start a project">
      <div className="v2-container max-w-4xl mx-auto px-4 sm:px-6">
        <SectionPlate variant="cta" />

        <div className="rounded-3xl bg-[#090c16] border border-white/10 p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Let&rsquo;s build an{" "}
              <span className="serif italic text-violet-300">automation.</span>
            </h2>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
              Have a repetitive workflow worth automating? Let&rsquo;s map your process and engineer practical AI agents, RAG pipelines, or workflow integrations under your complete ownership.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-black hover:bg-white/90 font-mono text-xs font-bold transition-all shadow-xl shadow-white/10 group"
              >
                <span>Start a conversation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={whatsappHref(WA_MESSAGES.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#141a2e] hover:bg-[#1a223c] text-white border border-white/10 font-mono text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Message</span>
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
