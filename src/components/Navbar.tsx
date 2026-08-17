"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Navbar (v2).
 *
 * Sticky, glassmorphic nav band that lights up its own backdrop blur
 * once the page scrolls. Three lanes:
 *
 *   left   ◈ AREFIN MUEEN wordmark — the lozenge rotates 45° on hover
 *   center mono uppercase nav links, underline animates on hover
 *   right  live status pill (system status) + "Book audit" CTA
 *
 * Below the bar we render a scroll progress hairline so the visitor
 * always has a sense of how far they are through any long page.
 */

const links = [
  { href: "/", label: "Home", num: "01" },
  { href: "/projects", label: "Work", num: "02" },
  { href: "/services", label: "Services", num: "03" },
  { href: "/blog", label: "Journal", num: "04" },
  { href: "/about", label: "About", num: "05" },
  { href: "/contact", label: "Contact", num: "06" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={`v2-nav ${scrolled ? "is-scrolled" : ""}`}
      data-scrolled={scrolled ? "1" : "0"}
    >
      <div className="v2-nav__inner">
        {/* Wordmark */}
        <Link
          href="/"
          className="v2-nav__brand group"
          onClick={() => setOpen(false)}
          aria-label="Arefin Mueen — home"
        >
          <span className="v2-nav__diamond" aria-hidden="true">
            ◈
          </span>
          <span className="v2-nav__wordmark">
            AREFIN MUEEN
            <span className="v2-nav__wordmark-sub">automation · DHK</span>
          </span>
        </Link>

        {/* Center links */}
        <nav className="v2-nav__center" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`v2-nav__link ${isActive(link.href) ? "is-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="v2-nav__right">
          <span className="v2-nav__pill" aria-label="Available for projects">
            <span className="v2-nav__pill-dot" />
            <span className="v2-nav__pill-text">available · DHK</span>
          </span>
          <Link href="/contact" className="v2-nav__cta">
            Contact me
            <span aria-hidden="true">→</span>
          </Link>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="v2-nav__burger"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="v2-nav__drawer" role="dialog" aria-label="Mobile navigation">
          <div className="v2-nav__drawer-list">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`v2-nav__drawer-link ${isActive(link.href) ? "is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="v2-nav__drawer-num">{link.num}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Scroll indicator */}
      <div
        className="v2-nav__progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
    </header>
  );
}
