"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Workflow,
  Bot,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface CapabilityNode {
  step: string;
  category: string;
  name: string;
  purpose: string;
  tech: string[];
  projectTitle: string;
  projectSlug: string;
  icon: typeof Workflow;
  accent: string;
}

const CAPABILITIES: CapabilityNode[] = [
  {
    step: "01",
    category: "INGESTION & TRIGGER",
    name: "AI Workflow Automation",
    purpose: "Event-driven pipelines connecting webhooks, inbox triage, and CRM records to eliminate repetitive operational chores.",
    tech: ["n8n", "Make", "Zapier", "Webhooks", "JSON"],
    projectTitle: "Email Automation & Smart Triage",
    projectSlug: "email-automation-smart-triage",
    icon: Workflow,
    accent: "text-violet-400 border-violet-500/30 bg-violet-600/10",
  },
  {
    step: "02",
    category: "REASONING & ROUTING",
    name: "AI Agents & Autonomous Assistants",
    purpose: "Autonomous reasoning agents equipped with tool calling, schema validation, and deterministic conditional routing.",
    tech: ["LangChain", "OpenAI API", "Claude 3.5", "Python"],
    projectTitle: "Customer Support Q&A Bot",
    projectSlug: "customer-support-qa-bot",
    icon: Bot,
    accent: "text-cyan-400 border-cyan-500/30 bg-cyan-600/10",
  },
  {
    step: "03",
    category: "KNOWLEDGE GROUNDING",
    name: "RAG & Knowledge Retrieval",
    purpose: "Context-aware question answering with semantic vector chunking, metadata filters, and zero hallucination guardrails.",
    tech: ["MongoDB Vector Search", "Pinecone", "Embeddings"],
    projectTitle: "RAG Knowledge Base Assistant",
    projectSlug: "rag-knowledge-base-assistant",
    icon: Brain,
    accent: "text-emerald-400 border-emerald-500/30 bg-emerald-600/10",
  },
  {
    step: "04",
    category: "MULTI-AGENT COLLABORATION",
    name: "Multi-Agent System Networks",
    purpose: "Coordinated crews of specialized agents (Researcher, Data Analyst, Writer, Critic) handling multi-phase synthesis.",
    tech: ["LangGraph", "CrewAI", "Python", "REST APIs"],
    projectTitle: "Market Research Multi-Agent System",
    projectSlug: "market-research-multi-agent-system",
    icon: Layers,
    accent: "text-indigo-400 border-indigo-500/30 bg-indigo-600/10",
  },
  {
    step: "05",
    category: "DESTINATION & SIDE-EFFECTS",
    name: "Tools, APIs & Business Output",
    purpose: "Clean execution of external mutations: database writes, ticket handoffs, Slack dispatches, and human-in-the-loop signoff.",
    tech: ["REST APIs", "Gmail API", "Google Sheets", "Slack"],
    projectTitle: "Social Media Content Generator",
    projectSlug: "social-media-content-generator",
    icon: CheckCircle2,
    accent: "text-amber-400 border-amber-500/30 bg-amber-600/10",
  },
];

export default function BentoServices() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeCap = CAPABILITIES[selectedIdx];
  const ActiveIcon = activeCap.icon;

  return (
    <div className="w-full space-y-6">
      {/* ─── SYSTEM TOPOLOGY FLOW PIPELINE ───────────────────────────────── */}
      <div className="rounded-3xl bg-[#090c16] border border-white/10 p-6 sm:p-8 shadow-2xl">
        {/* Step Flow Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {CAPABILITIES.map((cap, i) => {
            const isCurrent = selectedIdx === i;
            const Icon = cap.icon;
            return (
              <button
                key={cap.step}
                type="button"
                onClick={() => setSelectedIdx(i)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative ${
                  isCurrent
                    ? "bg-[#141a2e] border-violet-500/50 shadow-md shadow-violet-900/20"
                    : "bg-[#0c0f1d] border-white/5 hover:border-white/15 hover:bg-[#101426]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-mono text-[10px] font-bold text-white/40">
                    {cap.step}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isCurrent ? "text-violet-400" : "text-white/30"
                    }`}
                  />
                </div>
                <span className="text-[11px] font-bold text-white font-mono truncate w-full">
                  {cap.name.split(" ")[0]} {cap.name.split(" ")[1] || ""}
                </span>
                <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider mt-0.5 truncate w-full">
                  {cap.category.split(" ")[0]}
                </span>

                {isCurrent && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-violet-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── ACTIVE CAPABILITY DETAILED STAGE VIEW ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch p-6 rounded-2xl bg-[#0e1224] border border-white/[0.08]">
          {/* Left: Capability Spec */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest text-violet-300">
                  STAGE {activeCap.step} · {activeCap.category}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5 mt-1">
                <ActiveIcon className="w-6 h-6 text-violet-400 shrink-0" />
                <span>{activeCap.name}</span>
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                {activeCap.purpose}
              </p>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-semibold block">
                Production Tech Layer:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeCap.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md bg-[#161d36] border border-white/5 font-mono text-[11px] text-violet-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Connected Real Project Anchor */}
          <div className="lg:col-span-5 rounded-xl bg-[#080b16] border border-white/10 p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Proven In Real Case Study
              </span>
              <h4 className="text-base font-bold text-white tracking-tight mt-2">
                {activeCap.projectTitle}
              </h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed font-mono text-[11px]">
                Full end-to-end implementation with verified architecture and error recovery.
              </p>
            </div>

            <Link
              href={`/projects/${activeCap.projectSlug}`}
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 hover:text-white border border-violet-500/30 text-xs font-mono font-semibold transition-colors group"
            >
              <span>Explore Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Direct Service Index Link */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-white/40">
        <span>05 distinct pipeline specializations</span>
        <Link
          href="/services"
          className="text-violet-400 hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          <span>View all service blueprints</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
