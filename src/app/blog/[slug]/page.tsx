import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { sanityFetch } from "@/sanity/fetch";
import {
  allPostsQuery,
  postBySlugQuery,
  postSlugsQuery,
} from "@/sanity/queries";
import type { PostDetail, PostListItem } from "@/sanity/types";
import { urlFor } from "@/sanity/image";
import { SITE_URL } from "@/lib/site-url";
import { IconArrow } from "@/components/icons";
import ReadingProgress from "@/components/ReadingProgress";
import { PortableText } from "@/components/PortableText";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

import { FALLBACK_POSTS } from "@/data/fallbacks";
import { getPostBySlug, posts as staticPosts } from "@/data/posts";
import type { PortableTextBlock } from "@portabletext/types";

// Slug validation regex — prevent directory traversal and invalid formats
const VALID_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,100}$/i;

function validateSlug(slug: string): boolean {
  return VALID_SLUG_PATTERN.test(slug);
}

function markdownToPortableText(content: string): PortableTextBlock[] {
  const paragraphs = content.split("\n\n").map((s) => s.trim()).filter(Boolean);
  return paragraphs.map((p, i) => {
    if (p.startsWith("## ")) {
      return {
        _key: `h2-${i}`,
        _type: "block",
        style: "h2",
        children: [{ _key: `span-${i}`, _type: "span", text: p.replace(/^## /, "") }],
      };
    }
    return {
      _key: `p-${i}`,
      _type: "block",
      style: "normal",
      children: [{ _key: `span-${i}`, _type: "span", text: p }],
    };
  }) as PortableTextBlock[];
}

// Pre-render every post at build time, then revalidate on webhook.
export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: postSlugsQuery,
    tags: ["post"],
  });
  const live = slugs ?? [];
  const fallback = staticPosts.map((p) => p.slug);
  const all = Array.from(new Set([...live, ...fallback]));
  return all.map((slug) => ({ slug }));
}

async function getPost(slug: string): Promise<PostDetail | null> {
  // Validate slug format before querying to prevent injection attacks
  if (!validateSlug(slug)) {
    return null;
  }

  const live = await sanityFetch<PostDetail | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
  });
  if (live) return live;

  // Fallback to in-repo post data
  const staticPost = getPostBySlug(slug);
  if (staticPost) {
    return {
      _id: `post.${staticPost.slug}`,
      title: staticPost.title,
      slug: staticPost.slug,
      excerpt: staticPost.excerpt,
      date: staticPost.date,
      readingTime: staticPost.readingTime,
      category: staticPost.category,
      tags: staticPost.tags,
      coverImage: null,
      body: markdownToPortableText(staticPost.content),
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Validate slug format
  if (!validateSlug(slug)) {
    return { title: "Post not found" };
  }

  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };

  const ogImage = post.coverImage?.url
    ? urlFor(post.coverImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      authors: ["Arefin Mueen"],
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Validate slug format
  if (!validateSlug(slug)) {
    notFound();
  }

  const [post, rawPosts] = await Promise.all([
    getPost(slug),
    sanityFetch<PostListItem[]>({ query: allPostsQuery, tags: ["post"] }),
  ]);
  if (!post) notFound();

  const allPosts = rawPosts && rawPosts.length > 0 ? rawPosts : FALLBACK_POSTS;
  const others = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  // Article schema for Google rich results.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: "Arefin Mueen", url: SITE_URL },
    publisher: {
      "@type": "Person",
      name: "Arefin Mueen",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    keywords: post.tags?.join(", "),
    image: post.coverImage?.url
      ? [urlFor(post.coverImage).width(1200).height(630).fit("crop").url()]
      : undefined,
  };

  return (
    <>
      <ReadingProgress />

      <Script id={`article-jsonld-${post.slug}`} type="application/ld+json">
        {JSON.stringify(articleJsonLd)}
      </Script>

      <BreadcrumbsJsonLd
        id={`post-${post.slug}`}
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <section className="bg-paper border-b border-line">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-20 pb-14 md:pt-28 md:pb-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            ← All entries
          </Link>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted">
            {post.category ? <span className="chip">{post.category}</span> : null}
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {post.readingTime ? (
              <>
                <span>·</span>
                <span>{post.readingTime}</span>
              </>
            ) : null}
          </div>
          <h1 className="mt-6 display text-4xl md:text-6xl tracking-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {post.coverImage?.url ? (
        <div className="border-b border-line bg-paper">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 -mt-2 pb-10">
            <Image
              src={urlFor(post.coverImage).width(2000).url()}
              alt={post.coverImage.alt ?? post.title}
              width={post.coverImage.dimensions?.width ?? 2000}
              height={post.coverImage.dimensions?.height ?? 1125}
              priority
              placeholder={post.coverImage.lqip ? "blur" : undefined}
              blurDataURL={post.coverImage.lqip}
              className="rounded-2xl border border-line w-full h-auto"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      ) : null}

      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-14 md:py-20 prose-styling">
        <PortableText value={post.body} />
      </article>

      {others.length > 0 && (
        <section className="border-t border-line">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 section">
            <p className="eyebrow mb-8">Continue reading</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="bg-surface p-8 group flex flex-col"
                >
                  {p.category ? (
                    <span className="chip self-start">{p.category}</span>
                  ) : null}
                  <h3 className="mt-5 text-2xl tracking-tight font-medium leading-snug group-hover:text-accent-1 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-muted leading-relaxed">{p.excerpt}</p>
                  {p.readingTime ? (
                    <p className="mt-auto pt-6 text-xs text-muted">{p.readingTime}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 sm:px-8 pb-24 pt-12">
        <div className="rounded-3xl border border-line bg-paper p-10 md:p-14 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-5">Working together</p>
            <h2 className="display text-3xl md:text-4xl max-w-xl">
              Have a workflow you&apos;d like to make{" "}
              <span className="serif text-[1.04em]">disappear?</span>
            </h2>
          </div>
          <Link href="/contact" className="btn-primary">
            Book a free systems audit
            <IconArrow width={16} height={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
