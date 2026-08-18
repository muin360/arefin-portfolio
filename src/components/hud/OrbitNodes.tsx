import React from "react";

interface OrbitNodesProps {
  isHovered?: boolean;
}

export default function OrbitNodes({ isHovered = false }: OrbitNodesProps) {
  return (
    <g className="hud-nodes-layer pointer-events-none">
      <defs>
        <radialGradient id="node-glow-primary" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
          <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="node-glow-secondary" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="70%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Track 1: Outer Orbital (r = 144, clockwise) */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-scanner-rotate ${isHovered ? "5s" : "7.5s"} linear infinite`,
        }}
      >
        {/* Tracer arc behind node */}
        <path
          d="M 150 6 A 144 144 0 0 1 180 9.8"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity={isHovered ? 0.8 : 0.45}
        />
        <circle cx="150" cy="6" r={isHovered ? 6 : 4} fill="url(#node-glow-primary)" opacity="0.6" />
        <circle
          cx="150"
          cy="6"
          r={isHovered ? 3.5 : 2.8}
          fill="#38bdf8"
          stroke="#07090e"
          strokeWidth="1"
          style={{ animation: "hud-node-pulse 2s ease-in-out infinite" }}
        />
      </g>

      {/* Track 2: Middle Orbital (r = 136, counter-clockwise) */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-track-reverse ${isHovered ? "7.5s" : "11s"} linear infinite`,
        }}
      >
        <path
          d="M 286 150 A 136 136 0 0 1 282 178"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1"
          strokeLinecap="round"
          opacity={isHovered ? 0.75 : 0.4}
        />
        <circle
          cx="286"
          cy="150"
          r={isHovered ? 3 : 2.4}
          fill="#c084fc"
          stroke="#07090e"
          strokeWidth="0.8"
          style={{
            animation: "hud-node-pulse 2.8s ease-in-out infinite",
            animationDelay: "-1.2s",
          }}
        />
      </g>

      {/* Track 3: Inner Orbital (r = 118, clockwise with green accent) */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-scanner-rotate ${isHovered ? "10s" : "14.5s"} linear infinite`,
        }}
      >
        <circle cx="150" cy="268" r={isHovered ? 5 : 3.5} fill="url(#node-glow-secondary)" opacity="0.5" />
        <circle
          cx="150"
          cy="268"
          r={isHovered ? 2.6 : 2}
          fill="#34d399"
          stroke="#07090e"
          strokeWidth="0.8"
          style={{
            animation: "hud-node-pulse 2.5s ease-in-out infinite",
            animationDelay: "-0.6s",
          }}
        />
      </g>
    </g>
  );
}
