"use client";

import React from "react";

export interface SectionTab {
  id: string;
  label: string;
  count?: number;
}

interface SectionPlateProps {
  index: string;
  title: string;
  meta?: React.ReactNode;
  tabs?: SectionTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionPlate({
  index,
  title,
  meta,
  tabs,
  activeTab,
  onTabChange,
  action,
  className = "",
}: SectionPlateProps) {
  return (
    <div
      className={`relative w-full mb-8 pb-3.5 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs select-none ${className}`}
      aria-label={`${index} ${title}`}
    >
      {/* Left: Index + Title + Optional Context Meta */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-white/40 tracking-wider">
            {index}
          </span>
          <span className="text-white/20">/</span>
          <span className="text-xs font-bold tracking-widest uppercase text-violet-400">
            {title}
          </span>
        </div>

        {meta && (
          <>
            <span className="hidden sm:inline-block w-3 h-[1px] bg-white/20" aria-hidden="true" />
            <div className="text-[11px] text-white/50 tracking-wider font-normal">
              {meta}
            </div>
          </>
        )}
      </div>

      {/* Right: Functional Filter Tabs or Context Actions */}
      <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
        {tabs && tabs.length > 0 && onTabChange && (
          <div className="flex items-center gap-1 bg-[#0b0e1a] p-1 rounded-xl border border-white/[0.08]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono tracking-wider transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-violet-600/30 text-white border border-violet-500/40 shadow-sm font-semibold"
                      : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" && (
                    <span className="ml-1.5 text-[10px] opacity-60">
                      ({tab.count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
