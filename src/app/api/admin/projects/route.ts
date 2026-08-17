import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/db";
import { revalidatePath } from "next/cache";
import { recordAdminActivity } from "@/lib/analytics-db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await getProjects({ publishedOnly: false });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 },
      );
    }

    const project = await createProject({
      title: body.title,
      slug: body.slug,
      projectType: body.projectType || "Personal Project",
      category: body.category || "AI Automation",
      summary: body.summary || "",
      problem: body.problem || "",
      goal: body.goal || "",
      workflowSteps: body.workflowSteps || [],
      aiRole: body.aiRole || "",
      automationLogic: body.automationLogic || "",
      integrations: body.integrations || [],
      stack: body.stack || [],
      learningOutcome: body.learningOutcome || "",
      outcome: body.outcome || "",
      iconName: body.iconName || "workflow",
      thumbnail: body.thumbnail || null,
      demoUrl: body.demoUrl || null,
      repoUrl: body.repoUrl || null,
      featured: Boolean(body.featured),
      published: body.published !== false,
      order: Number(body.order ?? 99),
    });

    const actor = session.user.name || session.user.email || "Admin";

    await recordAdminActivity({
      type: "project_created",
      description: `Created project "${project.title}"`,
      targetId: project.id,
      targetTitle: project.title,
      actor,
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, project }, { status: 201 });
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const updated = await updateProject(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: updates.published !== undefined ? (updates.published ? "project_published" : "project_unpublished") : "project_updated",
      description: `Updated project "${updated.title}"`,
      targetId: updated.id,
      targetTitle: updated.title,
      actor,
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${updated.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, project: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update project";
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "project_deleted",
      description: `Deleted project ${id}`,
      targetId: id,
      actor,
    });

    revalidatePath("/projects");
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete project";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
