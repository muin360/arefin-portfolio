import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getAboutData, updateAboutData } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { recordAdminActivity } from "@/lib/analytics-db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const about = await getAboutData();
  return NextResponse.json({ about });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateAboutData(body);

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "about_updated",
      description: `Updated about story, technical philosophy, and principles`,
      actor,
    });

    revalidatePath("/about");
    revalidatePath("/");

    return NextResponse.json({ success: true, about: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update about data";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
