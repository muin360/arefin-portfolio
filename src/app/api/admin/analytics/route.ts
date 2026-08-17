import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getEventCounts,
  getUniqueSessionCount,
  getTopPages,
  getTopProjects,
  getDailyPageViews,
  getEventCount,
  hasAnalyticsData,
} from "@/lib/analytics-db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const days = Math.min(parseInt(url.searchParams.get("days") ?? "30"), 365);

  const [
    hasData,
    eventCounts,
    uniqueSessions,
    topPages,
    topProjects,
    dailyPageViews,
    ctaClicks,
    contactSubmits,
    whatsappClicks,
  ] = await Promise.all([
    hasAnalyticsData(),
    getEventCounts(days),
    getUniqueSessionCount(days),
    getTopPages(days, 8),
    getTopProjects(days, 6),
    getDailyPageViews(days),
    getEventCount("cta_click", days),
    getEventCount("contact_submit", days),
    getEventCount("whatsapp_click", days),
  ]);

  const pageViewEntry = eventCounts.find((e) => e.event === "page_view");
  const projectViewEntry = eventCounts.find((e) => e.event === "project_view");
  const totalPageViews = pageViewEntry?.count ?? 0;
  const totalProjectViews = projectViewEntry?.count ?? 0;

  return NextResponse.json({
    hasData,
    days,
    summary: {
      pageViews: totalPageViews,
      uniqueSessions,
      projectViews: totalProjectViews,
      ctaClicks,
      contactSubmits,
      whatsappClicks,
    },
    eventCounts,
    topPages,
    topProjects,
    dailyPageViews,
  });
}
