import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/data/posts";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Journal — Arefin Muin",
  description:
    "Notes on AI automation, agents and the engineering side of LLMs by Arefin Muin.",
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        index="06"
        meta={`${sorted.length} entries · Updated April 2025`}
        title={
          <>
            Notes on shipping{" "}
            <span className="serif">AI in production.</span>
          </>
        }
        subtitle="Lessons from real client work, opinions on the toolchain, and what I'm learning as I go deeper into LLM engineering."
      />

      <section className="max-w-5xl mx-auto px-6 sm:px-8 section">
        <ul className="divide-y divide-line border-y border-line">
          {sorted.map((post, i) => (
            <Reveal key={post.slug} as="li" delay={i * 80}>
              <Link
                href={`/blog/${post.slug}.html`}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 py-12 group hover:bg-paper-deep/30 transition-colors"
              >
                <div className="md:col-span-3 flex flex-col gap-2">
                  <span className="num text-sm text-muted">
                    {(i + 1).toString().padStart(2, "0")} —{" "}
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="chip self-start">{post.category}</span>
                </div>
                <div className="md:col-span-9">
                  <h2 className="display text-2xl md:text-4xl tracking-tight transition-colors group-hover:text-[var(--accent-1)]">
                    {post.title}
                  </h2>
                  <p className="mt-4 text-muted leading-relaxed max-w-2xl">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs mono text-muted">
                    <span>{post.readingTime}</span>
                    {post.tags.map((t) => (
                      <span key={t}>· {t}</span>
                    ))}
                    <span className="ml-auto hover-arrow text-foreground">
                      <span>Read</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
