"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/db/types";

interface JournalGridProps {
  posts?: BlogPost[];
  limit?: number;
}

export default function JournalGridV2({
  posts: propPosts,
  limit = 3,
}: JournalGridProps) {
  const items = propPosts && propPosts.length > 0 ? propPosts.slice(0, limit) : [];
  if (items.length === 0) return null;

  return (
    <div className="w-full divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {items.map((post, idx) => (
        <article
          key={post.slug || post.id}
          className="group py-6 sm:py-8 transition-colors hover:bg-white/[0.02]"
        >
          <Link
            href={`/blog/${post.slug}`}
            className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 sm:gap-6"
          >
            {/* Left: Metadata + Category */}
            <div className="flex items-center gap-3 md:w-64 shrink-0 font-mono text-xs text-white/40">
              <span className="text-[10px] font-bold text-violet-400/90 tracking-wider">
                0{idx + 1}
              </span>
              <span>·</span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/70 uppercase">
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

            {/* Middle: Title & Summary */}
            <div className="flex-1 space-y-1.5">
              <h3 className="text-base sm:text-xl font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-xs sm:text-sm text-white/60 line-clamp-2 leading-relaxed font-sans">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Right: Reading time + Arrow */}
            <div className="flex items-center gap-3 shrink-0 font-mono text-xs text-white/40 group-hover:text-violet-300 transition-colors self-end md:self-auto">
              <span className="text-[11px]">{post.readingTime || "4 min read"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-violet-400" />
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
