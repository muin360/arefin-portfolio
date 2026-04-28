"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PostListItem } from "@/sanity/types";
import Reveal from "@/components/Reveal";
import BentoCard from "@/components/BentoCard";

export default function BlogList({ posts }: { posts: PostListItem[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return posts;
    return posts.filter((p) => {
      const haystack = [
        p.title,
        p.excerpt,
        p.category ?? "",
        ...(p.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [q, posts]);

  return (
    <>
      <div className="mb-10 max-w-md">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
            Search
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try 'n8n', 'agents', 'LLM'…"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-violet-400/60"
          />
        </label>
        {q && (
          <p className="mt-2 text-xs font-mono text-white/40">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"} matching
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-white/65">
          Nothing matches that yet. Try a broader keyword, or{" "}
          <Link href="/contact" className="link-underline text-white">
            tell me what you were looking for
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {filtered.map((post, i) => {
            const featured = !q && i === 0;
            const span = featured ? "md:col-span-12" : "md:col-span-6";
            return (
              <Reveal key={post.slug} delay={i * 70} className={span}>
                <BentoCard className="h-full">
                  <Link href={`/blog/${post.slug}`} className="block h-full group">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                        {(i + 1).toString().padStart(2, "0")} —{" "}
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      {post.category ? (
                        <span className="tag-pill text-[10px]">{post.category}</span>
                      ) : null}
                      {featured && (
                        <span className="tag-pill text-[10px] !border-violet-400/40 text-violet-100">
                          featured
                        </span>
                      )}
                    </div>
                    <h2
                      className={`display tracking-tight text-white transition-colors group-hover:text-[var(--accent-1)] ${
                        featured ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"
                      }`}
                    >
                      {post.title}
                    </h2>
                    <p
                      className={`mt-4 text-white/65 leading-relaxed ${
                        featured ? "max-w-3xl text-base md:text-lg" : "text-sm"
                      }`}
                    >
                      {post.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-white/45">
                      {post.readingTime ? <span>{post.readingTime}</span> : null}
                      {post.tags?.map((t) => (
                        <span key={t}>· {t}</span>
                      ))}
                      <span className="ml-auto inline-flex items-center gap-1.5 text-white/85 group-hover:text-white">
                        <span>Read</span>
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </BentoCard>
              </Reveal>
            );
          })}
        </div>
      )}
    </>
  );
}
