"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Cpu,
  Zap,
  CheckCircle2,
  Workflow,
  Bot,
  Database,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface HeroSignatureProps {
  profileImage?: string | null;
  name?: string;
  role?: string;
  availabilityNote?: string;
}

const WORKFLOW_NODES = [
  {
    id: "trigger",
    step: "01",
    label: "TRIGGER",
    title: "Event Webhook / Inbound",
    desc: "n8n captures event payload",
    icon: Zap,
    badge: "12ms",
  },
  {
    id: "data",
    step: "02",
    label: "DATA",
    title: "Parse & Vector Query",
    desc: "Schema normalize + RAG lookup",
    icon: Database,
    badge: "Embeddings",
  },
  {
    id: "ai",
    step: "03",
    label: "AI REASONING",
    title: "LLM Agent Decision",
    desc: "Structured prompt & intent classify",
    icon: Bot,
    badge: "GPT-4o / Claude",
  },
  {
    id: "tool",
    step: "04",
    label: "TOOLS & APIS",
    title: "Execution & Write-back",
    desc: "CRM, Database & Slack dispatch",
    icon: Cpu,
    badge: "REST / SQL",
  },
  {
    id: "output",
    step: "05",
    label: "OUTPUT",
    title: "Deterministic Action",
    desc: "Task resolved & metrics logged",
    icon: CheckCircle2,
    badge: "100% Handled",
  },
];

export default function HeroSignature({
  profileImage,
  name = "Arefin Mueen",
  role = "AI Automation & AI Agent Developer",
  availabilityNote = "Available for automation projects",
}: HeroSignatureProps) {
  const [activeStep, setActiveStep] = useState(0);

  // Subtle cyclic progression through the workflow signature nodes
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WORKFLOW_NODES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Background ambient lighting */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── HUMAN ANCHOR: CIRCULAR PORTRAIT HUB ───────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center mb-6 text-center">
        <div className="relative group">
          {/* Subtle spinning accent ring */}
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-violet-600/40 via-indigo-500/30 to-emerald-500/40 blur-sm opacity-70 group-hover:opacity-100 transition duration-500" />

          {/* Portrait Container */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-[#090b12] border border-white/15 shadow-2xl overflow-hidden flex items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={`${name} — ${role}`}
                width={128}
                height={128}
                priority
                className="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#121626] to-[#0b0e18] flex flex-col items-center justify-center text-center p-2 relative">
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-1">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-sm font-bold text-white font-mono tracking-wider">
                  AM
                </span>
                <span className="text-[9px] text-white/50 font-mono tracking-tight">
                  Portfolio OS
                </span>
              </div>
            )}
          </div>

          {/* Active status pulse pill */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0d111d] border border-emerald-500/30 px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-black/50 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-medium text-emerald-300 tracking-tight uppercase">
              {availabilityNote}
            </span>
          </div>
        </div>

        {/* Human Signature Label */}
        <div className="mt-4">
          <p className="text-xs font-mono text-white/50 tracking-wider uppercase font-semibold">
            {name}
          </p>
          <p className="text-[11px] text-violet-300 font-mono">
            {role}
          </p>
        </div>
      </div>

      {/* ─── TECHNICAL ANCHOR: SIGNATURE WORKFLOW ARCHITECTURE ─────────────── */}
      <div className="w-full relative z-10 rounded-2xl bg-[#0a0d18]/90 border border-white/10 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
        {/* Terminal / System Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Workflow className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-tight block">
                Automation Architecture
              </span>
              <span className="text-[10px] font-mono text-white/40 block">
                Deterministic Execution Loop
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-white/60">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>n8n · LangChain · Python</span>
          </div>
        </div>

        {/* Workflow Progression Stepper */}
        <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mb-3.5">
          {WORKFLOW_NODES.map((node, i) => {
            const isActive = activeStep === i;
            return (
              <button
                key={node.id}
                onClick={() => setActiveStep(i)}
                className={`py-1.5 px-1 rounded-lg border text-center transition-all flex flex-col items-center justify-center relative ${
                  isActive
                    ? "bg-violet-600/25 border-violet-500/50 text-white shadow-sm shadow-violet-500/20"
                    : "bg-[#101424]/60 border-white/5 text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-[9px] font-mono font-bold leading-none mb-0.5">
                  {node.step}
                </span>
                <span className="text-[8px] font-mono uppercase tracking-tight truncate w-full text-center">
                  {node.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Node Live Telemetry Card */}
        {(() => {
          const current = WORKFLOW_NODES[activeStep];
          const CurrentIcon = current.icon;
          return (
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#0f1424] border border-violet-500/20 flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-300">
                  <CurrentIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">
                      {current.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0">
                      {current.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 truncate mt-0.5">
                    {current.desc}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-violet-400 shrink-0" />
            </div>
          );
        })()}

        {/* Real Outcome Footnote */}
        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/50">
          <span>Target Latency: &lt;1.5s</span>
          <span className="text-emerald-400">Zero Hallucination Guardrails</span>
        </div>
      </div>
    </div>
  );
}
