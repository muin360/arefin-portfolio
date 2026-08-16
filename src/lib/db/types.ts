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

export type DatabaseSchema = {
  siteSettings: SiteSettings;
  about: AboutData;
  projects: Project[];
  posts: BlogPost[];
  services: Service[];
  skills: SkillCategory[];
  submissions: ContactSubmission[];
};
