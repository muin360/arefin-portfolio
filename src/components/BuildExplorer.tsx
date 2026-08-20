"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  Layers,
  Box,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import type { WorkflowStep, WorkflowStepType } from "@/lib/db/types";
import {
  trackBuildExplorerOpen,
  trackBuildStepClick,
  trackBuildExplorer3DOpen,
} from "@/lib/track-event";
import BuildExplorer3DSkeleton from "./build-explorer/BuildExplorer3DSkeleton";

const BuildExplorer3D = dynamic(
  () => import("./build-explorer/BuildExplorer3D"),
  {
    ssr: false,
    loading: () => <BuildExplorer3DSkeleton />,
  },
);

interface BuildExplorerProps {
  workflowSteps?: WorkflowStep[];
  projectTitle?: string;
  projectSlug?: string;
  className?: string;
  initialMode?: "2d" | "3d";
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
    borderColor: "border-emerald-500/35",
    glowColor: "rgba(52, 211, 153, 0.25)",
  },
  default: {
    label: "PIPELINE STAGE",
    icon: Layers,
    color: "text-slate-300",
    bgColor: "bg-white/[0.04]",
    borderColor: "border-white/10",
    glowColor: "rgba(255, 255, 255, 0.1)",
  },
};

const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    name: "Event & Webhook Trigger",
    type: "trigger",
    tool: "Webhook / HTTP",
    desc: "Ingests raw event payloads from Webhooks, Stripe events, or CRM data pipelines with schema validation.",
  },
  {
    step: "02",
    name: "Context Extraction & Vector Search",
    type: "database",
    tool: "Pinecone / MongoDB",
    desc: "Performs hybrid dense-sparse vector similarity search to retrieve relevant enterprise documentation.",
  },
  {
    step: "03",
    name: "Autonomous LLM Reasoning & Tool Routing",
    type: "agent",
    tool: "LangChain / OpenAI",
    desc: "Executes tool calling and policy decisions with structured JSON output and deterministic guardrails.",
  },
  {
    step: "04",
    name: "Automated Dispatch & Human Handoff",
    type: "output",
    tool: "n8n / REST API",
    desc: "Dispatches sanitized output to downstream CRM, WhatsApp, Slack, or triggers human escalation workflows.",
  },
];

function detectStepType(
  step: WorkflowStep,
  idx: number,
  total: number,
): WorkflowStepType | "default" {
  if (step.type) return step.type;
  const nameLower = (step.name || step.title || "").toLowerCase();
  const toolLower = (step.tool || "").toLowerCase();

  if (nameLower.includes("trigger") || nameLower.includes("webhook") || idx === 0)
    return "trigger";
  if (
    nameLower.includes("vector") ||
    nameLower.includes("database") ||
    toolLower.includes("mongo") ||
    toolLower.includes("pinecone")
  )
    return "database";
  if (
    nameLower.includes("reason") ||
    nameLower.includes("agent") ||
    toolLower.includes("langchain")
  )
    return "agent";
  if (
    nameLower.includes("output") ||
    nameLower.includes("dispatch") ||
    idx === total - 1
  )
    return "output";
  return "default";
}

