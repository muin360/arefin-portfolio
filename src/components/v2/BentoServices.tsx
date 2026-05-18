"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Bento grid services section — 4 cards with internal visuals.
 *
 * Layout: two rows of 7+5 / 5+7 column splits so the grid feels weighted
 * like an editorial spread rather than a flat 2×2. Each card shows:
 *   - small mono index ("01" / SERVICE)
 *   - bold display title
 *   - one-line hook
 *   - a hand-rolled internal "visual" (workflow diagram, connection map,
 *     browser mockup) made of SVG / divs — no external assets.
 *   - tiny "read more" link to the matching anchor in /services.
 *
 * Visuals are intentionally schematic, not stock — they make the card
 * read like a piece of a real product surface.
 */

type Card = {
  index: string;
  title: string;
  hook: string;
  visual: React.ReactNode;
  href: string;
};

function AgentTabs() {
  const [tab, setTab] = useState<"problem" | "solution" | "outcome">("problem");
  const COPY: Record<typeof tab, string> = {
    problem:
      "Inbound on web, WhatsApp and Messenger piles up faster than your team can reply.",
    solution:
      "An LLM agent trained on your real content. Qualifies, books, hands off with full context.",
    outcome:
      "Replies in seconds, qualified leads to a human, audit trail per conversation.",
  };
  return (
    <div className="rounded-xl border" style={{ background: "rgba(0,0,0,0.25)", borderColor: "var(--border-2)" }}>
      <div className="flex border-b" style={{ borderColor: "var(--border-2)" }}>
        {(["problem", "solution", "outcome"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className="flex-1 px-3 py-2 text-[10px] tracking-[0.18em] uppercase font-mono"
            style={{
              color: tab === k ? "var(--t1)" : "var(--t3)",
              background: tab === k ? "var(--a4)" : "transparent",
              borderBottom:
                tab === k ? "1px solid var(--a1)" : "1px solid transparent",
            }}
            aria-pressed={tab === k}
          >
            {k}
          </button>
        ))}
      </div>
      <p className="p-4 text-[13px] leading-relaxed" style={{ color: "var(--t1)" }}>
        {COPY[tab]}
      </p>
    </div>
  );
}

function WorkflowDiagram() {
  const nodes = ["CRM", "n8n", "Slack", "Sheets"];
  return (
    <svg viewBox="0 0 320 110" className="w-full">
      <defs>
        <linearGradient id="wf-line" x1="0" x2="1">
          <stop offset="0%" stopColor="rgba(91,110,245,0)" />
          <stop offset="50%" stopColor="rgba(91,110,245,0.7)" />
          <stop offset="100%" stopColor="rgba(91,110,245,0)" />
        </linearGradient>
      </defs>
      {nodes.map((label, i) => {
        const x = 40 + i * 80;
        return (
          <g key={label}>
            {i < nodes.length - 1 && (
              <line
                x1={x + 20}
                y1={55}
                x2={x + 60}
                y2={55}
                stroke="url(#wf-line)"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                style={{ animation: "dash-flow 4s linear infinite" }}
              />
            )}
            <rect
              x={x - 24}
              y={36}
              width={48}
              height={36}
              rx={6}
              fill="rgba(0,0,0,0.5)"
              stroke="rgba(91,110,245,0.4)"
              strokeWidth={1}
            />
            <text
              x={x}
              y={59}
              textAnchor="middle"
              fontSize={9}
              fontFamily="var(--font-jetbrains-mono), monospace"
              fill="rgba(248,248,252,0.85)"
              letterSpacing="0.1em"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ConnectionMap() {
  const tools = ["Airtable", "Notion", "Slack", "Sheets", "Stripe", "Gmail"];
  return (
    <div className="relative aspect-[3/2]">
      <div
        className="absolute inset-0 grid place-items-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-20 h-20 rounded-full border grid place-items-center font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{
            background: "var(--a4)",
            borderColor: "var(--a3)",
            color: "var(--a2)",
          }}
        >
          API
        </div>
      </div>
      {tools.map((t, i) => {
        const angle = (i / tools.length) * Math.PI * 2 - Math.PI / 2;
        const r = 38; // %
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        return (
          <span
            key={t}
            className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md font-mono text-[10px]"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              background: "rgba(0,0,0,0.5)",
              border: "1px solid var(--border-3)",
              color: "var(--t2)",
            }}
          >
            {t}
          </span>
        );
      })}
    </div>
  );
}

function BrowserMockup() {
  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: "var(--border-2)", background: "rgba(0,0,0,0.30)" }}
    >
      <div
        className="flex items-center gap-1.5 px-3 py-2 border-b"
        style={{ borderColor: "var(--border-2)" }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--red)" }} />
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--amber)" }} />
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} />
        <span
          className="ml-3 px-2 py-0.5 rounded text-[10px] font-mono"
          style={{ background: "rgba(255,255,255,0.04)", color: "var(--t3)" }}
        >
          tensorix.ai/start
        </span>
      </div>
      <div className="p-4 space-y-2">
        <div className="h-2 rounded w-2/3" style={{ background: "rgba(255,255,255,0.10)" }} />
        <div className="h-2 rounded w-1/2" style={{ background: "rgba(255,255,255,0.07)" }} />
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="h-12 rounded" style={{ background: "var(--a4)", border: "1px solid var(--a3)" }} />
          <div className="h-12 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-2)" }} />
          <div className="h-12 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-2)" }} />
        </div>
        <div className="mt-2 flex justify-end">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-mono"
            style={{ background: "var(--a1)", color: "#fff" }}
          >
            Book audit →
          </span>
        </div>
      </div>
    </div>
  );
}

const CARDS: Card[] = [
  {
    index: "01 / AGENT",
    title: "AI Agent & Chatbot Systems",
    hook: "Capture and respond to more qualified leads, even outside business hours.",
    visual: <AgentTabs />,
    href: "/services#agent-chatbot",
  },
  {
    index: "02 / FLOW",
    title: "Workflow Automation",
    hook: "Remove the repetitive operations work that doesn't need a human.",
    visual: <WorkflowDiagram />,
    href: "/services#workflow-automation",
  },
  {
    index: "03 / API",
    title: "API & System Integrations",
    hook: "Make the tools you already pay for talk to each other.",
    visual: <ConnectionMap />,
    href: "/services#api-integrations",
  },
  {
    index: "04 / WEB",
    title: "Conversion Websites with Automation",
    hook: "Web systems, not generic web design — built to convert and run themselves.",
    visual: <BrowserMockup />,
    href: "/services#conversion-websites",
  },
];

export default function BentoServices() {
  return (
    <div className="space-y-5">
      <div className="v2-bento">
        <Card data={CARDS[0]} />
        <Card data={CARDS[1]} />
      </div>
      <div className="v2-bento v2-bento__row--inverted">
        <Card data={CARDS[2]} />
        <Card data={CARDS[3]} />
      </div>
    </div>
  );
}

function Card({ data }: { data: Card }) {
  return (
    <Link href={data.href} className="v2-bento__card group block">
      <div className="v2-bento__index">{data.index}</div>
      <h3 className="v2-bento__title">{data.title}</h3>
      <p className="v2-bento__hook">{data.hook}</p>
      <div className="v2-bento__visual">{data.visual}</div>
      <span
        className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "var(--a2)" }}
      >
        See service
        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
