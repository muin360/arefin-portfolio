// Shared TypeScript types for content fetched from Sanity. These shapes
// mirror the GROQ projections in queries.ts.

import type { PortableTextBlock } from "@portabletext/types";
import type { IconName } from "./schemaTypes/shared";

export type SanityImage = {
  url: string;
  alt?: string;
  lqip?: string;
  dimensions?: { width: number; height: number; aspectRatio: number };
} | null;

export type HeroTile = {
  label: string;
  value: string;
};

export type Live30DayStat = {
  label: string;
  value: string;
  suffix?: string;
  hint?: string;
  delta?: string;
  trendUp?: boolean;
};

export type SiteConfig = {
  name: string;
  role: string;
  email: string;
  phone?: string;
  phoneE164?: string;
  tagline: string;
  siteDescription?: string;
  availability?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
    email?: string;
  };
  heroTiles?: HeroTile[];
  live30Days?: Live30DayStat[];
  showLiveTicker?: boolean;
  showHeroTiles?: boolean;
  showLive30Days?: boolean;
};

export type EngagementDoc = {
  _id: string;
  tag: string;
  name: string;
  price: string;
  cadence?: string;
  summary: string;
  deliverables?: string[];
  ideal?: string;
  ctaLabel?: string;
  featured?: boolean;
  order?: number;
};

export type ServiceDoc = {
  _id: string;
  title: string;
  description: string;
  iconName: IconName;
  order?: number;
};

export type SkillCategoryDoc = {
  _id: string;
  category: string;
  items: string[];
  iconName: IconName;
  order?: number;
};

export type ProjectDoc = {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  outcome?: string;
  stack: string[];
  iconName: IconName;
  category: string;
  featured?: boolean;
  thumbnail: SanityImage;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readingTime?: string;
  category?: string;
  tags?: string[];
  coverImage: SanityImage;
};

export type PostDetail = PostListItem & {
  seoTitle?: string;
  seoDescription?: string;
  body: PortableTextBlock[];
};
