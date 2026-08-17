"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Workflow,
  Layers,
  Bot,
  Zap,
  CheckCircle2,
} from "lucide-react";
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

const FLOW_NODES = [
  { step: "01", label: "Trigger", icon: Zap },
  { step: "02", label: "Data", icon: Layers },
  { step: "03", label: "AI", icon: Bot },
  { step: "04", label: "Tools", icon: Workflow },
  { step: "05", label: "Output", icon: CheckCircle2 },
];

export default function HeroSignature({
  profileImage,
  name = "Arefin Mueen",
  role = "AI Automation & AI Agent Developer",
  availabilityNote = "Available for automation projects",
  labTitle = "RAG Support & Agent Routing System",
  labStatus = "ACTIVE EXPERIMENT",
  labInput = "Company knowledge base & ticket stream",
  labProcess = "retrieve → rerank → reason → structured dispatch",
  labOutput = "Cited response & ticket resolution",
  labStack = ["n8n", "LangChain", "MongoDB Atlas", "Python"],
  labLink = "/projects/customer-support-qa-bot",
}: HeroSignatureProps) {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      {/* ─── 01 PROFILE PORTRAIT WITH ORBIT SYSTEM ────────────────────────── */}
      <div className="mb-6 w-full flex justify-center">
        <ProfilePortrait
          profileImage={profileImage}
          name={name}
          role={role}
          availabilityNote={availabilityNote}
        />
      </div>

      {/* ─── 02 MINIMAL SIGNATURE FLOW TRACE ──────────────────────────────── */}
      <div className="w-full relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 mb-5 select-none">
        {FLOW_NODES.map((node, idx) => {
          const NodeIcon = node.icon;
          const isSelected = activeNode === idx;
          return (
            <div key={node.step} className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onMouseEnter={() => setActiveNode(idx)}
                onMouseLeave={() => setActiveNode(null)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-mono transition-all ${
                  isSelected
                    ? "bg-violet-600/30 border-violet-400 text-white shadow-sm shadow-violet-500/30"
                    : "bg-[#090c16] border-white/10 text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                <NodeIcon className={`w-3 h-3 ${isSelected ? "text-violet-400" : "text-white/40"}`} />
                <span className="font-semibold">{node.label}</span>
              </button>
              {idx < FLOW_NODES.length - 1 && (
                <span className="text-white/20 text-[10px] font-mono">→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── 03 FUNCTIONAL HERO SUPPORT CARD: LIVE LAB ────────────────────── */}
      <div className="w-full relative z-10 rounded-2xl bg-[#090c16]/95 border border-white/10 backdrop-blur-xl p-5 sm:p-6 shadow-2xl hover:border-violet-500/30 transition-all group">
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-white/90 uppercase">
              LIVE LAB
            </span>
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
            ● {labStatus}
          </span>
        </div>

        {/* Experiment Title */}
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {labTitle}
        </h3>

        {/* Structured Spec Grid: INPUT / PROCESS / OUTPUT */}
        <div className="mt-4 space-y-2.5 font-mono text-xs">
          {/* INPUT */}
          <div className="flex items-start gap-3 p-2 rounded-lg bg-[#0e1222] border border-white/5">
            <span className="text-[10px] font-bold text-violet-400/90 uppercase tracking-widest w-16 shrink-0 mt-0.5">
              INPUT
            </span>
            <span className="text-white/80 text-[11px] leading-relaxed">
              {labInput}
            </span>
          </div>

          {/* PROCESS */}
          <div className="flex items-start gap-3 p-2 rounded-lg bg-[#0e1222] border border-white/5">
            <span className="text-[10px] font-bold text-cyan-400/90 uppercase tracking-widest w-16 shrink-0 mt-0.5">
              PROCESS
            </span>
            <span className="text-white/80 text-[11px] leading-relaxed">
              {labProcess}
            </span>
          </div>

          {/* OUTPUT */}
          <div className="flex items-start gap-3 p-2 rounded-lg bg-[#0e1222] border border-white/5">
            <span className="text-[10px] font-bold text-emerald-400/90 uppercase tracking-widest w-16 shrink-0 mt-0.5">
              OUTPUT
            </span>
            <span className="text-white/80 text-[11px] leading-relaxed">
              {labOutput}
            </span>
          </div>
        </div>

        {/* STACK */}
        <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mr-1">
            STACK:
          </span>
          {labStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-[#13182b] border border-white/5 text-[10px] font-mono text-violet-300/80"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA Link */}
        {labLink && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <Link
              href={labLink}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-violet-300 hover:text-white transition-colors group/link"
            >
              <span>Open experiment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
            <span className="text-[10px] font-mono text-white/30">Admin verified</span>
          </div>
        )}
      </div>
    </div>
  );
}
