"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

const faqs = [
  {
    q: "How much does it cost?",
    a: "Most AI automation projects fall between BDT 25,000–250,000 (~$200–$2,000) depending on scope. Messenger bots start at BDT 15,000 (~$125). Websites start at BDT 35,000 (~$300). We agree on a flat price before I start — no surprises, no hourly billing.",
  },
  {
    q: "How long does it take?",
    a: "7–14 days for most automations and Messenger bots. 14–21 days for a complete website. You'll get daily updates on WhatsApp.",
  },
  {
    q: "Will I be able to run it after you leave?",
    a: "Yes. Every project ships with Loom video walkthroughs, written docs, and 30 days of free post-launch support. If your team can't run it on Day 30 — it's not done.",
  },
  {
    q: "What if I don't have a CRM or the right tools yet?",
    a: "No problem. I'll recommend the simplest stack for your size and budget — usually free or low-cost tools you'll actually use. I make money building, not reselling software.",
  },
  {
    q: "Do you work with my industry?",
    a: "If your business has customers, messages, leads or repetitive tasks — yes. So far: e-commerce, dental & beauty clinics, coaches, real estate, online agencies and local services across Bangladesh, the GCC and the US.",
  },
  {
    q: "What if it doesn't work?",
    a: "The 30-min audit call is free, no obligation. If you start a project and the system doesn't deliver the agreed outcome by handoff, I'll keep working on it without billing more — until it does.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 section">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="eyebrow mb-5">[ FAQ ] Common questions</p>
            <h2 className="display text-4xl md:text-6xl">
              Everything you&apos;re{" "}
              <span className="serif">about to ask.</span>
            </h2>
            <p className="mt-5 text-muted max-w-2xl mx-auto leading-relaxed">
              Six honest answers to the questions every small business asks
              before starting. No marketing speak.
            </p>
          </div>
        </Reveal>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 md:py-7 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4 md:gap-5 flex-1">
                    <span className="font-mono text-xs text-muted tabular-nums tracking-[0.16em] mt-1.5 shrink-0">
                      / {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg md:text-xl tracking-tight font-medium pr-4">
                      {f.q}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 mt-2 w-8 h-8 rounded-full border border-line grid place-items-center transition-all duration-300 ${
                      isOpen
                        ? "bg-foreground text-background border-foreground rotate-45"
                        : "bg-transparent text-foreground group-hover:border-foreground/40"
                    }`}
                    aria-hidden="true"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-6 md:pb-8"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pl-12 md:pl-14 pr-12 text-muted leading-relaxed max-w-3xl">
                      {f.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
