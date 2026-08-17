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
  labProcess?: string;
  labStack?: string[];
  labLink?: string;
}

const WORKFLOW_STAGES = [
  { label: "Webhook", desc: "Trigger" },
  { label: "LLM", desc: "Reason" },
  { label: "n8n", desc: "Logic" },
  { label: "API", desc: "Action" },
  { label: "Response", desc: "Output" },
];

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
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center select-none">
      {/* ─── 01 PROFILE PORTRAIT ANCHOR ──────────────────────────────────── */}
      <div className="w-full flex justify-center mb-6">
        <ProfilePortrait
          profileImage={profileImage}
          name={name}
          role={role}
          availabilityNote={availabilityNote}
        />
      </div>

      {/* ─── 02 ONE ABSTRACT TECHNICAL WORKFLOW PIPELINE ─────────────────── */}
      <div
        className="w-full mb-4 px-3 py-2.5 rounded-xl bg-[#0c0f18] border border-white/[0.06] relative overflow-hidden"
        aria-hidden="true"
      >
        {/* Occasional travelling signal dot */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[1px] bg-white/[0.04] pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400/80 shadow-[0_0_8px_#a78bfa] motion-safe:animate-workflow-signal" />
        </div>

        {/* 5 Technical Workflow Stages */}
        <div className="relative z-10 grid grid-cols-5 gap-1 text-center font-mono">
          {WORKFLOW_STAGES.map((st) => (
            <div key={st.label} className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-white tracking-tight">
                {st.label}
              </span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5">
                {st.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 03 MINIMAL EDITORIAL LIVE LAB SYSTEM CARD ─────────────────────── */}
      <div className="w-full rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 p-5 sm:p-6 transition-all group">
        <div className="flex items-center justify-between gap-2 mb-2.5 font-mono text-xs">
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

        {/* Dynamic Process Flow Trace with subtle hover animation */}
        <p className="mt-2 text-xs font-mono text-white/70 leading-relaxed group-hover:text-violet-200 transition-colors">
          {labProcess}
        </p>

        {/* Tech Stack + Direct Experiment Link */}
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
