"use client";

import { useEffect, useState } from "react";

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: "input" | "agent" | "tool" | "output";
};

const nodes: Node[] = [
  { id: "n1", x: 60, y: 80, label: "Inbound", kind: "input" },
  { id: "n2", x: 60, y: 200, label: "Database", kind: "input" },
  { id: "n3", x: 250, y: 140, label: "Agent", kind: "agent" },
  { id: "n4", x: 440, y: 60, label: "GPT-4", kind: "tool" },
  { id: "n5", x: 440, y: 220, label: "Search", kind: "tool" },
  { id: "n6", x: 620, y: 140, label: "Action", kind: "output" },
];

const edges: [string, string][] = [
  ["n1", "n3"],
  ["n2", "n3"],
  ["n3", "n4"],
  ["n3", "n5"],
  ["n4", "n6"],
  ["n5", "n6"],
];

const colorFor = (k: Node["kind"]) => {
  switch (k) {
    case "agent":
      return "var(--accent-1)";
    case "tool":
      return "var(--accent-2)";
    case "output":
      return "var(--accent-3)";
    default:
      return "var(--foreground)";
  }
};

const find = (id: string) => nodes.find((n) => n.id === id)!;

export default function AgentNetwork() {
  // Re-mount key to retrigger CSS animations on reveal
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 12000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 700 300"
        className="w-full h-auto"
        role="img"
        aria-label="Animated diagram of an automation pipeline with inputs, an AI agent, tools and an output action."
        key={tick}
      >
        <defs>
          <linearGradient id="edge" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.1" />
            <stop
              offset="50%"
              stopColor="var(--accent-1)"
              stopOpacity="0.55"
            />
            <stop
              offset="100%"
              stopColor="var(--accent-2)"
              stopOpacity="0.4"
            />
          </linearGradient>
          <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--accent-1)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent-1)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {edges.map(([a, b], i) => {
          const A = find(a);
          const B = find(b);
          const cx = (A.x + B.x) / 2;
          const cy = (A.y + B.y) / 2 - 18;
          const d = `M ${A.x} ${A.y} Q ${cx} ${cy} ${B.x} ${B.y}`;
          return (
            <g key={`${a}-${b}-${i}`}>
              <path
                d={d}
                fill="none"
                stroke="url(#edge)"
                strokeWidth="1.4"
                strokeDasharray="4 6"
                style={{
                  animation: `dash-flow ${4 + (i % 3)}s linear infinite`,
                }}
              />
              {/* Data pulse traveling the path */}
              <circle
                r="3"
                fill="var(--accent-1)"
                style={{
                  offsetPath: `path('${d}')`,
                  animation: `data-pulse ${3 + (i % 3) * 0.5}s ${i * 0.6}s ease-in-out infinite`,
                }}
              />
            </g>
          );
        })}

        {/* Halo around agent node */}
        <circle cx={250} cy={140} r="60" fill="url(#halo)" />

        {/* Nodes */}
        {nodes.map((n, i) => {
          const isAgent = n.kind === "agent";
          const r = isAgent ? 26 : 16;
          return (
            <g
              key={n.id}
              style={{
                transformOrigin: `${n.x}px ${n.y}px`,
                animation: isAgent
                  ? `pulse-node 2.6s ease-in-out infinite`
                  : `float ${4 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
              }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill="var(--surface)"
                stroke={colorFor(n.kind)}
                strokeWidth={isAgent ? 1.8 : 1.2}
              />
              {isAgent && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r - 6}
                  fill="none"
                  stroke={colorFor(n.kind)}
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                />
              )}
              <text
                x={n.x}
                y={n.y + r + 16}
                textAnchor="middle"
                fontFamily="var(--font-geist-mono)"
                fontSize="10"
                fill="var(--muted)"
                style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
