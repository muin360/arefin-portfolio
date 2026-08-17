import React from "react";

interface OrbitNodesProps {
  isHovered?: boolean;
}

export default function OrbitNodes({ isHovered = false }: OrbitNodesProps) {
  return (
    <g className="hud-nodes-layer pointer-events-none">
      {/* Node 1: Outer Track (r = 144, 7s rotation) */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-scanner-rotate ${isHovered ? "5.5s" : "7.2s"} linear infinite`,
        }}
      >
        <circle
          cx="150"
          cy="6"
          r={isHovered ? 3.2 : 2.6}
          fill="#c4b5fd"
          stroke="#07090e"
          strokeWidth="1"
          style={{ animation: "hud-node-pulse 2.2s ease-in-out infinite" }}
        />
      </g>

      {/* Node 2: Middle Track (r = 136, 11s reverse rotation) */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-track-reverse ${isHovered ? "8.5s" : "11.4s"} linear infinite`,
        }}
      >
        <circle
          cx="286"
          cy="150"
          r={isHovered ? 2.8 : 2.2}
          fill="#a78bfa"
          stroke="#07090e"
          strokeWidth="1"
          style={{
            animation: "hud-node-pulse 3.1s ease-in-out infinite",
            animationDelay: "-1.5s",
          }}
        />
      </g>

      {/* Node 3: Inner Track (r = 118, 14.5s rotation) */}
      <g
        style={{
          transformOrigin: "150px 150px",
          animation: `hud-scanner-rotate ${isHovered ? "11s" : "14.8s"} linear infinite`,
        }}
      >
        <circle
          cx="150"
          cy="268"
          r={isHovered ? 2.5 : 2}
          fill="#818cf8"
          stroke="#07090e"
          strokeWidth="0.8"
          style={{
            animation: "hud-node-pulse 2.8s ease-in-out infinite",
            animationDelay: "-0.8s",
          }}
        />
      </g>
    </g>
  );
}
