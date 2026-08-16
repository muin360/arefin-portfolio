import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const skills = await getSkills({ publishedOnly: false });
  return NextResponse.json({ skills });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.category) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const skill = await createSkill({
      category: body.category,
      iconName: body.iconName || "terminal",
      items: body.items || [],
      order: Number(body.order ?? 99),
      published: body.published !== false,
    });

    revalidatePath("/skills");
    revalidatePath("/");

    return NextResponse.json({ success: true, skill }, { status: 201 });
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
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const updated = await updateSkill(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Skill category not found" }, { status: 404 });
    }

    revalidatePath("/skills");
    revalidatePath("/");

    return NextResponse.json({ success: true, skill: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update skill";
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
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const deleted = await deleteSkill(id);
    if (!deleted) {
      return NextResponse.json({ error: "Skill category not found" }, { status: 404 });
    }

    revalidatePath("/skills");
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Skill deleted" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete skill";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
