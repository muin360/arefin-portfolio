import Link from "next/link";
import { IconMail, IconGithub, IconLinkedin, IconX, IconArrow } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
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
          href="mailto:arefinmuin@gmail.com"
          className="mt-10 inline-flex items-center gap-3 group"
        >
          <span className="email-cta text-2xl md:text-4xl">
            arefinmuin@gmail.com
          </span>
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
                <Link href="/about.html" className="text-white/85 hover:text-white link-underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services.html" className="text-white/85 hover:text-white link-underline">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/skills.html" className="text-white/85 hover:text-white link-underline">
                  Stack
                </Link>
              </li>
              <li>
                <Link href="/projects.html" className="text-white/85 hover:text-white link-underline">
                  Selected work
                </Link>
              </li>
              <li>
                <Link href="/blog.html" className="text-white/85 hover:text-white link-underline">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/privacy.html" className="text-white/85 hover:text-white link-underline">
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
              <li>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2">
                  <IconGithub width={14} height={14} /> GitHub
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2">
                  <IconLinkedin width={14} height={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2">
                  <IconX width={14} height={14} /> X / Twitter
                </a>
              </li>
              <li>
                <a href="mailto:arefinmuin@gmail.com" className="text-white/85 hover:text-white link-underline inline-flex items-center gap-2">
                  <IconMail width={14} height={14} /> Email
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/45 mb-4">
              Status
            </p>
            <p className="text-sm text-white/85 inline-flex items-center gap-2">
              <span className="live-dot" />
              Available · April 2025
            </p>
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

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-white/50">
          <p className="mono text-[11px] uppercase tracking-[0.16em]">
            © {year} Arefin Muin. Hand-coded with Next.js + Tailwind.
          </p>
          <p className="mono text-[11px] uppercase tracking-[0.16em]">
            v 2.0 · Editorial
          </p>
        </div>
      </div>
    </footer>
  );
}
