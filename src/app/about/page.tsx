import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Section";
import { IconArrow } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tensor Studio is an independent AI engineering studio founded and operated by Arefin Muin from Dhaka, Bangladesh — building AI agents and automation systems with n8n, Zapier, Make, LangChain, LangFlow and GoHighLevel.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Tensor Studio",
    description:
      "Tensor Studio is an independent AI engineering studio founded and operated by Arefin Muin from Dhaka, Bangladesh.",
    url: "/about",
  },
};

const principles = [
  {
    title: "Outcomes over outputs.",
    body: "We optimize for the business result, not the prettiest tech stack. Every automation has to earn its place by saving time or making money.",
  },
  {
    title: "No-code where it fits, code where it shouldn't.",
    body: "n8n, Zapier and Make get you 80% of the way fast. The remaining 20% is where Python and TypeScript earn their keep — and where most teams cut corners.",
  },
  {
    title: "Long-term ownership, not handoffs.",
    body: "We document, train, and stay reachable. The systems we leave behind are ones your team can run, edit and grow on its own.",
  },
];

const milestones = [
  {
    period: "2022",
    body: "The studio's founder began with no-code automations on Zapier — funnels, CRM glue, lead routing — for small businesses.",
  },
  {
    period: "2023",
    body: "Went deep on Make and self-hosted n8n. Took ownership of full operations stacks on GoHighLevel.",
  },
  {
    period: "2024",
    body: "Tensor Studio was founded. Brought LLMs into production workflows: classification, summarization, and the first real agents with LangChain and LangFlow.",
  },
  {
    period: "2025",
    body: "Going deeper on the engineering side of LLMs — evaluation, observability, retrieval quality, fine-tuning — and shipping production agents that hold up.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tensor Studio · About"
        index="02"
        meta="Studio profile · Founded 2024 · Dhaka"
        title={
          <>
            A studio that treats{" "}
            <span className="serif">automation</span> as a craft, not a
            checkbox.
          </>
        }
        subtitle="We help businesses replace repetitive manual work with quiet, reliable AI-powered systems that run on their own — and keep running long after the demo."
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              The studio
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Tensor Studio<br />Est. 2024 · Dhaka, BD
            </p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg leading-relaxed text-white/80">
            <p>
              <strong className="text-white">Tensor Studio</strong> is an
              independent AI engineering studio. We design and ship the
              workflows, integrations and LLM-powered agents that operate
              behind the scenes of modern companies — across{" "}
              <strong className="text-white">n8n</strong>,{" "}
              <strong className="text-white">Zapier</strong>,{" "}
              <strong className="text-white">Make</strong>,{" "}
              <strong className="text-white">LangChain</strong>,{" "}
              <strong className="text-white">LangFlow</strong> and{" "}
              <strong className="text-white">GoHighLevel</strong>, with{" "}
              <strong className="text-white">Python</strong> and{" "}
              <strong className="text-white">TypeScript</strong> when the no-code
              layer runs out.
            </p>
            <p>
              What gets us out of bed: the moment a client realizes a process
              that used to take their team six hours a day now runs on its own,
              with an AI agent making the judgement calls inside it.
            </p>
            <p>
              The studio was founded in 2024 by{" "}
              <strong className="text-white">Arefin Muin</strong> in Dhaka,
              Bangladesh, after three years of automation work for clients
              across the US, EU and APAC. We stay small, hands-on, and senior
              — every engagement is led by the founder.
            </p>
          </div>
        </div>
      </section>

      <section className="hero-dark border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              Principles
            </p>
            <h2 className="display text-3xl md:text-5xl text-white">
              How we work,
              <br />
              <span className="serif text-[1.04em] iridescent">in three lines.</span>
            </h2>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 gap-5">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <BentoCard className="h-full">
                  <div className="flex gap-6">
                    <span className="font-mono text-sm tabular-nums text-violet-300 mt-1 w-10">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-xl tracking-tight font-medium text-white">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-white/65 leading-relaxed">{p.body}</p>
                    </div>
                  </div>
                </BentoCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              Trajectory
            </p>
            <h2 className="display text-3xl md:text-5xl text-white">
              From scripts to{" "}
              <span className="serif text-[1.04em] iridescent">systems.</span>
            </h2>
          </div>
          <div className="md:col-span-8">
            <ol className="relative border-l border-white/15 pl-8 space-y-8">
              {milestones.map((m) => (
                <li key={m.period} className="relative">
                  <span className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 shadow-[0_0_14px_rgba(168,130,255,0.6)]" />
                  <p className="font-mono text-sm tabular-nums text-white/55">{m.period}</p>
                  <p className="mt-2 text-white/85 leading-relaxed">{m.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="hero-dark relative overflow-hidden">
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-24 relative">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border border-white/10 bg-white/[0.03] backdrop-blur-md">
            <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden="true">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(800px circle at 30% 20%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(700px circle at 80% 80%, rgba(236,72,153,0.30), transparent 60%)",
                }}
              />
            </div>
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
                Let&apos;s talk
              </p>
              <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                Currently taking on{" "}
                <span className="serif text-[1.04em] iridescent">a few projects.</span>
              </h2>
            </div>
            <Link href="/contact" className="btn-primary shimmer relative z-10 bg-white text-foreground border-white">
              Start a project
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
