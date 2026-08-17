import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { recordAdminActivity } from "@/lib/analytics-db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ seo: settings.seo });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current = await getSiteSettings();

    // Strip trailing slashes on canonical URL for SEO consistency
    if (body.canonicalUrl && typeof body.canonicalUrl === "string") {
      body.canonicalUrl = body.canonicalUrl.replace(/\/+$/, "");
    }

    const updated = await updateSiteSettings({
      seo: {
        ...current.seo,
        ...body,
      },
    });

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "seo_updated",
      description: `Updated global SEO title, meta descriptions, and OpenGraph tags`,
      actor,
    });

    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, seo: updated.seo });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update SEO settings";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
