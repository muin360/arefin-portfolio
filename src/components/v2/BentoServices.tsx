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
} from "lucide-react";
import type { Service, Project } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";

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
    tools: ["MongoDB Vector Search", "Pinecone", "Embeddings"],
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
  const [activeTab, setActiveTab] = useState("all");

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

  const tabs = [
    { id: "all", label: "All", count: capabilities.length },
    ...capabilities.map((c) => ({ id: c.id, label: c.tabLabel })),
  ];

  const displayedCapabilities =
    activeTab === "all"
      ? capabilities
      : capabilities.filter((c) => c.id === activeTab);

  return (
    <div className="w-full space-y-6">
      {/* ─── 02 / CAPABILITIES FUNCTIONAL CONTROLLER PLATE ─────────────────── */}
      <SectionPlate
        index="02"
        title="CAPABILITIES"
        sectionId="services"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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

      {/* ─── DYNAMIC CAPABILITY ARCHITECTURE LIST ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {displayedCapabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.id}
              className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                      {cap.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                  {cap.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                  {cap.explanation}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1 font-mono text-xs">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                    Problem Solved:
                  </span>
                  <p className="text-white/80 text-xs leading-relaxed">
                    {cap.problemSolved}
                  </p>
                </div>
              </div>

              {/* Bottom: Connected Real Case Study & Production Tools */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {cap.tools.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-[#121622] border border-white/5 text-[10px] text-white/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${cap.relatedProjectSlug}`}
                  className="inline-flex items-center gap-1.5 text-violet-300 hover:text-white font-medium text-[11px] transition-colors shrink-0 group/link"
                >
                  <span>View related work</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform text-violet-400" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
