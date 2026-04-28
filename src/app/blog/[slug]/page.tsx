import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { posts, getPostBySlug } from "@/data/posts";
import { IconArrow } from "@/components/icons";
import ReadingProgress from "@/components/ReadingProgress";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      authors: ["Arefin Muin"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

function renderMarkdown(md: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const inline = (s: string) =>
    escape(s)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="link-underline text-foreground">$1</a>',
      );

  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closeList();
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      out.push(
        `<h2 class="display text-2xl md:text-3xl mt-12 mb-5 tracking-tight">${inline(
          line.slice(3),
        )}</h2>`,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) {
        out.push('<ul class="my-5 space-y-3 pl-5">');
        inList = true;
      }
      out.push(
        `<li class="text-foreground/85 leading-relaxed list-disc marker:text-muted">${inline(
          line.slice(2),
        )}</li>`,
      );
      continue;
    }
    closeList();
    out.push(
      `<p class="my-5 text-foreground/85 leading-relaxed text-lg">${inline(
        line,
      )}</p>`,
    );
  }
  closeList();
  return out.join("\n");
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const others = sorted.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <ReadingProgress />
      <section className="bg-paper border-b border-line">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-20 pb-14 md:pt-28 md:pb-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            ← All entries
          </Link>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted">
            <span className="chip">{post.category}</span>
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-6 display text-4xl md:text-6xl tracking-tight">
            {post.title}
          </h1>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 sm:px-8 py-14 md:py-20">
        <div dangerouslySetInnerHTML={{ __html: html }} />
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
                  <span className="chip self-start">{p.category}</span>
                  <h3 className="mt-5 text-2xl tracking-tight font-medium leading-snug group-hover:text-accent-1 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-muted leading-relaxed">{p.excerpt}</p>
                  <p className="mt-auto pt-6 text-xs text-muted">
                    {p.readingTime}
                  </p>
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
            Start a project
            <IconArrow width={16} height={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
