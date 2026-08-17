"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";
import { ArrowRight, BookOpen, Search } from "lucide-react";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  const { categories, displayedPosts, featuredPost } = useMemo(() => {
    const catMap = new Map<string, number>();
    posts.forEach((p) => {
      if (p.category) {
        catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
      }
    });

    const categoryList = Array.from(catMap.entries()).map(([cat, count]) => ({
      id: cat.toLowerCase().replace(/\s+/g, "-"),
      label: cat,
      count,
      originalCat: cat,
    }));

    let list = posts;

    if (filter !== "all") {
      const match = categoryList.find((c) => c.id === filter);
      if (match) {
        list = list.filter((p) => p.category === match.originalCat);
      }
    }

    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.excerpt.toLowerCase().includes(needle) ||
          (p.category && p.category.toLowerCase().includes(needle))
      );
    }

    const featured = list.find((p) => p.featured) || list[0];
    const rest = list.filter((p) => p.slug !== featured?.slug);

    return {
      categories: categoryList,
      displayedPosts: rest,
      featuredPost: featured,
    };
  }, [posts, filter, q]);

  const tabs = [
    { id: "all", label: "All Notes", count: posts.length },
    ...categories.map((c) => ({ id: c.id, label: c.label, count: c.count })),
  ];

  if (posts.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#0c0f18] border border-white/[0.08] text-white/50 font-mono text-xs">
        No journal notes published yet.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ─── JOURNAL CONTROLLER PLATE ───────────────────────────────────── */}
      <SectionPlate
        index="05"
        title="ALL ENTRIES"
        tabs={tabs}
        activeTab={filter}
        onTabChange={setFilter}
        action={
          <div className="relative w-48 sm:w-64">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#121622] border border-white/10 text-white text-xs font-mono placeholder-white/30 focus:outline-none focus:border-violet-400"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        }
      />

      {/* ─── FEATURED HERO NOTE ──────────────────────────────────────────── */}
      {featuredPost && (
        <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 p-6 sm:p-10 transition-all group overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {featuredPost.coverImage && (
              <div className="lg:col-span-5 relative w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-white/10 bg-[#060810] shrink-0">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            )}

            <div className={`${featuredPost.coverImage ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
              <div className="flex items-center gap-2.5 font-mono text-xs text-white/50">
                <span className="px-2 py-0.5 rounded bg-violet-600/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold uppercase">
                  Featured Note
                </span>
                <span>·</span>
                <span className="uppercase text-[10px] text-white/60">
                  {featuredPost.category}
                </span>
                <span>·</span>
                <time dateTime={featuredPost.date} className="text-[10px]">
                  {featuredPost.date
                    ? new Date(featuredPost.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Latest"}
                </time>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight group-hover:text-violet-200 transition-colors">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                <span className="text-white/40">{featuredPost.readingTime || "4 min read"}</span>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-white transition-colors group/link"
                >
                  <span>Read full note</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform text-violet-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── QUIET EDITORIAL ARTICLE LIST ────────────────────────────────── */}
      {displayedPosts.length > 0 && (
        <div className="w-full divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {displayedPosts.map((post, idx) => (
            <article
              key={post.slug || post.id}
              className="group py-6 sm:py-7 transition-colors hover:bg-white/[0.02]"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 sm:gap-6"
              >
                {/* Left: Index + Category + Date */}
                <div className="flex items-center gap-2.5 md:w-56 shrink-0 font-mono text-xs text-white/40">
                  <span className="font-bold text-violet-400">
                    {(idx + 2).toString().padStart(2, "0")}
                  </span>
                  <span>·</span>
                  <span className="text-white/60 uppercase text-[10px]">
                    {post.category}
                  </span>
                  <span>·</span>
                  <span className="text-[10px]">
                    {post.date
                      ? new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Latest"}
                  </span>
                </div>

                {/* Middle: Title & Excerpt */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed font-sans">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                {/* Right: Reading time + Arrow */}
                <div className="flex items-center gap-2.5 shrink-0 font-mono text-xs text-white/40 group-hover:text-violet-300 transition-colors self-end md:self-auto">
                  <span className="text-[11px]">{post.readingTime || "3 min read"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-violet-400" />
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
