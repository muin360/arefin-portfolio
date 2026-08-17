"use client";

import { useState } from "react";
import type { TrafficDataPoint } from "@/lib/analytics-db";

interface Props {
  data: TrafficDataPoint[];
  hasData: boolean;
}

export default function TrafficChart({ data, hasData }: Props) {
  const [metric, setMetric] = useState<"pageViews" | "visitors" | "ctaClicks">("pageViews");

  if (!hasData || data.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] text-center py-14">
        <div className="w-12 h-12 rounded-2xl bg-[#161d2d] flex items-center justify-center mx-auto mb-3 text-violet-400 border border-[#252f44]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <p className="text-white font-semibold text-sm">No traffic data recorded yet</p>
        <p className="text-xs text-[#6b7280] max-w-sm mx-auto mt-1">
          Visitor trends and pageviews will graph automatically here in real time as your portfolio receives traffic.
        </p>
      </div>
    );
  }

  const values = data.map((d) => d[metric]);
  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / values.length);

  const w = 1000;
  const h = 260;
  const padding = 20;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;
  const step = chartW / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = padding + i * step;
    const y = h - padding - (d[metric] / max) * chartH;
    return { x, y, date: d.date, val: d[metric] };
  });

  const polylineStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const polygonStr = `${padding},${h - padding} ` + polylineStr + ` ${w - padding},${h - padding}`;

  const metricLabels = {
    pageViews: "Page Views",
    visitors: "Unique Visitors",
    ctaClicks: "CTA Clicks",
  };

  const metricColors = {
    pageViews: { stroke: "#8b5cf6", stop1: "rgba(139, 92, 246, 0.35)", stop2: "rgba(139, 92, 246, 0.0)" },
    visitors: { stroke: "#10b981", stop1: "rgba(16, 185, 129, 0.35)", stop2: "rgba(16, 185, 129, 0.0)" },
    ctaClicks: { stroke: "#f59e0b", stop1: "rgba(245, 158, 11, 0.35)", stop2: "rgba(245, 158, 11, 0.0)" },
  };

  const color = metricColors[metric];

  return (
    <div className="p-5 md:p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
      {/* Header with metric toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1a202c]">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Traffic &amp; Engagement Activity</h2>
          <p className="text-xs text-[#6b7280] font-mono mt-0.5">
            Total {total.toLocaleString()} {metricLabels[metric].toLowerCase()} · Avg {avg}/day
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#141a29] p-1 rounded-xl border border-[#1e2433]">
          {(["pageViews", "visitors", "ctaClicks"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metric === key
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-[#9ca3af] hover:text-white hover:bg-[#1a202c]"
              }`}
            >
              {metricLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-48 md:h-60 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color.stop1} />
              <stop offset="100%" stopColor={color.stop2} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={h - padding - ratio * chartH}
              x2={w - padding}
              y2={h - padding - ratio * chartH}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Fill area */}
          <polygon points={polygonStr} fill={`url(#grad-${metric})`} />

          {/* Line curve */}
          <polyline
            points={polylineStr}
            fill="none"
            stroke={color.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {points.map((p, i) => (
            <g key={i} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#0f111a"
                stroke={color.stroke}
                strokeWidth="2"
                className="transition-all hover:r-6"
              />
            </g>
          ))}
        </svg>

        {/* Date axis labels */}
        <div className="flex justify-between items-center text-[10px] font-mono text-[#6b7280] mt-3 px-2">
          <span>{data[0]?.date}</span>
          {data.length > 2 && (
            <span>{data[Math.floor(data.length / 2)]?.date}</span>
          )}
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}
