"use client";

import { useEffect, useState } from "react";

type ChatMsg = {
  role: "user" | "agent" | "tool";
  text: string;
  meta?: string;
};

type Frame = {
  status: { tag: string; text: string };
  active: "input" | "agent" | "tool" | "output";
  chat: ChatMsg[];
  toolCall?: {
    name: string;
    args: Record<string, string>;
    result: string;
  };
  metric: { latency: string; tokens: string; route: string };
};

const FRAMES: Frame[] = [
  {
    status: { tag: "INBOUND", text: "Webhook received · sales/lead.created" },
    active: "input",
    chat: [
      { role: "user", text: "Hi! Looking to automate our customer onboarding emails. Free this week?" },
    ],
    metric: { latency: "12 ms", tokens: "—", route: "lead-router" },
  },
  {
    status: { tag: "RETRIEVE", text: "Querying vector store · top-k=4" },
    active: "tool",
    chat: [
      { role: "user", text: "Hi! Looking to automate our customer onboarding emails…" },
      { role: "tool", text: "vector_search(query='customer onboarding email automation', k=4)", meta: "embeddings" },
    ],
    toolCall: {
      name: "vector_search",
      args: { query: "onboarding email automation", k: "4", index: "kb-public" },
      result: "4 chunks · best match 0.91",
    },
    metric: { latency: "284 ms", tokens: "1.2k", route: "rag/lead" },
  },
  {
    status: { tag: "REASON", text: "Drafting reply · gpt-4o · temp=0.4" },
    active: "agent",
    chat: [
      { role: "user", text: "Hi! Looking to automate our customer onboarding emails…" },
      { role: "tool", text: "vector_search(...) → 4 chunks", meta: "embeddings" },
      { role: "agent", text: "Drafting…" },
    ],
    metric: { latency: "1.1 s", tokens: "2.4k", route: "rag/lead" },
  },
  {
    status: { tag: "ACT", text: "Tool call · crm.create_deal + email.send" },
    active: "tool",
    chat: [
      { role: "user", text: "Hi! Looking to automate our customer onboarding emails…" },
      { role: "tool", text: "vector_search(...) → 4 chunks", meta: "embeddings" },
      { role: "agent", text: "Got it — happy to scope an onboarding flow this week. Sending a 15-min slot now." },
      { role: "tool", text: "crm.create_deal(stage='discovery', value=$8,200)", meta: "hubspot" },
    ],
    toolCall: {
      name: "crm.create_deal",
      args: { stage: "discovery", value: "$8,200", source: "lead-bot" },
      result: "deal_id: deal_8211 · stage updated",
    },
    metric: { latency: "1.6 s", tokens: "2.6k", route: "rag/lead" },
  },
  {
    status: { tag: "DELIVER", text: "Reply sent · message_id #2098" },
    active: "output",
    chat: [
      { role: "user", text: "Hi! Looking to automate our customer onboarding emails…" },
      { role: "agent", text: "Got it — happy to scope an onboarding flow this week. Sending a 15-min slot now." },
      { role: "tool", text: "email.send(to=lead, body=…)", meta: "postmark" },
      { role: "agent", text: "Done — you should see it in your inbox in ~30s. Anything specific you're trying to automate first?" },
    ],
    metric: { latency: "1.9 s", tokens: "2.6k", route: "rag/lead" },
  },
  {
    status: { tag: "IDLE", text: "Awaiting next event…" },
    active: "input",
    chat: [
      { role: "agent", text: "Anything specific you're trying to automate first?" },
    ],
    metric: { latency: "—", tokens: "—", route: "idle" },
  },
];

export default function LiveAgentDashboard() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setStep((s) => (s + 1) % FRAMES.length), 3200);
    return () => clearInterval(i);
  }, []);

  const f = FRAMES[step];
  const isAgentActive = f.active === "agent";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 md:p-7 relative overflow-hidden">
      {/* Aurora glow */}
      <div className="aurora pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />

      {/* Top status bar */}
      <div className="relative flex items-center justify-between text-[11px] font-mono text-white/60">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400/70" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
            <span className="w-2 h-2 rounded-full bg-green-400/70" />
          </span>
          <span className="uppercase tracking-[0.16em]">agent · production</span>
        </div>
        <div className="flex items-center gap-2 uppercase tracking-[0.14em]">
          <span className="live-dot" /> live
        </div>
      </div>

      {/* Top metrics strip */}
      <div className="relative mt-4 grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-white/55">
        <Metric label="latency" value={f.metric.latency} />
        <Metric label="tokens" value={f.metric.tokens} />
        <Metric label="route" value={f.metric.route} />
      </div>

      {/* Main split: graph + chat */}
      <div className="relative mt-5 grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Mini node graph */}
        <div className="md:col-span-2">
          <Graph active={f.active} />
        </div>

        {/* Chat stream */}
        <div className="md:col-span-3 rounded-xl border border-white/10 bg-black/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.03]">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
              session/lead-bot.log
            </span>
            <span className="font-mono text-[10px] text-white/40">
              {String(step + 1).padStart(2, "0")}/{String(FRAMES.length).padStart(2, "0")}
            </span>
          </div>
          <div className="p-4 space-y-2.5 min-h-[180px] max-h-[240px] overflow-hidden">
            {f.chat.slice(-4).map((m, idx) => (
              <ChatLine key={`${step}-${idx}`} m={m} typing={isAgentActive && idx === f.chat.length - 1 && m.role === "agent"} />
            ))}
            {/* Caret blink */}
            {isAgentActive && (
              <span className="inline-block w-2 h-3.5 ml-1 bg-white/70 align-middle caret-blink" aria-hidden="true" />
            )}
          </div>
          {f.toolCall && (
            <div className="px-4 py-3 border-t border-white/10 bg-violet-500/[0.06]">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-violet-300/80">
                tool_call
              </div>
              <div className="mt-1 font-mono text-[12px] text-white/85">
                <span className="text-violet-300">{f.toolCall.name}</span>
                <span className="text-white/40">(</span>
                {Object.entries(f.toolCall.args).map(([k, v], i, arr) => (
                  <span key={k}>
                    <span className="text-white/55">{k}</span>
                    <span className="text-white/40">=</span>
                    <span className="text-pink-300/90">&quot;{v}&quot;</span>
                    {i < arr.length - 1 && <span className="text-white/40">, </span>}
                  </span>
                ))}
                <span className="text-white/40">)</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-emerald-300/85">
                → {f.toolCall.result}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: status ticker + waveform */}
      <div className="relative mt-5 flex items-center gap-3 text-[11px] font-mono">
        <span className="live-dot" />
        <span
          key={`tag-${step}`}
          className="uppercase tracking-[0.14em] text-white/85 fade-in-up shrink-0"
        >
          {f.status.tag}
        </span>
        <span className="w-px h-3 bg-white/20 shrink-0" />
        <span
          key={`txt-${step}`}
          className="text-white/65 truncate fade-in-up"
        >
          {f.status.text}
        </span>
        <Waveform className="ml-auto" />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 flex items-baseline justify-between gap-2">
      <span className="text-white/45">{label}</span>
      <span className="text-white/90 font-medium normal-case tracking-normal">{value}</span>
    </div>
  );
}

