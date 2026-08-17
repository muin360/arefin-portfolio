import { auth } from "@/lib/auth";
import {
  FolderOpen,
  FileText,
  Workflow,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Plus,
  TrendingUp,
  TrendingDown,
  Mouse,
  Mail,
  Eye,
  Zap,
  Users,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  getProjects,
  getBlogPosts,
  getServices,
  getSkills,
  getContactSubmissions,
  getSiteSettings,
} from "@/lib/db";
import {
  getDashboardKpis,
  getTrafficOverTime,
  getProjectPerformance,
  getTopPages,
  getConversionFunnel,
  getCtaBreakdown,
  getRecentAdminActivity,
} from "@/lib/analytics-db";
import SystemHealthWidget from "@/components/admin/SystemHealthWidget";
import TrafficChart from "@/components/admin/TrafficChart";

export const metadata = {
  title: "Admin Dashboard · Portfolio OS",
};

interface MetricCardProps {
  title: string;
  value: number;
  changePct: number;
  trendUp: boolean;
  previous?: number;
  hasData: boolean;
  icon: React.ElementType;
  href: string;
  accent: "violet" | "emerald" | "amber" | "sky" | "rose" | "indigo";
}

function MetricCard({
  title,
  value,
  changePct,
  trendUp,
  hasData,
  icon: Icon,
  href,
  accent,
}: MetricCardProps) {
  const accentStyles = {
    violet: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    sky: { text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    indigo: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  }[accent];

  return (
    <Link
      href={href}
      className="group block p-4 rounded-2xl bg-[#0f111a] border border-[#1e2433] hover:border-violet-500/40 transition-all hover:bg-[#121624] shadow-sm relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#6b7280] font-semibold">
          {title}
        </span>
        <div className={`w-7 h-7 rounded-lg ${accentStyles.bg} flex items-center justify-center ${accentStyles.text}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {hasData && value > 0 ? (
        <>
          <p className="text-2xl font-bold text-white tracking-tight leading-none">
            {value.toLocaleString()}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono">
            {trendUp ? (
              <span className="inline-flex items-center text-emerald-400 font-semibold">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +{changePct}%
              </span>
            ) : (
              <span className="inline-flex items-center text-rose-400 font-semibold">
                <TrendingDown className="w-3 h-3 mr-0.5" />
                -{changePct}%
              </span>
            )}
            <span className="text-[#6b7280]">vs prev 30d</span>
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl font-bold text-white/50 tracking-tight leading-none">—</p>
          <p className="text-[10px] text-[#6b7280] mt-2 font-mono">No data yet</p>
        </>
      )}
    </Link>
  );
}

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const [
    kpis,
    trafficData,
    projectPerf,
    topPages,
    funnel,
    ctaBreakdown,
    adminActivity,
    projects,
    posts,
    services,
    skills,
    submissions,
    settings,
  ] = await Promise.all([
    getDashboardKpis(30),
    getTrafficOverTime(30, "daily"),
    getProjectPerformance(30, 5),
    getTopPages(30, 5),
    getConversionFunnel(30),
    getCtaBreakdown(30),
    getRecentAdminActivity(6),
    getProjects(),
    getBlogPosts(),
    getServices(),
    getSkills(),
    getContactSubmissions(),
    getSiteSettings(),
  ]);

  const unreadMessages = submissions.filter((s) => s.status === "unread").length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const publishedPosts = posts.filter((p) => p.published).length;
  const recentSubmissions = submissions.slice(0, 4);

  return (
    <div className="space-y-7 max-w-[1360px] mx-auto">
      {/* ── TOP HERO BANNER & GREETING ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-[#0f111a] via-[#111624] to-[#0f111a] p-6 md:p-8 rounded-3xl border border-[#1e2433] shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-radial from-violet-600/10 to-transparent pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20">
              OPERATING SYSTEM
            </span>
            <span className="text-[#4b5563] text-xs">·</span>
            <span className="text-xs text-[#6b7280] font-mono">Live Control Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            {greeting}, {user?.name?.split(" ")[0] || "Arefin"}
          </h1>

          <p className="text-xs sm:text-sm text-[#9ca3af] flex items-center gap-2 flex-wrap pt-0.5">
            <span>{settings.role || "AI Automation & AI Agent Developer"}</span>
            <span className="text-[#4b5563]">·</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                settings.availability === "available"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : settings.availability === "scoping"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {settings.availabilityNote || settings.availability}
            </span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center flex-wrap gap-2.5 relative z-10">
          <Link
            href="/admin/projects?new=1"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-all shadow-md shadow-violet-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </Link>
          <Link
            href="/admin/posts?new=1"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#161d2d] hover:bg-[#1f293d] text-white text-xs font-semibold transition-all border border-[#252f44]"
          >
            <Plus className="w-3.5 h-3.5" />
            New Article
          </Link>
          <Link
            href="/admin/messages"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161d2d] hover:bg-[#1f293d] text-white text-xs font-semibold transition-all border border-[#252f44]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
            Messages
            {unreadMessages > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {unreadMessages}
              </span>
            )}
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#161d2d] hover:bg-[#1f293d] text-[#9ca3af] hover:text-white text-xs font-semibold transition-all border border-[#252f44]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Site
          </Link>
        </div>
      </div>

      {/* ── KPI METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard
          title="Visitors"
          value={kpis.uniqueVisitors.current}
          changePct={kpis.uniqueVisitors.changePct}
          trendUp={kpis.uniqueVisitors.trendUp}
          previous={kpis.uniqueVisitors.previous}
          hasData={kpis.hasData}
          icon={Users}
          href="/admin/analytics"
          accent="emerald"
        />
        <MetricCard
          title="Page Views"
          value={kpis.pageViews.current}
          changePct={kpis.pageViews.changePct}
          trendUp={kpis.pageViews.trendUp}
          previous={kpis.pageViews.previous}
          hasData={kpis.hasData}
          icon={Eye}
          href="/admin/analytics"
          accent="sky"
        />
        <MetricCard
          title="Project Views"
          value={kpis.projectViews.current}
          changePct={kpis.projectViews.changePct}
          trendUp={kpis.projectViews.trendUp}
          previous={kpis.projectViews.previous}
          hasData={kpis.hasData}
          icon={FolderOpen}
          href="/admin/projects"
          accent="violet"
        />
        <MetricCard
          title="Blog Views"
          value={kpis.blogViews.current}
          changePct={kpis.blogViews.changePct}
          trendUp={kpis.blogViews.trendUp}
          previous={kpis.blogViews.previous}
          hasData={kpis.hasData}
          icon={FileText}
          href="/admin/posts"
          accent="indigo"
        />
        <MetricCard
          title="CTA Clicks"
          value={kpis.ctaClicks.current}
          changePct={kpis.ctaClicks.changePct}
          trendUp={kpis.ctaClicks.trendUp}
          previous={kpis.ctaClicks.previous}
          hasData={kpis.hasData}
          icon={Mouse}
          href="/admin/analytics"
          accent="amber"
        />
        <MetricCard
          title="Inquiries"
          value={kpis.contactSubmissions.current || submissions.length}
          changePct={kpis.contactSubmissions.changePct}
          trendUp={kpis.contactSubmissions.trendUp}
          previous={kpis.contactSubmissions.previous}
          hasData={submissions.length > 0 || kpis.hasData}
          icon={Mail}
          href="/admin/messages"
          accent="rose"
        />
      </div>

      {/* ── INTERACTIVE TRAFFIC ACTIVITY CHART ── */}
      <TrafficChart data={trafficData} hasData={kpis.hasData} />

      {/* ── TWO-COLUMN CORE PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: 2/3 WIDTH */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Projects Performance */}
          <div className="p-5 md:p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#1a202c] pb-4 mb-4">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Project Engagement</h2>
                <p className="text-xs text-[#6b7280] font-mono mt-0.5">
                  {projects.length} total projects ({publishedProjects} published)
                </p>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-mono font-medium"
              >
                All projects <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {projects.slice(0, 5).map((p) => {
                const perf = projectPerf.find((tp) => tp.projectSlug === p.slug);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#141a29]/60 border border-[#1e2433] hover:border-violet-500/30 transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                          {p.title}
                        </span>
                        {p.featured && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Featured
                          </span>
                        )}
                        {!p.published && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#1e2433] text-[#6b7280]">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6b7280] font-mono truncate">
                        /{p.slug} · {p.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                      {kpis.hasData && perf ? (
                        <>
                          <span className="text-sky-400 flex items-center gap-1" title="Views">
                            <Eye className="w-3.5 h-3.5" />
                            {perf.views}
                          </span>
                          <span className="text-violet-400 flex items-center gap-1" title="CTA / Demo Clicks">
                            <Zap className="w-3.5 h-3.5" />
                            {perf.ctaClicks + perf.demoClicks}
                          </span>
                          <span className="text-emerald-400 font-semibold" title="CTR">
                            {perf.ctr}% CTR
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-[#4b5563]">Waiting for telemetry</span>
                      )}

                      <Link
                        href={`/admin/projects?edit=${p.id}`}
                        className="px-2.5 py-1 text-xs text-[#9ca3af] hover:text-white bg-[#1a202c] hover:bg-violet-600 rounded-lg transition-all"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="p-5 md:p-6 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#1a202c] pb-4 mb-5">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">Conversion Funnel · 30 Days</h2>
                <p className="text-xs text-[#6b7280] font-mono mt-0.5">
                  Visitor journey from discovery to inquiry submission
                </p>
              </div>
              <Link
                href="/admin/analytics"
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-mono font-medium"
              >
                Deep-dive analytics <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {funnel.map((step, idx) => {
                return (
                  <div key={step.step} className="p-3.5 bg-[#141a29] rounded-xl border border-[#1e2433] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#6b7280]">{step.step}</span>
                      <span className="text-white/70 font-semibold">{step.conversionRate}% total</span>
                    </div>

                    <p className="text-xs font-medium text-white truncate">{step.label}</p>
                    <p className="text-xl font-bold text-white">{step.count.toLocaleString()}</p>

                    <div className="h-1.5 bg-[#0b0e17] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${Math.max(4, step.conversionRate)}%` }}
                      />
                    </div>

                    {idx > 0 && (
                      <p className="text-[10px] font-mono text-[#6b7280]">
                        {step.stepConversion}% vs prev step
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Pages & CTA Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-[#1a202c]">
                Top Visited Pages
              </h3>
              {topPages.length === 0 ? (
                <p className="text-xs text-[#4b5563] py-6 font-mono text-center">No page data yet</p>
              ) : (
                <div className="space-y-2">
                  {topPages.map((page, idx) => (
                    <div key={page.path} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#141a29] transition-colors">
                      <span className="text-[10px] font-mono text-[#4b5563] w-4 text-right shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-xs font-mono text-[#d1d5db] truncate">
                        {page.path}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className="h-1.5 rounded-full bg-violet-500/50"
                          style={{
                            width: `${Math.max(16, (page.views / (topPages[0]?.views || 1)) * 60)}px`,
                          }}
                        />
                        <span className="text-xs font-bold text-white w-8 text-right font-mono">
                          {page.views}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Breakdown */}
            <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
              <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-[#1a202c]">
                CTA Interaction Breakdown
              </h3>
              {ctaBreakdown.length === 0 ? (
                <p className="text-xs text-[#4b5563] py-6 font-mono text-center">No CTA clicks logged yet</p>
              ) : (
                <div className="space-y-2">
                  {ctaBreakdown.slice(0, 5).map((cta) => (
                    <div key={cta.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#141a29] transition-colors text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-white font-medium truncate">{cta.label}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {cta.clicks} clicks
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 1/3 WIDTH */}
        <div className="space-y-6">
          {/* System Health Diagnostics */}
          <SystemHealthWidget />

          {/* Recent Inquiries Inbox */}
          <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#1a202c] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Recent Inquiries</h3>
                {unreadMessages > 0 && (
                  <span className="bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full leading-none">
                    {unreadMessages} new
                  </span>
                )}
              </div>
              <Link
                href="/admin/messages"
                className="text-xs text-violet-400 hover:text-violet-300 font-mono font-medium flex items-center gap-1"
              >
                Inbox <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {recentSubmissions.length === 0 ? (
              <div className="py-8 text-center">
                <MessageSquare className="w-8 h-8 text-[#252f44] mx-auto mb-2" />
                <p className="text-xs text-[#6b7280]">No inquiries in inbox</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSubmissions.map((s) => (
                  <Link
                    key={s.id}
                    href="/admin/messages"
                    className="block p-3 rounded-xl bg-[#141a29]/60 border border-[#1e2433] hover:border-violet-500/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white truncate mr-2">
                        {s.name}
                      </span>
                      {s.status === "unread" ? (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#9ca3af] truncate">{s.subject}</p>
                    <p className="text-[10px] text-[#6b7280] font-mono mt-1">
                      {new Date(s.createdAt).toLocaleDateString()} · {s.email}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Admin Activity Audit Trail */}
          <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#1a202c] pb-3 mb-4">
              <h3 className="text-sm font-bold text-white">Admin Activity</h3>
              <Link
                href="/admin/activity"
                className="text-xs text-violet-400 hover:text-violet-300 font-mono font-medium flex items-center gap-1"
              >
                Full log <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {adminActivity.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#6b7280] font-mono">
                No recent administrative actions recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {adminActivity.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{act.description}</p>
                      <p className="text-[10px] text-[#6b7280] font-mono mt-0.5">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {act.actor || "Admin"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Snapshot */}
          <div className="p-5 rounded-2xl bg-[#0f111a] border border-[#1e2433] shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-[#1a202c] pb-3">
              Portfolio Content Status
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                href="/admin/projects"
                className="p-3 bg-[#141a29] rounded-xl border border-[#1e2433] hover:border-violet-500/30 transition-colors"
              >
                <FolderOpen className="w-4 h-4 text-violet-400 mb-1" />
                <p className="font-bold text-white text-base">{projects.length}</p>
                <p className="text-[10px] text-[#6b7280] font-mono">Projects ({publishedProjects} live)</p>
              </Link>

              <Link
                href="/admin/posts"
                className="p-3 bg-[#141a29] rounded-xl border border-[#1e2433] hover:border-violet-500/30 transition-colors"
              >
                <FileText className="w-4 h-4 text-sky-400 mb-1" />
                <p className="font-bold text-white text-base">{posts.length}</p>
                <p className="text-[10px] text-[#6b7280] font-mono">Articles ({publishedPosts} live)</p>
              </Link>

              <Link
                href="/admin/services"
                className="p-3 bg-[#141a29] rounded-xl border border-[#1e2433] hover:border-violet-500/30 transition-colors"
              >
                <Workflow className="w-4 h-4 text-amber-400 mb-1" />
                <p className="font-bold text-white text-base">{services.length}</p>
                <p className="text-[10px] text-[#6b7280] font-mono">Services Active</p>
              </Link>

              <Link
                href="/admin/skills"
                className="p-3 bg-[#141a29] rounded-xl border border-[#1e2433] hover:border-violet-500/30 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 mb-1" />
                <p className="font-bold text-white text-base">{skills.length}</p>
                <p className="text-[10px] text-[#6b7280] font-mono">Skill Categories</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
