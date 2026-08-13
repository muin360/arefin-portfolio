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
 *   left   ◈ TENSORIX wordmark — the lozenge rotates 45° on hover
 *   center mono uppercase nav links, underline animates on hover
 *   right  live status pill (system status) + "Book audit" CTA
 *
 * Below the bar we render a scroll progress hairline so the visitor
 * always has a sense of how far they are through any long page.
 */

const links = [
  { href: "/", label: "Home", num: "01" },
  { href: "/about", label: "About", num: "02" },
  { href: "/services", label: "Services", num: "03" },
  { href: "/skills", label: "Stack", num: "04" },
  { href: "/projects", label: "Work", num: "05" },
  { href: "/blog", label: "Journal", num: "06" },
  { href: "/contact", label: "Contact", num: "07" },
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
          aria-label="Tensorix home"
        >
          <span className="v2-nav__diamond" aria-hidden="true">
            ◈
          </span>
          <span className="v2-nav__wordmark">
            AREFIN MUIN
            <span className="v2-nav__wordmark-sub">engineer · DHK</span>
          </span>
        </Link>

        {/* Center links */}
        <nav className="v2-nav__center" aria-label="Primary">
          {links.slice(0, -1).map((link) => (
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
          <span className="v2-nav__pill" aria-label="Studio status: open for sprints">
            <span className="v2-nav__pill-dot" />
            <span className="v2-nav__pill-text">live · taking sprints</span>
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

      {/* Scroll progress hairline */}
      <div className="v2-nav__progress">
        <div
          className="v2-nav__progress-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="v2-nav__drawer" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="v2-nav__drawer-link"
            >
              <span>{link.label}</span>
              <span className="v2-nav__drawer-num">{link.num}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
