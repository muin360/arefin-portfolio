import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Section";
import { IconArrow } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hi, I'm Arefin Mueen — an AI Automation & AI Agent Developer. I build practical AI agents, RAG systems, multi-agent workflows, and business automations.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Arefin Mueen",
    description:
      "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    url: "/about",
  },
};

const principles = [
  {
    title: "Practical value over complexity.",
    body: "If a clean 4-node n8n workflow solves the problem reliably, I won't over-engineer a brittle 10-agent crew. The right solution is the simplest one that works every time.",
  },
  {
    title: "You own all workflows and code.",
    body: "All workflows, API keys, scripts, and documentation live in your accounts. You retain 100% control and ownership with clear walkthroughs provided.",
  },
  {
    title: "Continuous hands-on building.",
    body: "I learn by building real projects. Every agent, RAG pipeline, and webhook workflow is tested against practical business scenarios and edge cases.",
  },
];

const milestones = [
  {
    period: "Phase 1: Foundations",
    body: "Started with webhooks, REST APIs, JSON data structures, and no-code automation on Zapier and Make — learning how business tools communicate.",
  },
  {
    period: "Phase 2: Advanced n8n",
    body: "Moved deep into self-hosted n8n — designing complex multi-step workflows, conditional branching, error handlers, and custom webhook triggers.",
  },
  {
    period: "Phase 3: AI Agents & RAG",
    body: "Integrated modern LLMs, prompt engineering, Langflow visual prototypes, and retrieval-augmented generation (RAG) over documents with vector embeddings.",
  },
  {
    period: "Phase 4: Multi-Agent & Code",
    body: "Currently building: Multi-agent research crews with LangChain, voice AI appointment workflows, and custom Python/JavaScript integration scripts.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Arefin Mueen · About"
        index="02"
        meta="AI Automation & AI Agent Developer"
        title={
          <>
            Hi, I&rsquo;m Arefin.
            <br />
            I build <span className="serif">AI systems</span> that automate real work.
          </>
        }
        subtitle="I am an independent developer specializing in AI automation, autonomous agents, RAG systems, and workflow integrations using n8n, LangChain, Langflow, LLM APIs, and Python."
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              The developer
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Arefin Mueen<br />AI Automation &amp; AI Agent<br />Developer
            </p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg leading-relaxed text-white/80">
            <p>
              I am an AI automation and agent developer based in{" "}
              <strong className="text-white">Dhaka, Bangladesh</strong>. I focus on
              designing and building practical AI-powered workflows, conversational assistants,
              and automated systems that take repetitive manual tasks off people&rsquo;s plates.
            </p>
            <p>
              My path started with understanding how modern business tools talk to each other —
              working through webhooks, REST APIs, and automation platforms like Zapier and Make.
              As language models evolved, I focused heavily on self-hosted{" "}
              <strong className="text-white">n8n</strong>, visual agent design in{" "}
              <strong className="text-white">Langflow</strong>, vector retrieval with{" "}
              <strong className="text-white">RAG</strong>, and multi-agent coordination with{" "}
              <strong className="text-white">LangChain</strong>.
            </p>
            <p>
              I learn by building hands-on projects: from email triage agents and customer support bots
              to market research crews and voice-enabled schedulers. Along the way, I continuously
              develop my Python and JavaScript fundamentals to write custom data transformations and API glue.
            </p>
            <p>
              If you have a workflow you&rsquo;d like to automate or want to explore what an AI agent
              could do for your daily operations —{" "}
              <strong className="text-white">let&rsquo;s talk for 30 minutes. Free and straightforward.</strong>
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
              How I work,
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
                Let&rsquo;s talk · Free 30-min systems audit
              </p>
              <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                Limited project capacity{" "}
                <span className="serif text-[1.04em] iridescent">this quarter.</span>
              </h2>
              <p className="mt-4 text-white/65 max-w-md">
                30 minutes. I&rsquo;ll map your current workflows, share a written
                recommendation, and tell you where I think the highest-leverage
                automation lives. No obligation either way.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shimmer relative z-10 bg-white text-[#04040a] border-white">
              Book a free systems audit
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
