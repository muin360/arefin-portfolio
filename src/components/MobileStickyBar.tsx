"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, ArrowRight, Sparkles } from "lucide-react";

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const ratio = window.scrollY / max;
      if (ratio > 0.45 && !dismissed) setVisible(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  // Suppress on conversion pages
  if (pathname === "/book" || pathname === "/contact" || dismissed) return null;
  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Book a free systems audit"
      className="md:hidden fixed bottom-3 left-3 right-3 z-[60] flex items-center justify-between gap-3 rounded-2xl border border-violet-500/30 px-4 py-3 bg-[#0c101d]/95 backdrop-blur-xl shadow-2xl shadow-black/80 animate-slide-up"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white leading-tight truncate">
            Automate your workflows
          </p>
          <p className="text-[10px] text-white/50 leading-tight mt-0.5 truncate font-mono">
            Free 30-min scoping · Dhaka GMT+6
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Link
          href="/contact"
          className="rounded-xl px-3.5 py-1.5 text-xs font-mono font-semibold bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1 shadow-md shadow-violet-600/30 transition-colors"
        >
          <span>Scoping Call</span>
          <ArrowRight className="w-3 h-3" />
        </Link>

        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-white/40 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
