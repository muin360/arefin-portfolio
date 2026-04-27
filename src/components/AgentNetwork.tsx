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
  { id: "n1", x: 60, y: 70, label: "Inbound", kind: "input" },
  { id: "n2", x: 60, y: 230, label: "Database", kind: "input" },
  { id: "n3", x: 250, y: 150, label: "Agent", kind: "agent" },
  { id: "n4", x: 440, y: 60, label: "GPT-4", kind: "tool" },
  { id: "n5", x: 440, y: 240, label: "Search", kind: "tool" },
  { id: "n6", x: 620, y: 150, label: "Action", kind: "output" },
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

/** Status messages that cycle to make the panel feel alive. */
const events = [
  { tag: "INBOUND", text: "Lead enquiry received · webhook" },
  { tag: "RETRIEVE", text: "Querying knowledge base · 4 chunks" },
  { tag: "REASON", text: "Drafting response · GPT-4o" },
  { tag: "VALIDATE", text: "Schema check passed · 0 errors" },
  { tag: "ACT", text: "Reply queued · CRM updated" },
  { tag: "IDLE", text: "Awaiting next event…" },
];

const activeNodeForStep = (step: number): string => {
  // Maps each event to the node that should glow at that moment.
  return ["n1", "n3", "n4", "n3", "n6", "n3"][step] ?? "n3";
};

export default function AgentNetwork() {
  const [step, setStep] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setStep((s) => (s + 1) % events.length), 2400);
    return () => clearInterval(i);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 24000);
    return () => clearInterval(t);
  }, []);

  const event = events[step];
  const activeId = activeNodeForStep(step);

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 700 320"
        className="w-full h-auto"
        role="img"
        aria-label="Animated diagram of an automation pipeline with inputs, an AI agent, tools and an output action."
        key={tick}
      >
        <defs>
          <linearGradient id="edge" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--accent-1)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--accent-1)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--accent-1)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="halo-tool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--accent-2)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="halo-out" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--accent-3)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent-3)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges with multiple staggered data dots */}
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
              {/* Two staggered data pulses per edge so flow reads continuous */}
              <circle
                r="3.2"
                fill="var(--accent-1)"
                style={{
                  offsetPath: `path('${d}')`,
                  animation: `data-pulse ${3 + (i % 3) * 0.5}s ${i * 0.55}s ease-in-out infinite`,
                  filter: "url(#glow)",
                }}
              />
              <circle
                r="2"
                fill="var(--accent-2)"
                style={{
                  offsetPath: `path('${d}')`,
                  animation: `data-pulse ${3.6 + (i % 3) * 0.5}s ${i * 0.55 + 1.4}s ease-in-out infinite`,
                  opacity: 0.7,
                }}
              />
            </g>
          );
        })}

        {/* Halos */}
        <circle cx={250} cy={150} r="64" fill="url(#halo)" />
        <circle cx={440} cy={60} r="40" fill="url(#halo-tool)" />
        <circle cx={440} cy={240} r="40" fill="url(#halo-tool)" />
        <circle cx={620} cy={150} r="48" fill="url(#halo-out)" />

        {/* Radar rings around agent (continuously expand) */}
        {[0, 1, 2].map((k) => (
          <circle
            key={k}
            cx={250}
            cy={150}
            r="28"
            fill="none"
            stroke="var(--accent-1)"
            strokeWidth="1"
            opacity="0"
            style={{
              animation: `radar 3.6s ${k * 1.2}s ease-out infinite`,
              transformOrigin: "250px 150px",
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const isAgent = n.kind === "agent";
          const isActive = n.id === activeId;
          const r = isAgent ? 28 : 16;
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
              {/* Active highlight ring */}
              {isActive && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r + 6}
                  fill="none"
                  stroke={colorFor(n.kind)}
                  strokeWidth="1.4"
                  opacity="0.7"
                  style={{
                    transformOrigin: `${n.x}px ${n.y}px`,
                    animation: "active-ring 2.2s ease-out infinite",
                  }}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill="var(--surface)"
                stroke={colorFor(n.kind)}
                strokeWidth={isAgent ? 1.8 : isActive ? 1.6 : 1.2}
                style={{
                  transition: "stroke-width 0.4s ease",
                  filter: isActive ? "url(#glow)" : "none",
                }}
              />
              {isAgent && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r - 7}
                  fill="none"
                  stroke={colorFor(n.kind)}
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                  style={{
                    transformOrigin: `${n.x}px ${n.y}px`,
                    animation: "spin 22s linear infinite",
                  }}
                />
              )}
              {/* Inner dot for agent */}
              {isAgent && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r="3"
                  fill={colorFor(n.kind)}
                  style={{
                    transformOrigin: `${n.x}px ${n.y}px`,
                    animation: "pulse-node 1.4s ease-in-out infinite",
                  }}
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

      {/* Status ticker — cycles through realistic events */}
      <div className="mt-3 rounded-lg bg-foreground/[0.03] border border-line px-3 py-2 flex items-center gap-3">
        <span className="live-dot shrink-0" aria-hidden="true" />
        <span
          key={step}
          className="mono text-[10px] uppercase tracking-[0.14em] text-foreground/70 shrink-0 fade-in-up"
        >
          {event.tag}
        </span>
        <span className="w-px h-3 bg-foreground/20 shrink-0" />
        <span
          key={`t-${step}`}
          className="text-[12px] text-foreground/75 truncate fade-in-up"
        >
          {event.text}
        </span>
        <span className="ml-auto mono text-[10px] text-muted shrink-0 hidden sm:inline">
          {String(step + 1).padStart(2, "0")}/{String(events.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
