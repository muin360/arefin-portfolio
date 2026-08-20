"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight, Cpu } from "lucide-react";
import type { BlueprintNodeData } from "./types";

interface BlueprintDetailPanelProps {
  activeNode: BlueprintNodeData;
  totalNodes: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export default function BlueprintDetailPanel({
  activeNode,
  totalNodes,
  onPrev,
  onNext,
  className = "",
}: BlueprintDetailPanelProps) {
  const { config, stepNumber, title, description, tool, rawStep } = activeNode;

  return (
    <div
      role="tabpanel"
      id={`blueprint-panel-${activeNode.index}`}
      aria-labelledby={`blueprint-tab-${activeNode.index}`}
      className={`rounded-2xl bg-[#0d101a] border border-[#1e2638] p-5 sm:p-7 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-2xl ${className}`}
    >
      {/* Subtle architectural background corner grid */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      <div className="space-y-4 relative z-10">
        {/* ─── STAGE METADATA BAR ────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span
              className={`px-2.5 py-1 rounded-md font-bold uppercase text-[10px] tracking-wider border ${config.accentBg} ${config.accentBorder} ${config.accentText}`}
            >
              Stage {stepNumber} · {config.label}
            </span>

            <span className="px-2 py-0.5 rounded bg-black/40 text-white/50 text-[10px] border border-white/5">
              {config.category}
            </span>
          </div>

          {/* Prev / Next Node Cycling */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous architecture stage"
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] text-white/40 px-1">
              {activeNode.index + 1}/{totalNodes}
            </span>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next architecture stage"
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ─── STAGE TITLE & SPECIFICATION ───────────────────────────────── */}
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans font-normal">
            {description}
          </p>

          {/* Architectural Purpose / "Why It Exists" */}
          <div className="p-3.5 rounded-xl bg-black/30 border border-white/[0.06] space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-violet-400 font-bold block">
              Architectural Purpose:
            </span>
            <p className="text-xs text-white/60 leading-relaxed font-sans">
              {config.whyItExists}
            </p>
          </div>

          {/* Engine / Tool Specification */}
          {tool && (
            <div className="flex items-center gap-2 pt-1 font-mono text-xs text-white/70">
              <Cpu className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              <span className="text-white/40 uppercase tracking-wider text-[10px]">
                Engine:
              </span>
              <strong className="text-white font-semibold">{tool}</strong>
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── ACTION LINKS FOOTER ─────────────────────────────────────────── */}
      <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 relative z-10">
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold transition-colors shadow-md shadow-violet-600/30"
        >
          <span>Build this Flow</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {rawStep.postSlug && (
          <Link
            href={`/blog/${rawStep.postSlug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors"
          >
            <span>Read Build Note</span>
            <ExternalLink className="w-3.5 h-3.5 text-white/50" />
          </Link>
        )}
      </div>
    </div>
  );
}
