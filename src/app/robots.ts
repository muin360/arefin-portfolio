import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// Real search engines (Googlebot, Bingbot, DuckDuckBot, etc.) inherit the
// permissive default rule. Known LLM training scrapers are explicitly blocked.
// /studio and /api are excluded so the CMS chrome and webhook never appear in
// search results.
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
        disallow: ["/.well-known/", "/admin", "/admin/", "/api/"],
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
