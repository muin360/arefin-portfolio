"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { whatsappHref, WA_MESSAGES } from "@/lib/cta";

const links = [
  { href: "/", label: "Home", num: "01" },
  { href: "/projects", label: "Work", num: "02" },
  { href: "/services", label: "Services", num: "03" },
  { href: "/skills", label: "Stack", num: "04" },
  { href: "/blog", label: "Journal", num: "05" },
  { href: "/about", label: "About", num: "06" },
  { href: "/contact", label: "Contact", num: "07" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  // Scroll listener for progress hairline & glass density
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

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

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
        {/* Wordmark (Brand) */}
        <Link
          href="/"
          className="v2-nav__brand group shrink-0"
          onClick={() => setOpen(false)}
          aria-label="Arefin Mueen — Home"
        >
          <span className="v2-nav__diamond" aria-hidden="true">
            ◈
          </span>
          <span className="v2-nav__wordmark">
            AREFIN MUEEN
            <span className="v2-nav__wordmark-sub hidden sm:inline-block">automation · DHK</span>
          </span>
        </Link>

        {/* Center navigation links (Desktop only: lg+) */}
        <nav className="v2-nav__center hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`v2-nav__link text-[11px] font-mono tracking-wider transition-colors ${
                isActive(link.href) ? "is-active text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster: Availability + CTA + Mobile Hamburger */}
        <div className="v2-nav__right flex items-center gap-3 shrink-0">
          <span className="v2-nav__pill hidden xl:inline-flex" aria-label="Available for projects">
            <span className="v2-nav__pill-dot" />
            <span className="v2-nav__pill-text">available · DHK</span>
          </span>

          <Link href="/contact" className="v2-nav__cta hidden sm:inline-flex">
            <span>Contact me</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open navigation menu"}
            aria-expanded={open}
            className="v2-nav__burger lg:hidden flex items-center justify-center p-2 rounded-lg text-white/80 hover:text-white transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer (Starts directly below navbar, does NOT cover navbar) */}
      {open && (
        <div
          className="v2-nav__drawer lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col space-y-1">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold tracking-tight transition-colors ${
                    active
                      ? "bg-violet-600/15 text-violet-300 border border-violet-500/25"
                      : "text-white/80 hover:text-white hover:bg-white/[0.04]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-violet-400 font-normal">
                      {link.num}
                    </span>
                    <span>{link.label}</span>
                  </div>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
                </Link>
              );
            })}
          </div>

          {/* Drawer footer with availability and quick contact CTA */}
          <div className="pt-6 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-white/50 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for projects</span>
              </div>
              <span>Dhaka · GMT+6</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-colors"
                onClick={() => setOpen(false)}
              >
                <span>Contact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href={whatsappHref(WA_MESSAGES.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#121622] border border-white/10 hover:border-emerald-500/30 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-colors"
                onClick={() => setOpen(false)}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Scroll indicator hairline at the bottom edge */}
      <div
        className="v2-nav__progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
    </header>
  );
}
