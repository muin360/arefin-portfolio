"use client";

import Marquee from "./Marquee";

const events = [
  { ts: "12:04:31", tag: "WEBHOOK", text: "sales/lead.created → routed to lead-bot" },
  { ts: "12:04:32", tag: "AGENT.RUN", text: "rag/lead · model=gpt-4o · temp=0.4" },
  { ts: "12:04:33", tag: "TOOL", text: "vector_search(k=4) → 4 chunks" },
  { ts: "12:04:34", tag: "REPLY", text: "queued in postmark · message_id=#2098" },
  { ts: "12:04:35", tag: "CRM", text: "deal_id=8211 · stage=discovery · value=$8,200" },
  { ts: "12:05:02", tag: "WEBHOOK", text: "stripe/invoice.paid → archived" },
  { ts: "12:05:03", tag: "AGENT.RUN", text: "billing/triage · 320ms · 0 errors" },
  { ts: "12:05:11", tag: "RETRIEVE", text: "kb-private · top_k=8 · 91ms" },
  { ts: "12:05:12", tag: "VALIDATE", text: "schema check ok · 0 violations" },
  { ts: "12:05:18", tag: "DELIVER", text: "slack#leads · ack 2-of-3" },
];

const colorByTag: Record<string, string> = {
  WEBHOOK: "text-cyan-300",
  "AGENT.RUN": "text-violet-300",
  TOOL: "text-pink-300",
  REPLY: "text-emerald-300",
  CRM: "text-amber-300",
  RETRIEVE: "text-pink-300",
  VALIDATE: "text-emerald-300",
  DELIVER: "text-cyan-300",
};

export default function LiveTicker() {
  return (
    <div className="relative w-full border-y border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
      {/* Left badge */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center gap-2 px-3 bg-gradient-to-r from-black/90 via-black/60 to-transparent pr-8">
        <span className="live-dot" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
          system feed
        </span>
      </div>
      <div className="py-2.5 pl-36">
        <Marquee duration={50}>
          {[...events, ...events].map((e, i) => (
            <span
              key={`${e.ts}-${i}`}
              className="inline-flex items-center gap-3 px-5 font-mono text-[11px] whitespace-nowrap"
            >
              <span className="text-white/40">[{e.ts}]</span>
              <span className={`uppercase tracking-[0.16em] ${colorByTag[e.tag] ?? "text-white/70"}`}>
                {e.tag}
              </span>
              <span className="text-white/70">·</span>
              <span className="text-white/85">{e.text}</span>
              <span className="text-white/30 ml-2">◆</span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
