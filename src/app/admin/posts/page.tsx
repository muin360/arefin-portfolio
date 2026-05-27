import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { sanityFetch } from "@/sanity/fetch";
import { groq } from "next-sanity";
import { FileText, ExternalLink, Calendar } from "lucide-react";

export const metadata = {
  title: "Posts",
  description: "Manage your blog posts",
};

const postsQuery = groq`*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  "coverImage": coverImage.asset->url,
}`;

export default async function PostsPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const posts = ((await sanityFetch({ query: postsQuery, tags: ["post"] })) || []) as any[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNav user={session.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Posts</h1>
                <p className="text-slate-400">
                  {posts.length} post{posts.length !== 1 ? "s" : ""} — edit in Sanity Studio
                </p>
              </div>
              <a
                href="/studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Sanity Studio
              </a>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-xl">
              {posts.length > 0 ? (
                <div className="divide-y divide-slate-700/30">
                  {posts.map((post: any) => (
                    <div
                      key={post._id}
                      className="flex items-center justify-between p-6 hover:bg-slate-700/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{post.title}</h3>
                          {post.excerpt && (
                            <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">
                              {post.excerpt}
                            </p>
                          )}
                          {post.publishedAt && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {post.slug?.current && (
                          <a
                            href={`/blog/${post.slug.current}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View post"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No posts yet</h3>
                  <p className="text-slate-500 mb-6">Create your first blog post in Sanity Studio.</p>
                  <a
                    href="/studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Sanity Studio
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
