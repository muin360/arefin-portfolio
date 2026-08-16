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
import FooterReveal from "@/components/transitions/FooterReveal";

/**
 * Footer (v2).
 *
 * Three editorial columns:
 *
 *   1. Brand + tagline + the giant email CTA (display-font headline,
 *      mailto with hover ring)
 *   2. Sitemap (two stacks: primary nav + meta)
 *   3. Status card — live availability dot, location, response time, and
 *      a horizontal row of social icons
 *
 * The bottom bar is a mono terminal-style strip with the year, the
 * studio identifier and a build version. Inherits the v2 grain texture
 * from globals.css and a top accent hairline that mirrors the navbar.
 */
export default async function Footer() {
  const year = new Date().getFullYear();
  const cfg =
    (await sanityFetch<SiteConfig>({
      query: siteConfigQuery,
      tags: ["siteConfig"],
    })) ?? FALLBACK_SITE_CONFIG;

  const social = { ...(FALLBACK_SITE_CONFIG.social ?? {}), ...(cfg.social ?? {}) };
  const email = cfg.email ?? FALLBACK_SITE_CONFIG.email;
  const availability =
    cfg.availability ?? FALLBACK_SITE_CONFIG.availability ?? "";
  const whatsapp =
    social.whatsapp ??
    (cfg.phoneE164 ? `https://wa.me/${cfg.phoneE164}` : undefined);

  return (
    <footer className="v2-footer" data-reveal="footer" aria-label="Site footer">
      <FooterReveal />
      {/* Top accent hairline */}
      <span className="v2-footer__top-rule" aria-hidden="true" />

      <div className="v2-footer__inner">
        {/* Editorial CTA band */}
        <p className="v2-footer__eyebrow">
          <span aria-hidden="true">[ </span>
          let&rsquo;s build something
          <span aria-hidden="true"> ]</span>
        </p>
        <h2 className="v2-footer__head">
          Have a product or workflow{" "}
          <span className="v2-footer__head-italic">ready to build?</span>
        </h2>
        <a href={`mailto:${email}`} className="v2-footer__email group">
          <span>{email}</span>
          <span className="v2-footer__email-arrow" aria-hidden="true">
            <IconArrow width={16} height={16} />
          </span>
        </a>

        {/* 3-column grid: brand, sitemap, status */}
        <div className="v2-footer__grid">
          {/* COLUMN 1 — brand + description */}
          <div className="v2-footer__col v2-footer__col--brand">
            <div className="v2-footer__brand">
              <span className="v2-footer__diamond" aria-hidden="true">
                ◈
              </span>
              <span className="v2-footer__wordmark">AREFIN MUEEN</span>
            </div>
            <p className="v2-footer__desc">
              AI-Powered Full-Stack Developer &amp; Web Designer based in Dhaka. I engineer intelligent websites, web applications, AI agents, and production automation systems.
            </p>
            <p className="v2-footer__sub">
              Engineering intelligent digital products with AI.
            </p>
          </div>

          {/* COLUMN 2 — sitemap */}
          <div className="v2-footer__col">
            <p className="v2-footer__col-title">Sitemap</p>
            <ul className="v2-footer__links">
              <li>
                <Link href="/about" className="v2-footer__link">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="v2-footer__link">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/skills" className="v2-footer__link">
                  Stack
                </Link>
              </li>
              <li>
                <Link href="/projects" className="v2-footer__link">
                  Selected work
                </Link>
              </li>
              <li>
                <Link href="/blog" className="v2-footer__link">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/book" className="v2-footer__link">
                  Book audit
                </Link>
              </li>
              <li>
                <Link href="/contact" className="v2-footer__link">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="v2-footer__link">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="v2-footer__link">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — status card */}
          <div className="v2-footer__col v2-footer__col--status">
            <div className="v2-footer__status-card">
              <p className="v2-footer__col-title">Availability</p>
              {availability && (
                <p className="v2-footer__status-line">
                  <span className="v2-footer__status-dot" aria-hidden="true" />
                  <span>{availability}</span>
                </p>
              )}
              <p className="v2-footer__status-sub">
                Booking 1–2 new sprints per month · replies within a day.
              </p>
              <div className="v2-footer__meta">
                <div>
                  <p className="v2-footer__meta-label">Location</p>
                  <p className="v2-footer__meta-value">Dhaka · GMT+6</p>
                </div>
                <div>
                  <p className="v2-footer__meta-label">Coverage</p>
                  <p className="v2-footer__meta-value">US · EU · APAC</p>
                </div>
              </div>
            </div>

            <ul className="v2-footer__social">
              {social.github && (
                <li>
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="v2-footer__social-link"
                  >
                    <IconGithub width={16} height={16} />
                  </a>
                </li>
              )}
              {social.linkedin && (
                <li>
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="v2-footer__social-link"
                  >
                    <IconLinkedin width={16} height={16} />
                  </a>
                </li>
              )}
              {social.twitter && (
                <li>
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                    className="v2-footer__social-link"
                  >
                    <IconX width={16} height={16} />
                  </a>
                </li>
              )}
              {social.facebook && (
                <li>
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="v2-footer__social-link"
                  >
                    <IconFacebook width={16} height={16} />
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="v2-footer__social-link"
                  >
                    <IconWhatsapp width={16} height={16} />
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${email}`}
                  aria-label="Email"
                  className="v2-footer__social-link"
                >
                  <IconMail width={16} height={16} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="v2-footer__bottom">
          <p>
            © {year} Arefin Mueen · Hand-coded with Next.js + Tailwind
          </p>
          <p>
            <span className="opacity-50">build</span>{" "}
            <span>v2.0 · neural-dark</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
