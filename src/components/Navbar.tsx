"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrainMark from "@/components/BrainMark";

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
    const stem = href.replace(/\.html$/, "");
    return pathname?.startsWith(stem);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        scrolled
          ? "bg-background/85 border-b border-line"
          : "bg-background/40 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group"
          onClick={() => setOpen(false)}
        >
          <span className="relative w-10 h-10 rounded-xl bg-foreground grid place-items-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
            <BrainMark size={26} />
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent-1)]/0 via-[var(--accent-2)]/0 to-[var(--accent-3)]/0 group-hover:from-[var(--accent-1)]/15 group-hover:via-[var(--accent-2)]/15 group-hover:to-[var(--accent-3)]/15 transition-all duration-500" />
          </span>
          <div className="leading-tight">
            <div className="font-mono text-[15px] tracking-[0.26em] uppercase text-foreground">
              Tensor<span className="text-foreground/55"> studio</span>
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Intelligence that connects future
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.slice(0, -1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-2 text-sm transition-colors ${
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-foreground" />
              )}
            </Link>
          ))}
          <a
            href="https://wa.me/8801994605717?text=Hi%20Arefin!%20I%27d%20like%20to%20chat%20about%20automating%20my%20business."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Arefin"
            className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors ml-2"
            title="WhatsApp"
          >
            <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true" fill="currentColor">
              <path d="M19.11 17.21c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16s-.81 1-.99 1.21c-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.83-1.55-1.84-1.73-2.15-.18-.31-.02-.48.13-.63.13-.13.31-.36.46-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.69-.95-2.32-.25-.6-.51-.52-.7-.53l-.59-.01c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.39 4.75.75.32 1.34.51 1.8.66.75.24 1.44.21 1.98.13.6-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.29-.21-.6-.36zM16 4C9.37 4 4 9.37 4 16c0 2.12.55 4.11 1.5 5.84L4 28l6.32-1.45A11.93 11.93 0 0 0 16 28c6.63 0 12-5.37 12-12S22.63 4 16 4z" />
            </svg>
          </a>
          <Link
            href="/book"
            className="btn-primary text-sm ml-2"
          >
            <span className="live-dot" aria-hidden="true" />
            Get free audit
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden p-2 rounded-lg hover:bg-foreground/5"
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

      {/* Scroll progress bar */}
      <div className="h-px w-full bg-transparent">
        <div
          className="h-px bg-gradient-to-r from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)] origin-left"
          style={{ transform: `scaleX(${progress})`, transition: "transform 80ms linear" }}
        />
      </div>

      {open && (
        <nav className="md:hidden border-t border-line bg-background/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between border-b border-line py-3 ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <span className="text-base">{link.label}</span>
                <span className="mono text-xs text-muted">{link.num}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
