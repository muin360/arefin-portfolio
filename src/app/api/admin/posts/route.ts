import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/db";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete post";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
