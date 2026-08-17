import React from "react";

interface InnerFrameProps {
  isHovered?: boolean;
}

export default function InnerFrame({ isHovered = false }: InnerFrameProps) {
  return (
    <g className="hud-inner-frame-layer pointer-events-none">
      <defs>
        <linearGradient id="innerFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
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
          isHovered ? "opacity-75" : "opacity-45"
        }`}
      />

      {/* 4 Corner Signal Crosshair Marks at 0° (top), 90° (right), 180° (bottom), 270° (left) */}
      {/* 0° (Top) */}
      <line x1="150" y1="38" x2="150" y2="44" stroke="#a78bfa" strokeWidth="1.2" />
      {/* 90° (Right) */}
      <line x1="256" y1="150" x2="262" y2="150" stroke="#a78bfa" strokeWidth="1.2" />
      {/* 180° (Bottom) */}
      <line x1="150" y1="256" x2="150" y2="262" stroke="#a78bfa" strokeWidth="1.2" />
      {/* 270° (Left) */}
      <line x1="38" y1="150" x2="44" y2="150" stroke="#a78bfa" strokeWidth="1.2" />
    </g>
  );
}
