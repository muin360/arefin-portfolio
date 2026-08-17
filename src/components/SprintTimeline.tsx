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
import SectionPlate from "@/components/SectionPlate";

interface PipelineStep {
  id: string;
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
    id: "01",
    step: "01",
    name: "Map",
    subtitle: "Workflow Discovery & Scoping",
    desc: "We analyze your existing manual bottlenecks, list all target business applications, and map out the exact trigger events and data payloads.",
    icon: Compass,
    deliverables: ["Process flowchart", "Tool & API inventory", "Defined edge case rules"],
    duration: "Day 1–2",
  },
  {
    id: "02",
    step: "02",
    name: "Design",
    subtitle: "Architecture & Schema Blueprint",
    desc: "Drafting the deterministic logic schemas, system prompts, retrieval strategies, error handling loops, and API contracts before writing code.",
    icon: Layers,
    deliverables: ["Node architecture map", "Structured JSON schemas", "Prompt specifications"],
    duration: "Day 3–4",
  },
  {
    id: "03",
    step: "03",
    name: "Build",
    subtitle: "Core AI & Logic Implementation",
    desc: "Assembling the n8n or LangChain pipelines, wiring up LLM reasoning, vector stores, and custom Python/JavaScript transformation glue.",
    icon: Code2,
    deliverables: ["Working execution pipeline", "Validated prompt templates", "Webhook receivers"],
    duration: "Day 5–8",
  },
  {
    id: "04",
    step: "04",
    name: "Connect",
    subtitle: "API & Tool Integrations",
    desc: "Integrating CRM, Slack, Google Sheets, Gmail, database nodes, and external third-party endpoints with authenticated credentials.",
    icon: Workflow,
    deliverables: ["Authenticated API endpoints", "Webhook triggers", "Destination payloads"],
    duration: "Day 9–10",
  },
  {
    id: "05",
    step: "05",
    name: "Test",
    subtitle: "Edge Cases & Stress Testing",
    desc: "Simulating malformed inputs, rate limits, timeout recoveries, and token budget limits to ensure rock-solid production reliability.",
    icon: CheckCircle2,
    deliverables: ["Test execution log", "Edge case coverage report", "Zero-hallucination verification"],
    duration: "Day 11–12",
  },
  {
    id: "06",
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
  const [activeId, setActiveId] = useState("01");
  const activeStep = PIPELINE_STEPS.findIndex((s) => s.id === activeId);
  const current = PIPELINE_STEPS[activeStep >= 0 ? activeStep : 0];
  const StepIcon = current.icon;

  const tabs = PIPELINE_STEPS.map((s) => ({
    id: s.id,
    label: `${s.step} ${s.name}`,
  }));

  return (
    <div className="w-full space-y-6">
      {/* ─── FUNCTIONAL PROCESS PLATE ──────────────────────────────────── */}
      <SectionPlate
        index="04"
        title="BUILD LOOP"
        tabs={tabs}
        activeTab={activeId}
        onTabChange={setActiveId}
      />

      {/* ─── ACTIVE PHASE DEEP DIVE SPECIFICATION ────────────────────────── */}
      <div className="rounded-2xl bg-[#090c16] border border-white/[0.08] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs text-violet-400">
            <span className="font-semibold uppercase tracking-wider">
              Phase {current.step}
            </span>
            <span>·</span>
            <span className="text-white/50">{current.duration}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <StepIcon className="w-5 h-5 text-violet-400 shrink-0" />
            <span>{current.name}: {current.subtitle}</span>
          </h3>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans pt-1">
            {current.desc}
          </p>
        </div>

        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0e1224] border border-white/5 space-y-3 font-mono text-xs">
          <span className="text-[11px] text-white/50 font-semibold uppercase tracking-wider block">
            Deliverables:
          </span>

          <ul className="space-y-2 text-white/80">
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
  );
}
