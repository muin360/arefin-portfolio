import { groq } from "next-sanity";

// All queries are pure GROQ strings so they can be reused from server
// components, generateStaticParams, and the revalidate webhook.

export const siteConfigQuery = groq`
  *[_type == "siteConfig"][0]{
    name,
    role,
    email,
    phone,
    phoneE164,
    tagline,
    siteDescription,
    availability,
    availabilityNote,
    social,
    heroTiles,
    live30Days,
    showLiveTicker,
    showHeroTiles,
    showLive30Days
  }
`;

export const allEngagementsQuery = groq`
  *[_type == "engagement"] | order(coalesce(order, 9999) asc, _createdAt asc){
    _id, tag, name, price, cadence, summary, deliverables, ideal, ctaLabel, featured, order
  }
`;

export const allServicesQuery = groq`
  *[_type == "service"] | order(coalesce(order, 9999) asc, _createdAt asc){
    _id,
    title,
    iconName,
    hook,
    problem,
    solution,
    outcome,
    bullets,
    ctaLabel,
    ctaPrefill,
    isFeatured,
    badge,
    description,
    order
  }
`;

export const allFaqsQuery = groq`
  *[_type == "faq"] | order(coalesce(order, 9999) asc, _createdAt asc){
    _id, question, answer, order
  }
`;

export const allTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(coalesce(order, 9999) asc, _createdAt desc){
    _id, name, role, content, rating,
    "image": image{ "url": asset->url, alt, "lqip": asset->metadata.lqip }
  }
`;

export const heroQuery = groq`
  *[_type == "hero"][0]{
    _id, eyebrow, headline, subheadline, trustLine, scarcityPill,
    primaryCTA, secondaryCTA
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
    projectType,
    problem,
    goal,
    aiRole,
    automationLogic,
    learningOutcome,
    outcome,
    stack,
    iconName,
    category,
    featured,
    demoUrl,
    repoUrl,
    "thumbnail": thumbnail{ "url": asset->url, alt, "lqip": asset->metadata.lqip, "dimensions": asset->metadata.dimensions }
  }
`;

export const projectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)][].slug.current
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    projectType,
    problem,
    goal,
    aiRole,
    automationLogic,
    learningOutcome,
    outcome,
    stack,
    iconName,
    category,
    featured,
    demoUrl,
    repoUrl,
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
