"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import BlueprintNode from "./BlueprintNode";
import BlueprintConnection from "./BlueprintConnection";
import BlueprintDetailPanel from "./BlueprintDetailPanel";
import type { BlueprintNodeData } from "./types";

interface SystemBlueprintProps {
  nodes: BlueprintNodeData[];
  selectedIndex: number;
  onSelectNode: (index: number) => void;
  className?: string;
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

export default function SystemBlueprint({
  nodes,
  selectedIndex,
  onSelectNode,
  className = "",
}: SystemBlueprintProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  const activeNode = nodes[selectedIndex] || nodes[0];

  const handlePrev = useCallback(() => {
    const prev = (selectedIndex - 1 + nodes.length) % nodes.length;
    onSelectNode(prev);
  }, [selectedIndex, nodes.length, onSelectNode]);

  const handleNext = useCallback(() => {
    const next = (selectedIndex + 1) % nodes.length;
    onSelectNode(next);
  }, [selectedIndex, nodes.length, onSelectNode]);

  // Handle keyboard arrow navigation for tablist
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        onSelectNode(0);
      } else if (e.key === "End") {
        e.preventDefault();
        onSelectNode(nodes.length - 1);
      }
    },
    [handleNext, handlePrev, nodes.length, onSelectNode],
  );

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* ─── LEFT COLUMN: INTERACTIVE ARCHITECTURAL PIPELINE (7 Cols) ─────── */}
      <div className="lg:col-span-7 space-y-4">
        {/* Technical Blueprint Frame Header */}
        <div className="flex items-center justify-between font-mono text-[11px] text-white/50 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="uppercase tracking-widest text-[10px] font-bold text-white/70">
              System Execution Graph
            </span>
          </div>
          <span className="text-[10px] text-white/40">
            {nodes.length} Connected Stages
          </span>
        </div>

        {/* ─── DESKTOP 2x2/2x3 TECHNICAL GRID WITH FLOW CONNECTORS ─────────── */}
        <div
          role="tablist"
          aria-label="System blueprint pipeline stages"
          className="hidden sm:grid sm:grid-cols-2 gap-3.5 relative p-1"
        >
          {nodes.map((node, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div key={node.id} className="relative flex flex-col">
                <BlueprintNode
                  node={node}
                  isSelected={isSelected}
                  isSignalActive={selectedIndex === idx - 1}
                  onSelect={onSelectNode}
                />
              </div>
            );
          })}
        </div>

        {/* ─── MOBILE VERTICAL PIPELINE WITH DIRECTIONAL CONNECTORS ────────── */}
        <div
          role="tablist"
          aria-label="Mobile system pipeline stages"
          className="sm:hidden flex flex-col space-y-1"
        >
          {nodes.map((node, idx) => {
            const isSelected = selectedIndex === idx;
            const isLast = idx === nodes.length - 1;
            return (
              <React.Fragment key={node.id}>
                <BlueprintNode
                  node={node}
                  isSelected={isSelected}
                  onSelect={onSelectNode}
                />
                {!isLast && (
                  <BlueprintConnection
                    fromIndex={idx}
                    toIndex={idx + 1}
                    orientation="vertical"
                    reducedMotion={reducedMotion}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* System Flow Trace Summary */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/50">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[9px] uppercase tracking-wider text-violet-400 font-bold shrink-0">
              Data Flow:
            </span>
            {nodes.map((n, i) => (
              <React.Fragment key={n.id}>
                <button
                  type="button"
                  onClick={() => onSelectNode(i)}
                  className={`text-[10px] uppercase transition-colors shrink-0 ${
                    selectedIndex === i
                      ? "text-white font-bold underline underline-offset-4 decoration-violet-400"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {n.config.label}
                </button>
                {i < nodes.length - 1 && (
                  <span className="text-white/20 shrink-0">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN: LIVE ARCHITECTURAL SPECIFICATION (5 Cols) ─────── */}
      <div className="lg:col-span-5 lg:sticky lg:top-24">
        {activeNode && (
          <BlueprintDetailPanel
            activeNode={activeNode}
            totalNodes={nodes.length}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
