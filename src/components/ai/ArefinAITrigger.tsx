"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

// Lazy-load the heavy chat panel only when opened
const ArefinAIPanel = dynamic(() => import("./ArefinAIPanel"), {
  ssr: false,
});

interface ArefinAITriggerProps {
  variant?: "pill" | "button" | "compact";
  className?: string;
}

export default function ArefinAITrigger({
  variant = "pill",
  className = "",
}: ArefinAITriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === "pill" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Ask Arefin AI assistant"
          className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121624] hover:bg-[#181e30] border border-white/10 hover:border-violet-500/40 text-white transition-all duration-200 shadow-sm hover:shadow-violet-950/20 text-xs font-mono select-none ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 group-hover:text-white font-medium">
            Ask Arefin AI
          </span>
          <Sparkles className="w-3 h-3 text-violet-400 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {variant === "compact" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Ask Arefin AI assistant"
          className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-violet-600/15 border border-white/10 hover:border-violet-500/30 text-white/80 hover:text-white text-[11px] font-mono transition-colors ${className}`}
        >
          <Sparkles className="w-3 h-3 text-violet-400" />
          <span>AI</span>
        </button>
      )}

      {variant === "button" && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Ask Arefin AI assistant"
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#121624] hover:bg-[#181e30] border border-violet-500/30 hover:border-violet-400/60 text-violet-200 hover:text-white text-xs font-mono font-semibold transition-all shadow-md active:scale-[0.98] ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Ask Arefin AI</span>
        </button>
      )}

      {isOpen && (
        <ArefinAIPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
