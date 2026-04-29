import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import ContactForm from "./ContactForm";
import {
  IconMail,
  IconCheck,
  IconGithub,
  IconLinkedin,
  IconX,
  IconFacebook,
} from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import StudioTime from "@/components/StudioTime";
import { sanityFetch } from "@/sanity/fetch";
import { siteConfigQuery } from "@/sanity/queries";
import type { SiteConfig } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description:
    "Get in touch with Tensor to discuss AI agents, automation workflows and LLM engineering work. Replies within a day, Monday to Saturday, Asia/Dhaka.",
};

const FALLBACK_SOCIAL = {
  github: "https://github.com/arefinmuin",
  linkedin: "https://www.linkedin.com/in/arefin-muin/",
  twitter: "https://x.com/arefin_muin",
  facebook: "https://www.facebook.com/Mueen360",
};

export default async function ContactPage() {
  const cfg = await sanityFetch<SiteConfig | null>({
    query: siteConfigQuery,
    tags: ["siteConfig"],
  });
  const social = { ...FALLBACK_SOCIAL, ...(cfg?.social ?? {}) };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        index="07"
        meta="Replies within a day · Mon–Sat (Asia/Dhaka)"
        title={
          <>
            Tell us about the workflow you&apos;d like to{" "}
            <span className="serif">automate.</span>
          </>
        }
        subtitle="A short message is enough to start. We reply within a working day, Monday to Saturday — answering on Asia/Dhaka time."
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
                    The fastest way to reach the agency. Tell us what
                    you&apos;re trying to automate and the tools you
                    currently use.
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
                    Currently taking on a few engagements per quarter. Free
                    30-minute discovery calls always available — no pitch,
                    just a real look at whether it&apos;s a fit.
                  </p>
                  <StudioTime />
                </div>
              </BentoCard>

              <BentoCard className="h-full">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-4">
                    Find Tensor elsewhere
                  </p>
                  <ul className="grid grid-cols-2 gap-3">
                    {social.github && (
                      <li>
                        <a
                          href={social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white link-underline"
                        >
                          <IconGithub width={14} height={14} /> GitHub
                        </a>
                      </li>
                    )}
                    {social.linkedin && (
                      <li>
                        <a
                          href={social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white link-underline"
                        >
                          <IconLinkedin width={14} height={14} /> LinkedIn
                        </a>
                      </li>
                    )}
                    {social.twitter && (
                      <li>
                        <a
                          href={social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white link-underline"
                        >
                          <IconX width={14} height={14} /> X / Twitter
                        </a>
                      </li>
                    )}
                    {social.facebook && (
                      <li>
                        <a
                          href={social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white link-underline"
                        >
                          <IconFacebook width={14} height={14} /> Facebook
                        </a>
                      </li>
                    )}
                  </ul>
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
