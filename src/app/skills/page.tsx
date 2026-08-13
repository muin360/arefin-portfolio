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
import AnimatedSkillBar from "@/components/AnimatedSkillBar";
import { skillProficiency } from "@/data/site";
export const metadata: Metadata = {
  title: "Stack & Tools",
  description:
    "The platforms, languages and AI tooling Tensorix uses to build production automations and agents — n8n, Zapier, Make, LangChain, LangFlow, GoHighLevel, OpenAI, Claude, Python, TypeScript and more.",
  alternates: { canonical: "/skills" },
  openGraph: {
    title: "Stack & Tools — Tensorix",
    description:
      "Platforms, languages and AI tooling used to build production automations and agents.",
    url: "/skills",
  },
};

const skillsRow1 = [
  "n8n", "Zapier", "Make", "GoHighLevel", "Airtable", "Notion", "Slack",
  "Twilio", "HubSpot", "Postmark", "Webhooks", "Apify",
];
const skillsRow2 = [
  "OpenAI", "Anthropic Claude", "LangChain", "LangFlow", "Pinecone",
  "Supabase Vector", "OpenRouter", "Groq", "LlamaIndex", "Haystack", "Cohere",
];
const skillsRow3 = [
  "Python", "TypeScript", "Node.js", "Next.js", "FastAPI", "Postgres",
  "Redis", "Docker", "Vercel", "Cloudflare", "GitHub Actions", "Playwright",
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

// Per-tool capability blurbs (audit fix Phase 5.2).
//
// The /skills page lists categorised tools. Logos / names alone don't tell
// a visitor what each tool is _used for_ — these short descriptions make
// the list scannable and useful for buyers comparing vendors. Keyed by
// the same string used in FALLBACK_SKILLS.items and the Sanity item
// strings, so a Sanity-managed tool only needs a matching key here to
// pick up a description. Tools without a description still render
// gracefully (the description line is hidden when absent).
const TOOL_DESCRIPTIONS: Record<string, string> = {
  // Automation platforms
  n8n: "Self-hosted workflow automation. Preferred for complex, high-volume pipelines.",
  Zapier: "Rapid prototyping and simple integrations. 5,000+ app connectors.",
  Make: "Visual automation for moderate complexity. Great for content and CRM workflows.",
  "Make (Integromat)":
    "Visual automation for moderate complexity. Great for content and CRM workflows.",
  GoHighLevel:
    "All-in-one CRM + automation for service businesses and agencies.",

  // AI / LLM tools
  LangChain: "Agent orchestration, tool use, and multi-step reasoning pipelines.",
  LangFlow: "Visual LLM flow builder for RAG and retrieval systems.",
  "OpenAI API": "Primary LLM for production agents. Reliable, fast, capable.",
  "Anthropic Claude":
    "Used for long-context document analysis and nuanced instruction-following.",
  "Prompt Engineering":
    "Stable, testable prompts with eval harnesses — not vibes.",
  "RAG / Vector DBs":
    "Retrieval-augmented systems with Pinecone, pgvector, or Supabase Vector.",

  // Programming
  Python: "Scripting, data wrangling, ML, and FastAPI services in production.",
  JavaScript: "ES2024+ across the stack — browser, Node.js, and edge runtimes.",
  TypeScript: "Strict typing across all projects. No untyped JS in production.",
  "Node.js": "Server-side JS for APIs, automation runners, and webhooks.",
  "REST APIs": "Designing and consuming pragmatic REST — auth, versioning, errors.",

  // Currently learning
  "LLM Engineering":
    "Production-grade agent design — tools, memory, evals, observability.",
  "Fine-tuning":
    "Domain-specific fine-tunes when prompting and retrieval aren't enough.",
  "Evaluation & Observability":
    "LangSmith / Helicone-grade tracing, evals, and prompt versioning.",
};

const focusAreas = [
  {
    title: "Multi-tool orchestration",
    body: "Stitching together CRMs, databases, messaging, vector stores and bespoke APIs into reliable end-to-end pipelines.",
  },
  {
    title: "LLM-in-the-loop workflows",
    body: "Replacing brittle if/else with model-graded decisions — and knowing when not to.",
  },
  {
    title: "Retrieval-augmented systems",
    body: "Knowledge-base chatbots, internal search, document Q&A — chunking, retrievers and rerankers tuned for the use case.",
  },
  {
    title: "Production hygiene",
    body: "Monitoring, retries, dead-letter queues, observability, prompt versioning, and evaluation harnesses.",
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
        eyebrow="Stack"
        index="04"
        meta="Toolkit · Opinions held"
        title={
          <>
            The toolkit behind{" "}
            <span className="serif">every project.</span>
          </>
        }
        subtitle="A focused, opinionated stack — chosen because each piece earns its place in production."
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
                        {skillProficiency[it] && (
                          <AnimatedSkillBar
                            proficiency={skillProficiency[it]}
                            index={i}
                          />
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
