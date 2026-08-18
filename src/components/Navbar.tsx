"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { whatsappHref, WA_MESSAGES } from "@/lib/cta";
import ArefinAITrigger from "@/components/ai/ArefinAITrigger";

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
  const drawerRef = useRef<HTMLDivElement>(null);

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
    <>
      {/* ─── ACCESSIBLE SKIP LINK ────────────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-mono focus:text-xs focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className={`v2-nav ${scrolled ? "is-scrolled" : ""}`}
        data-scrolled={scrolled ? "1" : "0"}
      >
        {/* Scroll Hairline Progress Indicator */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-indigo-400 to-sky-400 opacity-80 pointer-events-none transition-all"
          style={{ width: `${progress * 100}%` }}
          aria-hidden="true"
        />

        <div className="v2-nav__inner">
          {/* Wordmark (Brand) */}
          <Link
            href="/"
            className="v2-nav__brand group shrink-0 flex items-center gap-2 sm:gap-2.5"
            onClick={() => setOpen(false)}
            aria-label="Arefin Mueen — Home"
          >
            <span
              className="v2-nav__diamond shrink-0 group-hover:rotate-45 group-hover:text-violet-300 transition-transform duration-300"
              aria-hidden="true"
            >
              ◈
            </span>
            <span className="v2-nav__wordmark whitespace-nowrap text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.28em] text-white">
              AREFIN MUEEN
              <span className="v2-nav__wordmark-sub hidden sm:inline-block">automation · DHK</span>
            </span>
          </Link>

          {/* Center navigation links (Desktop only: lg+) */}
          <nav
            className="v2-nav__center hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8"
            aria-label="Primary"
          >
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`v2-nav__link text-[11px] font-mono tracking-wider transition-colors relative py-1 ${
                    active ? "is-active text-white font-bold" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster: Availability + AI + CTA + Mobile Hamburger */}
          <div className="v2-nav__right flex items-center gap-2.5 sm:gap-3 shrink-0">
            <span
              className="v2-nav__pill hidden xl:inline-flex"
              aria-label="Available for projects"
            >
              <span className="v2-nav__pill-dot" />
              <span className="v2-nav__pill-text">available · DHK</span>
            </span>

            <ArefinAITrigger variant="compact" className="hidden sm:inline-flex" />

            <Link href="/contact" className="v2-nav__cta hidden sm:inline-flex">
              <span>Contact me</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>

            {/* Mobile hamburger button */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-drawer"
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

        {/* ─── FULL MOBILE NAVIGATION DRAWER (< lg) ──────────────────────── */}
        {open && (
          <div
            id="mobile-nav-drawer"
            ref={drawerRef}
            className="fixed inset-x-0 top-[var(--nav-height)] bottom-0 z-40 bg-[#07090e]/98 backdrop-blur-xl border-t border-white/[0.08] flex flex-col justify-between p-6 overflow-y-auto custom-scrollbar animate-fade-in lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="space-y-6">
              {/* Quick AI Trigger Banner inside Mobile Drawer */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-600/20 via-indigo-600/10 to-transparent border border-violet-500/30 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-violet-300 uppercase tracking-wider block">
                    Embedded AI
                  </span>
                  <span className="text-xs font-semibold text-white">Ask Arefin AI</span>
                </div>
                <ArefinAITrigger
                  variant="pill"
                  onTrigger={() => setOpen(false)}
                />
              </div>

              {/* Navigation Links Grid */}
              <nav className="space-y-1.5" aria-label="Mobile Navigation">
                {links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl text-sm font-mono tracking-wide transition-all ${
                        active
                          ? "bg-violet-600/20 text-white font-bold border border-violet-500/30"
                          : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      <span className="text-xs font-sans font-semibold">{link.label}</span>
                      <span className="text-[10px] text-white/40 font-mono">{link.num}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/[0.08] space-y-3">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition-colors"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={whatsappHref(WA_MESSAGES.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 text-xs font-mono flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Direct</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
