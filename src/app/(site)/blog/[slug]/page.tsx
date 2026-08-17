import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getBlogPostBySlug, getProjects, getServices } from "@/lib/db";
import { SITE_URL } from "@/lib/site-url";
import ReadingProgress from "@/components/ReadingProgress";
import MarkdownContent from "@/components/MarkdownContent";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import { ArrowRight, Workflow, Brain } from "lucide-react";

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
    title: `${metaTitle} — Arefin Mueen`,
    description: metaDesc,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: `${metaTitle} — Arefin Mueen`,
      description: metaDesc,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
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

  const [allPosts, allProjects, allServices] = await Promise.all([
    getBlogPosts({ publishedOnly: true }),
    getProjects({ publishedOnly: true }),
    getServices({ publishedOnly: true }),
  ]);

  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const relatedProject = allProjects.find((p) =>
    post.relatedProjectIds?.includes(p.id) ||
    p.category.toLowerCase().includes((post.category || "").toLowerCase())
  );

  const relatedService = allServices.find((s) =>
    post.relatedServiceIds?.includes(s.id) ||
    s.title.toLowerCase().includes((post.category || "").toLowerCase())
  );

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
    <article className="min-h-screen pt-12 pb-24">
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Back Navigation Plate */}
        <SectionPlate
          index="BUILD NOTE"
          title={post.category?.toUpperCase() || "ENGINEERING"}
          meta={post.readingTime || "4 min read"}
          action={
            <Link
              href="/blog"
              className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
            >
              <span>← All Notes</span>
            </Link>
          }
        />

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/50">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>By Arefin Mueen</span>
            <span>·</span>
            <span className="text-violet-300">{post.category}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans border-l-2 border-violet-500/40 pl-4">
              {post.excerpt}
            </p>
          )}

          {post.coverImage && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0c0f18]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}
        </header>

        {/* Article Body */}
        <div className="prose prose-invert prose-violet max-w-none font-sans text-white/80 leading-relaxed text-sm sm:text-base">
          <MarkdownContent content={post.content} />
        </div>

        {/* ─── CONNECTED CONTEXTUAL LINKS (PROJECT & SERVICE) ─────────────── */}
        {(relatedProject || relatedService) && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-semibold block">
              Connected Architecture
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              {relatedProject && (
                <Link
                  href={`/projects/${relatedProject.slug}`}
                  className="p-4 rounded-xl bg-[#121622] hover:bg-[#181e2e] border border-white/5 flex flex-col justify-between space-y-2 group transition-colors"
                >
                  <div className="flex items-center gap-2 text-violet-300">
                    <Workflow className="w-4 h-4" />
                    <span className="font-bold">Live Case Study</span>
                  </div>
                  <p className="text-white font-sans text-xs font-semibold line-clamp-1">
                    {relatedProject.title}
                  </p>
                  <span className="text-[10px] text-white/40 group-hover:text-white flex items-center gap-1 transition-colors">
                    <span>View implementation</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              )}

              {relatedService && (
                <Link
                  href="/services"
                  className="p-4 rounded-xl bg-[#121622] hover:bg-[#181e2e] border border-white/5 flex flex-col justify-between space-y-2 group transition-colors"
                >
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Brain className="w-4 h-4" />
                    <span className="font-bold">Capability Blueprint</span>
                  </div>
                  <p className="text-white font-sans text-xs font-semibold line-clamp-1">
                    {relatedService.title}
                  </p>
                  <span className="text-[10px] text-white/40 group-hover:text-white flex items-center gap-1 transition-colors">
                    <span>Explore service</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ─── RELATED NOTES ──────────────────────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-white/[0.08] space-y-4">
            <SectionPlate
              index="NEXT"
              title="MORE BUILD NOTES"
              meta="related engineering reflections"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="p-5 rounded-2xl bg-[#0c0f18] hover:bg-[#121622] border border-white/[0.08] group transition-colors space-y-2 block"
                >
                  <span className="text-[10px] font-mono uppercase text-violet-400 font-semibold">
                    {p.category}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-200 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-white/50 line-clamp-2 font-sans">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ─── CONTEXTUAL CTA ──────────────────────────────────────────────── */}
        <div className="pt-8">
          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Have a workflow worth{" "}
              <span className="serif italic text-violet-300">automating?</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto font-sans">
              Let&rsquo;s discuss your manual bottleneck and engineer an autonomous AI agent or workflow pipeline.
            </p>
            <div className="pt-2 flex justify-center">
              <Button href="/contact" variant="primary" size="md">
                Let&rsquo;s Build an Automation →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
