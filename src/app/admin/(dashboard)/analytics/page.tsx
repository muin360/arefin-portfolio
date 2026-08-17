import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTrafficOverTime,
  getTrafficSources,
  getTopPages,
  getProjectPerformance,
  getConversionFunnel,
  getCtaBreakdown,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getRecentEvents,
  hasAnalyticsData,
  getEventCounts,
  getUniqueSessionCount,
  getEventCount,
} from "@/lib/analytics-db";
import AnalyticsClientView from "@/components/admin/AnalyticsClientView";

export const metadata: Metadata = {
  title: "Analytics · Portfolio OS",
};

interface PageProps {
  searchParams: Promise<{ days?: string }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/admin/login");

  const params = await searchParams;
  const days = [7, 30, 90, 365].includes(Number(params.days))
    ? Number(params.days)
    : 30;

  const [
    hasData,
    trafficData,
    trafficSources,
    topPages,
    projectPerf,
    funnel,
    ctaBreakdown,
    deviceBreakdown,
    browserBreakdown,
    recentEvents,
    eventCounts,
    uniqueSessions,
    ctaClicks,
    contactSubmits,
    whatsappClicks,
    emailClicks,
  ] = await Promise.all([
    hasAnalyticsData(),
    getTrafficOverTime(days, "daily"),
    getTrafficSources(days),
    getTopPages(days, 12),
    getProjectPerformance(days, 12),
    getConversionFunnel(days),
    getCtaBreakdown(days),
    getDeviceBreakdown(days),
    getBrowserBreakdown(days),
    getRecentEvents(20),
    getEventCounts(days),
    getUniqueSessionCount(days),
    getEventCount("cta_click", days),
    getEventCount("contact_submit", days),
    getEventCount("whatsapp_click", days),
    getEventCount("email_click", days),
  ]);

  const totalPageViews = eventCounts.find((e) => e.event === "page_view")?.count ?? 0;
  const totalProjectViews = eventCounts.find((e) => e.event === "project_view")?.count ?? 0;
  const totalBlogViews = eventCounts.find((e) => e.event === "blog_view")?.count ?? 0;

  return (
    <AnalyticsClientView
      days={days}
      hasData={hasData}
      totalPageViews={totalPageViews}
      uniqueSessions={uniqueSessions}
      totalProjectViews={totalProjectViews}
      totalBlogViews={totalBlogViews}
      ctaClicks={ctaClicks}
      contactSubmits={contactSubmits}
      whatsappClicks={whatsappClicks}
      emailClicks={emailClicks}
      trafficData={trafficData}
      trafficSources={trafficSources}
      topPages={topPages}
      projectPerf={projectPerf}
      funnel={funnel}
      ctaBreakdown={ctaBreakdown}
      deviceBreakdown={deviceBreakdown}
      browserBreakdown={browserBreakdown}
      recentEvents={recentEvents}
    />
  );
}
