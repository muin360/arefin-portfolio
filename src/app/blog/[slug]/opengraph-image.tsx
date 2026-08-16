import { ImageResponse } from "next/og";
import { sanityFetch } from "@/sanity/fetch";
import { postBySlugQuery, postSlugsQuery } from "@/sanity/queries";
import type { PostDetail } from "@/sanity/types";

// Per-post OG images, auto-generated at build time and cached.
// 1200×630 is the standard for Twitter/X large card and Open Graph.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Arefin Mueen — Journal & Build Notes";

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: postSlugsQuery,
    tags: ["post"],
  });
  return (slugs ?? []).map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<PostDetail | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
  });

  const title = post?.title ?? "Arefin Mueen";
  const category = post?.category ?? "Journal";
  const date = post?.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(at 20% 20%, #2a1054 0%, transparent 50%), radial-gradient(at 80% 80%, #4c1d95 0%, transparent 50%), #0a0a14",
          padding: 80,
          color: "white",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              padding: "6px 18px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              fontSize: 18,
            }}
          >
            {category}
          </span>
          {date ? <span>{date}</span> : null}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 60 ? 64 : 84,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: 0,
              maxWidth: 1040,
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.15)",
            fontSize: 22,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.85)" }}>Arefin Mueen</span>
          <span style={{ color: "rgba(255,255,255,0.45)" }}>tensorix.me</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
