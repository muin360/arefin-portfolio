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
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Sanitize phone numbers
    if (body.phoneE164) {
      body.phoneE164 = String(body.phoneE164).replace(/[^\d]/g, "");
    }

    const updated = await updateSiteSettings(body);

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "settings_updated",
      description: `Updated site configuration and availability status (${updated.availability})`,
      actor,
    });

    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: updated,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update settings";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
