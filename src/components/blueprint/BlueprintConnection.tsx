"use client";

import React from "react";

interface BlueprintConnectionProps {
  fromIndex: number;
  toIndex: number;
  orientation?: "horizontal" | "vertical";
  reducedMotion?: boolean;
  className?: string;
}

export default function BlueprintConnection({
  fromIndex,
  orientation = "horizontal",
  reducedMotion = false,
  className = "",
}: BlueprintConnectionProps) {
  // Stagger animation timing per stage index
  const animationDelay = `${(fromIndex * 0.6).toFixed(2)}s`;

  if (orientation === "vertical") {
    return (
      <div
        className={`flex flex-col items-center justify-center my-1.5 h-6 relative ${className}`}
        aria-hidden="true"
      >
        <svg
          width="24"
          height="28"
          viewBox="0 0 24 28"
          fill="none"
          className="overflow-visible"
        >
          {/* Subtle curved connecting line */}
          <path
            d="M12 0 L12 20 M8 16 L12 22 L16 16"
            stroke="#334155"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Travelling signal dot */}
          {!reducedMotion && (
            <circle
              r="2.5"
              fill="#a78bfa"
              className="animate-signal-vertical"
              style={{
                animationDelay,
              }}
            >
              <animate
                attributeName="cy"
                values="0;22;22"
                keyTimes="0;0.7;1"
                dur="2.2s"
                repeatCount="indefinite"
                begin={animationDelay}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.7;0.8"
                dur="2.2s"
                repeatCount="indefinite"
                begin={animationDelay}
              />
            </circle>
          )}
        </svg>
      </div>
    );
  }

  // Horizontal desktop connector
  return (
    <div
      className={`hidden lg:flex items-center justify-center px-1 shrink-0 relative w-8 h-full ${className}`}
      aria-hidden="true"
    >
      <svg
        width="32"
        height="24"
        viewBox="0 0 32 24"
        fill="none"
        className="overflow-visible w-full"
      >
        {/* Subtle horizontal curved circuit path */}
        <path
          d="M0 12 C10 12, 12 12, 24 12 M20 7 L26 12 L20 17"
          stroke="#334155"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Travelling signal pulse */}
        {!reducedMotion && (
          <circle
            cy="12"
            r="2.5"
            fill="#a78bfa"
            style={{
              filter: "drop-shadow(0 0 4px #8b5cf6)",
            }}
          >
            <animate
              attributeName="cx"
              values="0;26;26"
              keyTimes="0;0.7;1"
              dur="2.2s"
              repeatCount="indefinite"
              begin={animationDelay}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.7;0.8"
              dur="2.2s"
              repeatCount="indefinite"
              begin={animationDelay}
            />
          </circle>
        )}
      </svg>
    </div>
  );
}
