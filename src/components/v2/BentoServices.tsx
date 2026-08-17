"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Workflow,
  Bot,
  Brain,
  Layers,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import type { Service, Project } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";

interface BentoServicesProps {
  services?: Service[];
  projects?: Project[];
}

interface CapabilityItem {
  id: string;
  tabLabel: string;
  category: string;
  title: string;
  explanation: string;
  problemSolved: string;
  tools: string[];
  relatedProjectTitle: string;
  relatedProjectSlug: string;
  icon: typeof Workflow;
}

const DEFAULT_CAPABILITIES: CapabilityItem[] = [
  {
    id: "automation",
    tabLabel: "Automation",
    category: "Workflow Automation",
    title: "Event-Driven Workflow Automation",
    explanation:
      "Automated operational pipelines connecting your inboxes, forms, CRMs, and internal databases to execute multi-step logic instantly upon trigger.",
    problemSolved:
      "Eliminates hours of manual data re-entry, triage lag, copy-pasting between SaaS tools, and human operational errors.",
    tools: ["n8n", "Make", "Zapier", "Webhooks", "JSON"],
    relatedProjectTitle: "Email Automation & Smart Triage",
    relatedProjectSlug: "email-automation-smart-triage",
    icon: Workflow,
  },
  {
    id: "agents",
    tabLabel: "AI Agents",
    category: "AI Agents",
    title: "Autonomous Tool-Calling Agents",
    explanation:
      "Context-aware AI agents that reason through user requests, query authorized tools/APIs, validate output schemas, and perform verified actions.",
    problemSolved:
      "Replaces static scripted bots with flexible agents capable of handling non-linear user requests, ambiguous queries, and structured data extraction.",
    tools: ["LangChain", "Claude 3.5", "OpenAI API", "Python"],
    relatedProjectTitle: "Customer Support Q&A Bot",
    relatedProjectSlug: "customer-support-qa-bot",
    icon: Bot,
  },
  {
    id: "rag",
    tabLabel: "RAG",
    category: "RAG Knowledge Retrieval",
    title: "Retrieval-Augmented Generation (RAG)",
    explanation:
      "Custom vector retrieval pipelines indexing your private documents, product manuals, and internal documentation with semantic chunking and source citations.",
    problemSolved:
      "Prevents LLM hallucinations by grounding every answer strictly in your verified private knowledge base with exact page and document references.",
    tools: ["MongoDB Vector Search", "Pinecone", "Embeddings", "FastAPI"],
    relatedProjectTitle: "RAG Knowledge Base Assistant",
    relatedProjectSlug: "rag-knowledge-base-assistant",
    icon: Brain,
  },
  {
    id: "multi-agent",
    tabLabel: "Multi-Agent",
    category: "Multi-Agent Systems",
    title: "Collaborative Multi-Agent Networks",
    explanation:
      "Coordinated networks of specialized agents (Researcher, Data Analyst, Technical Writer, Critic) executing asynchronous deep tasks.",
    problemSolved:
      "Handles long-horizon, high-complexity operations that exceed single-prompt context limits, ensuring thorough validation at each milestone.",
    tools: ["LangGraph", "CrewAI", "Python", "REST APIs"],
    relatedProjectTitle: "Market Research Multi-Agent System",
    relatedProjectSlug: "market-research-multi-agent-system",
    icon: Layers,
  },
];

export default function BentoServices({
  services = [],
  projects = [],
}: BentoServicesProps) {
  // Merge MongoDB services with capability items if available
  const capabilities = useMemo(() => {
    if (services.length === 0) return DEFAULT_CAPABILITIES;

    return services.map((srv, i) => {
      const relatedProject = projects.find((p) =>
        srv.relatedProjectIds?.includes(p.id)
      );

      const fallbackCap = DEFAULT_CAPABILITIES[i % DEFAULT_CAPABILITIES.length];

      return {
        id: srv.id,
        tabLabel: srv.title.split(" ")[0] || `Service ${i + 1}`,
        category: srv.title,
        title: srv.title,
        explanation: srv.hook || srv.solution || fallbackCap.explanation,
        problemSolved: srv.problem || srv.outcome || fallbackCap.problemSolved,
        tools: srv.bullets && srv.bullets.length > 0 ? srv.bullets : fallbackCap.tools,
        relatedProjectTitle:
          relatedProject?.title || fallbackCap.relatedProjectTitle,
        relatedProjectSlug:
          relatedProject?.slug || fallbackCap.relatedProjectSlug,
        icon: fallbackCap.icon,
      };
    });
  }, [services, projects]);

  const [selectedId, setSelectedId] = useState(capabilities[0]?.id || "automation");

  const tabs = capabilities.map((c) => ({
    id: c.id,
    label: c.tabLabel,
  }));

  const activeCap = capabilities.find((c) => c.id === selectedId) || capabilities[0];
  const ActiveIcon = activeCap.icon;

  return (
    <div className="w-full space-y-6">
      {/* ─── 02 / CAPABILITIES FUNCTIONAL CONTROLLER PLATE ─────────────────── */}
      <SectionPlate
        index="02"
        title="CAPABILITIES"
        sectionId="services"
        tabs={tabs}
        activeTab={selectedId}
        onTabChange={setSelectedId}
        action={
          <Link
            href="/services"
            className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
          >
            <span>All blueprints ({capabilities.length})</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        }
      />

      {/* ─── STRUCTURED ARCHITECTURAL BLUEPRINT DETAIL PANEL ───────────────── */}
      <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <ActiveIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-violet-400 font-semibold uppercase tracking-wider block">
                  {activeCap.category}
                </span>
                <span className="text-[11px] font-mono text-white/40">
                  Deterministic System Blueprint
                </span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              {activeCap.title}
            </h3>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
              {activeCap.explanation}
            </p>

            <div className="rounded-xl bg-[#121622]/80 border border-white/[0.06] p-4 space-y-1.5 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-violet-300 font-semibold text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Operational Outcome:</span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                {activeCap.problemSolved}
              </p>
            </div>

            {/* Production Stack Tags */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-white/40 mr-1">Stack:</span>
              {activeCap.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-lg bg-[#141828] border border-white/[0.08] text-xs font-mono text-white/70"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Right / Connected Case Study & Action Card (5 cols) */}
          <div className="lg:col-span-5 rounded-xl bg-[#121622] border border-white/[0.08] p-6 flex flex-col justify-between space-y-6 self-stretch">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <span>Verified Case Study</span>
              </div>

              <h4 className="text-lg font-bold text-white tracking-tight">
                {activeCap.relatedProjectTitle}
              </h4>

              <p className="text-xs text-white/60 leading-relaxed font-sans">
                Explore the complete production implementation, architecture flowchart, node logic, and measurable business impact.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <Button
                href={`/projects/${activeCap.relatedProjectSlug}`}
                variant="primary"
                size="md"
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                <span>Read Case Study</span>
              </Button>

              <Button
                href="/contact"
                variant="secondary"
                size="md"
                className="w-full"
              >
                <span>Scope This Capability</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
