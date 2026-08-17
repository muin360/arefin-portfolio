"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  Copy,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/db/types";

interface Props {
  initialPosts: BlogPost[];
}

const CATEGORIES = ["Notes", "AI Automation", "AI Agents", "Architecture", "Engineering", "Tutorials"];

export default function PostsManager({ initialPosts }: Props) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [posts, search, categoryFilter]);

  const handleOpenNew = () => {
    setIsNew(true);
    setPreviewMode(false);
    setEditingPost({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "AI Automation",
      tags: ["AI", "Automation", "n8n"],
      readingTime: "4 min read",
      date: new Date().toISOString().split("T")[0],
      published: true,
      featured: false,
      seoTitle: "",
      seoDescription: "",
    });
  };

  const handleOpenEdit = (post: BlogPost) => {
    setIsNew(false);
    setPreviewMode(false);
    setEditingPost({ ...post });
  };

  const handleDuplicate = (post: BlogPost) => {
    setIsNew(true);
    setPreviewMode(false);
    setEditingPost({
      ...post,
      id: undefined,
      title: `${post.title} (Draft Copy)`,
      slug: `${post.slug}-copy`,
      published: false,
      featured: false,
      date: new Date().toISOString().split("T")[0],
    });
    showToast("Article duplicated as draft");
  };

  const generateSlug = () => {
    if (!editingPost?.title) return;
    const slug = editingPost.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setEditingPost((prev) => (prev ? { ...prev, slug } : null));
  };

  // Auto calculate reading time based on word count
  const calculateReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const handleContentChange = (content: string) => {
    const readingTime = calculateReadingTime(content);
    setEditingPost((prev) => (prev ? { ...prev, content, readingTime } : null));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug) {
      showToast("Title and Slug are required.");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingPost),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create post");
        setPosts((prev) => [data.post, ...prev]);
        setEditingPost(null);
        showToast("Article published successfully!");
      } else {
        const res = await fetch("/api/admin/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingPost),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update post");
        setPosts((prev) => prev.map((p) => (p.id === data.post.id ? data.post : p)));
        setEditingPost(null);
        showToast("Article updated successfully!");
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Error saving article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
        showToast("Article deleted permanently");
      }
    } catch {
      showToast("Failed to delete article");
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !post.published } : p)));
        showToast(post.published ? "Article unpublished" : "Article published live");
      }
    } catch {
      showToast("Failed to toggle publish status");
    }
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161d2d] border border-violet-500/40 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toast}
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0f111a] p-6 rounded-3xl border border-[#1e2433] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
              EDITORIAL CONTROL
            </span>
            <span className="text-[#4b5563]">·</span>
            <span className="text-xs text-[#6b7280] font-mono">{posts.length} Journal Entries</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Blog &amp; Technical Notes
          </h1>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            Share technical notes, prompt engineering discoveries, and automation architectures
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-violet-600/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Write Article
        </button>
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f111a] p-4 rounded-2xl border border-[#1e2433]">
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title, tag, category..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-xs text-[#9ca3af] focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── POSTS TABLE ── */}
      <div className="bg-[#0f111a] border border-[#1e2433] rounded-2xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#6b7280] font-mono">
            No journal articles found matching the search.
          </div>
        ) : (
          <div className="divide-y divide-[#1e2433]/60">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#141a29]/40 transition-colors group"
              >
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm truncate group-hover:text-violet-300 transition-colors">
                      {p.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#161d2d] text-[#9ca3af] border border-[#252f44]">
                      {p.category}
                    </span>
                    {p.published ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1e2433] text-[#6b7280]">
                        Draft
                      </span>
                    )}
                    {p.featured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" /> Featured
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#9ca3af] line-clamp-1">{p.excerpt}</p>

                  <div className="flex items-center gap-3 text-[11px] text-[#6b7280] font-mono">
                    <span>{p.date}</span>
                    <span>·</span>
                    <span>{p.readingTime}</span>
                    <span>·</span>
                    <span className="truncate">tags: {p.tags.join(", ")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(p)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      p.published
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-[#161d2d] border-[#252f44] text-[#6b7280] hover:text-white"
                    }`}
                    title={p.published ? "Unpublish Article" : "Publish Article"}
                  >
                    {p.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="p-1.5 text-[#6b7280] hover:text-white hover:bg-[#1e2433] rounded-lg transition-colors"
                    title="View Public Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(p)}
                    className="p-1.5 text-[#6b7280] hover:text-white hover:bg-[#1e2433] rounded-lg transition-colors"
                    title="Duplicate Article"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 text-violet-400 hover:text-white hover:bg-violet-600 rounded-lg transition-colors"
                    title="Edit Article"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {deleteConfirmId === p.id ? (
                    <div className="flex items-center gap-1 ml-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-mono text-[10px]"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 bg-[#1e2433] text-[#9ca3af] rounded font-mono text-[10px]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 text-[#6b7280] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ARTICLE EDITOR MODAL ── */}
      {editingPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-[#0f111a] border border-[#1e2433] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1a202c] bg-[#111827]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-semibold">
                  {isNew ? "Write Article" : "Edit Article"}
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {editingPost.title || "Untitled Article"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    previewMode ? "bg-violet-600 text-white" : "bg-[#141a29] text-[#9ca3af] hover:text-white"
                  }`}
                >
                  {previewMode ? "Edit Mode" : "Preview Markdown"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="p-2 text-[#6b7280] hover:text-white bg-[#1a202c] hover:bg-[#252f44] rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[68vh] space-y-4 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    placeholder="e.g. Building Resilient AI Agents with Structured Tools"
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-mono uppercase text-[#9ca3af] font-semibold">
                      Slug URL *
                    </label>
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="text-[10px] text-violet-400 hover:text-violet-300 font-mono"
                    >
                      Auto Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingPost.slug || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    placeholder="building-resilient-ai-agents"
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    Category
                  </label>
                  <select
                    value={editingPost.category || CATEGORIES[0]}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={editingPost.date || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                    Reading Time
                  </label>
                  <input
                    type="text"
                    value={editingPost.readingTime || "5 min read"}
                    onChange={(e) => setEditingPost({ ...editingPost, readingTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Excerpt (Summary)
                </label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Key summary for search engines and article feed..."
                  className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500 leading-relaxed"
                />
              </div>

              {/* Content / Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase text-[#9ca3af] font-semibold">
                    Article Body (Markdown)
                  </label>
                  <span className="text-[10px] font-mono text-[#6b7280]">
                    {editingPost.content?.split(/\s+/).filter(Boolean).length || 0} words · {editingPost.readingTime || "1 min read"}
                  </span>
                </div>

                {/* Markdown Formatting Quick Toolbar */}
                {!previewMode && (
                  <div className="flex items-center gap-1.5 p-1.5 bg-[#141a29] border border-[#1e2433] rounded-t-xl overflow-x-auto text-[11px] font-mono text-[#9ca3af]">
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + "\n## ")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded transition-colors"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + "\n### ")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded transition-colors"
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + " **bold** ")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded font-bold transition-colors"
                      title="Bold Text"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + " *italic* ")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded italic transition-colors"
                      title="Italic Text"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + " `code` ")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded transition-colors"
                      title="Inline Code"
                    >
                      &lt;/&gt;
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + "\n```json\n{\n  \n}\n```\n")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded transition-colors"
                      title="Code Block"
                    >
                      Code Block
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + "\n> Quote\n")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded transition-colors"
                      title="Blockquote"
                    >
                      Quote
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + "\n- List item\n")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded transition-colors"
                      title="Bullet List"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContentChange((editingPost.content || "") + " [Link Title](https://example.com) ")}
                      className="px-2 py-1 hover:text-white hover:bg-[#1e2433] rounded transition-colors"
                      title="Link"
                    >
                      Link
                    </button>
                  </div>
                )}

                {previewMode ? (
                  <div className="w-full p-4 bg-[#141a29] border border-[#1e2433] rounded-xl text-slate-200 text-sm prose prose-invert max-w-none min-h-[260px] whitespace-pre-wrap">
                    {editingPost.content || "(No content written yet)"}
                  </div>
                ) : (
                  <textarea
                    rows={12}
                    value={editingPost.content || ""}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="## Introduction&#10;&#10;Write your deep dive in standard Markdown..."
                    className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-b-xl border-t-0 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-violet-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#9ca3af] mb-1 font-semibold">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={(editingPost.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="AI, Automation, LLMs, Agents"
                  className="w-full px-3.5 py-2.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* SEO & Publishing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1a202c]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono uppercase text-[#9ca3af] font-semibold">
                      SEO Title Override
                    </label>
                    <span className="text-[10px] font-mono text-[#6b7280]">
                      {editingPost.seoTitle?.length || 0}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingPost.seoTitle || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-mono uppercase text-[#9ca3af] font-semibold">
                      SEO Meta Description
                    </label>
                    <span className="text-[10px] font-mono text-[#6b7280]">
                      {editingPost.seoDescription?.length || 0}/160
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editingPost.seoDescription || ""}
                    onChange={(e) => setEditingPost({ ...editingPost, seoDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-[#141a29] border border-[#1e2433] rounded-xl text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-[#1a202c]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPost.published ?? true}
                    onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                  <span className="text-xs text-white font-medium">Published Live</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPost.featured ?? false}
                    onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                    className="w-4 h-4 accent-violet-600 rounded"
                  />
                  <span className="text-xs text-white font-medium">Featured Article</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1a202c]">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 text-xs text-[#9ca3af] hover:text-white bg-[#141a29] rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-600/20 disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Publish Article" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
