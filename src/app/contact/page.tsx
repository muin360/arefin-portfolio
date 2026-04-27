import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import ContactForm from "./ContactForm";
import { IconMail, IconCheck } from "@/components/icons";
import BentoCard from "@/components/BentoCard";

export const metadata: Metadata = {
  title: "Contact — Arefin Muin",
  description:
    "Get in touch with Arefin Muin to discuss AI automation, agents and LLM engineering projects.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        index="07"
        meta="Replies within 24h · Mon–Sat"
        title={
          <>
            Tell me about the workflow you&apos;d like to{" "}
            <span className="serif">automate.</span>
          </>
        }
        subtitle="A short message is enough to get the conversation started. I'll reply within a day, Monday to Saturday."
      />

      <section className="hero-dark relative overflow-hidden">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-6">
              <BentoCard className="h-full">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
                    Direct
                  </p>
                  <a
                    href="mailto:arefinmuin@gmail.com"
                    className="inline-flex items-center gap-3 text-xl md:text-2xl tracking-tight font-medium link-underline text-white break-all"
                  >
                    <IconMail width={22} height={22} />
                    arefinmuin@gmail.com
                  </a>
                  <p className="mt-4 text-white/65 leading-relaxed">
                    The fastest way to reach me. Tell me what you&apos;re trying
                    to automate and the tools you currently use.
                  </p>
                </div>
              </BentoCard>

              <BentoCard className="h-full">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
                    A good first message includes
                  </p>
                  <ul className="space-y-3">
                    {[
                      "What you're trying to automate or build",
                      "The tools you currently use (CRM, email, comms…)",
                      "Rough timeline and budget, if you have one",
                    ].map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-3 text-white/85"
                      >
                        <IconCheck
                          width={18}
                          height={18}
                          className="mt-1 shrink-0 text-violet-300"
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BentoCard>

              <BentoCard className="h-full">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-3 inline-flex items-center gap-2">
                    <span className="live-dot" /> Availability
                  </p>
                  <p className="text-white/85 leading-relaxed">
                    Currently taking on a few projects per quarter. Free 30-minute
                    discovery calls always available — no pitch, just a real look
                    at whether it&apos;s a fit.
                  </p>
                </div>
              </BentoCard>
            </div>

            <div className="md:col-span-7">
              <BentoCard className="h-full">
                <ContactForm />
              </BentoCard>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
