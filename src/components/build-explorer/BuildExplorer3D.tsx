"use client";

import React, { useState, useMemo, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import type { WorkflowStep } from "@/lib/db/types";
import {
  calculateNodePositions,
  calculateConnections,
  type Step3DNode,
} from "./types";
import BuildExplorerCanvas from "./BuildExplorerCanvas";
import { trackBuildExplorerReset, trackBuildExplorerNodeClick } from "@/lib/track-event";

interface BuildExplorer3DProps {
  workflowSteps: WorkflowStep[];
  projectTitle?: string;
  projectSlug: string;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onFallbackTo2D?: () => void;
}

function checkWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

class WebGLErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode; onError?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("WebGL 3D Scene encounter error, falling back to 2D:", error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function BuildExplorer3D({
  workflowSteps,
  projectSlug,
  selectedIndex,
  onSelectIndex,
  onFallbackTo2D,
}: BuildExplorer3DProps) {
  const [resetTrigger, setResetTrigger] = useState(0);
  const [webGLSupported] = useState<boolean>(checkWebGL);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  // Compute 3D node coordinates & connections from sanitized workflow steps
  const nodes: Step3DNode[] = useMemo(() => {
    return calculateNodePositions(workflowSteps);
  }, [workflowSteps]);

  const connections = useMemo(() => {
    return calculateConnections(nodes);
  }, [nodes]);

  const activeNode = nodes[selectedIndex] || nodes[0];
  const activeConfig = activeNode?.config;

  const handleSelectNode = useCallback(
    (index: number) => {
      onSelectIndex(index);
      const selected = nodes[index];
      if (selected) {
        trackBuildExplorerNodeClick(selected.type, projectSlug);
      }
    },
    [nodes, onSelectIndex, projectSlug],
  );

  const handleResetCamera = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
    trackBuildExplorerReset(projectSlug);
  }, [projectSlug]);

  const handlePrev = () => {
    const nextIdx = (selectedIndex - 1 + nodes.length) % nodes.length;
    handleSelectNode(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (selectedIndex + 1) % nodes.length;
    handleSelectNode(nextIdx);
  };

  if (webGLSupported === false) {
    return (
      <div className="p-8 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-mono font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>WebGL Acceleration Unavailable</span>
        </div>
        <p className="text-xs text-white/60 max-w-md mx-auto">
          Your browser or hardware environment does not currently have WebGL enabled. Switched to high-precision 2D Blueprint view.
        </p>
        <button
          type="button"
          onClick={onFallbackTo2D}
          className="px-4 py-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white font-mono text-xs transition-colors"
        >
          View 2D Blueprint
        </button>
      </div>
    );
  }

  return (
    <WebGLErrorBoundary
      onError={onFallbackTo2D}
      fallback={
        <div className="p-8 rounded-xl bg-violet-500/5 border border-violet-500/20 text-center space-y-3">
          <p className="text-xs text-white/70">
            Switching to 2D view for optimal performance.
          </p>
          <button
            type="button"
            onClick={onFallbackTo2D}
            className="px-4 py-2 rounded-lg bg-violet-600 text-white font-mono text-xs"
          >
            Switch to 2D Blueprint
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* ─── 3D SPATIAL CANVAS CONTAINER ─────────────────────────────────── */}
        <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] rounded-2xl bg-gradient-to-b from-[#0a0d16] to-[#06080e] border border-white/[0.08] overflow-hidden shadow-2xl">
          {/* Subtle Ambient Radial Lighting */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-700"
            style={{ backgroundColor: activeConfig?.accentColor || "#8b5cf6" }}
            aria-hidden="true"
          />

          {/* R3F 3D Canvas */}
          <BuildExplorerCanvas
            nodes={nodes}
            connections={connections}
            selectedIndex={selectedIndex}
            onSelectNode={handleSelectNode}
            resetTrigger={resetTrigger}
            reducedMotion={reducedMotion}
          />

          {/* ─── FLOATING TOP-LEFT HUD STATUS ─────────────────────────────── */}
          <div className="absolute top-3 left-3 pointer-events-none select-none z-10 flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md font-mono text-[10px] text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>Spatial Graph</span>
              <span className="opacity-40">·</span>
              <span className="opacity-60">{nodes.length} Stages</span>
            </span>
          </div>

          {/* ─── FLOATING TOP-RIGHT HUD CONTROLS ──────────────────────────── */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetCamera}
              aria-label="Reset camera orientation"
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-white/70 hover:text-white backdrop-blur-md transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              title="Reset Camera View"
            >
              <RotateCcw className="w-3.5 h-3.5 text-violet-400" />
            </button>
          </div>

          {/* ─── FLOATING BOTTOM-CENTER STAGE QUICK-NAV STRIP ─────────────── */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1 rounded-full bg-black/70 border border-white/10 backdrop-blur-md shadow-xl">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous pipeline stage"
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 px-1">
              {nodes.map((n) => {
                const isSelected = n.index === selectedIndex;
                return (
                  <button
                    key={n.index}
                    type="button"
                    onClick={() => handleSelectNode(n.index)}
                    aria-label={`Select stage ${n.stepNumber}: ${n.title}`}
                    className={`h-6 px-2.5 rounded-full font-mono text-[10px] font-semibold transition-all duration-200 flex items-center gap-1 ${
                      isSelected
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/40 scale-105"
                        : "bg-white/[0.04] hover:bg-white/10 text-white/50 hover:text-white/90"
                    }`}
                  >
                    <span>{n.stepNumber}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next pipeline stage"
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ─── FLOATING BOTTOM-RIGHT INTERACTION HINT ───────────────────── */}
          <div className="hidden md:flex absolute bottom-3 right-3 z-10 items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 border border-white/5 text-[10px] font-mono text-white/40 pointer-events-none select-none backdrop-blur-sm">
            <span>Rotate: Left Drag</span>
            <span>·</span>
            <span>Zoom: Scroll</span>
          </div>
        </div>

        {/* ─── HTML OVERLAY DETAIL PANEL FOR SELECTED NODE ──────────────────── */}
        <AnimatePresence mode="wait">
          {activeNode && (
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                activeConfig?.tailwindBgColor || "bg-violet-500/10"
              } ${activeConfig?.tailwindBorderColor || "border-violet-500/30"}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] border ${activeConfig?.tailwindBgColor} ${activeConfig?.tailwindBorderColor} ${activeConfig?.tailwindTextColor}`}
                    >
                      Stage {activeNode.stepNumber} · {activeConfig?.label}
                    </span>

                    {activeNode.tool && (
                      <span className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-white/80 text-[10px]">
                        Engine / Tool: <strong className="text-white">{activeNode.tool}</strong>
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-black/20 text-white/50 text-[10px]">
                      {activeConfig?.categoryName}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {activeNode.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-sans max-w-3xl">
                    {activeNode.desc}
                  </p>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-semibold transition-colors shadow-md shadow-violet-600/30"
                  >
                    <span>Build this Flow</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  {activeNode.rawStep.postSlug && (
                    <Link
                      href={`/blog/${activeNode.rawStep.postSlug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors"
                    >
                      <span>Read Build Note</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WebGLErrorBoundary>
  );
}
