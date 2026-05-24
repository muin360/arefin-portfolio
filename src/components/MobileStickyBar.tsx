"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Mobile scroll-depth nudge (audit fix Phase 4.2).
 *
 * After the visitor has scrolled past ~60% of the page on mobile, a
 * fixed bottom bar slides in offering the free 30-min audit CTA. It
 * stays out of the way of the existing `WhatsAppFab` (which sits in
 * the lower-right corner) and is hidden on tablet+ via the `md:hidden`
 * utility class.
 *
 * Hidden entirely on `/book` and `/contact` — those pages already are
 * the conversion target, so the nudge is redundant.
 */
export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const ratio = window.scrollY / max;
      if (ratio > 0.6) setVisible(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Suppress on conversion pages — they ARE the CTA target.
  if (pathname === "/book" || pathname === "/contact") return null;
  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Book a free systems audit"
      className="md:hidden fixed bottom-3 left-3 right-3 z-[60] flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md"
      style={{
        background: "color-mix(in oklab, var(--surface) 92%, transparent)",
        borderColor: "var(--border-2)",
        boxShadow: "0 18px 40px -22px rgba(0, 0, 0, 0.65)",
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-medium leading-tight truncate"
          style={{ color: "var(--t1)" }}
        >
          Ready to automate?
        </p>
        <p
          className="text-[11px] leading-tight mt-0.5 truncate"
          style={{ color: "var(--t3)" }}
        >
          Free 30-min audit · No obligation
        </p>
      </div>
      <Link
        href="/book"
        className="shrink-0 rounded-full px-4 py-2 text-[13px] font-medium tracking-tight"
        style={{
          background: "var(--a1)",
          color: "var(--void)",
        }}
      >
        Book audit →
      </Link>
    </div>
  );
}