function ChatLine({ m, typing }: { m: ChatMsg; typing?: boolean }) {
  const colorByRole = {
    user: "text-cyan-300",
    agent: "text-violet-300",
    tool: "text-pink-300",
  } as const;
  return (
    <div className="fade-in-up">
      <div className="flex items-center gap-2 mb-1">
        <span className={`font-mono text-[10px] uppercase tracking-[0.16em] ${colorByRole[m.role]}`}>
          {m.role}
        </span>
        {m.meta && (
          <span className="font-mono text-[10px] text-white/40">· {m.meta}</span>
        )}
      </div>
      <div className="text-[13px] leading-relaxed text-white/85">
        {m.text}
        {typing && <span className="opacity-60 ml-1">▍</span>}
      </div>
    </div>
  );
}

function Graph({ active }: { active: Frame["active"] }) {
  const nodeColor = (k: Frame["active"]) =>
    k === active ? "var(--accent-2)" : "rgba(255,255,255,0.18)";
  const ringFor = (k: Frame["active"]) =>
    k === active ? (
      <circle
        cx="0"
        cy="0"
        r="20"
        fill="none"
        stroke="var(--accent-2)"
        strokeWidth="1.4"
        opacity="0.7"
        style={{ animation: "active-ring 2s ease-out infinite", transformOrigin: "0 0" }}
      />
    ) : null;

  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4 h-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">
          flow.graph
        </span>
        <span className="font-mono text-[10px] text-white/40">v 1.4</span>
      </div>
      <svg viewBox="-20 -20 280 200" className="w-full h-auto">
        <defs>
          <linearGradient id="dl" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="50%" stopColor="rgba(168,130,255,0.55)" />
            <stop offset="100%" stopColor="rgba(236,72,153,0.4)" />
          </linearGradient>
          <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {[
          [40, 40, 120, 80],
          [40, 120, 120, 80],
          [120, 80, 200, 40],
          [120, 80, 200, 120],
        ].map(([x1, y1, x2, y2], i) => (
          <g key={i}>
            <path
              d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 10} ${x2} ${y2}`}
              fill="none"
              stroke="url(#dl)"
              strokeWidth="1.2"
              strokeDasharray="4 5"
              style={{ animation: `dash-flow ${4 + (i % 3)}s linear infinite` }}
            />
            <circle
              r="2.4"
              fill="rgba(168,130,255,0.95)"
              style={{
                offsetPath: `path('M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 10} ${x2} ${y2}')`,
                animation: `data-pulse ${3 + (i % 2)}s ${i * 0.4}s ease-in-out infinite`,
                filter: "url(#g)",
              }}
            />
          </g>
        ))}

        {/* Nodes */}
        {[
          { x: 40, y: 40, k: "input" as const, label: "IN" },
          { x: 40, y: 120, k: "input" as const, label: "DB" },
          { x: 120, y: 80, k: "agent" as const, label: "AGENT" },
          { x: 200, y: 40, k: "tool" as const, label: "GPT" },
          { x: 200, y: 120, k: "output" as const, label: "ACT" },
        ].map((n) => (
          <g key={n.label} transform={`translate(${n.x} ${n.y})`}>
            {ringFor(n.k)}
            <circle r="13" fill="rgba(0,0,0,0.5)" stroke={nodeColor(n.k)} strokeWidth="1.5" />
            <text
              textAnchor="middle"
              y="3"
              fontFamily="var(--font-geist-mono)"
              fontSize="7"
              fill="rgba(255,255,255,0.85)"
              style={{ letterSpacing: "0.08em" }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Waveform({ className = "" }: { className?: string }) {
  // Animated frequency bars (CSS-only, looks like an audio spectrum)
  const bars = 24;
  return (
    <div className={`flex items-end gap-[3px] h-5 ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[2px] rounded-sm bg-gradient-to-b from-violet-400 to-pink-400"
          style={{
            animation: `wave 1.${(i * 7) % 9}s ease-in-out ${i * 0.07}s infinite alternate`,
            height: "30%",
          }}
        />
      ))}
    </div>
  );
}
