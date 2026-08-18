import { getBaseUrl } from "./site-url";

/**
 * Safely serialize a JSON-LD payload for inline injection into a
 * <script type="application/ld+json"> tag.
 */
export function safeJsonLd(payload: unknown): string {
  return JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function generatePersonJsonLd(baseUrl = getBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "Arefin Mueen",
    jobTitle: "AI Automation & AI Agent Developer",
    url: baseUrl,
    image: `${baseUrl}/pp.png`,
    sameAs: [
      "https://github.com/muin360",
      "https://linkedin.com/in/arefinmueen",
      "https://twitter.com/arefinmueen",
    ],
    knowsAbout: [
      "AI Automation",
      "AI Agents",
      "Retrieval-Augmented Generation (RAG)",
      "LangChain",
      "n8n",
      "Python",
      "MongoDB Vector Search",
      "Autonomous Systems",
    ],
  };
}

export function generateWebSiteJsonLd(baseUrl = getBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Arefin Mueen Portfolio",
    url: baseUrl,
    publisher: {
      "@id": `${baseUrl}/#person`,
    },
    inLanguage: "en-US",
  };
}

export function generateProjectJsonLd(project: {
  title: string;
  summary: string;
  slug: string;
  coverImage?: string;
  category?: string;
  stack?: string[];
}, baseUrl = getBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.summary,
    url: `${baseUrl}/projects/${project.slug}`,
    image: project.coverImage ? (project.coverImage.startsWith("http") ? project.coverImage : `${baseUrl}${project.coverImage}`) : undefined,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Cloud / Serverless",
    author: {
      "@id": `${baseUrl}/#person`,
    },
  };
}

export function generateArticleJsonLd(post: {
  title: string;
  summary: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  coverImage?: string;
}, baseUrl = getBaseUrl()) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    url: `${baseUrl}/blog/${post.slug}`,
    datePublished: post.publishedAt || new Date().toISOString(),
    dateModified: post.updatedAt || post.publishedAt || new Date().toISOString(),
    image: post.coverImage ? (post.coverImage.startsWith("http") ? post.coverImage : `${baseUrl}${post.coverImage}`) : undefined,
    author: {
      "@id": `${baseUrl}/#person`,
    },
    publisher: {
      "@id": `${baseUrl}/#person`,
    },
  };
}
