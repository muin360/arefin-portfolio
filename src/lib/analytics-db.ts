import "server-only";
import { getCollection, getDb } from "@/lib/mongodb";
import type { AnalyticsEvent, AnalyticsEventType, AdminActivity } from "@/lib/db/types";
import { ObjectId } from "mongodb";

// ─── INSERT EVENT ────────────────────────────────────────────────────────────

export async function insertAnalyticsEvent(
  event: Omit<AnalyticsEvent, "id">,
): Promise<void> {
  try {
    const col = await getCollection<AnalyticsEvent>("analytics_events");
    if (!col) return;
    await col.insertOne({ ...event, _id: new ObjectId() } as unknown as AnalyticsEvent);
  } catch {
    // Non-blocking: analytics must never crash the app
  }
}

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type MetricStat = {
  current: number;
  previous: number;
  changePct: number;
  trendUp: boolean;
  sparkline?: number[];
};

export type DashboardKpis = {
  hasData: boolean;
  pageViews: MetricStat;
  uniqueVisitors: MetricStat;
  projectViews: MetricStat;
  blogViews: MetricStat;
  ctaClicks: MetricStat;
  contactSubmissions: MetricStat;
};

export type TrafficDataPoint = {
  date: string;
  pageViews: number;
  visitors: number;
  ctaClicks: number;
};

export type TrafficSource = {
  source: string;
  visitors: number;
  percentage: number;
};

export type TopPageItem = {
  path: string;
  views: number;
  uniqueVisitors: number;
  ctaClicks: number;
};

export type ProjectPerformanceItem = {
  projectSlug: string;
  views: number;
  uniqueViews: number;
  ctaClicks: number;
  demoClicks: number;
  githubClicks: number;
  contactStarts: number;
  ctr: number;
};

export type FunnelStep = {
  step: string;
  label: string;
  count: number;
  conversionRate: number; // vs initial visitors
  stepConversion: number; // vs previous step
};

export type CtaPerformanceItem = {
  label: string;
  clicks: number;
  uniqueUsers: number;
  topPage?: string;
};

export type DeviceBreakdown = {
  desktop: number;
  mobile: number;
  tablet: number;
  desktopPct: number;
  mobilePct: number;
  tabletPct: number;
};

export type BrowserBreakdown = {
  browser: string;
  count: number;
  percentage: number;
};

// ─── KPI COMPARISON METRICS ──────────────────────────────────────────────────

function calcChange(curr: number, prev: number): { changePct: number; trendUp: boolean } {
  if (prev === 0) {
    return { changePct: curr > 0 ? 100 : 0, trendUp: curr >= prev };
  }
  const diff = ((curr - prev) / prev) * 100;
  return {
    changePct: Math.abs(Math.round(diff * 10) / 10),
    trendUp: diff >= 0,
  };
}

