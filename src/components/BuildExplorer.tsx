"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  FileInput,
  Brain,
  Bot,
  Wrench,
  Database,
  GitBranch,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  ExternalLink,
} from "lucide-react";
import type { WorkflowStep, WorkflowStepType } from "@/lib/db/types";
import { trackBuildExplorerOpen, trackBuildStepClick } from "@/lib/track-event";

interface BuildExplorerProps {
  workflowSteps?: WorkflowStep[];
  projectTitle?: string;
  projectSlug?: string;
  className?: string;
}

const STEP_TYPE_CONFIG: Record<
  WorkflowStepType | "default",
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
  }
> = {
  trigger: {
    label: "TRIGGER",
    icon: Zap,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.2)",
  },
  input: {
    label: "DATA INPUT",
    icon: FileInput,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    glowColor: "rgba(56, 189, 248, 0.2)",
  },
  ai: {
    label: "AI REASONING",
    icon: Brain,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    glowColor: "rgba(168, 85, 247, 0.25)",
  },
  agent: {
    label: "AGENT ROUTER",
    icon: Bot,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    glowColor: "rgba(192, 132, 252, 0.25)",
  },
  tool: {
    label: "TOOL / API",
    icon: Wrench,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    glowColor: "rgba(52, 211, 153, 0.2)",
  },
  database: {
    label: "DATABASE / VECTOR",
    icon: Database,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    glowColor: "rgba(6, 182, 212, 0.2)",
  },
  decision: {
    label: "DECISION LOGIC",
    icon: GitBranch,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    glowColor: "rgba(99, 102, 241, 0.2)",
  },
  output: {
    label: "OUTPUT / HANDOFF",
    icon: CheckCircle2,
    color: "text-emerald-300",
    bgColor: "bg-emerald-500/15",
    borderColor: "border-emerald-400/40",
    glowColor: "rgba(110, 231, 183, 0.25)",
  },
  default: {
    label: "STAGE",
    icon: Layers,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    glowColor: "rgba(168, 85, 247, 0.2)",
  },
};

/** Normalize step type from string or heuristics */
function detectStepType(step: WorkflowStep, index: number, total: number): WorkflowStepType {
  if (step.type) return step.type;
  const name = (step.name || step.title || "").toLowerCase();
  const desc = (step.desc || step.description || "").toLowerCase();
  const combined = `${name} ${desc}`;

  if (combined.includes("trigger") || combined.includes("webhook") || index === 0) return "trigger";
  if (combined.includes("database") || combined.includes("vector") || combined.includes("pinecone") || combined.includes("mongo")) return "database";
  if (combined.includes("agent") || combined.includes("autonomous") || combined.includes("routing")) return "agent";
  if (combined.includes("ai") || combined.includes("llm") || combined.includes("reasoning") || combined.includes("gpt") || combined.includes("claude")) return "ai";
  if (combined.includes("tool") || combined.includes("api") || combined.includes("integration") || combined.includes("connector")) return "tool";
  if (combined.includes("decision") || combined.includes("condition") || combined.includes("check") || combined.includes("validation")) return "decision";
  if (combined.includes("output") || combined.includes("handoff") || combined.includes("response") || combined.includes("notify") || index === total - 1) return "output";
  if (combined.includes("input") || combined.includes("payload") || combined.includes("parse")) return "input";

  return "default" as WorkflowStepType;
}

