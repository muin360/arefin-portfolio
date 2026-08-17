import React from "react";
import SpectrumRing from "./SpectrumRing";
import ScannerArc from "./ScannerArc";
import OrbitNodes from "./OrbitNodes";
import WaveformRing from "./WaveformRing";
import InnerFrame from "./InnerFrame";

interface ProfileHUDProps {
  isHovered?: boolean;
}

export default function ProfileHUD({ isHovered = false }: ProfileHUDProps) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none flex items-center justify-center motion-safe:animate-hud-fade-in"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ─── LAYER 4: BROKEN OUTER ORBITAL TRACK (Reverse Slow Rotation) ─── */}
        <g
          style={{
            transformOrigin: "150px 150px",
            animation: "hud-track-reverse 48s linear infinite",
          }}
        >
          <circle
            cx="150"
            cy="150"
            r="144"
            fill="none"
            stroke="#a78bfa"
            strokeWidth="0.8"
            strokeDasharray="6 10 28 14 4 8 54 18"
            className={`transition-opacity duration-500 ${
              isHovered ? "opacity-35" : "opacity-20"
            }`}
          />
        </g>

        {/* ─── LAYER 7: WAVEFORM RING (Subtle Organic Deformation) ─────────── */}
        <WaveformRing isHovered={isHovered} />

        {/* ─── LAYER 3: CIRCULAR EQUALIZER SPECTRUM RING ───────────────────── */}
        <SpectrumRing isHovered={isHovered} />

        {/* ─── LAYER 5: ROBOTIC SCANNER ARC & LUMINOUS TRAIL ───────────────── */}
        <ScannerArc isHovered={isHovered} />

        {/* ─── LAYER 6: MULTI-TRACK ORBIT DATA NODES ───────────────────────── */}
        <OrbitNodes isHovered={isHovered} />

        {/* ─── LAYER 2: INNER TECHNICAL FRAME & CORNER SIGNAL TICKS ────────── */}
        <InnerFrame isHovered={isHovered} />
      </svg>
    </div>
  );
}
