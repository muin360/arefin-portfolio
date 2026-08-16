import type { MetadataRoute } from "next";
import { getBlogPosts, getProjects } from "@/lib/db";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [posts, projects] = await Promise.all([
    getBlogPosts({ publishedOnly: true }),
    getProjects({ publishedOnly: true }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,         changeFrequency: "monthly", priority: 1.0, lastModified: now },
    { url: `${SITE_URL}/about`,    changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/skills`,   changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: `${SITE_URL}/blog`,     changeFrequency: "weekly",  priority: 0.7, lastModified: now },
    { url: `${SITE_URL}/contact`,  changeFrequency: "yearly",  priority: 0.9, lastModified: now },
    { url: `${SITE_URL}/book`,     changeFrequency: "monthly", priority: 0.95, lastModified: now },
    { url: `${SITE_URL}/privacy`,  changeFrequency: "yearly",  priority: 0.3, lastModified: now },
    { url: `${SITE_URL}/terms`,    changeFrequency: "yearly",  priority: 0.3, lastModified: now },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
    lastModified: new Date(p.date),
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
    lastModified: now,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
