"use client";

import { useState } from "react";
import {
  Compass,
  Layers,
  Code2,
  Workflow,
  CheckCircle2,
  Rocket,
} from "lucide-react";

interface PipelineStep {
  step: string;
  name: string;
  subtitle: string;
  desc: string;
  icon: typeof Compass;
  deliverables: string[];
  duration: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    step: "01",
    name: "Map",
    subtitle: "Workflow Discovery & Scoping",
    desc: "We analyze your existing manual bottlenecks, list all target business applications, and map out the exact trigger events and data payloads.",
    icon: Compass,
    deliverables: ["Process flowchart", "Tool & API inventory", "Defined edge case rules"],
    duration: "Day 1–2",
  },
  {
    step: "02",
    name: "Design",
    subtitle: "Architecture & Schema Blueprint",
    desc: "Drafting the deterministic logic schemas, system prompts, retrieval strategies, error handling loops, and API contracts before writing code.",
    icon: Layers,
    deliverables: ["Node architecture map", "Structured JSON schemas", "Prompt specifications"],
    duration: "Day 3–4",
  },
  {
    step: "03",
    name: "Build",
    subtitle: "Core AI & Logic Implementation",
    desc: "Assembling the n8n or LangChain pipelines, wiring up LLM reasoning, vector stores, and custom Python/JavaScript transformation glue.",
    icon: Code2,
    deliverables: ["Working execution pipeline", "Validated prompt templates", "Webhook receivers"],
    duration: "Day 5–8",
  },
  {
    step: "04",
    name: "Connect",
    subtitle: "API & Tool Integrations",
    desc: "Integrating CRM, Slack, Google Sheets, Gmail, database nodes, and external third-party endpoints with authenticated credentials.",
    icon: Workflow,
    deliverables: ["Authenticated API endpoints", "Webhook triggers", "Destination payloads"],
    duration: "Day 9–10",
  },
  {
    step: "05",
    name: "Test",
    subtitle: "Edge Cases & Stress Testing",
    desc: "Simulating malformed inputs, rate limits, timeout recoveries, and token budget limits to ensure rock-solid production reliability.",
    icon: CheckCircle2,
    deliverables: ["Test execution log", "Edge case coverage report", "Zero-hallucination verification"],
    duration: "Day 11–12",
  },
  {
    step: "06",
    name: "Ship",
    subtitle: "Handover & 100% Client Ownership",
    desc: "Deploying directly into your own infrastructure/accounts, recording custom video walkthroughs, and delivering setup runbooks.",
    icon: Rocket,
    deliverables: ["Video walkthrough guide", "Written runbook", "100% account & code ownership"],
    duration: "Day 13–14",
  },
];

export default function SprintTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const current = PIPELINE_STEPS[activeStep];
  const StepIcon = current.icon;

  return (
    <div className="w-full space-y-6">
      {/* ─── SINGLE FLOWING PIPELINE LINE WITH 6 NODES ─────────────────── */}
      <div className="rounded-3xl bg-[#090c16] border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Horizontal Flow Line with 6 Connected Step Pins */}
        <div className="relative mb-8 pb-4">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-[2px] bg-white/10 -z-0 hidden sm:block" />

          {/* Active Flow Progress Line */}
          <div
            className="absolute top-5 left-6 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 transition-all duration-500 hidden sm:block"
            style={{
              width: `${(activeStep / (PIPELINE_STEPS.length - 1)) * 100}%`,
              maxWidth: "calc(100% - 3rem)",
            }}
          />

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 sm:gap-2 relative z-10">
            {PIPELINE_STEPS.map((s, idx) => {
              const isSelected = activeStep === idx;
              const isPassed = idx <= activeStep;
              const Icon = s.icon;

              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all group ${
                    isSelected
                      ? "bg-[#141a2e] border-violet-400 shadow-lg shadow-violet-950/50 scale-105"
                      : isPassed
                      ? "bg-[#0c0f1e] border-white/20 text-white"
                      : "bg-[#080b16] border-white/5 text-white/40 hover:border-white/15"
                  }`}
                >
                  {/* Node Icon Circle */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors mb-2 ${
                      isSelected
                        ? "bg-violet-600 text-white shadow-[0_0_12px_#8b5cf6]"
                        : isPassed
                        ? "bg-[#1a2238] text-violet-300 border border-violet-500/30"
                        : "bg-[#111422] text-white/40 border border-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span className="text-[10px] font-mono font-bold text-white/50 tracking-wider">
                    {s.step}
                  </span>
                  <span className="text-xs font-bold text-white tracking-tight mt-0.5">
                    {s.name}
                  </span>
                  <span className="text-[9px] font-mono text-white/40 mt-1">
                    {s.duration}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── ACTIVE STEP DEEP-DIVE SPECIFICATION ─────────────────────────── */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1224] border border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 font-mono text-[10px] uppercase tracking-widest font-semibold">
                PHASE {current.step} · {current.duration}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <StepIcon className="w-6 h-6 text-violet-400 shrink-0" />
              <span>{current.name}: {current.subtitle}</span>
            </h3>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans pt-1">
              {current.desc}
            </p>
          </div>

          <div className="lg:col-span-5 p-5 rounded-xl bg-[#080b16] border border-white/10 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Concrete Deliverables
            </span>

            <ul className="space-y-2 text-xs font-mono text-white/80">
              {current.deliverables.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-violet-400 text-[11px] mt-0.5">▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
