"use client";

import { useEffect, useState } from "react";

/**
 * Animated equirectangular world map with pulsing dots representing
 * agent activity across cities. Pulses fire on a randomized cadence so
 * it feels like a real telemetry feed.
 */

type City = {
  name: string;
  lat: number; // -90..90
  lng: number; // -180..180
};

const CITIES: City[] = [
  { name: "San Francisco", lat: 37.77, lng: -122.42 },
  { name: "New York", lat: 40.71, lng: -74.0 },
  { name: "Toronto", lat: 43.65, lng: -79.38 },
  { name: "London", lat: 51.5, lng: -0.13 },
  { name: "Berlin", lat: 52.52, lng: 13.4 },
  { name: "Paris", lat: 48.85, lng: 2.35 },
  { name: "Lisbon", lat: 38.72, lng: -9.14 },
  { name: "Stockholm", lat: 59.33, lng: 18.07 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Mumbai", lat: 19.07, lng: 72.87 },
  { name: "Dhaka", lat: 23.81, lng: 90.41, /* studio HQ */ },
  { name: "Bangkok", lat: 13.75, lng: 100.5 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Seoul", lat: 37.57, lng: 126.98 },
  { name: "Sydney", lat: -33.87, lng: 151.21 },
  { name: "Melbourne", lat: -37.81, lng: 144.96 },
  { name: "São Paulo", lat: -23.55, lng: -46.63 },
  { name: "Mexico City", lat: 19.43, lng: -99.13 },
  { name: "Cape Town", lat: -33.92, lng: 18.42 },
  { name: "Lagos", lat: 6.52, lng: 3.38 },
  { name: "Cairo", lat: 30.04, lng: 31.24 },
];

const W = 800;
const H = 380;

const project = (lat: number, lng: number) => {
  // simple equirectangular
  const x = ((lng + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return { x, y };
};

const EVENTS = [
  "AGENT.RUN · rag/lead · 320ms",
  "WEBHOOK · stripe/invoice.paid",
  "TOOL · vector_search(k=4)",
  "DELIVER · slack#leads · ack",
  "VALIDATE · schema check ok",
  "RETRIEVE · kb-private · 91ms",
  "REPLY · postmark queue · 2098",
  "AGENT.RUN · billing/triage",
  "ROUTE · tier-2 · escalated",
  "REASON · gpt-4o · temp=0.4",
];

export default function GlobalActivityMap() {
  // Active "ping" cities (rotating)
  const [active, setActive] = useState<number[]>([]);
  const [eventLog, setEventLog] = useState<{ city: string; event: string; t: string }[]>([]);
  const [counter, setCounter] = useState(14237);

  useEffect(() => {
    const tick = () => {
      // Pick 1-2 random cities to flash
      const a = Math.floor(Math.random() * CITIES.length);
      const b = Math.floor(Math.random() * CITIES.length);
      const next = [a];
      if (b !== a) next.push(b);
      setActive(next);

      // Build a fake log line for the most recently fired city
      const city = CITIES[a];
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      const now = new Date();
      const t = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setEventLog((prev) => [{ city: city.name, event, t }, ...prev].slice(0, 6));
      setCounter((prev) => prev + Math.floor(Math.random() * 4) + 1);
    };
    tick();
    const id = window.setInterval(tick, 1600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-md p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55">
            tensor.global · live agent footprint
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <span className="hidden sm:inline">22 regions</span>
          <span className="hidden sm:inline">·</span>
          <span className="text-white/85 tabular-nums">
            {counter.toLocaleString()} events / 24h
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="mapStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a78bfa" stopOpacity="0.5" />
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="cityPing" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#ec4899" stopOpacity="0.85" />
              <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Latitude / longitude grid */}
          {[-60, -30, 0, 30, 60].map((lat) => {
            const { y } = project(lat, 0);
            return (
              <line
                key={`lat${lat}`}
                x1="0"
                y1={y}
                x2={W}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            );
          })}
          {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
            const { x } = project(0, lng);
            return (
              <line
                key={`lng${lng}`}
                x1={x}
                y1="0"
                x2={x}
                y2={H}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
                strokeDasharray="2 4"
              />
            );
          })}

          {/* Continent silhouettes — extremely simplified blob shapes */}
          <g
            stroke="url(#mapStroke)"
            strokeWidth="1.2"
            fill="rgba(167,139,250,0.04)"
            strokeLinejoin="round"
          >
            {/* North America */}
            <path d="M 80 70 L 200 60 L 240 90 L 230 140 L 200 170 L 150 200 L 120 220 L 100 230 L 70 200 L 60 150 Z" />
            {/* South America */}
            <path d="M 200 220 L 250 230 L 260 280 L 240 330 L 210 350 L 190 320 L 195 270 Z" />
            {/* Greenland */}
            <path d="M 280 50 L 320 50 L 330 80 L 300 90 L 280 70 Z" />
            {/* Europe */}
            <path d="M 360 80 L 430 70 L 440 110 L 420 140 L 380 145 L 360 115 Z" />
            {/* Africa */}
            <path d="M 380 160 L 440 155 L 470 200 L 460 270 L 430 310 L 400 290 L 390 230 Z" />
            {/* Russia/Asia mass */}
            <path d="M 450 60 L 620 60 L 700 90 L 720 130 L 680 150 L 600 145 L 510 140 L 470 110 Z" />
            {/* SE Asia / India */}
            <path d="M 540 150 L 620 150 L 640 200 L 600 240 L 550 220 L 530 180 Z" />
            {/* Australia */}
            <path d="M 650 270 L 720 265 L 730 305 L 700 320 L 660 310 L 645 290 Z" />
          </g>

          {/* City dots */}
          {CITIES.map((city, i) => {
            const { x, y } = project(city.lat, city.lng);
            const isActive = active.includes(i);
            const isHQ = city.name === "Dhaka";
            return (
              <g key={city.name}>
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="url(#cityPing)"
                    style={{ animation: "agentPing 1.6s ease-out" }}
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isHQ ? 3.2 : 2}
                  fill={isHQ ? "#ec4899" : isActive ? "#fbcfe8" : "#a78bfa"}
                  stroke={isHQ ? "rgba(236,72,153,0.4)" : "none"}
                  strokeWidth={isHQ ? "4" : "0"}
                />
                {isHQ && (
                  <text
                    x={x + 8}
                    y={y + 4}
                    fill="rgba(255,255,255,0.7)"
                    fontSize="8"
                    fontFamily="monospace"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    HQ · DHAKA
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Crosshair / scanner overlay */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-0 right-0 h-px"
            style={{
              top: "50%",
              background:
                "linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)",
              animation: "scanY 8s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Live event log */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-2.5">
            · streaming events
          </p>
          <ul className="space-y-1.5 font-mono text-[11px] text-white/80">
            {eventLog.length === 0 && (
              <li className="text-white/40">awaiting first event…</li>
            )}
            {eventLog.map((e, i) => (
              <li
                key={`${e.t}-${i}`}
                className="flex items-baseline gap-2 tabular-nums"
                style={{ opacity: 1 - i * 0.13 }}
              >
                <span className="text-white/40">[{e.t}]</span>
                <span className="text-pink-300">{e.city.toUpperCase()}</span>
                <span className="text-white/55">·</span>
                <span className="text-white/65 truncate">{e.event}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <Tile label="regions" value="22" hint="active" />
          <Tile label="agents" value="04" hint="online" />
          <Tile label="latency" value="118ms" hint="p95" />
          <Tile label="errors" value="0.02%" hint="24h" />
          <Tile label="cost" value="$1.42" hint="/ k tokens" />
          <Tile label="uptime" value="99.97%" hint="30d" />
        </div>
      </div>
    </div>
  );
}

function Tile({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>
      <p className="font-mono text-base text-white tabular-nums mt-1">{value}</p>
      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/35 mt-0.5">
        {hint}
      </p>
    </div>
  );
}
