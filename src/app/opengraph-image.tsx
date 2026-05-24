import { ImageResponse } from "next/og";

// Root Open Graph image generator (audit fix Phase 6.2).
//
// Renders a 1200×630 PNG at request time using the Edge runtime. The
// image is fetched by Facebook / X / LinkedIn / iMessage / Slack when
// they unfurl any URL on the site that doesn't override `openGraph`,
// which means tensorix.ai → home, /about, /services etc. all get this
// canonical card unless they declare their own.
//
// The static `/og.png` is still referenced by `app/layout.tsx`'s
// `metadata.openGraph.images` as a safety net for any client that
// doesn't follow the Next.js convention path; this file is the
// preferred, dynamically-generated source.

export const runtime = "edge";
export const alt = "Tensorix — AI Automation & Agent Engineering Studio";
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
          <span>TENSORIX</span>
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
            Founder-led AI engineering studio · Dhaka → Global. Agents,
            workflow automation, integrations and conversion web systems.
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
            <span>Accepting new engagements</span>
          </div>
          <div>Tensorix.ai</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