export async function getDashboardKpis(days = 30): Promise<DashboardKpis> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  const emptyStat: MetricStat = { current: 0, previous: 0, changePct: 0, trendUp: true, sparkline: [] };

  if (!col) {
    return {
      hasData: false,
      pageViews: emptyStat,
      uniqueVisitors: emptyStat,
      projectViews: emptyStat,
      blogViews: emptyStat,
      ctaClicks: emptyStat,
      contactSubmissions: emptyStat,
    };
  }

  try {
    const totalCount = await col.estimatedDocumentCount();
    if (totalCount === 0) {
      return {
        hasData: false,
        pageViews: emptyStat,
        uniqueVisitors: emptyStat,
        projectViews: emptyStat,
        blogViews: emptyStat,
        ctaClicks: emptyStat,
        contactSubmissions: emptyStat,
      };
    }

    const now = Date.now();
    const currSince = new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
    const prevSince = new Date(now - days * 2 * 24 * 60 * 60 * 1000).toISOString();

    // 1. Fetch current and previous period event counts in parallel
    const [currEvents, prevEvents, currUniqueSessions, prevUniqueSessions, dailyViews] =
      await Promise.all([
        col
          .aggregate([
            { $match: { timestamp: { $gte: currSince } } },
            { $group: { _id: "$event", count: { $sum: 1 } } },
          ])
          .toArray(),
        col
          .aggregate([
            { $match: { timestamp: { $gte: prevSince, $lt: currSince } } },
            { $group: { _id: "$event", count: { $sum: 1 } } },
          ])
          .toArray(),
        col
          .aggregate([
            { $match: { timestamp: { $gte: currSince }, event: "page_view" } },
            { $group: { _id: "$sessionId" } },
            { $count: "total" },
          ])
          .toArray(),
        col
          .aggregate([
            { $match: { timestamp: { $gte: prevSince, $lt: currSince }, event: "page_view" } },
            { $group: { _id: "$sessionId" } },
            { $count: "total" },
          ])
          .toArray(),
        getDailyPageViews(days),
      ]);

    const currMap: Record<string, number> = {};
    for (const e of currEvents) currMap[e._id] = e.count;

    const prevMap: Record<string, number> = {};
    for (const e of prevEvents) prevMap[e._id] = e.count;

    const currPv = currMap["page_view"] ?? 0;
    const prevPv = prevMap["page_view"] ?? 0;

    const currVis = (currUniqueSessions[0] as { total: number } | undefined)?.total ?? 0;
    const prevVis = (prevUniqueSessions[0] as { total: number } | undefined)?.total ?? 0;

    const currProj = currMap["project_view"] ?? 0;
    const prevProj = prevMap["project_view"] ?? 0;

    const currBlog = currMap["blog_view"] ?? 0;
    const prevBlog = prevMap["blog_view"] ?? 0;

    const currCta = (currMap["cta_click"] ?? 0) + (currMap["whatsapp_click"] ?? 0) + (currMap["email_click"] ?? 0);
    const prevCta = (prevMap["cta_click"] ?? 0) + (prevMap["whatsapp_click"] ?? 0) + (prevMap["email_click"] ?? 0);

    const currSub = currMap["contact_submit"] ?? 0;
    const prevSub = prevMap["contact_submit"] ?? 0;

    const sparkline = dailyViews.map((d) => d.count);

    return {
      hasData: currPv > 0 || currVis > 0 || totalCount > 0,
      pageViews: { current: currPv, previous: prevPv, ...calcChange(currPv, prevPv), sparkline },
      uniqueVisitors: { current: currVis, previous: prevVis, ...calcChange(currVis, prevVis) },
      projectViews: { current: currProj, previous: prevProj, ...calcChange(currProj, prevProj) },
      blogViews: { current: currBlog, previous: prevBlog, ...calcChange(currBlog, prevBlog) },
      ctaClicks: { current: currCta, previous: prevCta, ...calcChange(currCta, prevCta) },
      contactSubmissions: { current: currSub, previous: prevSub, ...calcChange(currSub, prevSub) },
    };
  } catch {
    return {
      hasData: false,
      pageViews: emptyStat,
      uniqueVisitors: emptyStat,
      projectViews: emptyStat,
      blogViews: emptyStat,
      ctaClicks: emptyStat,
      contactSubmissions: emptyStat,
    };
  }
}

// ─── DAILY / AGGREGATED TRAFFIC OVER TIME ────────────────────────────────────

export async function getDailyPageViews(days = 30): Promise<{ date: string; count: number }[]> {
  try {
    const col = await getCollection<AnalyticsEvent>("analytics_events");
    if (!col) return [];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const results = await col
      .aggregate([
        { $match: { timestamp: { $gte: since }, event: "page_view" } },
        {
          $group: {
            _id: { $substr: ["$timestamp", 0, 10] },
            count: { $sum: 1 },
          },
        },
        { $project: { date: "$_id", count: 1, _id: 0 } },
        { $sort: { date: 1 } },
      ])
      .toArray();
    return results as { date: string; count: number }[];
  } catch {
    return [];
  }
}

