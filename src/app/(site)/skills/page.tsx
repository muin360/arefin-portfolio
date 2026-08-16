import type { Metadata } from "next";
import { getSkills } from "@/lib/db";
import { iconFor } from "@/components/IconRegistry";
import { PageHeader } from "@/components/Section";
import { IconCheck } from "@/components/icons";
import SkillsConstellation from "@/components/SkillsConstellation";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "Stack & Tools",
  description:
    "The platforms, tools, and libraries Arefin Mueen uses to build AI automations and agents — n8n, Zapier, Langflow, LangChain, OpenAI, Claude, APIs, and Python.",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Stack & Tools — Arefin Mueen",
    description:
      "Platforms, tools, and AI libraries used by Arefin Mueen to build practical automations and agents.",
    url: "/skills",
  },
};

const skillsRow1 = [
  "n8n", "Zapier", "Make", "Langflow", "LangChain", "OpenAI API",
  "Claude API", "Pinecone", "Webhooks", "REST APIs", "Python", "JavaScript",
];
const skillsRow2 = [
  "Prompt Engineering", "RAG Systems", "Multi-Agent Crews", "JSON", "Git",
  "GitHub", "Airtable", "Google Sheets", "Slack API", "Gmail API", "Twilio", "Typeform",
];
const skillsRow3 = [
  "AI Agents", "Tool Calling", "Vector Embeddings", "Workflow Design",
  "Event Triggers", "Error Handling", "Semantic Search", "LangChain Python", "Postman",
];

function SkillPill({
  label,
  variant,
}: {
  label: string;
  variant: "violet" | "pink" | "cyan";
}) {
  const tint = {
    violet: "border-violet-400/30 text-violet-100 bg-violet-500/[0.06]",
    pink: "border-pink-400/30 text-pink-100 bg-pink-500/[0.06]",
    cyan: "border-cyan-400/30 text-cyan-100 bg-cyan-500/[0.06]",
  }[variant];
  const dot = {
    violet: "bg-violet-300",
    pink: "bg-pink-300",
    cyan: "bg-cyan-300",
  }[variant];
  return (
    <span
      className={`mx-3 inline-flex items-center gap-3 rounded-full border ${tint} px-5 py-2.5 backdrop-blur-md`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} shadow-[0_0_8px_currentColor]`} />
      <span className="font-medium tracking-tight whitespace-nowrap">{label}</span>
    </span>
  );
}

const TOOL_DESCRIPTIONS: Record<string, string> = {
  // Automation platforms
  n8n: "Self-hosted workflow automation. Core platform for complex, multi-step integrations.",
  Zapier: "Quick triggers and integrations across thousands of third-party apps.",
  Make: "Visual automation for multi-step content and CRM workflows.",
  "Make (Integromat)": "Visual automation for multi-step content and CRM workflows.",
  Langflow: "Visual builder for rapid prototyping of LLM flows and agent logic.",

  // AI / LLM tools
  LangChain: "Python framework for agent tool calling, document loaders, and RAG pipelines.",
  "OpenAI & Claude APIs": "Foundation models used for classification, reasoning, and text synthesis.",
  "Prompt Engineering": "Clear, structured prompt templates with robust validation.",
  "RAG Systems": "Retrieval-augmented generation over company docs and vector databases.",
  "AI Agents": "Autonomous agents configured with tools to take actions on external APIs.",
  "Multi-Agent Systems": "Collaborative crews of specialized agents for research and reporting.",

  // Programming & Dev
  Python: "Custom automation scripts, API glue, data wrangling, and LangChain agents.",
  JavaScript: "Node.js scripts, webhook transformation functions, and API consumption.",
  JSON: "Parsing, formatting, and transforming structured payload schemas.",
  "Git & GitHub": "Version control, workflow repository backup, and project tracking.",
  "REST APIs": "Consuming third-party endpoints, managing headers, tokens, and webhooks.",
  "Web Fundamentals": "Understanding HTTP methods, status codes, JSON payloads, and headers.",
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
        eyebrow="Arefin Mueen · Capabilities & Stack"
        index="04"
        meta="n8n · LangChain · Langflow · APIs · Python"
        title={
          <>
            The tools and stack,
            <br />
            <span className="serif">I build with daily.</span>
          </>
        }
        subtitle="The platforms, libraries, APIs, and languages I use to build robust AI automations and autonomous agents."
      />

      {/* Marquee bands */}
      <section className="hero-dark py-14 overflow-hidden border-b border-white/5 space-y-4">
        <Marquee duration={32}>
          {skillsRow1.map((s) => (
            <SkillPill key={s} label={s} variant="violet" />
          ))}
        </Marquee>
        <Marquee duration={28} reverse>
          {skillsRow2.map((s) => (
            <SkillPill key={s} label={s} variant="pink" />
          ))}
        </Marquee>
        <Marquee duration={36}>
          {skillsRow3.map((s) => (
            <SkillPill key={s} label={s} variant="cyan" />
          ))}
        </Marquee>
      </section>

      {/* Interactive 3D Orbit Constellation */}
      <section className="hero-dark relative overflow-hidden border-b border-white/5 py-24">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-3">
                [ Interactive ] System Architecture
              </p>
              <h2 className="display text-3xl md:text-5xl text-white">
                The Automation &amp; Agent{" "}
                <span className="serif text-[1.04em] iridescent">Ecosystem.</span>
              </h2>
            </div>
          </Reveal>
          <SkillsConstellation />
        </div>
      </section>

      {/* Categorized Skills Grid (FROM DB) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 section">
        <Reveal>
          <div className="max-w-2xl mb-12">
            <p className="eyebrow mb-3">Detailed breakdown</p>
            <h2 className="display text-3xl md:text-5xl">
              Categorized{" "}
              <span className="serif text-[1.04em]">technical tools.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => {
            const Icon = iconFor(cat.iconName);
            return (
              <Reveal key={cat.id} delay={i * 80}>
                <div className="rounded-3xl border border-line bg-surface p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-foreground/[0.04] border border-line">
                      <Icon width={24} height={24} className="text-foreground" />
                    </div>
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-6">{cat.category}</h3>
                  <div className="space-y-4 flex-1">
                    {cat.items.map((item) => {
                      const desc = TOOL_DESCRIPTIONS[item];
                      return (
                        <div key={item} className="pt-3 border-t border-line/60 first:pt-0 first:border-0">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-1" />
                            <h4 className="font-medium text-sm text-foreground">{item}</h4>
                          </div>
                          {desc && (
                            <p className="mt-1 text-xs text-muted leading-relaxed pl-3.5">
                              {desc}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Focus Areas */}
      <section className="hero-dark border-t border-white/5 py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {focusAreas.map((f, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <IconCheck width={16} height={16} className="text-violet-400" />
                  <h3 className="text-base font-semibold text-white">{f.title}</h3>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
