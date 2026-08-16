import { ImageResponse } from "next/og";

// Root Open Graph image generator (audit fix Phase 6.2).
//
// Renders a 1200×630 PNG at request time. The image is fetched by
// Facebook / X / LinkedIn / iMessage / Slack when they unfurl any URL
// on the site. Every page on tensorstudio.vercel.app → home, /about, 
// /services etc. all get this canonical card unless they declare their own.
//
// Uses the Node.js runtime (Next.js default) on purpose — the Edge
// runtime bundles `next/og`'s satori + resvg deps into the function,
// which on Vercel free tier exceeds the 1 MB Edge Function size limit.
// Node.js runtime has no such limit; the cold-start cost is acceptable
// for an OG endpoint that's hit by social crawlers, not end users.
//
// The static `/og.png` is still referenced by `app/layout.tsx`'s
// `metadata.openGraph.images` as a safety net for any client that
// doesn't follow the Next.js convention path; this file is the
// preferred, dynamically-generated source.

export const alt = "Arefin Mueen — AI Automation & AI Agent Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #04040a 0%, #07070f 55%, #0c0c18 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          color: "#f0f0f8",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        {/* top — brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#7b8fff",
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        >
          <span style={{ fontSize: 26 }}>◈</span>
          <span>AREFIN MUEEN</span>
        </div>

        {/* middle — headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 880,
            }}
          >
            AI systems that turn repetitive work into reliable workflows.
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              lineHeight: 1.35,
              color: "rgba(240, 240, 248, 0.6)",
              maxWidth: 820,
            }}
          >
            AI Automation &amp; AI Agent Developer · Dhaka → Global. AI agents,
            n8n workflows, LangChain, RAG systems, and API integrations.
          </div>
        </div>

        {/* bottom — meta strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "rgba(240, 240, 248, 0.55)",
            fontSize: 18,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#10d9a0",
                boxShadow: "0 0 14px rgba(16, 217, 160, 0.7)",
                display: "block",
              }}
            />
            <span>Open to AI automation projects</span>
          </div>
          <div>tensorstudio.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
