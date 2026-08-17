import React from "react";

interface WaveformRingProps {
  isHovered?: boolean;
}

export default function WaveformRing({ isHovered = false }: WaveformRingProps) {
  // 16-point organic modulated waveform path around r ~ 116px (center 150, 150)
  const waveformPath = `
    M 150 34
    Q 175 32, 198 48
    Q 224 62, 242 88
    Q 262 118, 266 150
    Q 264 182, 246 210
    Q 228 238, 196 254
    Q 166 268, 150 266
    Q 124 268, 98 252
    Q 70 236, 52 208
    Q 34 180, 34 150
    Q 36 118, 56 90
    Q 76 64, 104 46
    Q 128 32, 150 34
    Z
  `;

  return (
    <g
      className={`hud-waveform-layer pointer-events-none transition-opacity duration-500 ${
        isHovered ? "opacity-40" : "opacity-25"
      }`}
    >
      <path
        d={waveformPath}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="0.9"
        strokeDasharray="18 8 40 12 8 8 60 14"
        strokeLinecap="round"
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-waveform-spin ${isHovered ? "20s" : "28s"} ease-in-out infinite`,
        }}
      />
    </g>
  );
}