export async function getTrafficOverTime(
  days = 30,
  aggregation: "daily" | "weekly" | "monthly" = "daily",
): Promise<TrafficDataPoint[]> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  if (!col) return [];

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const dateLength = aggregation === "monthly" ? 7 : aggregation === "weekly" ? 10 : 10;

    const [pageViews, sessions, ctaClicks] = await Promise.all([
      col
        .aggregate([
          { $match: { timestamp: { $gte: since }, event: "page_view" } },
          {
            $group: {
              _id: { $substr: ["$timestamp", 0, dateLength] },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      col
        .aggregate([
          { $match: { timestamp: { $gte: since }, event: "page_view" } },
          {
            $group: {
              _id: {
                date: { $substr: ["$timestamp", 0, dateLength] },
                session: "$sessionId",
              },
            },
          },
          {
            $group: {
              _id: "$_id.date",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
      col
        .aggregate([
          {
            $match: {
              timestamp: { $gte: since },
              event: { $in: ["cta_click", "whatsapp_click", "email_click", "project_demo_click"] },
            },
          },
          {
            $group: {
              _id: { $substr: ["$timestamp", 0, dateLength] },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
    ]);

    const dates = new Set<string>();
    for (const r of pageViews) dates.add(r._id);
    for (const r of sessions) dates.add(r._id);
    for (const r of ctaClicks) dates.add(r._id);

    const pvMap = Object.fromEntries(pageViews.map((r) => [r._id, r.count]));
    const sesMap = Object.fromEntries(sessions.map((r) => [r._id, r.count]));
    const ctaMap = Object.fromEntries(ctaClicks.map((r) => [r._id, r.count]));

    const sortedDates = Array.from(dates).sort();
    return sortedDates.map((d) => ({
      date: d,
      pageViews: pvMap[d] ?? 0,
      visitors: sesMap[d] ?? 0,
      ctaClicks: ctaMap[d] ?? 0,
    }));
  } catch {
    return [];
  }
}

// ─── CSV SANITIZATION HELPER ────────────────────────────────────────────────

export { sanitizeCsvField } from "@/lib/csv-sanitizer";

// ─── TRAFFIC SOURCES ─────────────────────────────────────────────────────────

function classifyReferrer(ref?: string): string {
  if (!ref || ref === "" || ref === "direct") return "Direct";
  const r = ref.toLowerCase();
  if (
    r.includes("tensorstudio.vercel.app") ||
    r.includes("localhost") ||
    r.includes("127.0.0.1") ||
    r.includes("arefin-portfolio")
  ) {
    return "Direct";
  }
  if (r.includes("google.")) return "Google";
  if (r.includes("github.")) return "GitHub";
  if (r.includes("linkedin.")) return "LinkedIn";
  if (r.includes("twitter.") || r.includes("x.com") || r.includes("t.co")) return "Twitter / X";
  if (r.includes("facebook.") || r.includes("fb.com")) return "Facebook";
  if (r.includes("youtube.")) return "YouTube";
  if (r.includes("bing.") || r.includes("duckduckgo.")) return "Search Engines";
  try {
    const url = new URL(ref.startsWith("http") ? ref : `https://${ref}`);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "tensorstudio.vercel.app" || host === "localhost" || host === "127.0.0.1") {
      return "Direct";
    }
    return host;
  } catch {
    return "Referral";
  }
}

export async function getTrafficSources(days = 30): Promise<TrafficSource[]> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  if (!col) return [];

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const records = await col
      .aggregate([
        { $match: { timestamp: { $gte: since }, event: "page_view" } },
        { $group: { _id: { referrer: "$referrer", session: "$sessionId" } } },
        { $group: { _id: "$_id.referrer", count: { $sum: 1 } } },
      ])
      .toArray();

    const categorized: Record<string, number> = {};
    let total = 0;

    for (const r of records) {
      const source = classifyReferrer(r._id);
      categorized[source] = (categorized[source] ?? 0) + r.count;
      total += r.count;
    }

    if (total === 0) return [];

    const list = Object.entries(categorized).map(([source, visitors]) => ({
      source,
      visitors,
      percentage: Math.round((visitors / total) * 1000) / 10,
    }));

    list.sort((a, b) => b.visitors - a.visitors);
    return list;
  } catch {
    return [];
  }
}

// ─── TOP PAGES ───────────────────────────────────────────────────────────────

export async function getTopPages(days = 30, limit = 10): Promise<TopPageItem[]> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  if (!col) return [];

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [views, sessions, ctaClicks] = await Promise.all([
      col
        .aggregate([
          { $match: { timestamp: { $gte: since }, event: "page_view" } },
          { $group: { _id: "$path", views: { $sum: 1 } } },
          { $sort: { views: -1 } },
          { $limit: limit },
        ])
        .toArray(),
      col
        .aggregate([
          { $match: { timestamp: { $gte: since }, event: "page_view" } },
          { $group: { _id: { path: "$path", session: "$sessionId" } } },
          { $group: { _id: "$_id.path", count: { $sum: 1 } } },
        ])
        .toArray(),
      col
        .aggregate([
          {
            $match: {
              timestamp: { $gte: since },
              event: { $in: ["cta_click", "whatsapp_click", "email_click", "contact_start"] },
            },
          },
          { $group: { _id: "$path", count: { $sum: 1 } } },
        ])
        .toArray(),
    ]);

    const sessionMap = Object.fromEntries(sessions.map((s) => [s._id, s.count]));
    const ctaMap = Object.fromEntries(ctaClicks.map((c) => [c._id, c.count]));

    return views.map((v) => ({
      path: v._id,
      views: v.views,
      uniqueVisitors: sessionMap[v._id] ?? Math.min(v.views, 1),
      ctaClicks: ctaMap[v._id] ?? 0,
    }));
  } catch {
    return [];
  }
}

// ─── PROJECT PERFORMANCE ─────────────────────────────────────────────────────

export async function getProjectPerformance(days = 30, limit = 12): Promise<ProjectPerformanceItem[]> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  if (!col) return [];

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [views, uniqueViews, clicks] = await Promise.all([
      col
        .aggregate([
          {
            $match: {
              timestamp: { $gte: since },
              event: "project_view",
              projectSlug: { $exists: true, $ne: null },
            },
          },
          { $group: { _id: "$projectSlug", count: { $sum: 1 } } },
        ])
        .toArray(),
      col
        .aggregate([
          {
            $match: {
              timestamp: { $gte: since },
              event: "project_view",
              projectSlug: { $exists: true, $ne: null },
            },
          },
          { $group: { _id: { slug: "$projectSlug", session: "$sessionId" } } },
          { $group: { _id: "$_id.slug", count: { $sum: 1 } } },
        ])
        .toArray(),
      col
        .aggregate([
          {
            $match: {
              timestamp: { $gte: since },
              projectSlug: { $exists: true, $ne: null },
              event: {
                $in: [
                  "cta_click",
                  "project_demo_click",
                  "project_github_click",
                  "contact_start",
                ],
              },
            },
          },
          {
            $group: {
              _id: { slug: "$projectSlug", event: "$event" },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
    ]);

    const viewMap = Object.fromEntries(views.map((v) => [v._id, v.count]));
    const uniqueMap = Object.fromEntries(uniqueViews.map((u) => [u._id, u.count]));

    const clickMap: Record<string, { cta: number; demo: number; github: number; contactStart: number }> = {};
    for (const c of clicks) {
      const slug = c._id.slug;
      if (!clickMap[slug]) clickMap[slug] = { cta: 0, demo: 0, github: 0, contactStart: 0 };
      if (c._id.event === "cta_click") clickMap[slug].cta += c.count;
      if (c._id.event === "project_demo_click") clickMap[slug].demo += c.count;
      if (c._id.event === "project_github_click") clickMap[slug].github += c.count;
      if (c._id.event === "contact_start") clickMap[slug].contactStart += c.count;
    }

    const allSlugs = Array.from(
      new Set([...Object.keys(viewMap), ...Object.keys(clickMap)]),
    );

    const items: ProjectPerformanceItem[] = allSlugs.map((slug) => {
      const v = viewMap[slug] ?? 0;
      const u = uniqueMap[slug] ?? Math.min(v, 1);
      const c = clickMap[slug] ?? { cta: 0, demo: 0, github: 0, contactStart: 0 };
      const totalClicks = c.cta + c.demo + c.github;
      const ctr = v > 0 ? Math.round((totalClicks / v) * 1000) / 10 : 0;
      return {
        projectSlug: slug,
        views: v,
        uniqueViews: u,
        ctaClicks: c.cta,
        demoClicks: c.demo,
        githubClicks: c.github,
        contactStarts: c.contactStart,
        ctr,
      };
    });

    items.sort((a, b) => b.views - a.views);
    return items.slice(0, limit);
  } catch {
    return [];
  }
}

// ─── CONVERSION FUNNEL ───────────────────────────────────────────────────────

export async function getConversionFunnel(days = 30): Promise<FunnelStep[]> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  if (!col) return [];

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [visitors, viewers, ctaClickers, contactStarters, submissions] = await Promise.all([
      col
        .aggregate([
          { $match: { timestamp: { $gte: since }, event: "page_view" } },
          { $group: { _id: "$sessionId" } },
          { $count: "total" },
        ])
        .toArray(),
      col
        .aggregate([
          {
            $match: {
              timestamp: { $gte: since },
              $or: [
                { event: "project_view" },
                { event: "blog_view" },
                { path: { $in: ["/services", "/skills", "/projects", "/about"] } },
              ],
            },
          },
          { $group: { _id: "$sessionId" } },
          { $count: "total" },
        ])
        .toArray(),
      col
        .aggregate([
          {
            $match: {
              timestamp: { $gte: since },
              event: { $in: ["cta_click", "whatsapp_click", "email_click", "project_demo_click"] },
            },
          },
          { $group: { _id: "$sessionId" } },
          { $count: "total" },
        ])
        .toArray(),
      col
        .aggregate([
          { $match: { timestamp: { $gte: since }, event: "contact_start" } },
          { $group: { _id: "$sessionId" } },
          { $count: "total" },
        ])
        .toArray(),
      col.countDocuments({ timestamp: { $gte: since }, event: "contact_submit" }),
    ]);

    const s1 = (visitors[0] as { total: number } | undefined)?.total ?? 0;
    const s2 = (viewers[0] as { total: number } | undefined)?.total ?? 0;
    const s3 = (ctaClickers[0] as { total: number } | undefined)?.total ?? 0;
    const s4 = (contactStarters[0] as { total: number } | undefined)?.total ?? 0;
    const s5 = submissions;

    const base = Math.max(s1, 1);

    return [
      {
        step: "01",
        label: "All Visitors",
        count: s1,
        conversionRate: 100,
        stepConversion: 100,
      },
      {
        step: "02",
        label: "Engaged Viewers",
        count: s2,
        conversionRate: Math.round((s2 / base) * 1000) / 10,
        stepConversion: s1 > 0 ? Math.round((s2 / s1) * 1000) / 10 : 0,
      },
      {
        step: "03",
        label: "CTA Clickers",
        count: s3,
        conversionRate: Math.round((s3 / base) * 1000) / 10,
        stepConversion: s2 > 0 ? Math.round((s3 / s2) * 1000) / 10 : 0,
      },
      {
        step: "04",
        label: "Contact Starters",
        count: s4,
        conversionRate: Math.round((s4 / base) * 1000) / 10,
        stepConversion: s3 > 0 ? Math.round((s4 / s3) * 1000) / 10 : 0,
      },
      {
        step: "05",
        label: "Submissions / Leads",
        count: s5,
        conversionRate: Math.round((s5 / base) * 1000) / 10,
        stepConversion: s4 > 0 ? Math.round((s5 / s4) * 1000) / 10 : 0,
      },
    ];
  } catch {
    return [];
  }
}

// ─── CTA ANALYTICS ───────────────────────────────────────────────────────────

export async function getCtaBreakdown(days = 30): Promise<CtaPerformanceItem[]> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  if (!col) return [];

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const results = await col
      .aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            event: {
              $in: [
                "cta_click",
                "whatsapp_click",
                "email_click",
                "project_demo_click",
                "project_github_click",
                "contact_start",
              ],
            },
          },
        },
        {
          $group: {
            _id: {
              label: { $ifNull: ["$label", "$event"] },
              session: "$sessionId",
            },
            path: { $first: "$path" },
          },
        },
        {
          $group: {
            _id: "$_id.label",
            clicks: { $sum: 1 },
            uniqueUsers: { $sum: 1 },
            topPage: { $first: "$path" },
          },
        },
        { $sort: { clicks: -1 } },
      ])
      .toArray();

    return results.map((r) => ({
      label: r._id || "CTA Button",
      clicks: r.clicks,
      uniqueUsers: r.uniqueUsers,
      topPage: r.topPage,
    }));
  } catch {
    return [];
  }
}

