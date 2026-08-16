"use client";

import { useEffect, useRef, useState } from "react";

/**
 * TensorPipeline — an autoplay diagram of how a workflow we ship actually
 * runs in production. Five nodes (Trigger → Retrieve → Reason → Act →
 * Verify) light up in sequence on a 6-second loop, with a stream of
 * data packets flowing along the connecting edges. Beside the diagram
 * is a live, scrolling system terminal that prints each step as it
 * executes — so the section reads like real telemetry, not decoration.
 *
 * No interactivity required: the whole thing runs on its own.
 */

type Node = {
  id: string;
  label: string;
  sub: string;
  // grid coords on a 1000x420 viewBox
  x: number;
  y: number;
  // Lucide-style mini icon glyph (SVG path)
  glyph: React.ReactNode;
};

type Edge = {
  from: string;
  to: string;
};

type LogLine = {
  ts: string;
  tag: string;
  body: string;
  tone: "info" | "ok" | "warn" | "agent";
};

const NODES: Node[] = [
  {
    id: "trigger",
    label: "Trigger",
    sub: "webhook · cron · email",
    x: 90,
    y: 210,
    glyph: (
      <g>
        <path d="M-7 -4 L 5 -4 L 1 0 L 7 0 L -3 8 L 1 2 L -7 2 Z" />
      </g>
    ),
  },
  {
    id: "retrieve",
    label: "Retrieve",
    sub: "vector · sql · kb",
    x: 305,
    y: 110,
    glyph: (
      <g>
        <ellipse cx="0" cy="-3" rx="7" ry="3" fill="none" strokeWidth="1.4" />
        <path d="M-7 -3 L -7 3 a 7 3 0 0 0 14 0 L 7 -3" fill="none" strokeWidth="1.4" />
        <path d="M-7 0 a 7 3 0 0 0 14 0" fill="none" strokeWidth="1.4" />
      </g>
    ),
  },
  {
    id: "reason",
    label: "Reason",
    sub: "llm · tools · plan",
    x: 510,
    y: 210,
    glyph: (
      <g>
        <circle r="6" fill="none" strokeWidth="1.4" />
        <circle r="2" />
        <circle cx="-4" cy="-3" r="1" />
        <circle cx="4" cy="3" r="1" />
        <circle cx="-3" cy="4" r="1" />
        <line x1="0" y1="0" x2="-4" y2="-3" strokeWidth="1" />
        <line x1="0" y1="0" x2="4" y2="3" strokeWidth="1" />
        <line x1="0" y1="0" x2="-3" y2="4" strokeWidth="1" />
      </g>
    ),
  },
  {
    id: "act",
    label: "Act",
    sub: "api · slack · crm",
    x: 715,
    y: 110,
    glyph: (
      <g>
        <path d="M-6 -2 L 0 -6 L 6 -2 L 6 6 L -6 6 Z" fill="none" strokeWidth="1.4" />
        <line x1="-3" y1="2" x2="3" y2="2" strokeWidth="1" />
      </g>
    ),
  },
  {
    id: "verify",
    label: "Verify",
    sub: "schema · sla · eval",
    x: 910,
    y: 210,
    glyph: (
      <g>
        <path d="M-6 0 L -2 4 L 6 -4" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    ),
  },
];

const EDGES: Edge[] = [
  { from: "trigger", to: "retrieve" },
  { from: "retrieve", to: "reason" },
  { from: "reason", to: "act" },
  { from: "act", to: "verify" },
];

const SCRIPT: { node: string; line: LogLine }[] = [
  {
    node: "trigger",
    line: { ts: "00.012", tag: "WEBHOOK", body: "sales/lead.created · src=stripe", tone: "info" },
  },
  {
    node: "retrieve",
    line: { ts: "00.094", tag: "VECTOR", body: "kb-private · top_k=8 · 91ms", tone: "ok" },
  },
  {
    node: "reason",
    line: { ts: "00.412", tag: "AGENT", body: "rag/lead · gpt-4o · plan=tool_call(book)", tone: "agent" },
  },
  {
    node: "act",
    line: { ts: "00.638", tag: "TOOL", body: "ghl.appointment.book(slot=Tue 11:00)", tone: "info" },
  },
  {
    node: "verify",
    line: { ts: "00.961", tag: "EVAL", body: "schema=ok · slo=ok · cost=$0.0042 ✓", tone: "ok" },
  },
];

