"use client";

import React from "react";
import { RotateCcw, Box, Layers } from "lucide-react";
import type { Step3DNode } from "./types";

interface BuildExplorerControlsProps {
  mode: "2d" | "3d";
  onModeChange: (mode: "2d" | "3d") => void;
  nodes: Step3DNode[];
  selectedIndex: number;
  onSelectNode: (index: number) => void;
  onResetView: () => void;
  className?: string;
}

export default function BuildExplorerControls({
  mode,
  onModeChange,
  nodes,
  selectedIndex,
  onSelectNode,
  onResetView,
  className = "",
}: BuildExplorerControlsProps) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 text-xs font-mono ${className}`}>
      {/* ─── 2D / 3D VIEW TOGGLE ─────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="View mode selector"
        className="inline-flex p-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => onModeChange("2d")}
          aria-pressed={mode === "2d"}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
            mode === "2d"
              ? "bg-violet-600/30 text-white border border-violet-400/40 shadow-sm"
              : "text-white/60 hover:text-white/90 hover:bg-white/[0.04]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D Specs</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("3d")}
          aria-pressed={mode === "3d"}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
            mode === "3d"
              ? "bg-violet-600/30 text-white border border-violet-400/40 shadow-sm"
              : "text-white/60 hover:text-white/90 hover:bg-white/[0.04]"
          }`}
        >
          <Box className="w-3.5 h-3.5 text-violet-400" />
          <span>3D Spatial</span>
        </button>
      </div>

      {/* ─── 3D SPECIFIC CONTROLS (RESET & STAGE QUICK-JUMP) ─────────────── */}
      {mode === "3d" && (
        <div className="flex items-center gap-2">
          {/* Quick Stage Pills */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
            {nodes.map((n) => {
              const isSelected = n.index === selectedIndex;
              return (
                <button
                  key={n.index}
                  type="button"
                  onClick={() => onSelectNode(n.index)}
                  aria-label={`Jump to stage ${n.stepNumber}: ${n.title}`}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    isSelected
                      ? "bg-violet-500/25 text-violet-300 font-bold border border-violet-500/30"
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  {n.stepNumber}
                </button>
              );
            })}
          </div>

          {/* Reset Camera View Button */}
          <button
            type="button"
            onClick={onResetView}
            aria-label="Reset 3D camera view"
            className="px-2.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            <RotateCcw className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden xs:inline">Reset View</span>
          </button>
        </div>
      )}
    </div>
  );
}
