import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/data/posts";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import BentoCard from "@/components/BentoCard";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Notes from Tensor Studio on AI automation, agents and the engineering side of LLMs — lessons from real client work, opinions on the toolchain, and what I'm learning in production.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Journal — Tensor Studio",
    description:
      "Notes from Tensor Studio on AI automation, agents and the engineering side of LLMs.",
    url: "/blog",
  },
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

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 section relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {sorted.map((post, i) => {
              const featured = i === 0;
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
                        <span className="tag-pill text-[10px]">{post.category}</span>
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
                        <span>{post.readingTime}</span>
                        {post.tags.map((t) => (
                          <span key={t}>· {t}</span>
                        ))}
                        <span className="ml-auto inline-flex items-center gap-1.5 text-white/85 group-hover:text-white">
                          <span>Read</span>
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  </BentoCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
