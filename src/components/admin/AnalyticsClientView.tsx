"use client";

import { useState } from "react";
import {
  BarChart3,
  Eye,
  Activity,
  Mouse,
  Mail,
  MessageSquare,
  TrendingUp,
  Download,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type {
  TrafficDataPoint,
  TrafficSource,
  TopPageItem,
  ProjectPerformanceItem,
  FunnelStep,
  CtaPerformanceItem,
  DeviceBreakdown,
  BrowserBreakdown,
} from "@/lib/analytics-db";
import type { AnalyticsEvent } from "@/lib/db/types";
import TrafficChart from "./TrafficChart";

interface Props {
  days: number;
  hasData: boolean;
  totalPageViews: number;
  uniqueSessions: number;
  totalProjectViews: number;
  totalBlogViews: number;
  ctaClicks: number;
  contactSubmits: number;
  whatsappClicks: number;
  emailClicks: number;
  trafficData: TrafficDataPoint[];
  trafficSources: TrafficSource[];
  topPages: TopPageItem[];
  projectPerf: ProjectPerformanceItem[];
  funnel: FunnelStep[];
  ctaBreakdown: CtaPerformanceItem[];
  deviceBreakdown: DeviceBreakdown;
  browserBreakdown: BrowserBreakdown[];
  recentEvents: AnalyticsEvent[];
}

export default function AnalyticsClientView({
  days,
  hasData,
  totalPageViews,
  uniqueSessions,
  totalProjectViews,
  totalBlogViews,
  ctaClicks,
  contactSubmits,
  whatsappClicks,
  emailClicks,
  trafficData,
  trafficSources,
  topPages,
  projectPerf,
  funnel,
  ctaBreakdown,
  deviceBreakdown,
  browserBreakdown,
  recentEvents,
}: Props) {
  const [projectSort, setProjectSort] = useState<"views" | "ctaClicks" | "ctr">("views");

  const sortedProjects = [...projectPerf].sort((a, b) => b[projectSort] - a[projectSort]);

  // Export CSV
  const exportCsv = () => {
    const rows = [
      ["Metric", "Value"],
      ["Date Range (Days)", String(days)],
      ["Page Views", String(totalPageViews)],
      ["Unique Visitors / Sessions", String(uniqueSessions)],
      ["Project Views", String(totalProjectViews)],
      ["Blog Views", String(totalBlogViews)],
      ["Total CTA Clicks", String(ctaClicks)],
      ["WhatsApp Clicks", String(whatsappClicks)],
      ["Email Clicks", String(emailClicks)],
      ["Contact Submissions", String(contactSubmits)],
      [],
      ["--- Top Pages ---"],
      ["Path", "Views", "Unique Visitors", "CTA Clicks"],
      ...topPages.map((p) => [p.path, String(p.views), String(p.uniqueVisitors), String(p.ctaClicks)]),
      [],
      ["--- Project Performance ---"],
      ["Project Slug", "Views", "Unique Views", "CTA Clicks", "Demo Clicks", "GitHub Clicks", "CTR %"],
      ...projectPerf.map((p) => [
        p.projectSlug,
        String(p.views),
        String(p.uniqueViews),
        String(p.ctaClicks),
        String(p.demoClicks),
        String(p.githubClicks),
        `${p.ctr}%`,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `arefin_analytics_${days}d_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const ranges = [
    { label: "7 Days", value: 7 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
    { label: "1 Year", value: 365 },
  ];

  return (
    <div className="space-y-8 max-w-[1360px] mx-auto">
      {/* ── HEADER WITH DATE RANGE & EXPORT ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f111a] p-6 rounded-3xl border border-[#1e2433] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              TELEMETRY &amp; INSIGHTS
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">Last {days} Days</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Traffic &amp; Conversion Analytics
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            {hasData
              ? `Aggregated real-time metrics for the last ${days} days`
              : "Awaiting telemetry events from visitors"}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {/* Range Selector */}
          <div className="flex items-center gap-1 bg-[#141a29] p-1 rounded-xl border border-[#1e2433]">
            {ranges.map((r) => (
              <Link
                key={r.value}
                href={`/admin/analytics?days=${r.value}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  days === r.value
                    ? "bg-violet-600 text-white shadow-sm"
                    : "text-[#6b7280] hover:text-white hover:bg-[#1e2433]"
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>

          {/* Export CSV */}
          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#161d2d] hover:bg-[#1f293d] border border-[#252f44] hover:border-violet-500/30 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            Export CSV
          </button>
        </div>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="rounded-3xl bg-[#0f111a] border border-[#1e2433] p-16 text-center shadow-lg">
          <div className="w-16 h-16 rounded-3xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4 text-violet-400">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h2 className="text-white font-bold text-lg mb-1">No analytics telemetry yet</h2>
          <p className="text-[#6b7280] text-xs max-w-md mx-auto leading-relaxed">
            Privacy-safe analytics events are recorded automatically when users visit the portfolio,
            read projects, click buttons, or send inquiries. All calculations update in real time.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-violet-600/20"
            >
              Open Live Site <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* ── KPI ROW ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {[
              { label: "Page Views", value: totalPageViews, icon: Eye, color: "text-sky-400" },
              { label: "Unique Visitors", value: uniqueSessions, icon: Activity, color: "text-emerald-400" },
              { label: "Project Views", value: totalProjectViews, icon: TrendingUp, color: "text-violet-400" },
              { label: "CTA Clicks", value: ctaClicks, icon: Mouse, color: "text-amber-400" },
              { label: "WhatsApp", value: whatsappClicks, icon: MessageSquare, color: "text-green-400" },
              { label: "Submissions", value: contactSubmits, icon: Mail, color: "text-rose-400" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] font-semibold">{kpi.label}</span>
                  <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                </div>
                <p className={`text-2xl font-bold ${kpi.color} tracking-tight`}>
                  {kpi.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {/* ── TRAFFIC TIMELINE CHART ── */}
          <TrafficChart data={trafficData} hasData={hasData} />

          {/* ── TRAFFIC SOURCES & TOP PAGES ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="p-5 md:p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1a202c] pb-3.5 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Traffic Acquisition Sources</h2>
                  <p className="text-xs text-[#6b7280] font-mono mt-0.5">Where visitors discover your portfolio</p>
                </div>
                <Globe className="w-4 h-4 text-violet-400" />
              </div>

              {trafficSources.length === 0 ? (
                <p className="text-xs text-[#6b7280] py-8 text-center font-mono">No traffic source data yet.</p>
              ) : (
                <div className="space-y-3">
                  {trafficSources.map((src) => (
                    <div key={src.source} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white font-medium">{src.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#9ca3af]">{src.visitors} sessions</span>
                          <span className="text-violet-400 font-bold w-12 text-right">{src.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-[#141a29] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-600 rounded-full transition-all"
                          style={{ width: `${Math.max(3, src.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Pages */}
            <div className="p-5 md:p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1a202c] pb-3.5 mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Top Pages &amp; Routes</h2>
                  <p className="text-xs text-[#6b7280] font-mono mt-0.5">Most viewed pages and their engagement</p>
                </div>
                <Eye className="w-4 h-4 text-sky-400" />
              </div>

              {topPages.length === 0 ? (
                <p className="text-xs text-[#6b7280] py-8 text-center font-mono">No page view data yet.</p>
              ) : (
                <div className="space-y-2">
                  {topPages.map((page, idx) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#141a29]/60 border border-[#1e2433] text-xs font-mono"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[#6b7280] text-[10px] w-4">{idx + 1}</span>
                        <span className="text-white font-medium truncate">{page.path}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 text-[11px]">
                        <span className="text-sky-400 font-bold">{page.views} views</span>
                        <span className="text-[#9ca3af]">{page.uniqueVisitors} visitors</span>
                        {page.ctaClicks > 0 && (
                          <span className="text-amber-400 font-semibold">{page.ctaClicks} CTAs</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── PROJECT PERFORMANCE TABLE ── */}
          <div className="p-5 md:p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a202c] pb-4 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Project Level Performance</h2>
                <p className="text-xs text-[#6b7280] font-mono mt-0.5">
                  Detailed conversion and click telemetry across project case studies
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#6b7280] uppercase">Sort by:</span>
                {(["views", "ctaClicks", "ctr"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setProjectSort(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                      projectSort === s
                        ? "bg-violet-600 text-white"
                        : "bg-[#141a29] text-[#9ca3af] hover:text-white"
                    }`}
                  >
                    {s === "views" ? "Views" : s === "ctaClicks" ? "Clicks" : "CTR"}
                  </button>
                ))}
              </div>
            </div>

            {sortedProjects.length === 0 ? (
              <p className="text-xs text-[#6b7280] py-8 text-center font-mono">No project telemetry recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left">
                  <thead>
                    <tr className="border-b border-[#1e2433] text-[#6b7280] uppercase text-[10px]">
                      <th className="pb-3 font-semibold">Project</th>
                      <th className="pb-3 font-semibold text-right">Views</th>
                      <th className="pb-3 font-semibold text-right">Unique</th>
                      <th className="pb-3 font-semibold text-right">CTA Clicks</th>
                      <th className="pb-3 font-semibold text-right">Demo Clicks</th>
                      <th className="pb-3 font-semibold text-right">GitHub</th>
                      <th className="pb-3 font-semibold text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2433]/60">
                    {sortedProjects.map((p) => (
                      <tr key={p.projectSlug} className="hover:bg-[#141a29]/40 transition-colors">
                        <td className="py-3 pr-4 font-sans font-medium text-white">
                          <Link href={`/projects/${p.projectSlug}`} target="_blank" className="hover:text-violet-400 flex items-center gap-1.5">
                            {p.projectSlug}
                            <ArrowRight className="w-3 h-3 text-[#6b7280]" />
                          </Link>
                        </td>
                        <td className="py-3 text-right text-sky-400 font-semibold">{p.views}</td>
                        <td className="py-3 text-right text-[#9ca3af]">{p.uniqueViews}</td>
                        <td className="py-3 text-right text-amber-400 font-semibold">{p.ctaClicks}</td>
                        <td className="py-3 text-right text-emerald-400">{p.demoClicks}</td>
                        <td className="py-3 text-right text-violet-400">{p.githubClicks}</td>
                        <td className="py-3 text-right text-emerald-400 font-bold">{p.ctr}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── CONVERSION FUNNEL & CTA PERFORMANCE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel */}
            <div className="p-5 md:p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <h2 className="text-sm font-bold text-white mb-1">Conversion Funnel Drop-offs</h2>
              <p className="text-xs text-[#6b7280] font-mono mb-4">Step-by-step conversion from discovery to lead</p>

              <div className="space-y-3">
                {funnel.map((step, idx) => (
                  <div key={step.step} className="p-3 bg-[#141a29] rounded-xl border border-[#1e2433]">
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-white font-medium">{step.step}. {step.label}</span>
                      <span className="text-violet-400 font-bold">{step.count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-[#0b0e17] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full"
                        style={{ width: `${Math.max(3, step.conversionRate)}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#6b7280] font-mono mt-1">
                      <span>{step.conversionRate}% overall</span>
                      {idx > 0 && <span>{step.stepConversion}% of previous stage</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Breakdown */}
            <div className="p-5 md:p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <h2 className="text-sm font-bold text-white mb-1">CTA &amp; Intent Actions</h2>
              <p className="text-xs text-[#6b7280] font-mono mb-4">Clicks by button label &amp; trigger source</p>

              {ctaBreakdown.length === 0 ? (
                <p className="text-xs text-[#6b7280] py-8 text-center font-mono">No CTA clicks logged yet.</p>
              ) : (
                <div className="space-y-2">
                  {ctaBreakdown.map((cta) => (
                    <div
                      key={cta.label}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#141a29]/60 border border-[#1e2433] text-xs font-mono"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-white font-medium truncate">{cta.label}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-amber-400 font-bold">{cta.clicks} clicks</span>
                        <span className="text-[#6b7280] text-[10px]">{cta.uniqueUsers} users</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── DEVICE, BROWSER & LIVE EVENT STREAM ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Device Category */}
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-[#1a202c]">
                Device Distribution
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-[#141a29] rounded-xl border border-[#1e2433] text-xs font-mono">
                  <div className="flex items-center gap-2 text-white">
                    <Laptop className="w-4 h-4 text-violet-400" />
                    <span>Desktop</span>
                  </div>
                  <span className="font-bold text-violet-400">{deviceBreakdown.desktopPct}% ({deviceBreakdown.desktop})</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#141a29] rounded-xl border border-[#1e2433] text-xs font-mono">
                  <div className="flex items-center gap-2 text-white">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Mobile</span>
                  </div>
                  <span className="font-bold text-emerald-400">{deviceBreakdown.mobilePct}% ({deviceBreakdown.mobile})</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#141a29] rounded-xl border border-[#1e2433] text-xs font-mono">
                  <div className="flex items-center gap-2 text-white">
                    <Tablet className="w-4 h-4 text-amber-400" />
                    <span>Tablet</span>
                  </div>
                  <span className="font-bold text-amber-400">{deviceBreakdown.tabletPct}% ({deviceBreakdown.tablet})</span>
                </div>
              </div>
            </div>

            {/* Browsers */}
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-[#1a202c]">
                Browser Breakdown
              </h3>
              {browserBreakdown.length === 0 ? (
                <p className="text-xs text-[#6b7280] py-6 text-center font-mono">No browser data yet</p>
              ) : (
                <div className="space-y-2">
                  {browserBreakdown.map((b) => (
                    <div key={b.browser} className="flex items-center justify-between p-2 rounded-lg bg-[#141a29]/60 text-xs font-mono">
                      <span className="text-white">{b.browser}</span>
                      <span className="text-sky-400 font-bold">{b.percentage}% ({b.count})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Live Activity */}
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-[#1a202c]">
                Live Event Stream
              </h3>
              {recentEvents.length === 0 ? (
                <p className="text-xs text-[#6b7280] py-6 text-center font-mono">No recent events logged</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {recentEvents.slice(0, 10).map((ev) => (
                    <div key={ev.id} className="p-2 rounded-lg bg-[#141a29]/40 border border-[#1e2433] text-[11px] font-mono">
                      <div className="flex items-center justify-between text-[#6b7280]">
                        <span className="text-violet-300 font-semibold uppercase">{ev.event.replace("_", " ")}</span>
                        <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="text-[#9ca3af] truncate mt-0.5">{ev.path} {ev.label ? `· ${ev.label}` : ""}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
