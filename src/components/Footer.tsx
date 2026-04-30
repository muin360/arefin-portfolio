import Link from "next/link";
import {
  IconMail,
  IconGithub,
  IconLinkedin,
  IconX,
  IconFacebook,
  IconWhatsapp,
  IconArrow,
} from "./icons";
import { sanityFetch } from "@/sanity/fetch";
import { siteConfigQuery } from "@/sanity/queries";
import type { SiteConfig } from "@/sanity/types";
import { FALLBACK_SITE_CONFIG } from "@/data/fallbacks";

export default async function Footer() {
  const year = new Date().getFullYear();
  const cfg = (await sanityFetch<SiteConfig>({
    query: siteConfigQuery,
    tags: ["siteConfig"],
  })) ?? FALLBACK_SITE_CONFIG;

  const social = { ...(FALLBACK_SITE_CONFIG.social ?? {}), ...(cfg.social ?? {}) };
  const email = cfg.email ?? FALLBACK_SITE_CONFIG.email;
  const availability = cfg.availability ?? FALLBACK_SITE_CONFIG.availability ?? "";
  const whatsapp =
    social.whatsapp ??
    (cfg.phoneE164 ? `https://wa.me/${cfg.phoneE164}` : undefined);

  return (
    <footer className="bg-foreground text-white relative overflow-hidden">
      <div className="noise" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 md:pt-32 pb-10 relative">
        {/* Big editorial CTA */}
        <p className="mono text-xs uppercase tracking-[0.18em] text-white/55 mb-8">
          <span className="opacity-60 mr-2">[</span>
          Let&apos;s build something
          <span className="opacity-60 ml-2">]</span>
        </p>
        <h2 className="display text-[14vw] md:text-[10vw] leading-[0.92] tracking-[-0.04em] max-w-[12ch]">
          Got a workflow{" "}
          <span className="serif text-white/85">worth automating?</span>
        </h2>

        <a
          href={`mailto:${email}`}
          className="mt-10 inline-flex items-center gap-3 group"
        >
          <span className="email-cta text-2xl md:text-4xl">{email}</span>
          <span className="grid place-items-center w-10 h-10 rounded-full border border-white/20 group-hover:bg-white group-hover:text-foreground transition-colors">
            <IconArrow width={16} height={16} />
          </span>
        </a>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 border-t border-white/10 pt-10">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/45 mb-4">
              Sitemap
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-white/85 hover:text-white link-underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/85 hover:text-white link-underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-white/85 hover:text-white link-underline">
                  Stack
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-white/85 hover:text-white link-underline">
                  Selected work
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/85 hover:text-white link-underline">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/85 hover:text-white link-underline">
                  Privacy &amp; Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/45 mb-4">
              Elsewhere
            </p>
            <ul className="space-y-2.5 text-sm">
              {social.github && (
                <li>
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2"
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
                    className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2"
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
                    className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2"
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
                    className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2"
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
                    className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2"
                  >
                    <IconWhatsapp width={14} height={14} /> WhatsApp
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2"
                >
                  <IconMail width={14} height={14} /> Email
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/45 mb-4">
              Status
            </p>
            {availability && (
              <p className="text-sm text-white/85 inline-flex items-center gap-2">
                <span className="live-dot" />
                {availability}
              </p>
            )}
            <p className="mt-3 text-sm text-white/55 leading-relaxed">
              Booking 1–2 new engagements per month. Replies within a day.
            </p>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/45 mb-4">
              Based in
            </p>
            <p className="text-sm text-white/85">
              Remote · GMT+6
            </p>
            <p className="mt-3 text-sm text-white/55 leading-relaxed">
              Working with teams across US, EU and APAC.
            </p>
          </div>
        </div>

        {/* Studio identity strip */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tensor-logo-256.png"
                alt="Tensor"
                width={72}
                height={72}
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
                loading="lazy"
              />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-2">
                  The agency
                </p>
                <p className="font-mono text-2xl md:text-3xl tracking-[0.22em] uppercase text-white">
                  Tensor
                </p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
                  Intelligence that connects the future
                </p>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-md">
              Tensor is a small AI engineering agency building
              quiet, intelligent systems for ambitious teams. Founded and
              operated by Arefin Muin from Dhaka, Bangladesh.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-white/50">
          <p className="mono text-[11px] uppercase tracking-[0.16em]">
            © {year} Tensor · Founded by Arefin Muin · Hand-coded with Next.js + Tailwind
          </p>
          <p className="mono text-[11px] uppercase tracking-[0.16em]">
            v 2.0 · Editorial
          </p>
        </div>
      </div>
    </footer>
  );
}