export default function BuildExplorer({
  workflowSteps = DEFAULT_WORKFLOW_STEPS,
  projectTitle = "Production Architecture Blueprint",
  projectSlug = "general",
  className = "",
  initialMode = "2d",
}: BuildExplorerProps) {
  const [mode, setMode] = useState<"2d" | "3d">(initialMode);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackBuildExplorerOpen(projectSlug);

    // Defer client preference check to post-mount to guarantee zero hydration mismatch
    const timer = setTimeout(() => {
      try {
        const savedMode = localStorage.getItem("arefin_build_explorer_mode");
        if (savedMode === "2d" || savedMode === "3d") {
          setMode(savedMode);
        } else if (window.innerWidth >= 1024) {
          const canvas = document.createElement("canvas");
          const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
          if (gl) setMode("3d");
        }
      } catch {
        // In SSR or incognito mode keep initialMode
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [projectSlug]);

  const activeStep = workflowSteps[selectedIdx] || workflowSteps[0];
  const activeType = detectStepType(activeStep, selectedIdx, workflowSteps.length);
  const activeConfig = STEP_TYPE_CONFIG[activeType] || STEP_TYPE_CONFIG.default;

  const handleSelectNode = useCallback(
    (idx: number, stepType?: string) => {
      setSelectedIdx(idx);
      const sType =
        stepType ||
        detectStepType(workflowSteps[idx], idx, workflowSteps.length);
      trackBuildStepClick(sType, projectSlug);
    },
    [projectSlug, workflowSteps],
  );

  const handleModeChange = (newMode: "2d" | "3d") => {
    setMode(newMode);
    try {
      localStorage.setItem("arefin_build_explorer_mode", newMode);
    } catch {
      // Ignore quota/private mode errors
    }
    if (newMode === "3d") {
      trackBuildExplorer3DOpen(projectSlug);
    }
  };

  // Keyboard navigation for tablist
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = (selectedIdx + 1) % workflowSteps.length;
        handleSelectNode(next);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = (selectedIdx - 1 + workflowSteps.length) % workflowSteps.length;
        handleSelectNode(prev);
      }
    },
    [selectedIdx, workflowSteps.length, handleSelectNode],
  );

  const handleCopyBlueprint = () => {
    const summary = workflowSteps
      .map(
        (s, i) =>
          `Stage ${s.step || `0${i + 1}`}: ${s.name || s.title} [${s.tool || "Custom"}]\n${
            s.desc || s.description || ""
          }`,
      )
      .join("\n\n");

    navigator.clipboard.writeText(`${projectTitle} Architecture:\n\n${summary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPct = ((selectedIdx + 1) / workflowSteps.length) * 100;

  return (
    <div
      className={`rounded-2xl bg-[#0c101d] border border-white/[0.08] p-5 sm:p-7 relative overflow-hidden shadow-2xl ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Subtle background ambient flare */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700 opacity-20"
        style={{ backgroundColor: activeConfig.glowColor }}
        aria-hidden="true"
      />

      {/* ─── HEADER & CONTROL BAR ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_#a78bfa]" />
            <span className="font-mono text-[10px] sm:text-xs font-bold text-violet-300 uppercase tracking-widest">
              Interactive Execution Explorer
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {projectTitle}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 2D / 3D Mode Toggle Switch */}
          <div
            role="group"
            aria-label="View mode toggle"
            className="inline-flex p-1 rounded-xl bg-black/40 border border-white/10"
          >
            <button
              type="button"
              onClick={() => handleModeChange("2d")}
              aria-pressed={mode === "2d"}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                mode === "2d"
                  ? "bg-violet-600/30 text-white border border-violet-400/40 shadow-sm"
                  : "text-white/60 hover:text-white/90 hover:bg-white/[0.04]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D Specs</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("3d")}
              aria-pressed={mode === "3d"}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                mode === "3d"
                  ? "bg-violet-600/30 text-white border border-violet-400/40 shadow-sm"
                  : "text-white/60 hover:text-white/90 hover:bg-white/[0.04]"
              }`}
            >
              <Box className="w-3.5 h-3.5 text-violet-400" />
              <span>3D Spatial</span>
            </button>
          </div>

          {/* Copy Blueprint Specs */}
          <button
            type="button"
            onClick={handleCopyBlueprint}
            aria-label="Copy blueprint architecture"
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-violet-400" />
                <span>Copy Specs</span>
              </>
            )}
          </button>

          <span className="font-mono text-xs px-2.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 font-semibold">
            {workflowSteps.length} Stages
          </span>
        </div>
      </div>

      {/* ─── 3D SPATIAL MODE VIEW ────────────────────────────────────────── */}
      {mode === "3d" ? (
        <div className="pt-4">
          <BuildExplorer3D
            workflowSteps={workflowSteps}
            projectTitle={projectTitle}
            projectSlug={projectSlug}
            selectedIndex={selectedIdx}
            onSelectIndex={handleSelectNode}
            onFallbackTo2D={() => handleModeChange("2d")}
          />
        </div>
      ) : (
        /* ─── 2D CANONICAL SPECIFICATION BLUEPRINT ───────────────────────── */
        <>
          {/* Stage Completion Progress Bar */}
          <div className="w-full bg-white/[0.05] h-1.5 rounded-full my-4 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
              aria-hidden="true"
            />
          </div>

          {/* Pipeline Workflow Nodes Tablist */}
          <div
            role="tablist"
            aria-label="Pipeline execution stages"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-5"
          >
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
                  role="tab"
                  id={`stage-tab-${idx}`}
                  aria-selected={isSelected}
                  aria-controls={`stage-panel-${idx}`}
                  onClick={() => handleSelectNode(idx, stepType)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 ${
                    isSelected
                      ? `${conf.bgColor} ${conf.borderColor} shadow-lg shadow-black/40 scale-[1.02]`
                      : "bg-[#07090e]/80 border-white/[0.08] hover:bg-[#0e121d] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? `${conf.bgColor} ${conf.borderColor} ${conf.color}`
                          : "bg-[#121622] border-white/10 text-white/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        isSelected ? conf.color : "text-white/40"
                      }`}
                    >
                      {stepNumber}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block">
                      {conf.label}
                    </span>
                    <span
                      className={`text-xs font-semibold block truncate mt-0.5 ${
                        isSelected ? "text-white" : "text-white/70"
                      }`}
                    >
                      {stepTitle}
                    </span>
                  </div>

                  {step.tool && (
                    <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/[0.04] text-white/60 border border-white/5 truncate block">
                      {step.tool}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Stage Details Panel */}
          <div
            role="tabpanel"
            id={`stage-panel-${selectedIdx}`}
            aria-labelledby={`stage-tab-${selectedIdx}`}
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
                    <span className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-white/80 text-[10px]">
                      Engine / Tool: <strong className="text-white">{activeStep.tool}</strong>
                    </span>
                  )}
                </div>

                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeStep.name || activeStep.title || "Architecture Execution Step"}
                </h4>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans max-w-3xl">
                  {activeStep.desc ||
                    activeStep.description ||
                    "Deterministic execution node processing input payloads, triggering downstream events, or persisting vector embeddings."}
                </p>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold transition-colors shadow-md shadow-violet-600/30"
                >
                  <span>Build this Flow</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                {activeStep.postSlug && (
                  <Link
                    href={`/blog/${activeStep.postSlug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors"
                  >
                    <span>Read Build Note</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
