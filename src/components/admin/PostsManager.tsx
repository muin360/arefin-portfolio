"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, ExternalLink, Check, Eye, EyeOff, Star } from "lucide-react";
import type { BlogPost } from "@/lib/db/types";

interface Props {
  initialPosts: BlogPost[];
}

export default function PostsManager({ initialPosts }: Props) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  const handleOpenNew = () => {
    setIsNew(true);
    setError(null);
    setSuccess(null);
    setEditingPost({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Notes",
      tags: ["AI", "Automation"],
      readingTime: "5 min read",
      date: new Date().toISOString().split("T")[0],
      published: true,
      featured: false,
      seoTitle: "",
      seoDescription: "",
    });
  };

  const handleOpenEdit = (post: BlogPost) => {
    setIsNew(false);
    setError(null);
    setSuccess(null);
    setEditingPost({ ...post });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug) {
      setError("Title and Slug are required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const url = "/api/admin/posts";
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPost),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post");

      if (isNew) {
        setPosts((prev) => [data.post, ...prev]);
      } else {
        setPosts((prev) =>
          prev.map((p) => (p.id === data.post.id ? data.post : p)),
        );
      }

      setSuccess("Post saved successfully!");
      setTimeout(() => {
        setEditingPost(null);
        setSuccess(null);
      }, 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting post");
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const updated = { ...post, published: !post.published };
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search journal entries by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500 flex-1 max-w-md"
        />
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Write Post
        </button>
      </div>

      {/* Posts List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/60">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No journal entries found matching your search.
            </div>
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-base">
                      {p.title}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {p.category}
                    </span>
                    {p.published ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        Draft
                      </span>
                    )}
                    {p.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-300" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{p.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>{p.date}</span>
                    <span>·</span>
                    <span>{p.readingTime}</span>
                    <span>·</span>
                    <span>tags: {p.tags.join(", ")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleTogglePublished(p)}
                    title={p.published ? "Unpublish" : "Publish"}
                    className={`p-2 rounded-lg border transition-colors ${
                      p.published
                        ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View live post"
                    className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleOpenEdit(p)}
                    title="Edit post"
                    className="p-2 rounded-lg bg-violet-950/40 border border-violet-800/80 text-violet-300 hover:bg-violet-900/60 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    title="Delete post"
                    className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/80 text-rose-400 hover:bg-rose-900/60 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                {isNew ? "Write New Journal Entry" : `Edit: ${editingPost.title}`}
              </h2>
              <button
                onClick={() => setEditingPost(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕ Close
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Post Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = isNew
                        ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
                        : editingPost.slug;
                      setEditingPost((p) => ({ ...p, title, slug }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.slug || ""}
                    onChange={(e) =>
                      setEditingPost((p) => ({ ...p, slug: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingPost.category || "Notes"}
                    onChange={(e) =>
                      setEditingPost((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingPost.date || ""}
                    onChange={(e) =>
                      setEditingPost((p) => ({ ...p, date: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={editingPost.readingTime || "5 min read"}
                    onChange={(e) =>
                      setEditingPost((p) => ({
                        ...p,
                        readingTime: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ""}
                  onChange={(e) =>
                    setEditingPost((p) => ({ ...p, excerpt: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Post Content (Markdown supported)
                </label>
                <textarea
                  rows={12}
                  value={editingPost.content || ""}
                  onChange={(e) =>
                    setEditingPost((p) => ({ ...p, content: e.target.value }))
                  }
                  placeholder="Write your thoughts, technical breakdowns, or code samples in Markdown..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={(editingPost.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditingPost((p) => ({
                      ...p,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    }))
                  }
                  placeholder="AI, Automation, n8n, LangChain"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    SEO Title Override (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingPost.seoTitle || ""}
                    onChange={(e) =>
                      setEditingPost((p) => ({ ...p, seoTitle: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    SEO Description Override (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingPost.seoDescription || ""}
                    onChange={(e) =>
                      setEditingPost((p) => ({ ...p, seoDescription: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPost.published ?? true}
                    onChange={(e) =>
                      setEditingPost((p) => ({
                        ...p,
                        published: e.target.checked,
                      }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0"
                  />
                  Published (Visible on /blog)
                </label>

                <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPost.featured ?? false}
                    onChange={(e) =>
                      setEditingPost((p) => ({
                        ...p,
                        featured: e.target.checked,
                      }))
                    }
                    className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0"
                  />
                  Featured Entry
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Publish Post" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
