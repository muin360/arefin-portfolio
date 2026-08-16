import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBlogPosts } from "@/lib/db";
import PostsManager from "@/components/admin/PostsManager";

export const metadata = {
  title: "Manage Journal · Admin",
};

export default async function AdminPostsPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const posts = await getBlogPosts({ publishedOnly: false });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Journal &amp; Build Notes</h1>
        <p className="text-sm text-slate-400 mt-1">
          Write and manage technical articles, personal build logs, and toolchain opinions.
        </p>
      </div>

      <PostsManager initialPosts={posts} />
    </div>
  );
}
