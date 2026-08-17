"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Workflow,
  CheckCircle2,
  Bot,
  Zap,
  Layers,
} from "lucide-react";

interface HeroSignatureProps {
  profileImage?: string | null;
  name?: string;
  role?: string;
  availabilityNote?: string;
  nowBuildingTitle?: string;
  nowBuildingStatus?: string;
  nowBuildingDescription?: string;
  nowBuildingStack?: string[];
  nowBuildingFocus?: string[];
  nowBuildingLink?: string;
}

const SIGNATURE_STEPS = [
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
  nowBuildingTitle = "RAG Support & Agent Routing System",
  nowBuildingStatus = "ACTIVE EXPERIMENT",
  nowBuildingDescription = "Context-aware customer intelligence system with vector chunk retrieval, fallback confidence scoring, and multi-tier routing.",
  nowBuildingStack = ["n8n", "LangChain", "MongoDB Atlas", "Python"],
  nowBuildingFocus = [
    "Vector retrieval quality & metadata filtering",
    "Deterministic agent routing without infinite loops",
    "Sub-second latency & zero hallucination guardrails",
  ],
  nowBuildingLink = "/projects/customer-support-qa-bot",
}: HeroSignatureProps) {
  const [activeStep, setActiveStep] = useState(0);

  // Subtle cyclic progression through the signature nodes
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % SIGNATURE_STEPS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Background ambient radial glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ─── 01 LARGE PORTRAIT SYSTEM WITH SYSTEM ORBIT ───────────────────── */}
      <div className="relative z-10 flex flex-col items-center mb-8 text-center">
        {/* Orbital System Wrapper: 260px desktop / 190px mobile */}
        <div className="relative flex items-center justify-center w-[250px] h-[250px] sm:w-[290px] sm:h-[290px]">
          {/* Outer Orbit Ring (Slow Rotation) */}
          <div className="absolute inset-0 rounded-full border border-dashed border-violet-500/30 animate-orbit-slow pointer-events-none">
            {/* Small Orbiting Glowing Node */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_14px_#a78bfa] border-2 border-[#090b12]" />
          </div>

          {/* Inner Counter-Orbit Ring (Reverse Rotation) */}
          <div className="absolute inset-3 sm:inset-4 rounded-full border border-white/10 animate-orbit-reverse pointer-events-none">
            {/* Secondary subtle node */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] border border-[#090b12]" />
          </div>

          {/* Portrait Anchor: Perfect Circle (210px desktop / 160px mobile) */}
          <div className="relative w-[190px] h-[190px] sm:w-[230px] sm:h-[230px] rounded-full p-1 bg-[#090b12] border-2 border-white/20 shadow-2xl shadow-violet-950/40 overflow-hidden flex items-center justify-center group transition-all duration-500">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={`${name} — ${role}`}
                width={240}
                height={240}
                priority
                className="w-full h-full object-cover rounded-full transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#121629] via-[#0b0e18] to-[#070911] flex flex-col items-center justify-center text-center p-4 relative">
                {/* Inner highlight & subtle neural icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-2 shadow-inner">
                  <Sparkles className="w-6 h-6 text-violet-400 animate-orbit-pulse" />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white font-mono tracking-widest">
                  AM
                </span>
                <span className="text-[10px] text-white/50 font-mono tracking-wider uppercase mt-0.5">
                  AI Automation
                </span>
              </div>
            )}

            {/* Inner top highlight arc */}
            <div className="absolute inset-0 rounded-full border-t border-white/30 pointer-events-none" />
          </div>

          {/* Active Status Pulse Pill */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0c101c] border border-emerald-500/30 px-3.5 py-1 rounded-full flex items-center gap-2 shadow-xl shadow-black/70 whitespace-nowrap z-20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-medium text-emerald-300 tracking-wider uppercase">
              {availabilityNote}
            </span>
          </div>
        </div>

        {/* Human Signature Title */}
        <div className="mt-5">
          <p className="text-xs font-mono text-white/50 tracking-widest uppercase font-semibold">
            {name}
          </p>
          <p className="text-xs text-violet-300/90 font-mono mt-0.5">
            {role}
          </p>
        </div>
      </div>

      {/* ─── 02 SIGNATURE WORKFLOW MOTIF LOOP ─────────────────────────────── */}
      <div className="w-full relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 mb-6">
        {SIGNATURE_STEPS.map((st, i) => {
          const isActive = activeStep === i;
          const StepIcon = st.icon;
          return (
            <div key={st.step} className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all ${
                  isActive
                    ? "bg-violet-600/25 border-violet-500/50 text-white shadow-sm shadow-violet-500/20"
                    : "bg-[#0b0e17] border-white/10 text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <StepIcon className={`w-3 h-3 ${isActive ? "text-violet-400" : "text-white/40"}`} />
                <span className="font-semibold">{st.label}</span>
              </button>
              {i < SIGNATURE_STEPS.length - 1 && (
                <span className="text-white/20 text-xs font-mono">→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── 03 FUNCTIONAL PERSONAL MODULE: NOW BUILDING ──────────────────── */}
      <div className="w-full relative z-10 rounded-2xl bg-[#090c16]/95 border border-white/10 backdrop-blur-xl p-5 sm:p-6 shadow-2xl hover:border-violet-500/30 transition-colors">
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-violet-300 uppercase">
              NOW BUILDING
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
            {nowBuildingStatus}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {nowBuildingTitle}
        </h3>
        <p className="mt-1.5 text-xs text-white/65 leading-relaxed">
          {nowBuildingDescription}
        </p>

        {/* Tech Stack Pills */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {nowBuildingStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-md bg-[#13182b] border border-white/5 text-[10px] font-mono text-violet-300/80"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Current Focus Bullets */}
        {nowBuildingFocus && nowBuildingFocus.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-white/5 space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 font-semibold">
              Current Engineering Focus:
            </p>
            <ul className="space-y-1 text-xs text-white/70">
              {nowBuildingFocus.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-violet-400 font-mono text-[10px] mt-0.5">▹</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Link */}
        {nowBuildingLink && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <Link
              href={nowBuildingLink}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-violet-300 hover:text-white transition-colors group"
            >
              <span>Explore build architecture</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <span className="text-[10px] font-mono text-white/30">Updated live</span>
          </div>
        )}
      </div>
    </div>
  );
}
