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
          <Link
            href="/contact"
            className="btn-primary text-sm ml-4"
          >
            <span className="live-dot" aria-hidden="true" />
            Available
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
