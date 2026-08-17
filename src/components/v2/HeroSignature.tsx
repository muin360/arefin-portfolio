"use client";

import Link from "next/link";
import { ArrowRight, Activity, Terminal } from "lucide-react";
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

const PIPELINE_NODES = [
  { label: "Webhook", desc: "Trigger" },
  { label: "LLM", desc: "Reason" },
  { label: "n8n", desc: "Logic" },
  { label: "API", desc: "Action" },
  { label: "Output", desc: "Payload" },
];

export default function HeroSignature({
  profileImage = "/pp.png",
  name = "Arefin Mueen",
  role = "AI Automation & AI Agent Developer",
  availabilityNote = "Available for projects",
  labTitle = "RAG Support Agent",
  labStatus = "active experiment",
  labProcess = "retrieve → rerank → reason → structured dispatch",
  labStack = ["n8n", "LangChain", "MongoDB", "Python"],
  labLink = "/projects/customer-support-qa-bot",
}: HeroSignatureProps) {
  return (
    <div className="relative w-full max-w-[420px] mx-auto flex flex-col items-center select-none space-y-6">
      {/* ─── 01 SIGNATURE PROFILE VISUAL COUNTERWEIGHT ─────────────────────── */}
      <div className="w-full flex justify-center py-2">
        <ProfilePortrait
          profileImage={profileImage}
          name={name}
          role={role}
          availabilityNote={availabilityNote}
        />
      </div>

      {/* ─── 02 INTEGRATED HORIZONTAL WORKFLOW SIGNAL PIPELINE ─────────────── */}
      <div className="w-full rounded-xl bg-[#0c0f18]/90 border border-white/[0.08] p-3 relative overflow-hidden backdrop-blur-sm shadow-xl">
        {/* Subtle traveling signal beam */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-[1px] bg-white/[0.05] pointer-events-none">
          <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa] motion-safe:animate-workflow-signal" />
        </div>

        {/* Pipeline Nodes */}
        <div className="relative z-10 grid grid-cols-5 gap-1 text-center font-mono">
          {PIPELINE_NODES.map((node) => (
            <div key={node.label} className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-white tracking-tight">
                {node.label}
              </span>
              <span className="text-[8px] text-white/40 uppercase tracking-widest mt-0.5">
                {node.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 03 COMPACT LIVE LAB SYSTEM READOUT ─────────────────────────────── */}
      <div className="w-full rounded-xl bg-[#0c0f18]/80 border border-white/[0.08] hover:border-violet-500/30 p-4 transition-all duration-300 group">
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] mb-2">
          <div className="flex items-center gap-1.5 text-violet-400 font-bold uppercase tracking-wider">
            <Activity className="w-3 h-3 animate-pulse text-emerald-400" />
            <span>LIVE LAB</span>
          </div>
          <span className="text-white/40 font-mono tracking-wider lowercase">
            {labStatus}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
            {labTitle}
          </h3>
          <span className="text-[10px] font-mono text-white/40">
            {labStack.slice(0, 2).join(" · ")}
          </span>
        </div>

        {/* Process Trace */}
        <p className="mt-1.5 text-[11px] font-mono text-white/60 leading-relaxed group-hover:text-white/80 transition-colors truncate">
          {labProcess}
        </p>

        {/* Link Footer */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1 text-[10px] text-white/40">
            <Terminal className="w-3 h-3 text-violet-400/80" />
            <span>Production ready</span>
          </div>
          <Link
            href={labLink || "/projects"}
            className="inline-flex items-center gap-1 text-[11px] text-violet-300 hover:text-white transition-colors group/link"
          >
            <span>Open experiment</span>
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform text-violet-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
