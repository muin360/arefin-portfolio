import type { Metadata } from "next";
import { getSkills } from "@/lib/db";
import { iconFor } from "@/components/IconRegistry";
import { PageHeader } from "@/components/Section";
import SectionPlate from "@/components/SectionPlate";
import SkillsConstellation from "@/components/SkillsConstellation";
import Marquee from "@/components/Marquee";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Stack & Tools",
  description:
    "The platforms, tools, and libraries Arefin Mueen uses to build AI automations and agents — n8n, Langflow, LangChain, OpenAI, Claude, APIs, and Python.",
  alternates: { canonical: "/skills" },
};

const skillsRow1 = [
  "n8n", "Zapier", "Make", "Langflow", "LangChain", "OpenAI API",
  "Claude API", "Pinecone", "Webhooks", "REST APIs", "Python", "JavaScript",
];
const skillsRow2 = [
  "Prompt Engineering", "RAG Systems", "Multi-Agent Crews", "JSON", "Git",
  "GitHub", "Airtable", "Google Sheets", "Slack API", "Gmail API", "Postman",
];
const skillsRow3 = [
  "AI Agents", "Tool Calling", "Vector Embeddings", "Workflow Design",
  "Event Triggers", "Error Handling", "Semantic Search", "LangChain Python", "FastAPI",
];

function SkillPill({
  label,
  variant,
}: {
  label: string;
  variant: "violet" | "pink" | "cyan";
}) {
  const tint = {
    violet: "border-violet-500/30 text-violet-200 bg-violet-500/10",
    pink: "border-fuchsia-500/30 text-fuchsia-200 bg-fuchsia-500/10",
    cyan: "border-cyan-500/30 text-cyan-200 bg-cyan-500/10",
  }[variant];
  const dot = {
    violet: "bg-violet-400",
    pink: "bg-fuchsia-400",
    cyan: "bg-cyan-400",
  }[variant];

  return (
    <span
      className={`mx-2.5 inline-flex items-center gap-2.5 rounded-full border ${tint} px-4 py-2 text-xs font-mono font-medium whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shadow-[0_0_8px_currentColor]`} />
      <span>{label}</span>
    </span>
  );
}

const TOOL_DESCRIPTIONS: Record<string, string> = {
  n8n: "Self-hosted workflow automation. Core platform for complex multi-step integrations.",
  Zapier: "Quick event triggers and integrations across thousands of third-party SaaS apps.",
  Make: "Visual automation for multi-step content, CRM, and webhook flows.",
  Langflow: "Visual builder for rapid prototyping of LLM flows and agent logic.",
  LangChain: "Python framework for agent tool calling, document loaders, and RAG pipelines.",
  "OpenAI & Claude APIs": "Foundation models used for classification, reasoning, and text synthesis.",
  "Prompt Engineering": "Clear, structured prompt templates with robust schema validation.",
  "RAG Systems": "Retrieval-augmented generation over company docs and vector databases.",
  "AI Agents": "Autonomous agents configured with tools to take actions on external APIs.",
  "Multi-Agent Systems": "Collaborative crews of specialized agents for research and reporting.",
  Python: "Custom automation scripts, API glue, data wrangling, and LangChain agents.",
  JavaScript: "Node.js scripts, webhook transformation functions, and API consumption.",
  JSON: "Parsing, formatting, and transforming structured payload schemas.",
  "Git & GitHub": "Version control, workflow repository backup, and project tracking.",
  "REST APIs": "Consuming third-party endpoints, managing headers, tokens, and webhooks.",
};

const focusAreas = [
  {
    title: "Workflow Automation & n8n",
    body: "Connecting business applications, webhooks, and databases into clean, automated event-driven pipelines.",
  },
  {
    title: "LLM-in-the-Loop Decisions",
    body: "Adding AI reasoning to classify incoming requests, draft replies, and extract structured data from unstructured text.",
  },
  {
    title: "RAG & Knowledge Retrieval",
    body: "Building vector search flows so AI models can cite real company knowledge bases accurately.",
  },
  {
    title: "Tool-Calling Agents",
    body: "Configuring agents that can query external APIs, execute searches, and update CRM records automatically.",
  },
];

export default async function SkillsPage() {
  const categories = await getSkills({ publishedOnly: true });

  return (
    <>
      <PageHeader
        eyebrow="Capabilities & Stack"
        index="04"
        meta="n8n · LangChain · Langflow · APIs · Python"
        title={
          <>
            The tools and stack{" "}
            <span className="serif italic text-violet-300">I build with daily.</span>
          </>
        }
        subtitle="The platforms, libraries, APIs, and languages I use to build robust AI automations and autonomous agents."
      />

      {/* Marquee bands */}
      <section className="py-10 overflow-hidden border-b border-white/[0.08] space-y-3" aria-label="Skills Marquee">
        <Marquee duration={35}>
          {skillsRow1.map((s) => (
            <SkillPill key={s} label={s} variant="violet" />
          ))}
        </Marquee>
        <Marquee duration={30} reverse>
          {skillsRow2.map((s) => (
            <SkillPill key={s} label={s} variant="pink" />
          ))}
        </Marquee>
        <Marquee duration={40}>
          {skillsRow3.map((s) => (
            <SkillPill key={s} label={s} variant="cyan" />
          ))}
        </Marquee>
      </section>

      {/* Interactive 3D Orbit Constellation */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]" aria-label="Constellation Grid">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionPlate
            index="01"
            title="PROFICIENCY & TOOL MATRIX"
            sectionId="matrix"
            meta="active toolchain · core specializations"
          />

          <SkillsConstellation />
        </div>
      </section>

      {/* Categorized Skills Grid (FROM DB) */}
      <section className="py-16 sm:py-20 border-b border-white/[0.08]" aria-label="Categorized Breakdown">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionPlate
            index="02"
            title="CATEGORIZED TECHNICAL BREAKDOWN"
            sectionId="breakdown"
            meta="ecosystem breakdown · database synced"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = iconFor(cat.iconName);
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-6 sm:p-8 flex flex-col hover:border-violet-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400">
                      <Icon width={22} height={22} />
                    </div>
                    <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                  </div>

                  <h3 className="text-xl font-bold tracking-tight text-white mb-6">
                    {cat.category}
                  </h3>

                  <div className="space-y-4 flex-1">
                    {cat.items.map((item) => {
                      const desc = TOOL_DESCRIPTIONS[item];
                      return (
                        <div
                          key={item}
                          className="pt-3 border-t border-white/[0.06] first:pt-0 first:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                            <h4 className="font-medium text-sm text-white">{item}</h4>
                          </div>
                          {desc && (
                            <p className="mt-1 text-xs text-white/60 leading-relaxed pl-3.5 font-sans">
                              {desc}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-16 sm:py-20" aria-label="Core Focus Areas">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <SectionPlate
            index="03"
            title="CORE ARCHITECTURAL PRINCIPLES"
            sectionId="principles"
            meta="production philosophy · resilience"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {focusAreas.map((f, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-3 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h3 className="text-base font-bold text-white font-sans normal-case tracking-tight">
                    {f.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans pl-6">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
