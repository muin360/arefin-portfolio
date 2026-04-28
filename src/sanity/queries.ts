import { groq } from "next-sanity";

// All queries are pure GROQ strings so they can be reused from server
// components, generateStaticParams, and the revalidate webhook.

export const siteConfigQuery = groq`
  *[_type == "siteConfig"][0]{
    name, role, email, tagline, siteDescription, social
  }
`;

export const allServicesQuery = groq`
  *[_type == "service"] | order(coalesce(order, 9999) asc, _createdAt asc){
    _id, title, description, iconName, order
  }
`;

export const allSkillCategoriesQuery = groq`
  *[_type == "skillCategory"] | order(coalesce(order, 9999) asc, _createdAt asc){
    _id, category, items, iconName, order
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(coalesce(order, 9999) asc, _createdAt desc){
    _id,
    title,
    "slug": slug.current,
    summary,
    outcome,
    stack,
    iconName,
    category,
    featured,
    "thumbnail": thumbnail{ "url": asset->url, alt, "lqip": asset->metadata.lqip, "dimensions": asset->metadata.dimensions }
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(coalesce(order, 9999) asc, _createdAt desc)[0...3]{
    _id, title, "slug": slug.current, summary, stack, iconName, category
  }
`;

// Light-weight post listing — no body — for /blog and homepage previews.
export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "date": publishedAt,
    readingTime,
    category,
    tags,
    "coverImage": coverImage{ "url": asset->url, alt, "lqip": asset->metadata.lqip }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "date": publishedAt,
    readingTime,
    category,
    tags,
    seoTitle,
    seoDescription,
    "coverImage": coverImage{ "url": asset->url, alt, "lqip": asset->metadata.lqip, "dimensions": asset->metadata.dimensions },
    body
  }
`;
