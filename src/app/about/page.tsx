import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Section";
import { IconArrow } from "@/components/icons";

export const metadata: Metadata = {
  title: "About — Arefin Muin",
  description:
    "Arefin Muin is an AI automation and agent engineer specializing in n8n, Zapier, Make, LangChain, LangFlow and GoHighLevel.",
};

const principles = [
  {
    title: "Outcomes over outputs.",
    body: "I optimize for the business result, not the prettiest tech stack. Every automation has to earn its place by saving time or making money.",
  },
  {
    title: "No-code where it fits, code where it shouldn't.",
    body: "n8n, Zapier and Make get you 80% of the way fast. The remaining 20% is where Python and TypeScript earn their keep — and where most teams cut corners.",
  },
  {
    title: "Long-term ownership, not handoffs.",
    body: "I document, train, and stay reachable. The systems I leave behind are ones the team can run, edit and grow on their own.",
  },
];

const milestones = [
  {
    period: "2022",
    body: "Started with no-code automations on Zapier — funnels, CRM glue, lead routing — for small businesses.",
  },
  {
    period: "2023",
    body: "Went deep on Make and self-hosted n8n. Took ownership of full operations stacks on GoHighLevel.",
  },
  {
    period: "2024",
    body: "Brought LLMs into production workflows: classification, summarization, and the first real agents with LangChain and LangFlow.",
  },
  {
    period: "2025",
    body: "Going deeper on the engineering side of LLMs — evaluation, observability, retrieval quality, fine-tuning.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        index="02"
        meta="Profile · Portfolio v 2.0"
        title={
          <>
            An engineer who treats{" "}
            <span className="serif">automation</span> as a craft, not a
            checkbox.
          </>
        }
        subtitle="I help businesses replace repetitive manual work with quiet, reliable AI-powered systems that run on their own — and keep running long after the demo."
      />

      <section className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <p className="eyebrow mb-5">Profile</p>
        </div>
        <div className="md:col-span-8 space-y-6 text-lg leading-relaxed text-foreground/85">
          <p>
            I&apos;m Arefin Muin. I design and ship the workflows,
            integrations and LLM-powered agents that operate behind the scenes
            of modern companies — across <strong>n8n</strong>,{" "}
            <strong>Zapier</strong>, <strong>Make</strong>,{" "}
            <strong>LangChain</strong>, <strong>LangFlow</strong> and{" "}
            <strong>GoHighLevel</strong>, with <strong>Python</strong> and{" "}
            <strong>TypeScript</strong> when the no-code layer runs out.
          </p>
          <p>
            What gets me out of bed: the moment a client realizes a process
            that used to take their team six hours a day now runs on its own,
            with an AI agent making the judgement calls inside it.
          </p>
          <p>
            I&apos;m currently going deeper on LLM engineering — evaluation,
            observability, retrieval quality, fine-tuning — to ship agents
            that hold up in production, not just demos.
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="eyebrow mb-5">Principles</p>
            <h2 className="display text-3xl md:text-5xl">
              How I work,
              <br />
              <span className="serif text-[1.04em]">in three lines.</span>
            </h2>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 gap-6">
            {principles.map((p, i) => (
              <div
                key={p.title}
                className="flex gap-6 pb-6 border-b border-line last:border-0 last:pb-0"
              >
                <span className="text-sm tabular-nums text-muted mt-1 w-10">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-xl tracking-tight font-medium">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-muted leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <p className="eyebrow mb-5">Trajectory</p>
          <h2 className="display text-3xl md:text-5xl">
            From scripts to{" "}
            <span className="serif text-[1.04em]">systems.</span>
          </h2>
        </div>
        <div className="md:col-span-8">
          <ol className="relative border-l border-line pl-8 space-y-8">
            {milestones.map((m) => (
              <li key={m.period} className="relative">
                <span className="absolute -left-[37px] top-1 w-3 h-3 rounded-full bg-foreground" />
                <p className="text-sm tabular-nums text-muted">{m.period}</p>
                <p className="mt-2 text-foreground/85 leading-relaxed">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-24">
        <div className="rounded-3xl border border-line bg-paper p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-5">Let&apos;s talk</p>
            <h2 className="display text-3xl md:text-5xl max-w-2xl">
              Currently taking on{" "}
              <span className="serif text-[1.04em]">a few projects.</span>
            </h2>
          </div>
          <Link href="/contact" className="btn-primary">
            Start a project
            <IconArrow width={16} height={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