// ─── DEVICE & BROWSER BREAKDOWNS ─────────────────────────────────────────────

export async function getDeviceBreakdown(days = 30): Promise<DeviceBreakdown> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  const empty: DeviceBreakdown = {
    desktop: 0,
    mobile: 0,
    tablet: 0,
    desktopPct: 0,
    mobilePct: 0,
    tabletPct: 0,
  };
  if (!col) return empty;

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const records = await col
      .aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            deviceCategory: { $exists: true, $ne: null },
          },
        },
        { $group: { _id: "$deviceCategory", count: { $sum: 1 } } },
      ])
      .toArray();

    const counts: Record<string, number> = {};
    let total = 0;
    for (const r of records) {
      counts[r._id] = r.count;
      total += r.count;
    }

    if (total === 0) return empty;

    const desktop = counts["desktop"] ?? 0;
    const mobile = counts["mobile"] ?? 0;
    const tablet = counts["tablet"] ?? 0;

    return {
      desktop,
      mobile,
      tablet,
      desktopPct: Math.round((desktop / total) * 1000) / 10,
      mobilePct: Math.round((mobile / total) * 1000) / 10,
      tabletPct: Math.round((tablet / total) * 1000) / 10,
    };
  } catch {
    return empty;
  }
}

export async function getBrowserBreakdown(days = 30): Promise<BrowserBreakdown[]> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  if (!col) return [];

  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const records = await col
      .aggregate([
        {
          $match: {
            timestamp: { $gte: since },
            browser: { $exists: true, $ne: null },
          },
        },
        { $group: { _id: "$browser", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    const total = records.reduce((acc, r) => acc + r.count, 0);
    if (total === 0) return [];

    return records.map((r) => ({
      browser: r._id,
      count: r.count,
      percentage: Math.round((r.count / total) * 1000) / 10,
    }));
  } catch {
    return [];
  }
}

// ─── RECENT EVENT STREAM ─────────────────────────────────────────────────────

export async function getRecentEvents(limit = 20): Promise<AnalyticsEvent[]> {
  const col = await getCollection<AnalyticsEvent>("analytics_events");
  if (!col) return [];

  try {
    const docs = await col.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
    return docs.map((d) => {
      const { _id, id: _idField, ...rest } = d as { _id?: unknown; id?: string } & AnalyticsEvent;
      return { ...rest, id: String(_id ?? _idField ?? "") };
    });
  } catch {
    return [];
  }
}

// ─── ADMIN ACTIVITY LOG ──────────────────────────────────────────────────────

export async function recordAdminActivity(
  activity: Omit<AdminActivity, "id" | "timestamp">,
): Promise<void> {
  try {
    const col = await getCollection<AdminActivity>("admin_activities");
    if (!col) return;
    await col.insertOne({
      ...activity,
      _id: new ObjectId(),
      timestamp: new Date().toISOString(),
    } as unknown as AdminActivity);
  } catch {
    // Non-blocking
  }
}

export async function getRecentAdminActivity(limit = 10): Promise<AdminActivity[]> {
  const col = await getCollection<AdminActivity>("admin_activities");
  if (!col) return [];

  try {
    const docs = await col.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
    return docs.map((d) => {
      const { _id, id: _idField, ...rest } = d as { _id?: unknown; id?: string } & AdminActivity;
      return { ...rest, id: String(_id ?? _idField ?? "") };
    });
  } catch {
    return [];
  }
}

// ─── LEGACY AGGREGATES & HEALTH ──────────────────────────────────────────────

export async function getEventCounts(days = 30): Promise<{ event: AnalyticsEventType; count: number }[]> {
  try {
    const col = await getCollection<AnalyticsEvent>("analytics_events");
    if (!col) return [];
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const results = await col
      .aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: "$event", count: { $sum: 1 } } },
        { $project: { event: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ])
      .toArray();
    return results as { event: AnalyticsEventType; count: number }[];
  } catch {
    return [];
  }
}

