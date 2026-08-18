import React from "react";

interface SpectrumRingProps {
  isHovered?: boolean;
}

// 48 radial equalizer bars with harmonic heights (5px to 16px)
const BAR_HEIGHTS = [
  8, 12, 16, 7, 10, 15, 9, 14, 6, 13, 17, 8, 11, 15, 18, 10,
  6, 14, 17, 9, 5, 12, 16, 10, 8, 15, 11, 7, 16, 13, 9, 12,
  6, 15, 10, 14, 8, 11, 18, 9, 6, 13, 17, 10, 12, 8, 15, 11,
];

export default function SpectrumRing({ isHovered = false }: SpectrumRingProps) {
  const total = BAR_HEIGHTS.length;

  return (
    <g
      className={`hud-spectrum-group transition-all duration-500 ${
        isHovered ? "opacity-100 filter drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]" : "opacity-75"
      }`}
    >
      <defs>
        <linearGradient id="spectrum-accent-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="spectrum-base-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {BAR_HEIGHTS.map((height, i) => {
        const deg = (360 / total) * i;
        const delay = (i / total) * (isHovered ? 2.4 : 3.6);
        const isAccent = i % 6 === 0;
        const isSecondaryAccent = i % 3 === 0;

        const strokeColor = isAccent
          ? "url(#spectrum-accent-grad)"
          : isSecondaryAccent
          ? "#c4b5fd"
          : "url(#spectrum-base-grad)";

        const strokeWidth = isAccent ? (isHovered ? 2.2 : 1.8) : isHovered ? 1.4 : 1.1;

        return (
          <line
            key={i}
            x1="150"
            y1="34"
            x2="150"
            y2={34 - (isHovered ? height * 1.25 : height)}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            transform={`rotate(${deg} 150 150)`}
            style={{
              transformOrigin: "150px 150px",
              animation: `hud-bar-wave ${isHovered ? "2.2s" : "3.4s"} ease-in-out infinite`,
              animationDelay: `-${delay}s`,
            }}
          />
        );
      })}
    </g>
  );
}
