"use client";

import { useEffect, useId, useState } from "react";
import DigitRoll from "./DigitRoll";

type Stat = {
  label: string;
  /** integer for the DigitRoll / formatted display value */
  value: number;
  /** trailing unit (k, %, m, h, etc.) shown after the value */
  suffix?: string;
  hint: string;
  trend: number[]; // sparkline values (any scale, normalized for display)
  delta: number; // percent change shown in header (positive = up)
  trendUp: boolean; // true = green up, false = down (positive direction)
  /** force a non-integer display value (e.g. "99.97") */
  displayOverride?: string;
};

const STATS: Stat[] = [
  {
    label: "workflows shipped",
    value: 27,
    hint: "trailing 30 days",
    trend: [3, 4, 5, 4, 6, 7, 6, 8, 9, 10, 12, 11, 14, 16, 18, 20, 22, 24, 25, 27],
    delta: 42,
    trendUp: true,
  },
  {
    label: "hours saved",
    value: 1842,
    hint: "across 12 clients",
    trend: [40, 60, 80, 110, 140, 180, 210, 260, 320, 410, 530, 680, 820, 980, 1140, 1320, 1480, 1620, 1740, 1842],
    delta: 64,
    trendUp: true,
  },
  {
    label: "events routed",
    value: 142,
    suffix: "k+",
    hint: "agents · webhooks · tools",
    trend: [4, 5, 7, 8, 6, 9, 11, 10, 13, 14, 12, 15, 16, 14, 17, 18, 20, 19, 21, 22],
    delta: 38,
    trendUp: true,
  },
  {
    label: "tokens / day",
    value: 1.24,
    suffix: "M",
    hint: "rolling avg · last 7d",
    trend: [12, 14, 16, 15, 17, 18, 20, 22, 21, 23, 25, 24, 27, 26, 28, 27, 29, 28, 30, 31],
    delta: 22,
    trendUp: true,
    displayOverride: "1.24",
  },
  {
    label: "incident MTTR",
    value: 4,
    suffix: "m",
    hint: "median · 30d",
    trend: [12, 11, 10, 9, 9, 8, 8, 7, 7, 6, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4],
    delta: -67,
    trendUp: false,
  },
  {
    label: "uptime",
    value: 99.97,
    suffix: "%",
    hint: "p99 across services",
    trend: [99.6, 99.7, 99.8, 99.85, 99.9, 99.92, 99.94, 99.95, 99.95, 99.96, 99.96, 99.97, 99.97, 99.97, 99.97, 99.97, 99.97, 99.97, 99.97, 99.97],
    delta: 0.37,
    trendUp: true,
    displayOverride: "99.97",
  },
];

export default function Live30Days() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {STATS.map((stat, i) => (
        <StatTile key={stat.label} stat={stat} delay={i * 80} />
      ))}
    </div>
  );
}

function StatTile({ stat, delay }: { stat: Stat; delay: number }) {
  const rawId = useId();
  const idKey = rawId.replace(/:/g, "");
  const areaId = `spark-area-${idKey}`;
  const lineId = `spark-line-${idKey}`;
  const [animatedTrend, setAnimatedTrend] = useState<number[]>([]);
  // Animate the sparkline drawing on mount
  useEffect(() => {
    const tid = window.setTimeout(() => {
      let i = 0;
      const interval = window.setInterval(() => {
        i++;
        setAnimatedTrend(stat.trend.slice(0, i));
        if (i >= stat.trend.length) window.clearInterval(interval);
      }, 35);
      return () => window.clearInterval(interval);
    }, delay);
    return () => window.clearTimeout(tid);
  }, [stat.trend, delay]);

  // Build sparkline path
  const W = 140;
  const H = 36;
  const max = Math.max(...stat.trend);
  const min = Math.min(...stat.trend);
  const range = max - min || 1;
  const pts = animatedTrend.map((v, i) => {
    const x = (i / (stat.trend.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = pts.length > 0 ? `M ${pts.join(" L ")}` : "";
  const areaPath = pts.length > 0 ? `${path} L ${W},${H} L 0,${H} Z` : "";

  const useRoll = stat.displayOverride === undefined && Number.isInteger(stat.value);

  return (
    <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-md p-5 hover:border-white/25 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          {stat.label}
        </span>
        <span
          className={`inline-flex items-center gap-1 font-mono text-[10px] tabular-nums ${
            stat.trendUp ? "text-emerald-300" : "text-cyan-300"
          }`}
        >
          {stat.delta >= 0 ? "▲" : "▼"}
          {stat.delta >= 0 ? "+" : ""}
          {stat.delta}%
        </span>
      </div>

      {/* Big value */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <span className="display text-4xl md:text-5xl text-white tabular-nums tracking-tight">
          {useRoll ? (
            <DigitRoll to={stat.value} />
          ) : (
            stat.displayOverride ?? String(stat.value)
          )}
        </span>
        {stat.suffix && (
          <span className="font-mono text-base text-white/55 mb-1">
            {stat.suffix}
          </span>
        )}
      </div>

      {/* Sparkline */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-9" preserveAspectRatio="none">
        <defs>
          <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ec4899" stopOpacity="0.35" />
            <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={lineId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill={`url(#${areaId})`} />}
        {path && (
          <path
            d={path}
            fill="none"
            stroke={`url(#${lineId})`}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        )}
      </svg>

      {/* Hint */}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
        {stat.hint}
      </p>
    </div>
  );
}
