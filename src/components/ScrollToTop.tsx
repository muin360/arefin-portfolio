"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setVisible(y > 400);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <button
      type="button"
      aria-label="Scroll to top of page"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-11 h-11 rounded-full bg-[#0c101d]/90 backdrop-blur-md border border-white/15 text-white/80 hover:text-white shadow-xl hover:border-violet-400/60 hover:shadow-violet-950/40 flex items-center justify-center transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
          : "opacity-0 translate-y-4 pointer-events-none scale-90"
      }`}
    >
      {/* Circular Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="2"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>
      <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 relative z-10" />
    </button>
  );
}
