import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "@/lib/db";
import { revalidatePath } from "next/cache";

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
    const updated = await updateSiteSettings(body);

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
