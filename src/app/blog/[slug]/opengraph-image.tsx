import { ImageResponse } from "next/og";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/db";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Arefin Mueen — Journal & Build Notes";

export async function generateStaticParams() {
  const posts = await getBlogPosts({ publishedOnly: true });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { publishedOnly: true });

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
            justifyContent: "space-between",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#a78bfa",
            }}
          >
            AREFIN MUEEN
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 18,
              color: "#94a3b8",
            }}
          >
            <span>{category}</span>
            {date && <span>· {date}</span>}
          </div>
        </div>

        <div
          style={{
            fontSize: title.length > 50 ? 56 : 68,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
            marginBottom: "auto",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 32,
            fontSize: 20,
            color: "#94a3b8",
          }}
        >
          <span>AI Automation &amp; AI Agent Developer</span>
          <span style={{ color: "#a78bfa" }}>tensorstudio.vercel.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
