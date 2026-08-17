import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/db";
import { revalidatePath } from "next/cache";
import { recordAdminActivity } from "@/lib/analytics-db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await getServices({ publishedOnly: false });
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const service = await createService({
      title: body.title,
      iconName: body.iconName || "workflow",
      hook: body.hook || "",
      problem: body.problem || "",
      solution: body.solution || "",
      outcome: body.outcome || "",
      bullets: (body.bullets || []).filter((b: string) => Boolean(b.trim())),
      ctaLabel: body.ctaLabel || "Let's build an automation",
      ctaPrefill: body.ctaPrefill || "",
      isFeatured: Boolean(body.isFeatured),
      published: body.published !== false,
      order: Number(body.order ?? 99),
    });

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "service_updated",
      description: `Created service "${service.title}"`,
      targetId: service.id,
      targetTitle: service.title,
      actor,
    });

    revalidatePath("/services");
    revalidatePath("/");

    return NextResponse.json({ success: true, service }, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Invalid payload";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    if (updates.bullets && Array.isArray(updates.bullets)) {
      updates.bullets = updates.bullets.filter((b: string) => Boolean(b.trim()));
    }

    const updated = await updateService(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "service_updated",
      description: `Updated service "${updated.title}"`,
      targetId: updated.id,
      targetTitle: updated.title,
      actor,
    });

    revalidatePath("/services");
    revalidatePath("/");

    return NextResponse.json({ success: true, service: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update service";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const deleted = await deleteService(id);
    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "service_updated",
      description: `Deleted service ${id}`,
      targetId: id,
      actor,
    });

    revalidatePath("/services");
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Service deleted" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete service";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
