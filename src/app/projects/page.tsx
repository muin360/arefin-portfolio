import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/site";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { IconArrow } from "@/components/icons";

export const metadata: Metadata = {
  title: "Selected work — Arefin Muin",
  description:
    "Selected automation and AI-agent systems built by Arefin Muin for clients and personal projects.",
};

const outcomes: Record<string, string> = {
  "AI Lead Qualification Agent": "Cut response time 4h → 6 min, lifted lead-to-meeting 45%.",
  "GoHighLevel Booking Bot": "Booked 60% of qualified inbound conversations with no human in the loop.",
  "Content Repurposing Pipeline": "1 hour of video → 12 ready-to-post pieces in under 15 minutes.",
  "Internal Knowledge-Base Chatbot": "Reduced internal SOP questions by ~70% in the first month.",
  "E-commerce Auto-Reply Agent": "Auto-resolved ~55% of Tier-1 tickets with brand-tone replies.",
  "AI Cold-Outreach System": "350+ personalized openers per day per sender, 11% reply rate.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        index="05"
        meta="Case studies · Editorial"
        title={
          <>
            Systems that{" "}
            <span className="serif">do the work,</span>
            <br />
            so the team doesn&apos;t.
          </>
        }
        subtitle="A selection of automations and AI agents I've put into production. Case studies are anonymized — I'll share specifics on a call."
      />

      <section className="max-w-7xl mx-auto px-6 sm:px-8 section">
        <ul className="divide-y divide-line border-y border-line">
          {projects.map(({ Icon, title, summary, stack, category }, i) => (
            <Reveal
              key={title}
              as="li"
              delay={i * 60}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 md:py-16 group hover:bg-paper-deep/30 transition-colors duration-500"
            >
              <div className="md:col-span-1">
                <span className="num text-sm text-muted">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="md:col-span-2">
                <Icon
                  width={32}
                  height={32}
                  className="text-foreground transition-transform duration-500 group-hover:rotate-[-6deg]"
                />
                <p className="mt-3 chip">{category}</p>
              </div>
              <div className="md:col-span-9">
                <h2 className="display text-2xl md:text-4xl tracking-tight">
                  {title}
                </h2>
                <p className="mt-4 text-foreground/85 max-w-2xl leading-relaxed">
                  {summary}
                </p>
                {outcomes[title] && (
                  <p className="mt-4 inline-flex items-center gap-2 text-sm">
                    <span className="w-6 h-px bg-[var(--accent-1)]" />
                    <span className="text-foreground/80 italic serif text-base">
                      {outcomes[title]}
                    </span>
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs mono text-muted">
                  {stack.map((s) => (
                    <span key={s}>· {s}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <div className="mt-24 rounded-3xl border border-line bg-paper p-10 md:p-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-5">[ Next project ]</p>
              <h2 className="display text-3xl md:text-5xl max-w-2xl">
                Want a system like one of{" "}
                <span className="serif">these?</span>
              </h2>
            </div>
            <Link href="/contact.html" className="btn-primary">
              Start a project
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
