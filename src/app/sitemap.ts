import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";
import { SITE_URL } from "@/lib/site-url";

// Required for `output: "export"` (static export) — bakes the file at build time.
export const dynamic = "force-static";

// Next.js generates /sitemap.xml from this at build time. Works with
// `output: "export"` — it's emitted as a static file.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,         changeFrequency: "monthly", priority: 1.0, lastModified: now },
    { url: `${SITE_URL}/about`,    changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/skills`,   changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/blog`,     changeFrequency: "weekly",  priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/contact`,  changeFrequency: "yearly",  priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/privacy`,  changeFrequency: "yearly",  priority: 0.3, lastModified: now },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
    lastModified: new Date(p.date),
  }));

  return [...staticRoutes, ...postRoutes];
}
