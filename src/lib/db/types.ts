export type WorkflowStep = {
  step: string;
  name: string;
  desc: string;
};

export type IconName =
  | "workflow"
  | "bot"
  | "spark"
  | "chart"
  | "agent"
  | "brain"
  | "layers"
  | "terminal"
  | "lock"
  | "zap"
  | "bookmark"
  | "compass"
  | "rocket"
  | "globe";

export type Project = {
  id: string;
  title: string;
  slug: string;
  projectType: string;
  category: string;
  summary: string;
  problem: string;
  goal: string;
  workflowSteps: WorkflowStep[];
  aiRole: string;
  automationLogic: string;
  integrations: string[];
  stack: string[];
  learningOutcome: string;
  outcome?: string;
  iconName: IconName;
  thumbnail?: string | null;
  coverImage?: string | null;
  gallery?: string[];
  workflowImage?: string | null;
  architectureImage?: string | null;
  videoUrl?: string | null;
  relatedProjectIds?: string[];
  relatedServiceIds?: string[];
  relatedPostIds?: string[];
  demoUrl?: string | null;
  repoUrl?: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  tags: string[];
  readingTime: string;
  date: string;
  published: boolean;
  featured: boolean;
  relatedProjectIds?: string[];
  relatedServiceIds?: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: string;
  title: string;
  iconName: IconName;
  hook: string;
  problem: string;
  solution: string;
  outcome: string;
  bullets: string[];
  ctaLabel?: string;
  ctaPrefill?: string;
  isFeatured: boolean;
  published: boolean;
  order: number;
  relatedProjectIds?: string[];
  createdAt: string;
  updatedAt: string;
};

export type SkillCategory = {
  id: string;
  category: string;
  iconName: IconName;
  items: string[];
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AboutData = {
  id: string;
  headline: string;
  bio: string;
  mindset: string;
  story: string[];
  principles: { title: string; desc: string }[];
  experienceHighlights: { period: string; title: string; organization: string; desc: string }[];
  updatedAt: string;
};

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
  email?: string;
};

export type LiveStatCard = {
  label: string;
  value: string;
  suffix?: string;
  hint?: string;
  delta?: string;
  trendUp?: boolean;
};

export type SiteSettings = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  shortBio: string;
  email: string;
  phone: string;
  phoneE164: string;
  profileImage?: string | null;
  availability: "available" | "scoping" | "booked";
  availabilityNote: string;
  socialLinks: SocialLinks;
  seo: {
    siteTitle: string;
    siteDescription: string;
    ogTitle: string;
    ogDescription: string;
    canonicalUrl: string;
    author: string;
  };
  live30Days: LiveStatCard[];
  showLiveTicker: boolean;
  showHeroTiles: boolean;
  showLive30Days: boolean;
  updatedAt: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  read?: boolean;
  archived?: boolean;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

export type AnalyticsEventType =
  | "page_view"
  | "project_view"
  | "project_demo_click"
  | "project_github_click"
  | "cta_click"
  | "whatsapp_click"
  | "email_click"
  | "contact_start"
  | "contact_submit"
  | "blog_view"
  | "scroll_50"
  | "scroll_90";

export type AnalyticsEvent = {
  id: string;
  event: AnalyticsEventType;
  path: string;
  projectSlug?: string;
  postSlug?: string;
  label?: string;
  sessionId?: string;
  anonymousId?: string;
  referrer?: string;
  deviceCategory?: "desktop" | "mobile" | "tablet";
  browser?: string;
  os?: string;
  timestamp: string;
};

export type AdminActivityType =
  | "project_created"
  | "project_updated"
  | "project_deleted"
  | "project_published"
  | "project_unpublished"
  | "post_created"
  | "post_updated"
  | "post_deleted"
  | "post_published"
  | "post_unpublished"
  | "service_updated"
  | "skill_updated"
  | "settings_updated"
  | "seo_updated"
  | "about_updated"
  | "submission_read"
  | "submission_archived"
  | "submission_deleted";

export type AdminActivity = {
  id: string;
  type: AdminActivityType;
  description: string;
  targetId?: string;
  targetTitle?: string;
  actor?: string;
  timestamp: string;
};

export type DatabaseSchema = {
  siteSettings: SiteSettings;
  about: AboutData;
  projects: Project[];
  posts: BlogPost[];
  services: Service[];
  skills: SkillCategory[];
  submissions: ContactSubmission[];
};

