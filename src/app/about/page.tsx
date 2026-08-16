import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Section";
import { IconArrow } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hi, I'm Arefin Mueen — an AI-Powered Full-Stack Developer and Web Designer. I build intelligent web applications, conversion-driven websites, AI agents, and production automation systems.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Arefin Mueen",
    description:
      "I design and engineer intelligent digital products — modern web applications, AI agents, and automation workflows.",
    url: "/about",
  },
};

const principles = [
  {
    title: "Outcomes, not features.",
    body: "Every system I ship has to solve a real problem or move a real metric. If it doesn't save measurable hours, generate revenue, or streamline operations, I won't build it.",
  },
  {
    title: "You own everything.",
    body: "All source code, design files, database schemas, and API accounts live in your name with full documentation and handover. You retain 100% intellectual property.",
  },
  {
    title: "Direct senior engineering.",
    body: "I work with a small client load so each project gets direct, dedicated engineering attention. No project managers, no junior handoffs, no agency overhead.",
  },
];

const milestones = [
  {
    period: "2022",
    body: "Started with full-stack web fundamentals and operations automation — building web interfaces, funnels, and CRM integrations for growing businesses.",
  },
  {
    period: "2023",
    body: "Expanded into production web systems — Next.js, React, Node.js, self-hosted n8n, and custom API backends for clinics, SaaS tools, and agencies.",
  },
  {
    period: "2024",
    body: "Pioneered specialized AI integration — autonomous agents, RAG knowledge bases over internal docs, LLM tool-calling, and custom web applications.",
  },
  {
    period: "2025+",
    body: "Now: Full-stack web apps, conversion-driven websites, multi-agent AI systems, and production automation pipelines for founders across North America, the GCC, and Asia.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Arefin Mueen · About"
        index="02"
        meta="AI-Powered Full-Stack Developer & Web Designer"
        title={
          <>
            Hi, I&rsquo;m Arefin.
            <br />
            I build <span className="serif">intelligent digital products</span> with AI.
          </>
        }
        subtitle="I combine modern web development, bespoke UI design, autonomous AI agents, and workflow automation to build software systems that solve real business problems — with clean architecture, documentation, and launch support."
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              The engineer &amp; designer
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Arefin Mueen<br />AI-Powered Full-Stack<br />Developer &amp; Designer
            </p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg leading-relaxed text-white/80">
            <p>
              I am a product-minded full-stack developer and web designer who uses
              modern web technologies and artificial intelligence to build intelligent
              websites, web applications, business systems, and digital products.
            </p>
            <p>
              Most projects suffer from a disconnect: designers who don&rsquo;t understand
              backend architecture, or developers who don&rsquo;t care about conversion
              and aesthetics. I bridge that gap by handling the full lifecycle — from
              bespoke UI/UX design to robust Next.js/React frontends, scalable API backends,
              and intelligent AI agent automation.
            </p>
            <p>
              Based in <strong className="text-white">Dhaka, Bangladesh</strong>, I work
              with founders, startups, and established businesses globally — from Toronto
              and Dubai to London and Singapore.
            </p>
            <p>
              I work with a <strong className="text-white">small client load on purpose</strong>.
              You work directly with the engineer designing and writing your codebase,
              with zero agency overhead.
            </p>
            <p>
              Whether you need a high-converting web platform, a custom SaaS product, or
              an autonomous AI agent system —{" "}
              <strong className="text-white">let&rsquo;s talk for 30 minutes. Free. No obligation.</strong>
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
