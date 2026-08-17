"use client";

import React, { useRef, KeyboardEvent } from "react";

export interface SectionTab {
  id: string;
  label: string;
  count?: number;
}

export interface SectionPlateProps {
  index: string;
  title: string;
  sectionId?: string;
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
  sectionId,
  meta,
  tabs,
  activeTab,
  onTabChange,
  action,
  className = "",
}: SectionPlateProps) {
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (!tabs || !onTabChange) return;

    let targetIndex = -1;
    if (e.key === "ArrowRight") {
      targetIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      targetIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = tabs.length - 1;
    }

    if (targetIndex >= 0) {
      e.preventDefault();
      onTabChange(tabs[targetIndex].id);
      const buttons = tabsContainerRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons?.[targetIndex]?.focus();
    }
  };

  const handleSectionScroll = () => {
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div
      className={`relative w-full mb-8 pb-3.5 border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs select-none ${className}`}
      aria-label={`${index} ${title}`}
    >
      {/* Left: Index + Title + Optional Context Meta */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSectionScroll}
          className={`flex items-center gap-2 group text-left ${
            sectionId ? "cursor-pointer hover:opacity-90" : "cursor-default"
          }`}
          aria-label={sectionId ? `Scroll to section ${title}` : undefined}
        >
          <span className="text-[11px] font-bold text-white/40 group-hover:text-white/60 transition-colors tracking-wider">
            {index}
          </span>
          <span className="text-white/20">/</span>
          <span className="text-xs font-bold tracking-widest uppercase text-violet-400 group-hover:text-violet-300 transition-colors">
            {title}
          </span>
        </button>

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
          <div
            ref={tabsContainerRef}
            role="tablist"
            aria-label={`${title} filters`}
            className="flex items-center gap-1 bg-[#0c0f18] p-1 rounded-xl border border-white/[0.08]"
          >
            {tabs.map((tab, idx) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono tracking-wider transition-all duration-200 whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-violet-400/50 ${
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
