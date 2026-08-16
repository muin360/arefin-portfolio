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
  IconWhatsapp,
} from "@/components/icons";
import BentoCard from "@/components/BentoCard";
import StudioTime from "@/components/StudioTime";
import { sanityFetch } from "@/sanity/fetch";
import { siteConfigQuery } from "@/sanity/queries";
import type { SiteConfig } from "@/sanity/types";
import { FALLBACK_SITE_CONFIG } from "@/data/fallbacks";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description:
    "Get in touch with Arefin Mueen to discuss AI automations, AI agents, RAG systems, and workflow integrations. Replies within 24 hours.",
};

function whatsappLink(cfg: SiteConfig): string | undefined {
  if (cfg.social?.whatsapp) return cfg.social.whatsapp;
  if (cfg.phoneE164) return `https://wa.me/${cfg.phoneE164}`;
  return undefined;
}

export default async function ContactPage() {
  const cfgRaw = await sanityFetch<SiteConfig>({
    query: siteConfigQuery,
    tags: ["siteConfig"],
  });
  const cfg: SiteConfig = cfgRaw ?? FALLBACK_SITE_CONFIG;
  const social = { ...(FALLBACK_SITE_CONFIG.social ?? {}), ...(cfg.social ?? {}) };
  const email = cfg.email ?? FALLBACK_SITE_CONFIG.email;
  const phone = cfg.phone ?? FALLBACK_SITE_CONFIG.phone;
  const phoneE164 = cfg.phoneE164 ?? FALLBACK_SITE_CONFIG.phoneE164;
  const whatsapp = whatsappLink({ ...cfg, social });

  return (
    <>
      <PageHeader
        eyebrow="Arefin Mueen · Contact"
        index="07"
        meta="Replies within 24 hours · Mon–Sat (Asia/Dhaka)"
        title={
          <>
            Tell me about the workflow you want to{" "}
            <span className="serif">automate.</span>
          </>
        }
        subtitle="Whether you want to connect business apps with n8n, build an autonomous agent, or set up a RAG knowledge assistant — share what you're trying to accomplish and the tools you use."
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
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-3 text-xl md:text-2xl tracking-tight font-medium link-underline text-white break-all"
                  >
                    <IconMail width={22} height={22} />
                    {email}
                  </a>
                  <p className="mt-4 text-white/65 leading-relaxed">
                    The fastest way to reach me directly. Tell me what
                    you&apos;re trying to build or automate and the tools you
                    currently use.
                  </p>
                </div>
              </BentoCard>

              {(whatsapp || phone) && (
                <BentoCard className="h-full">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 mb-5">
                      WhatsApp &amp; phone
                    </p>
                    <div className="flex flex-col gap-3">
                      {whatsapp && (
                        <a
                          href={whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 text-lg md:text-xl tracking-tight font-medium link-underline text-white"
                        >
                          <IconWhatsapp width={20} height={20} />
                          {phone ? `WhatsApp ${phone}` : "Open WhatsApp"}
                        </a>
                      )}
                      {phone && phoneE164 && (
                        <a
                          href={`tel:+${phoneE164}`}
                          className="inline-flex items-center gap-3 text-base text-white/85 link-underline"
                        >
                          <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">
                            Call
                          </span>
                          {phone}
                        </a>
                      )}
                    </div>
                    <p className="mt-4 text-white/65 leading-relaxed">
                      Prefer voice? Drop a WhatsApp message any day, or call
                      between 10:00–19:00 Asia/Dhaka.
                    </p>
                  </div>
                </BentoCard>
              )}

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
                    Find me elsewhere
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
                    {whatsapp && (
                      <li>
                        <a
                          href={whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white link-underline"
                        >
                          <IconWhatsapp width={14} height={14} /> WhatsApp
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
