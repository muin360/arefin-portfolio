import type { Metadata } from "next";
import { skills } from "@/data/site";
import { PageHeader } from "@/components/Section";
import { IconCheck } from "@/components/icons";
import SkillsConstellation from "@/components/SkillsConstellation";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "Stack — Tensor Studio",
  description:
    "The platforms, languages and AI tooling Tensor Studio uses to build production automations and agents.",
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

export default function SkillsPage() {
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
          {skills.map(({ Icon, category, items }, i) => (
            <Reveal key={category} delay={i * 80} className="bg-surface p-8 md:p-10">
              <div className="flex items-center gap-3">
                <Icon width={22} height={22} className="text-foreground" />
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  {category}
                </p>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
                {items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-2 text-foreground/85"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
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
