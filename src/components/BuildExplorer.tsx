"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import type { WorkflowStep } from "@/lib/db/types";
import {
  trackBuildExplorerOpen,
  trackBuildStepClick,
  trackBlueprintCopySpecs,
} from "@/lib/track-event";
import { formatBlueprintNodes } from "./blueprint/types";
import SystemBlueprint from "./blueprint/SystemBlueprint";

interface BuildExplorerProps {
  workflowSteps?: WorkflowStep[];
  projectTitle?: string;
  projectSlug?: string;
  className?: string;
}

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

export default function BuildExplorer({
  workflowSteps = DEFAULT_WORKFLOW_STEPS,
  projectTitle = "Production Architecture Blueprint",
  projectSlug = "general",
  className = "",
}: BuildExplorerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackBuildExplorerOpen(projectSlug);
  }, [projectSlug]);

  const nodes = useMemo(() => {
    return formatBlueprintNodes(workflowSteps);
  }, [workflowSteps]);

  const handleSelectNode = useCallback(
    (idx: number) => {
      setSelectedIdx(idx);
      const selected = nodes[idx];
      if (selected) {
        trackBuildStepClick(selected.type, projectSlug);
      }
    },
    [nodes, projectSlug],
  );

  const handleCopyBlueprint = () => {
    const summary = nodes
      .map(
        (n) =>
          `[Stage ${n.stepNumber} · ${n.config.label}]\nTitle: ${n.title}\nEngine: ${
            n.tool || "Custom Integration"
          }\nFunction: ${n.description}\nPurpose: ${n.config.whyItExists}`,
      )
      .join("\n\n----------------------------------------\n\n");

    navigator.clipboard.writeText(
      `=== ${projectTitle.toUpperCase()} ===\nSYSTEM ARCHITECTURE BLUEPRINT\n\n${summary}`,
    );
    setCopied(true);
    trackBlueprintCopySpecs(projectSlug);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPct = ((selectedIdx + 1) / Math.max(1, nodes.length)) * 100;

  return (
    <div
      className={`rounded-2xl bg-[#090c14] border border-[#1b2233] p-5 sm:p-7 relative overflow-hidden shadow-2xl ${className}`}
    >
      {/* Subtle architectural background technical lines */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)",
          backgroundSize: "20px 20px, 80px 80px",
        }}
        aria-hidden="true"
      />

      {/* ─── 01 EDITORIAL BLUEPRINT HEADER ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_#a78bfa]" />
            <span className="font-mono text-[10px] sm:text-xs font-bold text-violet-300 uppercase tracking-widest">
              Interactive System Blueprint
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {projectTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Copy Architecture Specifications Button */}
          <button
            type="button"
            onClick={handleCopyBlueprint}
            aria-label="Copy blueprint architecture specification"
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Specs Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-violet-400" />
                <span>Copy Specs</span>
              </>
            )}
          </button>

          <span className="font-mono text-xs px-2.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 font-semibold">
            {nodes.length} Pipeline Stages
          </span>
        </div>
      </div>

      {/* ─── 02 ARCHITECTURAL PROGRESS BAR ───────────────────────────────── */}
      <div className="w-full bg-white/[0.04] h-1 rounded-full my-5 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-indigo-400 to-emerald-400 transition-all duration-300 rounded-full"
          style={{ width: `${progressPct}%` }}
          aria-hidden="true"
        />
      </div>

      {/* ─── 03 ASYMMETRIC SYSTEM BLUEPRINT FLOW ─────────────────────────── */}
      <SystemBlueprint
        nodes={nodes}
        selectedIndex={selectedIdx}
        onSelectNode={handleSelectNode}
      />
    </div>
  );
}
