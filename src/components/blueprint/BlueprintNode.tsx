"use client";

import React from "react";
import type { BlueprintNodeData } from "./types";

interface BlueprintNodeProps {
  node: BlueprintNodeData;
  isSelected: boolean;
  isSignalActive?: boolean;
  onSelect: (index: number) => void;
  className?: string;
}

export default function BlueprintNode({
  node,
  isSelected,
  isSignalActive = false,
  onSelect,
  className = "",
}: BlueprintNodeProps) {
  const { config, stepNumber, title, functionSummary, tool } = node;

  // Distinct subtle shape indicators
  const renderShapeBadge = () => {
    switch (config.shape) {
      case "bracket":
        return (
          <span className="font-mono text-[10px] font-bold tracking-tight text-amber-400">
            [<span className="opacity-60">·</span>]
          </span>
        );
      case "capsule":
        return (
          <span className="w-3.5 h-2 rounded-full border border-violet-400/60 bg-violet-500/20 inline-block" />
        );
      case "datastack":
        return (
          <div className="flex flex-col gap-0.5 w-3" aria-hidden="true">
            <span className="h-0.5 w-full bg-cyan-400/80 rounded-sm" />
            <span className="h-0.5 w-full bg-cyan-400/50 rounded-sm" />
            <span className="h-0.5 w-full bg-cyan-400/30 rounded-sm" />
          </div>
        );
      case "diamond":
        return (
          <span className="w-2.5 h-2.5 rotate-45 border border-purple-400 bg-purple-500/20 inline-block" />
        );
      case "terminal":
        return (
          <span className="font-mono text-[10px] font-bold text-emerald-400">
            &gt;_
          </span>
        );
      default:
        return (
          <span className="w-2 h-2 rounded-sm border border-slate-400/60 bg-slate-400/20 inline-block" />
        );
    }
  };

  return (
    <button
      type="button"
      role="tab"
      id={`blueprint-tab-${node.index}`}
      aria-selected={isSelected}
      aria-controls={`blueprint-panel-${node.index}`}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onSelect(node.index)}
      className={`group relative w-full text-left p-4 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 cursor-pointer flex flex-col justify-between space-y-3 select-none ${
        isSelected
          ? `bg-[#131826] ${config.accentBorderActive} shadow-lg shadow-black/50 ring-1 ring-violet-400/30`
          : isSignalActive
          ? `bg-[#0e121c] ${config.accentBorder} shadow-md`
          : "bg-[#0b0e17] border-[#1a2130] hover:bg-[#0f1422] hover:border-white/20"
      } ${className}`}
    >
      {/* Top Header: Monospace TYPE + Step Number + Architectural Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-2.5 w-full">
        <div className="flex items-center gap-1.5 min-w-0">
          {renderShapeBadge()}
          <span className="font-mono text-[10px] font-bold tracking-wider text-white/50 group-hover:text-white/80 transition-colors uppercase truncate">
            {config.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isSelected && (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          )}
          <span
            className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              isSelected
                ? `${config.accentBg} ${config.accentText} border ${config.accentBorder}`
                : "bg-white/[0.04] text-white/40 border border-white/5"
            }`}
          >
            {stepNumber}
          </span>
        </div>
      </div>

      {/* Main Title */}
      <div className="space-y-1">
        <h4
          className={`text-xs sm:text-sm font-bold tracking-tight transition-colors line-clamp-1 ${
            isSelected ? "text-white" : "text-white/85 group-hover:text-white"
          }`}
        >
          {title}
        </h4>

        <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2 font-sans font-normal">
          {functionSummary}
        </p>
      </div>

      {/* Footer Engine / Tool Metadata */}
      {tool && (
        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono">
          <span className="text-white/40 uppercase tracking-widest text-[9px]">
            Engine:
          </span>
          <span
            className={`px-1.5 py-0.5 rounded bg-black/40 border border-white/5 truncate max-w-[120px] ${
              isSelected ? config.accentText : "text-white/70"
            }`}
          >
            {tool}
          </span>
        </div>
      )}

      {/* Architectural Corner Notches for technical blueprint feel */}
      <span className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-white/20 pointer-events-none" />
      <span className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-white/20 pointer-events-none" />
    </button>
  );
}