export default function BuildExplorer({
  workflowSteps = [],
  projectTitle = "Project",
  projectSlug = "",
  className = "",
}: BuildExplorerProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  useEffect(() => {
    if (projectSlug && workflowSteps && workflowSteps.length > 0) {
      trackBuildExplorerOpen(projectSlug);
    }
  }, [projectSlug, workflowSteps]);

  // Empty safety check: never render an empty diagram
  if (!workflowSteps || workflowSteps.length === 0) {
    return null;
  }

  const activeStep = workflowSteps[selectedIdx] || workflowSteps[0];
  const activeType = detectStepType(activeStep, selectedIdx, workflowSteps.length);
  const activeConfig = STEP_TYPE_CONFIG[activeType] || STEP_TYPE_CONFIG.default;

  const handleSelectNode = (idx: number, stepType: string) => {
    setSelectedIdx(idx);
    trackBuildStepClick(stepType, projectSlug);
  };

  return (
    <div
      className={`rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-5 sm:p-8 space-y-6 overflow-hidden ${className}`}
      aria-label={`${projectTitle} Interactive Build Explorer`}
    >
      {/* ─── HEADER & CONTROLS ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-violet-400 uppercase">
                Interactive Build Explorer
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Live Architecture Pipeline Trace
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-white/40">
          <span className="text-[11px]">
            {workflowSteps.length} Verified Execution {workflowSteps.length === 1 ? "Stage" : "Stages"}
          </span>
        </div>
      </div>

      {/* ─── DESKTOP PIPELINE FLOW (Horizontal Nodes + Traveling Signal) ──── */}
      <div className="hidden md:block relative pt-4 pb-2">
        {/* Continuous Pipeline Connector Track */}
        <div className="absolute top-[38px] left-6 right-6 h-[2px] bg-white/[0.08] pointer-events-none" />

        {/* Traveling Signal Pulse (Respects prefers-reduced-motion) */}
        <div
          className="absolute top-[37px] h-[4px] w-16 rounded-full bg-gradient-to-r from-transparent via-violet-400 to-transparent pointer-events-none motion-reduce:hidden animate-signal-travel"
          style={{
            animation: "signal-travel 3s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
          aria-hidden="true"
        />

        {/* Node Chips */}
        <div className="grid grid-flow-col auto-cols-fr gap-3 relative z-10">
          {workflowSteps.map((step, idx) => {
            const stepType = detectStepType(step, idx, workflowSteps.length);
            const conf = STEP_TYPE_CONFIG[stepType] || STEP_TYPE_CONFIG.default;
            const Icon = conf.icon;
            const isSelected = selectedIdx === idx;
            const stepNumber = step.step || `0${idx + 1}`;
            const stepTitle = step.name || step.title || `Stage ${idx + 1}`;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectNode(idx, stepType)}
                aria-pressed={isSelected}
                data-selected={isSelected ? "true" : "false"}
                className={`group flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
                  isSelected
                    ? `${conf.bgColor} ${conf.borderColor} shadow-lg shadow-black/40 scale-[1.03]`
                    : "bg-[#07090e]/90 border-white/[0.08] hover:border-white/20 hover:bg-[#0e121d]"
                }`}
              >
                {/* Stage Circular Icon Anchor */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 border transition-transform duration-300 ${
                    isSelected
                      ? `${conf.bgColor} ${conf.borderColor} ${conf.color} scale-110 shadow-md`
                      : "bg-[#121622] border-white/10 text-white/50 group-hover:text-white/80 group-hover:scale-105"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Stage Type & Number */}
                <span
                  className={`font-mono text-[9px] font-bold tracking-widest uppercase mb-1 ${
                    isSelected ? conf.color : "text-white/40 group-hover:text-white/60"
                  }`}
                >
                  {stepNumber} · {conf.label.split(" ")[0]}
                </span>

                {/* Stage Title */}
                <span
                  className={`text-xs font-semibold line-clamp-1 transition-colors ${
                    isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                  }`}
                >
                  {stepTitle}
                </span>

                {/* Tool Tag if present */}
                {step.tool && (
                  <span className="mt-1.5 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/5 font-mono text-[8px] text-white/50 truncate max-w-full">
                    {step.tool}
                  </span>
                )}

                {/* Active Indicator Arrow */}
                {isSelected && (
                  <div
                    className="absolute -bottom-2 w-2.5 h-2.5 bg-[#0c0f18] border-r border-b border-violet-500/40 rotate-45"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── MOBILE PIPELINE FLOW (Vertical Interactive Timeline) ─────────── */}
      <div className="block md:hidden space-y-2 relative">
        <div className="flex flex-col space-y-2">
          {workflowSteps.map((step, idx) => {
            const stepType = detectStepType(step, idx, workflowSteps.length);
            const conf = STEP_TYPE_CONFIG[stepType] || STEP_TYPE_CONFIG.default;
            const Icon = conf.icon;
            const isSelected = selectedIdx === idx;
            const stepNumber = step.step || `0${idx + 1}`;
            const stepTitle = step.name || step.title || `Stage ${idx + 1}`;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectNode(idx, stepType)}
                aria-pressed={isSelected}
                data-selected={isSelected ? "true" : "false"}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? `${conf.bgColor} ${conf.borderColor} shadow-md`
                    : "bg-[#07090e]/80 border-white/[0.08] hover:bg-[#0e121d]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? `${conf.bgColor} ${conf.borderColor} ${conf.color}`
                        : "bg-[#121622] border-white/10 text-white/50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40">
                      <span className={isSelected ? conf.color : ""}>{stepNumber}</span>
                      <span>·</span>
                      <span className="uppercase">{conf.label}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold truncate block ${
                        isSelected ? "text-white" : "text-white/70"
                      }`}
                    >
                      {stepTitle}
                    </span>
                  </div>
                </div>

                {step.tool && (
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/[0.04] text-white/60 shrink-0 ml-2 border border-white/5">
                    {step.tool}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── INTERACTIVE NODE DETAIL INSPECTOR ─────────────────────────────── */}
      <div
        className={`p-5 sm:p-6 rounded-xl border transition-all duration-300 ${activeConfig.bgColor} ${activeConfig.borderColor}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span
                className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] border ${activeConfig.bgColor} ${activeConfig.borderColor} ${activeConfig.color}`}
              >
                Stage {activeStep.step || `0${selectedIdx + 1}`} · {activeConfig.label}
              </span>

              {activeStep.tool && (
                <span className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-white/70 text-[10px]">
                  Tool: <strong className="text-white">{activeStep.tool}</strong>
                </span>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {activeStep.name || activeStep.title || "Architecture Execution Step"}
            </h4>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-3xl">
              {activeStep.desc ||
                activeStep.description ||
                "Deterministic execution node processing input payloads, triggering downstream events, or persisting vector embeddings."}
            </p>
          </div>

          {/* Connected Capability or Journal Link */}
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
            {activeStep.serviceSlug ? (
              <Link
                href={`/services#${activeStep.serviceSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 hover:border-violet-500/40 text-violet-300 text-xs font-mono transition-colors"
              >
                <span>Related Capability</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 hover:border-violet-500/40 text-violet-300 text-xs font-mono transition-colors"
              >
                <span>Explore Capabilities</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}

            {activeStep.postSlug && (
              <Link
                href={`/blog/${activeStep.postSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 hover:border-violet-500/40 text-white/70 hover:text-white text-xs font-mono transition-colors"
              >
                <span>Read Build Note</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
