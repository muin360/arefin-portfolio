import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/fetch";
import { allPostsQuery, allProjectsQuery } from "@/sanity/queries";
import type { PostListItem, ProjectDoc } from "@/sanity/types";
import { SITE_URL } from "@/lib/site-url";

// Sitemap is regenerated on demand via the same revalidate webhook
// (revalidatePath('/sitemap.xml') from /api/revalidate could be added if
// needed — but tag-based revalidation already covers it because the queries
// below are tagged with 'post' / 'project').
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [postsRaw, projectsRaw] = await Promise.all([
    sanityFetch<PostListItem[]>({ query: allPostsQuery, tags: ["post"] }),
    sanityFetch<ProjectDoc[]>({ query: allProjectsQuery, tags: ["project"] }),
  ]);
  const posts = postsRaw ?? [];
  const liveProjects = projectsRaw ?? [];

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

  const { FALLBACK_PROJECTS, FALLBACK_POSTS } = await import("@/data/fallbacks");

  const postList = posts.length > 0 ? posts : FALLBACK_POSTS;
  const postRoutes: MetadataRoute.Sitemap = postList.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
    lastModified: new Date(p.date),
  }));

  // Include built-in fallback projects so /projects/<slug> URLs surface
  // even when Sanity is empty or not configured (matches the static-params
  // behavior in the dynamic route).
  const slugs = Array.from(
    new Set([
      ...liveProjects.map((p) => p.slug),
      ...FALLBACK_PROJECTS.map((p) => p.slug),
    ]),
  );
  const projectRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
    lastModified: now,
  }));

  return [...staticRoutes, ...postRoutes, ...projectRoutes];
}

