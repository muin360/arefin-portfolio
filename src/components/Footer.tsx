import Link from "next/link";
import {
  IconMail,
  IconGithub,
  IconLinkedin,
  IconX,
  IconWhatsapp,
  IconArrow,
} from "./icons";
import { getSiteSettings } from "@/lib/db";
import FooterReveal from "@/components/transitions/FooterReveal";

export default async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();

  const { email, availability, availabilityNote, socialLinks, phoneE164 } = settings;
  const whatsapp =
    socialLinks.whatsapp ||
    (phoneE164 ? `https://wa.me/${phoneE164}` : undefined);

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
          Have a workflow{" "}
          <span className="v2-footer__head-italic">worth automating?</span>
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
              AI Automation &amp; AI Agent Developer based in Dhaka. I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.
            </p>
            <p className="v2-footer__sub">
              Practical AI automations that solve real workflow bottlenecks.
            </p>
          </div>

          {/* COLUMN 2 — sitemap */}
          <div className="v2-footer__col">
            <p className="v2-footer__col-title">Navigation</p>
            <ul className="v2-footer__links">
              <li>
                <Link href="/projects" className="v2-footer__link">
                  Work
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
                <Link href="/blog" className="v2-footer__link">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/about" className="v2-footer__link">
                  About
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
              <p className="v2-footer__status-line">
                <span className="v2-footer__status-dot" aria-hidden="true" />
                <span>{availabilityNote || availability}</span>
              </p>
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
              {socialLinks.github && (
                <li>
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="v2-footer__social-link"
                  >
                    <IconGithub width={16} height={16} />
                  </a>
                </li>
              )}
              {socialLinks.linkedin && (
                <li>
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="v2-footer__social-link"
                  >
                    <IconLinkedin width={16} height={16} />
                  </a>
                </li>
              )}
              {socialLinks.twitter && (
                <li>
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X / Twitter"
                    className="v2-footer__social-link"
                  >
                    <IconX width={16} height={16} />
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
            <span>v2.0 · Production</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
