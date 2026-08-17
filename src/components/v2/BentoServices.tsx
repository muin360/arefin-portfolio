"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Workflow,
  Bot,
  Brain,
  Layers,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import SectionPlate from "@/components/SectionPlate";

interface ServiceItem {
  id: string;
  category: string;
  tabLabel: string;
  title: string;
  whatItIs: string;
  problemSolved: string;
  tech: string[];
  projectTitle: string;
  projectSlug: string;
  icon: typeof Workflow;
}

const SERVICES: ServiceItem[] = [
  {
    id: "automation",
    category: "Workflow Automation",
    tabLabel: "Automation",
    title: "Event-Driven Workflow Automation",
    whatItIs:
      "Automated operational pipelines connecting your inboxes, forms, CRMs, and internal databases to execute multi-step business logic instantly upon trigger.",
    problemSolved:
      "Eliminates hours of manual data re-entry, triage lag, copy-pasting between SaaS tools, and human operational errors.",
    tech: ["n8n", "Make", "Zapier", "Webhooks", "JSON"],
    projectTitle: "Email Automation & Smart Triage",
    projectSlug: "email-automation-smart-triage",
    icon: Workflow,
  },
  {
    id: "agents",
    category: "AI Agents",
    tabLabel: "Agents",
    title: "Autonomous Tool-Calling Agents",
    whatItIs:
      "Context-aware AI agents that reason through user requests, query authorized tools/APIs, validate output schemas, and perform verified actions.",
    problemSolved:
      "Replaces static scripted bots with flexible agents capable of handling non-linear user requests, ambiguous queries, and structured data extraction.",
    tech: ["LangChain", "Claude 3.5", "OpenAI API", "Python"],
    projectTitle: "Customer Support Q&A Bot",
    projectSlug: "customer-support-qa-bot",
    icon: Bot,
  },
  {
    id: "rag",
    category: "RAG Knowledge Bases",
    tabLabel: "RAG",
    title: "Retrieval-Augmented Generation",
    whatItIs:
      "Custom vector retrieval pipelines indexing your private documents, product manuals, and internal documentation with semantic chunking and source citations.",
    problemSolved:
      "Prevents LLM hallucinations by grounding every answer strictly in your verified private knowledge base with exact page and document references.",
    tech: ["MongoDB Vector Search", "Pinecone", "Embeddings"],
    projectTitle: "RAG Knowledge Base Assistant",
    projectSlug: "rag-knowledge-base-assistant",
    icon: Brain,
  },
  {
    id: "multi-agent",
    category: "Multi-Agent Systems",
    tabLabel: "Multi-Agent",
    title: "Collaborative Multi-Agent Networks",
    whatItIs:
      "Coordinated networks of specialized agents (e.g. Researcher, Data Analyst, Technical Writer, Critic) executing asynchronous deep tasks.",
    problemSolved:
      "Handles long-horizon, high-complexity operations that exceed single-prompt context limits, ensuring thorough validation at each milestone.",
    tech: ["LangGraph", "CrewAI", "Python", "REST APIs"],
    projectTitle: "Market Research Multi-Agent System",
    projectSlug: "market-research-multi-agent-system",
    icon: Layers,
  },
];

export default function BentoServices() {
  const [activeTab, setActiveTab] = useState("all");

  const displayedServices =
    activeTab === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.id === activeTab);

  const tabs = [
    { id: "all", label: "All" },
    ...SERVICES.map((s) => ({ id: s.id, label: s.tabLabel })),
  ];

  return (
    <div className="w-full">
      {/* ─── FUNCTIONAL CAPABILITIES PLATE ───────────────────────────────── */}
      <SectionPlate
        index="02"
        title="CAPABILITIES"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        action={
          <Link
            href="/services"
            className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
          >
            <span>All blueprints</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        }
      />

      {/* ─── DYNAMIC CAPABILITY ARCHITECTURE LIST ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {displayedServices.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="rounded-2xl bg-[#090c16] border border-white/[0.08] hover:border-violet-500/30 p-6 sm:p-7 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-white/50 uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                  {service.title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                  {service.whatItIs}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-1 font-mono text-xs">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                    Problem Solved:
                  </span>
                  <p className="text-white/80 text-xs leading-relaxed">
                    {service.problemSolved}
                  </p>
                </div>
              </div>

              {/* Bottom: Connected Project & Tech Stack */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {service.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-[#101426] border border-white/5 text-[10px] text-white/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${service.projectSlug}`}
                  className="inline-flex items-center gap-1.5 text-violet-300 hover:text-white font-medium text-[11px] transition-colors shrink-0 group/link"
                >
                  <span>Case Study</span>
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
