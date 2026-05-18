"use client";

import Link from "next/link";
import { posts } from "@/data/posts";
import { useInView } from "@/hooks/useInView";

/**
 * Journal grid (v2).
 *
 * Magazine-style 3-up grid. Each card has a giant translucent
 * watermark number on the upper-right (01 / 02 / 03), a category +
 * date row, a display title, a 3-line excerpt, and a tiny mono CTA at
 * the foot. On hover, a 1px gradient bar lights up the top edge.
 */
export default function JournalGridV2() {
  const items = posts.slice(0, 3);
  return (
    <div className="v2-journal__grid">
      {items.map((p, i) => (
        <Card key={p.slug} post={p} idx={i} />
      ))}
    </div>
  );
}

function Card({
  post,
  idx,
}: {
  post: (typeof posts)[number];
  idx: number;
}) {
  const [ref, inView] = useInView<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      href={`/blog/${post.slug}`}
      className={`v2-journal__card group ${inView ? "is-in" : ""}`}
      style={{ ["--delay" as string]: `${idx * 90}ms` }}
    >
      <span className="v2-journal__watermark" aria-hidden="true">
        {String(idx + 1).padStart(2, "0")}
      </span>

      <div className="v2-journal__meta">
        <span className="v2-journal__category">{post.category}</span>
        <span className="v2-journal__sep" aria-hidden="true">
          ·
        </span>
        <span className="v2-journal__date">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="v2-journal__sep" aria-hidden="true">
          ·
        </span>
        <span className="v2-journal__time">{post.readingTime}</span>
      </div>

      <h3 className="v2-journal__title">{post.title}</h3>
      <p className="v2-journal__excerpt">{post.excerpt}</p>

      <span className="v2-journal__cta">
        Read note
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
