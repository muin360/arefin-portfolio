import React from "react";

export interface SectionHeaderProps {
  index?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`w-full mb-10 sm:mb-12 select-none ${
        isCentered ? "text-center max-w-3xl mx-auto" : ""
      } ${className}`}
    >
      {/* Top Meta Line: Index + Eyebrow */}
      {(index || eyebrow) && (
        <div
          className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-violet-400 mb-3 ${
            isCentered ? "justify-center" : ""
          }`}
        >
          {index && (
            <>
              <span className="text-white/40 font-bold">{index}</span>
              <span className="text-white/20">/</span>
            </>
          )}
          {eyebrow && <span className="font-semibold">{eyebrow}</span>}
        </div>
      )}

      {/* Main Title & Action Row */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${
          isCentered ? "items-center" : ""
        }`}
      >
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h2>

          {description && (
            <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed font-sans font-normal">
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 pt-2 md:pt-0">{action}</div>}
      </div>
    </div>
  );
}
