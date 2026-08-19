"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Bot } from "lucide-react";

// Lazy-load the heavy chat panel only when opened
const ArefinAIPanel = dynamic(() => import("./ArefinAIPanel"), {
  ssr: false,
});

interface ArefinAITriggerProps {
  variant?: "pill" | "button" | "compact" | "floating";
  className?: string;
  onTrigger?: () => void;
}

export default function ArefinAITrigger({
  variant = "pill",
  className = "",
  onTrigger,
}: ArefinAITriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    onTrigger?.();
    setIsOpen(true);
  };

  return (
    <>
      {variant === "pill" && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Ask Arefin AI assistant"
          className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c101d]/90 hover:bg-[#13192c] border border-violet-500/30 hover:border-violet-400 text-white transition-all duration-300 shadow-md shadow-violet-950/30 hover:shadow-violet-600/20 text-xs font-mono select-none backdrop-blur-md ${className}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-white/90 group-hover:text-white font-semibold">
            Ask Arefin AI
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {variant === "compact" && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Ask Arefin AI assistant"
          className={`group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-violet-950/40 hover:bg-violet-900/60 border border-violet-500/30 hover:border-violet-400 text-violet-300 hover:text-white text-[11px] font-mono font-semibold transition-all ${className}`}
        >
          <Bot className="w-3.5 h-3.5 text-violet-400" />
          <span>AI</span>
        </button>
      )}

      {variant === "button" && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Ask Arefin AI assistant"
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/30 text-white text-xs font-mono font-bold tracking-wide transition-all shadow-lg shadow-violet-600/25 active:scale-[0.98] ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Ask Arefin AI</span>
        </button>
      )}

      {variant === "floating" && (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Ask Arefin AI assistant"
          className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_45px_rgba(139,92,246,0.6)] border border-violet-400/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-mono text-xs font-bold ${className}`}
        >
          <Bot className="w-5 h-5" />
          <span className="hidden sm:inline">Ask Arefin AI</span>
        </button>
      )}

      {isOpen && <ArefinAIPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
