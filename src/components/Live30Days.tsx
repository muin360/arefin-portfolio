"use client";

import { useEffect, useId, useState } from "react";
import type { Live30DayStat } from "@/sanity/types";

type Stat = Live30DayStat;

export default function Live30Days({ stats }: { stats: Stat[] }) {
  if (!stats || stats.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {stats.map((stat, i) => (
        <StatTile key={`${stat.label}-${i}`} stat={stat} delay={i * 80} />
      ))}
    </div>
  );
}

// Build a smooth synthetic sparkline that ramps up to (or down to) the
// final value. We don't fabricate "telemetry" — the sparkline is a visual
// only and trends in the same direction as the configured delta.
function syntheticTrend(trendUp: boolean, points = 20): number[] {
  const out: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    // ease-out curve so the sparkline feels organic
    const ease = 1 - Math.pow(1 - t, 2);
    out.push(trendUp ? ease : 1 - ease);
  }
  return out;
}

function StatTile({ stat, delay }: { stat: Stat; delay: number }) {
  const rawId = useId();
  const idKey = rawId.replace(/:/g, "");
  const areaId = `spark-area-${idKey}`;
  const lineId = `spark-line-${idKey}`;
  const trend = syntheticTrend(stat.trendUp ?? true);
  const [animatedTrend, setAnimatedTrend] = useState<number[]>([]);

  useEffect(() => {
    const tid = window.setTimeout(() => {
      let i = 0;
      const interval = window.setInterval(() => {
        i++;
        setAnimatedTrend(trend.slice(0, i));
        if (i >= trend.length) window.clearInterval(interval);
      }, 35);
      return () => window.clearInterval(interval);
    }, delay);
    return () => window.clearTimeout(tid);
  }, [trend, delay]);

  // Build sparkline path
  const W = 140;
  const H = 36;
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  const pts = animatedTrend.map((v, i) => {
    const x = (i / (trend.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = pts.length > 0 ? `M ${pts.join(" L ")}` : "";
  const areaPath = pts.length > 0 ? `${path} L ${W},${H} L 0,${H} Z` : "";

  const trendUp = stat.trendUp ?? true;

  return (
    <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-md p-5 hover:border-white/25 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          {stat.label}
        </span>
        {stat.delta && (
          <span
            className={`inline-flex items-center gap-1 font-mono text-[10px] tabular-nums ${
              trendUp ? "text-emerald-300" : "text-cyan-300"
            }`}
          >
            {trendUp ? "▲" : "▼"}
            {stat.delta}
          </span>
        )}
      </div>

      {/* Big value */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <span className="display text-4xl md:text-5xl text-white tabular-nums tracking-tight">
          {stat.value}
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
      {stat.hint && (
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
          {stat.hint}
        </p>
      )}
    </div>
  );
}
