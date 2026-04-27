import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import ContactForm from "./ContactForm";
import { IconMail, IconCheck } from "@/components/icons";

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

      <section className="max-w-6xl mx-auto px-6 sm:px-8 section">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-8">
            <div>
              <p className="eyebrow mb-5">Direct</p>
              <a
                href="mailto:arefinmuin@gmail.com"
                className="inline-flex items-center gap-3 text-2xl md:text-3xl tracking-tight font-medium link-underline"
              >
                <IconMail width={24} height={24} />
                arefinmuin@gmail.com
              </a>
              <p className="mt-4 text-muted leading-relaxed max-w-md">
                The fastest way to reach me. Tell me what you&apos;re trying
                to automate and the tools you currently use.
              </p>
            </div>

            <div>
              <p className="eyebrow mb-5">A good first message includes</p>
              <ul className="space-y-3">
                {[
                  "What you're trying to automate or build",
                  "The tools you currently use (CRM, email, comms…)",
                  "Rough timeline and budget, if you have one",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-foreground/85"
                  >
                    <IconCheck
                      width={18}
                      height={18}
                      className="mt-1 shrink-0"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line pt-8">
              <p className="eyebrow mb-3">Availability</p>
              <p className="text-foreground/85 leading-relaxed">
                Currently taking on a few projects per quarter. Free 30-minute
                discovery calls always available — no pitch, just a real look
                at whether it&apos;s a fit.
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
