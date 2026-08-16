import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/fetch";
import { allSkillCategoriesQuery } from "@/sanity/queries";
import type { SkillCategoryDoc } from "@/sanity/types";
import { FALLBACK_SKILLS } from "@/data/fallbacks";
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
    title: "Retrieval-Augmented Generation (RAG)",
    body: "Indexing internal documentation and knowledge bases into vector databases for citation-backed question answering.",
  },
  {
    title: "Custom Python & API Glue",
    body: "Writing clean Python and JavaScript integration logic when pre-built connectors need custom transformations.",
  },
];

export default async function SkillsPage() {
  const raw = await sanityFetch<SkillCategoryDoc[]>({
    query: allSkillCategoriesQuery,
    tags: ["skillCategory"],
  });
  const skills = raw && raw.length > 0 ? raw : FALLBACK_SKILLS;

  return (
    <>
      <PageHeader
        eyebrow="Arefin Mueen · Stack & Tools"
        index="04"
        meta="AI Automation · AI Agents · RAG · APIs"
        title={
          <>
            The toolkit behind{" "}
            <span className="serif">the automations.</span>
          </>
        }
        subtitle="A focused set of automation platforms, AI frameworks, and development tools I use to build practical workflows, agents, and integrations."
      />

      {/* Auto-running marquee strip — like sponsor logos, never stops */}
      <section className="hero-dark relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="aurora opacity-50" aria-hidden="true" />

        <div className="relative py-10 md:py-14 space-y-6">
          <Marquee duration={40}>
            {skillsRow1.map((t) => (
              <SkillPill key={t} label={t} variant="violet" />
            ))}
          </Marquee>
          <Marquee duration={50} reverse>
            {skillsRow2.map((t) => (
              <SkillPill key={t} label={t} variant="pink" />
            ))}
          </Marquee>
          <Marquee duration={36}>
            {skillsRow3.map((t) => (
              <SkillPill key={t} label={t} variant="cyan" />
            ))}
          </Marquee>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-16 pb-6">
        <Reveal>
          <p className="eyebrow mb-5">[ A ] Tools, ranked by use</p>
        </Reveal>
        <Reveal delay={100}>
          <SkillsConstellation />
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 section pt-16">
        <Reveal>
          <p className="eyebrow mb-5">[ B ] Stack, by category</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {skills.map(({ iconName, category, items }, i) => { const Icon = iconFor(iconName); return (
            <Reveal key={category} delay={i * 80} className="bg-surface p-8 md:p-10">
              <div className="flex items-center gap-3">
                <Icon width={22} height={22} className="text-foreground" />
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  {category}
                </p>
              </div>
              <ul className="mt-6 grid grid-cols-1 gap-4">
                {items.map((it) => {
                  const desc = TOOL_DESCRIPTIONS[it];
                  return (
                    <li
                      key={it}
                      className="flex items-start gap-3 text-foreground/85"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium leading-tight">{it}</p>
                        {desc && (
                          <p className="mt-1 text-xs text-muted leading-relaxed">
                            {desc}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ); })}
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="eyebrow mb-5">Focus areas</p>
            <h2 className="display text-3xl md:text-5xl">
              What I&apos;m{" "}
              <span className="serif text-[1.04em]">deepest in.</span>
            </h2>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {focusAreas.map((f) => (
              <div
                key={f.title}
                className="border border-line bg-surface rounded-2xl p-7"
              >
                <IconCheck width={20} height={20} className="text-foreground" />
                <h3 className="mt-4 text-lg font-medium tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
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
