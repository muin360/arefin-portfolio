import React from "react";

interface ScannerArcProps {
  isHovered?: boolean;
}

export default function ScannerArc({ isHovered = false }: ScannerArcProps) {
  return (
    <g
      className={`hud-scanner-layer transition-opacity duration-500 ${
        isHovered ? "opacity-100" : "opacity-85"
      }`}
    >
      <defs>
        <linearGradient id="hudScannerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Primary Scanner Arc & Laser Trail */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-scanner-rotate ${isHovered ? "4.5s" : "7s"} linear infinite`,
        }}
      >
        {/* Leading Scanner Head (arc) */}
        <circle
          cx="150"
          cy="150"
          r="142"
          fill="none"
          stroke="url(#hudScannerGradient)"
          strokeWidth={isHovered ? "2.2" : "1.8"}
          strokeDasharray="230 660"
          strokeLinecap="round"
        />

        {/* Laser focal point */}
        <circle
          cx="150"
          cy="8"
          r={isHovered ? "2.8" : "2.2"}
          fill="#38bdf8"
          className="shadow-[0_0_10px_#38bdf8]"
        />
      </g>

      {/* Secondary Counter-Rotating Sweep Accent */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-track-reverse ${isHovered ? "9s" : "13s"} linear infinite`,
        }}
      >
        <circle
          cx="150"
          cy="150"
          r="126"
          fill="none"
          stroke="#818cf8"
          strokeWidth="0.8"
          strokeDasharray="40 360"
          strokeLinecap="round"
          opacity={isHovered ? 0.6 : 0.3}
        />
      </g>
    </g>
  );
}
