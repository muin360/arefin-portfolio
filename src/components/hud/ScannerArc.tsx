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
          <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Rotating Scanner Arc & Trail */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-scanner-rotate ${isHovered ? "5.5s" : "7.5s"} linear infinite`,
        }}
      >
        {/* Leading Scanner Head (brighter 25% arc) */}
        <circle
          cx="150"
          cy="150"
          r="142"
          fill="none"
          stroke="url(#hudScannerGradient)"
          strokeWidth="1.8"
          strokeDasharray="210 682"
          strokeLinecap="round"
        />

        {/* Small bright laser leading point */}
        <circle
          cx="150"
          cy="8"
          r="2.2"
          fill="#ede9fe"
          className="shadow-[0_0_8px_#c4b5fd]"
        />
      </g>
    </g>
  );
}
