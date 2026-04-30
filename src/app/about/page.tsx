import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Section";
import { IconArrow } from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Hi, I'm Arefin Muin — the AI engineer behind Tensor. I build AI automation, Messenger bots and high-converting websites for small businesses, from Dhaka to Dubai to Toronto. Two clients at a time. No agency overhead. You get the operator.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Tensor",
    description:
      "I'm Arefin Muin. I build AI automation, Messenger bots and high-converting websites for small businesses.",
    url: "/about",
  },
};

const principles = [
  {
    title: "Outcomes, not features.",
    body: "Every system I ship has to save you real hours or make you real money. If it can't be measured in your bank account or your team's calendar, I won't build it.",
  },
  {
    title: "You own everything.",
    body: "All accounts, all logins, all source code — in your name, on your hardware, with full documentation. I never hold your business hostage. If you want to take it elsewhere on day 31, you can.",
  },
  {
    title: "Two clients at a time.",
    body: "I work small on purpose. No project managers, no junior handoffs, no agency overhead. You get the operator who built it — reachable on WhatsApp, every working day.",
  },
];

const milestones = [
  {
    period: "2022",
    body: "Started with no-code automations on Zapier for small businesses — funnels, CRM glue, lead routing. Learned that most SMBs don't need fancy AI; they need the boring stuff to stop breaking.",
  },
  {
    period: "2023",
    body: "Went deep on Make and self-hosted n8n. Built full operations stacks for clinics, coaches and online agencies on GoHighLevel.",
  },
  {
    period: "2024",
    body: "Founded Tensor. Brought LLMs into real production workflows for paying clients — lead qualification agents, Messenger bots, RAG chatbots over internal docs.",
  },
  {
    period: "2025",
    body: "Now: AI automation, Facebook & Messenger bots, and high-converting websites for small businesses across Bangladesh, the GCC and the US. Replies on WhatsApp within 1 hour, 7 days a week.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tensor · About"
        index="02"
        meta="Operator-led · Founded 2024 · Dhaka, Bangladesh"
        title={
          <>
            Hi, I&rsquo;m Arefin.
            <br />
            I build the systems{" "}
            <span className="serif">that quietly run</span>{" "}
            small businesses.
          </>
        }
        subtitle="AI automation, Facebook & Messenger bots, and high-converting websites — done-for-you, owned by you, supported by me."
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10 relative">
          <div className="md:col-span-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
              The operator
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Arefin Muin<br />Est. 2024 · Dhaka, BD<br />Replies in &lt; 1 hour
            </p>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg leading-relaxed text-white/80">
            <p>
              I build the AI systems, automations and websites that quietly
              run small businesses — so the owner can stop copy-pasting,
              stop missing Messenger replies, and start sleeping.
            </p>
            <p>
              Most &ldquo;automation guys&rdquo; sell you a Zapier zap and disappear.
              I do the opposite: I learn your workflow, build something that
              actually fits your business, document it, train you on it, and
              stay reachable on WhatsApp. The systems I leave behind are
              ones your team can run — and grow on.
            </p>
            <p>
              I&rsquo;m an AI engineer based in{" "}
              <strong className="text-white">Dhaka, Bangladesh</strong>, and over
              the last few years I&rsquo;ve shipped automations and websites for
              e-commerce stores, dental and beauty clinics, coaches, real-estate
              brokers, online agencies and local services — from Dhaka to
              Dubai to Toronto.
            </p>
            <p>
              I work small on purpose. <strong className="text-white">Two clients at a time</strong>,
              no junior handoffs, no agency overhead. You get the operator,
              not a project manager.
            </p>
            <p>
              If your team is drowning in repetitive work, your Messenger
              inbox is quietly costing you sales, or your website is silently
              killing your conversions —{" "}
              <strong className="text-white">let&rsquo;s talk for 30 minutes. Free. No pitch.</strong>
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
                Let&rsquo;s talk · Free 30-min audit
              </p>
              <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
                Two slots open{" "}
                <span className="serif text-[1.04em] iridescent">this month.</span>
              </h2>
              <p className="mt-4 text-white/65 max-w-md">
                30 minutes. I&rsquo;ll review your workflow, inbox or website
                live and tell you exactly what to fix first. No pitch.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shimmer relative z-10 bg-white text-foreground border-white">
              Book my free audit
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
