import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/db";
import { SITE_URL } from "@/lib/site-url";
import { IconArrow } from "@/components/icons";
import ReadingProgress from "@/components/ReadingProgress";
import MarkdownContent from "@/components/MarkdownContent";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export async function generateStaticParams() {
  const posts = await getBlogPosts({ publishedOnly: true });
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { publishedOnly: true });
  if (!post) return { title: "Post not found" };

  const metaTitle = post.seoTitle || post.title;
  const metaDesc = post.seoDescription || post.excerpt;

  return {
    title: metaTitle,
    description: metaDesc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${metaTitle} — Arefin Mueen`,
      description: metaDesc,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { publishedOnly: true });
  if (!post) notFound();

  const allPosts = await getBlogPosts({ publishedOnly: true });
  const otherPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: {
      "@type": "Person",
      name: "Arefin Mueen",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Arefin Mueen",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbsJsonLd
        id={post.slug}
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <ReadingProgress />

      <article className="hero-dark relative overflow-hidden border-b border-white/5 pt-32 pb-24">
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />

        <div className="max-w-3xl mx-auto px-6 sm:px-8 relative">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors mb-8"
          >
            ← Back to journal
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/50 mb-6">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
            {post.category && (
              <>
                <span>·</span>
                <span className="tag-pill text-[10px]">{post.category}</span>
              </>
            )}
          </div>

          <h1 className="display text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/70 leading-relaxed font-sans border-l-2 border-violet-500/50 pl-4">
            {post.excerpt}
          </p>

          <div className="mt-12 pt-8 border-t border-white/10">
            <MarkdownContent content={post.content} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-white/60 border border-white/10"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Author Box */}
          <div className="mt-16 p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-white/40">
                Written by
              </p>
              <h3 className="text-lg font-bold text-white mt-1">Arefin Mueen</h3>
              <p className="text-xs text-white/60 mt-0.5">
                AI Automation &amp; AI Agent Developer · Dhaka, Bangladesh
              </p>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/40 text-xs font-mono text-white transition-colors"
            >
              Get in touch →
            </Link>
          </div>
        </div>
      </article>

      {/* More Posts */}
      {otherPosts.length > 0 && (
        <section className="py-20 border-b border-white/5 bg-slate-950">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <h2 className="display text-2xl text-white mb-8">
              More <span className="serif">build notes.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors group block space-y-2"
                >
                  <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                    {p.date} · {p.readingTime}
                  </p>
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-white/60 line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="hero-dark relative overflow-hidden py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="display text-3xl text-white">
            Have thoughts or <span className="serif iridescent">questions?</span>
          </h2>
          <p className="mt-3 text-sm text-white/65">
            Always open to discussing AI automation architectures and practical implementations.
          </p>
          <div className="mt-6">
            <Link href="/contact" className="btn-primary shimmer">
              Send a message
              <IconArrow width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
