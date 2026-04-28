import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// Required for `output: "export"` (static export) — bakes the file at build time.
export const dynamic = "force-static";

// Next.js emits /robots.txt from this at build time. Works with
// `output: "export"`.
//
// Real search engines (Googlebot, Bingbot, DuckDuckBot, etc.) inherit the
// permissive default rule. Known LLM training scrapers are explicitly blocked.
export default function robots(): MetadataRoute.Robots {
  const trainingScrapers = [
    "GPTBot",
    "ClaudeBot",
    "anthropic-ai",
    "Google-Extended", // Note: Gemini training only — does NOT affect Google Search
    "CCBot",
    "PerplexityBot",
    "Bytespider",
    "Amazonbot",
    "FacebookBot",
    "Applebot-Extended",
    "Meta-ExternalAgent",
    "OAI-SearchBot",
    "cohere-ai",
    "Diffbot",
    "ImagesiftBot",
    "Omgili",
    "DuckAssistBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/.well-known/"],
      },
      ...trainingScrapers.map((bot) => ({
        userAgent: bot,
        disallow: "/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
