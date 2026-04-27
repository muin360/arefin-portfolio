import type { Metadata } from "next";
import { skills } from "@/data/site";
import { PageHeader } from "@/components/Section";
import { IconCheck } from "@/components/icons";
import SkillsConstellation from "@/components/SkillsConstellation";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Stack — Arefin Muin",
  description:
    "The platforms, languages and AI tooling Arefin Muin uses to build production automations and agents.",
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

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pt-12 md:pt-16 pb-6">
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
