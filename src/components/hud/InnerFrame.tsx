import React from "react";

interface InnerFrameProps {
  isHovered?: boolean;
}

export default function InnerFrame({ isHovered = false }: InnerFrameProps) {
  return (
    <g className="hud-inner-frame-layer pointer-events-none">
      <defs>
        <linearGradient id="innerFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c084fc" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Main 1px technical circle (r = 108) */}
      <circle
        cx="150"
        cy="150"
        r="108"
        fill="none"
        stroke="url(#innerFrameGrad)"
        strokeWidth="1"
        className={`transition-opacity duration-500 ${
          isHovered ? "opacity-85" : "opacity-45"
        }`}
      />

      {/* Secondary concentric dashed boundary (r = 102) */}
      <circle
        cx="150"
        cy="150"
        r="102"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="0.6"
        strokeDasharray="3 6"
        opacity={isHovered ? 0.5 : 0.25}
      />

      {/* 4 Cardinal Signal Crosshair Marks (0°, 90°, 180°, 270°) */}
      {/* 0° (Top) */}
      <line x1="150" y1="36" x2="150" y2="44" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
      {/* 90° (Right) */}
      <line x1="256" y1="150" x2="264" y2="150" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
      {/* 180° (Bottom) */}
      <line x1="150" y1="256" x2="150" y2="264" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
      {/* 270° (Left) */}
      <line x1="36" y1="150" x2="44" y2="150" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />

      {/* 4 Diagonal Precision Corner Ticks (45°, 135°, 225°, 315°) */}
      {[45, 135, 225, 315].map((deg) => (
        <line
          key={deg}
          x1="150"
          y1="40"
          x2="150"
          y2="43"
          stroke="#c4b5fd"
          strokeWidth="0.8"
          transform={`rotate(${deg} 150 150)`}
          opacity={isHovered ? 0.7 : 0.35}
        />
      ))}
    </g>
  );
}
