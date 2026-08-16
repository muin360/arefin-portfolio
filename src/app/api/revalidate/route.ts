import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const apiKey = req.headers.get("x-revalidate-secret");
    const secret = process.env.ADMIN_SECRET || "revalidate-secret";

    const isAuthorized = session?.user?.isAdmin || (apiKey && apiKey === secret);
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { path } = (await req.json().catch(() => ({}))) as { path?: string };
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true, path: path || "all" });
  } catch {
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