const TONE_COLOR: Record<LogLine["tone"], string> = {
  info: "text-cyan-300",
  ok: "text-emerald-300",
  warn: "text-amber-300",
  agent: "text-pink-300",
};

const STAGE_DURATION = 1200; // ms per node
const TOTAL_STAGES = NODES.length;

export default function TensorPipeline() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [log, setLog] = useState<LogLine[]>([SCRIPT[0].line]);
  const [runCount, setRunCount] = useState(1);
  const idxRef = useRef(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      idxRef.current = (idxRef.current + 1) % TOTAL_STAGES;
      const nextIdx = idxRef.current;
      setActiveIdx(nextIdx);
      const scripted = SCRIPT[nextIdx];
      setLog((prev) => {
        // When we wrap back to stage 0, push a "RUN COMPLETE" then start fresh
        if (nextIdx === 0) {
          setRunCount((c) => c + 1);
          const completion: LogLine = {
            ts: "01.024",
            tag: "RUN",
            body: "complete · handoff to verify queue ✓",
            tone: "ok",
          };
          return [scripted.line, completion, ...prev].slice(0, 14);
        }
        return [scripted.line, ...prev].slice(0, 14);
      });
    }, STAGE_DURATION);
    return () => window.clearInterval(id);
  }, []);

  // Build edge paths (cubic Bézier curves between node centers)
  const edgePaths = EDGES.map((edge) => {
    const a = NODES.find((n) => n.id === edge.from)!;
    const b = NODES.find((n) => n.id === edge.to)!;
    const cx1 = a.x + (b.x - a.x) * 0.45;
    const cx2 = a.x + (b.x - a.x) * 0.55;
    return {
      d: `M ${a.x} ${a.y} C ${cx1} ${a.y}, ${cx2} ${b.y}, ${b.x} ${b.y}`,
      from: edge.from,
      to: edge.to,
      activeWhen: NODES.findIndex((n) => n.id === edge.from),
    };
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <span className="relative flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/85">
            tensor.pipeline · live trace
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            run #
            <span className="text-white/85 tabular-nums">
              {String(runCount).padStart(4, "0")}
            </span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
            slo · ok
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
        {/* Left: SVG diagram */}
        <div className="xl:col-span-8 p-6 md:p-8 relative">
          {/* subtle grid backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />
          <svg
            viewBox="0 0 1000 420"
            className="relative w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Animated diagram of an AI automation workflow"
          >
            <defs>
              <linearGradient id="pipeEdge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#a78bfa" />
                <stop offset="0.5" stopColor="#ec4899" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="pipeEdgeDim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#a78bfa" stopOpacity="0.18" />
                <stop offset="1" stopColor="#22d3ee" stopOpacity="0.18" />
              </linearGradient>
              <radialGradient id="pipeNodeGlow">
                <stop offset="0" stopColor="#ec4899" stopOpacity="0.55" />
                <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
              </radialGradient>
              <filter id="pipeBlur">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            {/* Edges */}
            {edgePaths.map((edge, i) => {
              const isActive = i === activeIdx; // edge i flows out of node i
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path
                    d={edge.d}
                    fill="none"
                    stroke="url(#pipeEdgeDim)"
                    strokeWidth="1.6"
                  />
                  {/* The "live" highlighted edge gets a stronger stroke + a packet */}
                  {isActive && (
                    <>
                      <path
                        d={edge.d}
                        fill="none"
                        stroke="url(#pipeEdge)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        opacity="0.95"
                      />
                      <PacketAlongPath d={edge.d} duration={STAGE_DURATION} />
                    </>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node, i) => {
              const isActive = i === activeIdx;
              const isPast = i < activeIdx;
              return (
                <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
                  {/* outer glow when active */}
                  {isActive && (
                    <circle
                      r="44"
                      fill="url(#pipeNodeGlow)"
                      filter="url(#pipeBlur)"
                    />
                  )}
                  {/* halo ring */}
                  <circle
                    r="30"
                    fill="none"
                    stroke={isActive ? "#ec4899" : "rgba(255,255,255,0.18)"}
                    strokeWidth={isActive ? "1.4" : "1"}
                    strokeDasharray={isPast ? "0" : "2 4"}
                    opacity={isActive ? 0.9 : isPast ? 0.5 : 0.35}
                  />
                  {/* core circle */}
                  <circle
                    r="22"
                    fill={isActive ? "#ec4899" : isPast ? "rgba(34, 211, 238, 0.35)" : "rgba(15, 15, 24, 0.85)"}
                    stroke={isActive ? "#fff" : "rgba(255,255,255,0.22)"}
                    strokeWidth="1.2"
                    style={{
                      transition: "fill 380ms ease, stroke 380ms ease",
                    }}
                  />
                  {/* glyph */}
                  <g
                    stroke={isActive ? "#fff" : "rgba(255,255,255,0.65)"}
                    strokeWidth="1.4"
                    fill={isActive ? "#fff" : "rgba(255,255,255,0.65)"}
                    style={{ transition: "stroke 380ms ease, fill 380ms ease" }}
                  >
                    {node.glyph}
                  </g>
                  {/* label */}
                  <text
                    y="50"
                    textAnchor="middle"
                    className="fill-white"
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {node.label}
                  </text>
                  <text
                    y="68"
                    textAnchor="middle"
                    className="fill-white/45"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {node.sub}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Bottom strip: stage progress */}
          <div className="mt-2 grid grid-cols-5 gap-2 px-2">
            {NODES.map((node, i) => (
              <div key={node.id} className="flex flex-col gap-1.5">
                <div className="h-1 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      i < activeIdx
                        ? "w-full bg-cyan-400/80"
                        : i === activeIdx
                          ? "w-full bg-pink-400 animate-pulse"
                          : "w-0 bg-white/30"
                    }`}
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
                  {String(i + 1).padStart(2, "0")} · {node.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: live terminal */}
        <div className="xl:col-span-4 border-t xl:border-t-0 xl:border-l border-white/8 bg-[#0a0a14]/60">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
              tensor.tail · stdout
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
              {log.length} lines
            </span>
          </div>
          <div className="px-5 py-4 space-y-1.5 font-mono text-[11px] leading-relaxed h-[320px] overflow-hidden">
            {log.map((entry, i) => (
              <div
                key={`${i}-${entry.ts}-${entry.tag}`}
                className="flex gap-2.5 transition-opacity"
                style={{
                  opacity: Math.max(0.25, 1 - i * 0.08),
                }}
              >
                <span className="text-white/35 tabular-nums">[{entry.ts}]</span>
                <span className={`${TONE_COLOR[entry.tone]} font-semibold`}>
                  {entry.tag}
                </span>
                <span className="text-white/75 truncate">{entry.body}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-white/30">$</span>
              <span className="inline-block w-2 h-3.5 bg-pink-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-3 border-t border-white/8 bg-white/[0.015] font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
        <span>
          shape: <span className="text-white/75">trigger → retrieve → reason → act → verify</span>
        </span>
        <span>
          median: <span className="text-white/75 tabular-nums">962 ms</span> · cost / run:{" "}
          <span className="text-white/75 tabular-nums">$0.0042</span> · errors:{" "}
          <span className="text-emerald-300 tabular-nums">0.02%</span>
        </span>
      </div>
    </div>
  );
}

/**
 * A tiny circle that travels along an SVG path using CSS motion-path
 * (offset-path). Falls back gracefully on browsers without motion-path
 * support — it just won't show, the rest of the diagram still works.
 */
function PacketAlongPath({ d, duration }: { d: string; duration: number }) {
  return (
    <circle
      r="3.4"
      fill="#fff"
      style={{
        offsetPath: `path("${d}")`,
        offsetDistance: "0%",
        animation: `packet-flow ${duration}ms cubic-bezier(0.4, 0, 0.6, 1) forwards`,
        filter: "drop-shadow(0 0 6px rgba(236, 72, 153, 0.9))",
      }}
    />
  );
}
