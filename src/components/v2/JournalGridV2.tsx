"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";

interface JournalGridProps {
  posts?: BlogPost[];
  limit?: number;
}

export default function JournalGridV2({
  posts = [],
  limit = 3,
}: JournalGridProps) {
  const [filter, setFilter] = useState("all");

  // Dynamically calculate categories from actual MongoDB posts
  const { categories, filteredPosts } = useMemo(() => {
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

    let filtered = posts;
    if (filter !== "all") {
      const match = categoryList.find((c) => c.id === filter);
      if (match) {
        filtered = posts.filter((p) => p.category === match.originalCat);
      }
    }

    return {
      categories: categoryList,
      filteredPosts: filtered.slice(0, limit),
    };
  }, [posts, filter, limit]);

  const tabs = [
    { id: "all", label: "All", count: posts.length },
    ...categories.map((c) => ({ id: c.id, label: c.label, count: c.count })),
  ];

  if (posts.length === 0) return null;

  return (
    <div className="w-full space-y-6">
      {/* ─── FUNCTIONAL JOURNAL PLATE ──────────────────────────────────── */}
      <SectionPlate
        index="06"
        title="JOURNAL"
        tabs={tabs}
        activeTab={filter}
        onTabChange={setFilter}
        action={
          <Link
            href="/blog"
            className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
          >
            <span>All entries ({posts.length})</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        }
      />

      {/* ─── QUIET EDITORIAL ARTICLE LIST ────────────────────────────────── */}
      <div className="w-full divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {filteredPosts.map((post, idx) => (
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
                  0{idx + 1}
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
                <span className="text-[11px]">{post.readingTime || "4 min read"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-violet-400" />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
