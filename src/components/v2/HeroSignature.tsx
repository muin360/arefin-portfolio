"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProfilePortrait from "@/components/ProfilePortrait";

interface HeroSignatureProps {
  profileImage?: string | null;
  name?: string;
  role?: string;
  availabilityNote?: string;
  labTitle?: string;
  labStatus?: string;
  labInput?: string;
  labProcess?: string;
  labOutput?: string;
  labStack?: string[];
  labLink?: string;
}

export default function HeroSignature({
  profileImage,
  name = "Arefin Mueen",
  role = "AI Automation & AI Agent Developer",
  availabilityNote = "Available for projects",
  labTitle = "RAG Support Agent",
  labStatus = "active experiment",
  labProcess = "retrieve → rerank → reason → respond",
  labStack = ["n8n", "LangChain", "MongoDB Atlas"],
  labLink = "/projects/customer-support-qa-bot",
}: HeroSignatureProps) {
  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      {/* ─── 01 PROFILE PORTRAIT WITH REFINED ORBIT ──────────────────────── */}
      <div className="w-full flex justify-center mb-8">
        <ProfilePortrait
          profileImage={profileImage}
          name={name}
          role={role}
          availabilityNote={availabilityNote}
        />
      </div>

      {/* ─── 02 MINIMAL EDITORIAL LIVE LAB SYSTEM CARD ─────────────────────── */}
      <div className="w-full rounded-2xl bg-[#090c16] border border-white/[0.08] hover:border-violet-500/30 p-5 sm:p-6 transition-all group">
        <div className="flex items-center justify-between gap-2 mb-3 font-mono text-xs">
          <span className="text-[10px] font-bold tracking-widest text-violet-400 uppercase">
            LIVE LAB
          </span>
          <span className="text-[10px] text-white/50 lowercase">
            {labStatus}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {labTitle}
        </h3>

        {/* Dynamic Process Flow Trace */}
        <p className="mt-2 text-xs font-mono text-white/70 leading-relaxed">
          {labProcess}
        </p>

        {/* Tech Stack + Direct Experiment CTA */}
        <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-white/40 truncate">
            {labStack.join(" · ")}
          </span>

          <Link
            href={labLink || "/projects"}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-violet-300 hover:text-white transition-colors shrink-0 group/link"
          >
            <span>Open experiment</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform text-violet-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