export async function getUniqueSessionCount(days = 30): Promise<number> {
  try {
    const col = await getCollection<AnalyticsEvent>("analytics_events");
    if (!col) return 0;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const results = await col
      .aggregate([
        { $match: { timestamp: { $gte: since }, event: "page_view" } },
        { $group: { _id: "$sessionId" } },
        { $count: "total" },
      ])
      .toArray();
    return (results[0] as { total: number } | undefined)?.total ?? 0;
  } catch {
    return 0;
  }
}

export async function getTopProjects(days = 30, limit = 10): Promise<{ projectSlug: string; views: number; ctaClicks: number }[]> {
  const perf = await getProjectPerformance(days, limit);
  return perf.map((p) => ({
    projectSlug: p.projectSlug,
    views: p.views,
    ctaClicks: p.ctaClicks + p.demoClicks + p.githubClicks,
  }));
}

export async function getEventCount(event: AnalyticsEventType, days = 30): Promise<number> {
  try {
    const col = await getCollection<AnalyticsEvent>("analytics_events");
    if (!col) return 0;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    return await col.countDocuments({ event, timestamp: { $gte: since } });
  } catch {
    return 0;
  }
}

export async function hasAnalyticsData(): Promise<boolean> {
  try {
    const col = await getCollection<AnalyticsEvent>("analytics_events");
    if (!col) return false;
    const count = await col.estimatedDocumentCount();
    return count > 0;
  } catch {
    return false;
  }
}

export async function checkMongoHealth(): Promise<{
  connected: boolean;
  dbName: string;
  collectionsCount?: number;
  latencyMs?: number;
}> {
  try {
    const db = await getDb();
    if (!db) return { connected: false, dbName: "n/a" };
    const start = Date.now();
    await db.command({ ping: 1 });
    const latencyMs = Date.now() - start;
    const cols = await db.listCollections().toArray();
    return {
      connected: true,
      dbName: db.databaseName,
      collectionsCount: cols.length,
      latencyMs,
    };
  } catch {
    return { connected: false, dbName: "n/a" };
  }
}
