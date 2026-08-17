import React from "react";

interface SpectrumRingProps {
  isHovered?: boolean;
}

// Deterministic pseudo-random heights for 56 radial equalizer bars (4px to 14px)
const BAR_HEIGHTS = [
  6, 9, 12, 5, 8, 14, 7, 11, 4, 10, 13, 6, 8, 12, 15, 9, 5, 11, 14, 7, 4, 10,
  13, 8, 6, 12, 9, 5, 14, 11, 7, 10, 4, 13, 8, 12, 6, 9, 15, 7, 5, 11, 14, 8,
  10, 6, 13, 9, 4, 12, 7, 11, 5, 14, 8, 10,
];

export default function SpectrumRing({ isHovered = false }: SpectrumRingProps) {
  const total = BAR_HEIGHTS.length;

  return (
    <g
      className={`hud-spectrum-group transition-opacity duration-500 ${
        isHovered ? "opacity-100" : "opacity-75"
      }`}
    >
      {BAR_HEIGHTS.map((height, i) => {
        const deg = (360 / total) * i;
        const delay = (i / total) * 3.6;
        // Highlight accent bars
        const isAccent = i % 7 === 0;
        const strokeColor = isAccent ? "#c4b5fd" : "#8b5cf6";
        const strokeWidth = isAccent ? 1.6 : 1.2;

        return (
          <line
            key={i}
            x1="150"
            y1="34"
            x2="150"
            y2={34 - height}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            transform={`rotate(${deg} 150 150)`}
            style={{
              transformOrigin: `150px 34px`,
              animation: `hud-bar-wave ${isHovered ? "2.6s" : "3.6s"} ease-in-out infinite`,
              animationDelay: `-${delay}s`,
            }}
          />
        );
      })}
    </g>
  );
}
