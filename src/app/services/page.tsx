import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/site";
import { PageHeader } from "@/components/Section";
import { IconArrow, IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Services — Arefin Muin",
  description:
    "AI agents, workflow automation, GoHighLevel setup, custom LLM solutions and engineering audits.",
};

const process = [
  {
    step: "01",
    title: "Discovery",
    body: "A short call to understand the business, the tools, and the bottleneck. Free, no pitch.",
  },
  {
    step: "02",
    title: "Audit & proposal",
    body: "I map the current workflow, identify the highest-ROI opportunities, and send a clear scope and price.",
  },
  {
    step: "03",
    title: "Build & test",
    body: "I build the system, share progress as I go, and run it against real data before going live.",
  },
  {
    step: "04",
    title: "Launch & support",
    body: "Once it's live, I document everything, train the team and stay reachable for iteration.",
  },
];

const engagement = [
  "Weekly progress updates with live links",
  "All work delivered in your accounts (you own everything)",
  "Documentation and Loom handoff at the end of every project",
  "Source code under a clear license, in your repo",
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        index="03"
        meta="Capabilities · Pricing on call"
        title={
          <>
            Services for teams that want{" "}
            <span className="serif">leverage,</span> not headcount.
          </>
        }
        subtitle="Pick what fits, or tell me what's slowing you down — I'll design the right combination."
      />

      <section className="max-w-6xl mx-auto px-6 sm:px-8 section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {services.map(({ Icon, title, description }) => (
            <div key={title} className="bg-surface p-8 md:p-10">
              <div className="flex items-start justify-between">
                <Icon width={28} height={28} className="text-foreground" />
                <span className="text-xs tabular-nums text-muted">
                  /{(services.indexOf(services.find((s) => s.title === title)!) + 1)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-2xl tracking-tight font-medium">
                {title}
              </h3>
              <p className="mt-3 text-muted leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="eyebrow mb-5">Process</p>
            <h2 className="display text-3xl md:text-5xl">
              Simple, deliberate,{" "}
              <span className="serif text-[1.04em]">no surprises.</span>
            </h2>
            <p className="mt-5 text-muted leading-relaxed">
              The same lightweight loop every project — built around clarity
              and tight feedback.
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {process.map((p) => (
              <div
                key={p.step}
                className="border border-line bg-surface rounded-2xl p-7"
              >
                <p className="text-sm tabular-nums text-muted">{p.step}</p>
                <h3 className="mt-2 text-lg font-medium tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 section grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <p className="eyebrow mb-5">What you get</p>
          <h2 className="display text-3xl md:text-5xl">
            Every engagement{" "}
            <span className="serif text-[1.04em]">includes.</span>
          </h2>
        </div>
        <div className="md:col-span-8">
          <ul className="divide-y divide-line border-y border-line">
            {engagement.map((line) => (
              <li
                key={line}
                className="flex items-start gap-4 py-5 text-foreground/85"
              >
                <IconCheck
                  width={20}
                  height={20}
                  className="text-foreground mt-0.5 shrink-0"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-24">
        <div className="rounded-3xl border border-line bg-foreground text-white p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-white/60 mb-5">Get started</p>
            <h2 className="display text-3xl md:text-5xl max-w-2xl">
              Tell me what&apos;s on{" "}
              <span className="serif text-[1.04em]">your plate.</span>
            </h2>
          </div>
          <Link
            href="/contact.html"
            className="btn-primary bg-white text-foreground border-white hover:bg-accent-1 hover:text-white hover:border-accent-1"
          >
            Start a project
            <IconArrow width={16} height={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
