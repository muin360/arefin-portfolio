import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/db";
import { revalidatePath } from "next/cache";
import { recordAdminActivity } from "@/lib/analytics-db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await getBlogPosts({ publishedOnly: false });
  return NextResponse.json({ posts });
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

    const post = await createBlogPost({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || "",
      content: body.content || "",
      coverImage: body.coverImage || null,
      category: body.category || "Notes",
      tags: body.tags || [],
      readingTime: body.readingTime || "5 min read",
      date: body.date || new Date().toISOString().split("T")[0],
      published: body.published !== false,
      featured: Boolean(body.featured),
      seoTitle: body.seoTitle || "",
      seoDescription: body.seoDescription || "",
    });

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "post_created",
      description: `Created article "${post.title}"`,
      targetId: post.id,
      targetTitle: post.title,
      actor,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, post }, { status: 201 });
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
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const updated = await updateBlogPost(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: updates.published !== undefined ? (updates.published ? "post_published" : "post_unpublished") : "post_updated",
      description: `Updated article "${updated.title}"`,
      targetId: updated.id,
      targetTitle: updated.title,
      actor,
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, post: updated });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update post";
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
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const deleted = await deleteBlogPost(id);
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const actor = session.user.name || session.user.email || "Admin";
    await recordAdminActivity({
      type: "post_deleted",
      description: `Deleted article ${id}`,
      targetId: id,
      actor,
    });

    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete post";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
