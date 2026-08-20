export type WorkflowStepType =
  | "trigger"
  | "input"
  | "ai"
  | "agent"
  | "tool"
  | "database"
  | "decision"
  | "output";

export type WorkflowStep = {
  id?: string;
  step?: string;
  type?: WorkflowStepType;
  name: string;
  title?: string;
  desc: string;
  description?: string;
  tool?: string;
  order?: number;
  serviceSlug?: string;
  postSlug?: string;
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

export type ProjectTier = "flagship" | "advanced" | "showcase";

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
  videoPoster?: string | null;
  altText?: string;
  captions?: string[];
  relatedProjectIds?: string[];
  relatedServiceIds?: string[];
  relatedPostIds?: string[];
  demoUrl?: string | null;
  repoUrl?: string | null;
  featured: boolean;
  published: boolean;
  tier?: ProjectTier;
  featuredOrder?: number;
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
  nowBuildingTitle?: string;
  nowBuildingStatus?: string;
  nowBuildingDescription?: string;
  nowBuildingStack?: string[];
  nowBuildingFocus?: string[];
  nowBuildingLink?: string;
  labTitle?: string;
  labStatus?: string;
  labInput?: string;
  labProcess?: string;
  labOutput?: string;
  labStack?: string[];
  labLink?: string;
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
  | "scroll_90"
  | "ai_open"
  | "ai_prompt"
  | "ai_project_click"
  | "build_explorer_open"
  | "build_step_click"
  | "blueprint_copy_specs";

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
  | "ai_config_saved"
  | "ai_config_activated"
  | "ai_version_restored"
  | "ai_secret_updated"
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

// ─── AI CONTROL CENTER TYPES ──────────────────────────────────────────────

export type AIProviderName = "openai" | "anthropic" | "google" | "local_grounded";

export interface AIBrainConfig {
  name: string;
  displayDescription: string;
  role: string;
  persona: string;
  systemPrompt: string;
  behaviorRules: string[];
  knowledgeRules: string[];
  safetyRules: string[];
  responseStyle: string;
  fallbackResponse: string;
  greeting: string;
  suggestedPrompts: string[];
  tone: "technical_direct" | "collaborative" | "executive" | "analytical";
  languageBehavior: "auto_detect" | "english_only" | "configurable";
}

export interface AIModelConfig {
  provider: AIProviderName;
  modelId: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  contextBudget: number;
  timeoutMs: number;
  enableFailover: boolean;
  fallbackProvider?: AIProviderName;
  fallbackModelId?: string;
}

export interface AIKnowledgeConfig {
  enabledCollections: {
    projects: boolean;
    services: boolean;
    posts: boolean;
    skills: boolean;
    about: boolean;
  };
  topK: number;
  minRelevanceScore: number;
  contextBudgetChars: number;
  maxDocuments: number;
  includeSourceLinks: boolean;
}

export interface AISafetyConfig {
  promptInjectionDefense: boolean;
  strictGrounding: boolean;
  blockSecretExtraction: boolean;
  toolPermissions: "public_read_only" | "admin";
}

export interface AILimitsConfig {
  rateLimitPerMin: number;
  maxPromptLength: number;
  maxOutputTokens: number;
  dailyRequestLimit: number;
  monthlyRequestLimit: number;
}

export interface AIConfig {
  id?: string;
  status: "active" | "draft" | "archived";
  brain: AIBrainConfig;
  model: AIModelConfig;
  knowledge: AIKnowledgeConfig;
  safety: AISafetyConfig;
  limits: AILimitsConfig;
  versionNumber: number;
  promptHash?: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface AIProviderCredential {
  id?: string;
  provider: "openai" | "anthropic" | "google";
  encryptedSecret: string;
  iv: string;
  authTag: string;
  keyFingerprint: string;
  baseUrl?: string;
  organizationId?: string;
  status: "connected" | "invalid" | "unavailable" | "not_configured";
  lastRotatedAt: string;
  lastTestedAt?: string;
  lastError?: string;
  updatedAt: string;
}

export interface AIConfigVersion {
  id?: string;
  versionNumber: number;
  status: "archived" | "active";
  promptHash: string;
  config: AIConfig;
  changeSummary?: string;
  createdAt: string;
  createdBy: string;
}

export interface AIUsageMetric {
  id?: string;
  timestamp: string;
  provider: string;
  model: string;
  latencyMs: number;
  status: "success" | "error" | "rate_limited" | "blocked";
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  requestType: "chat" | "playground" | "health";
  errorCategory?: string;
  clientIpHash?: string;
}

export interface AIAuditLog {
  id?: string;
  action:
    | "config_saved"
    | "config_activated"
    | "version_restored"
    | "secret_added"
    | "secret_rotated"
    | "secret_disabled"
    | "provider_tested";
  actor: string;
  target: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface AIUserMemory {
  id?: string;
  sessionId: string;
  encryptedData: string; // AES-256-GCM encrypted JSON payload
  iv: string;
  authTag: string;
  extractedLead?: {
    hasContactInfo: boolean;
    name?: string;
    intent: string;
    extractedTech: string[];
    summarySnippet: string;
  };
  lastActiveAt: string;
  createdAt: string;
}

export type DatabaseSchema = {
  siteSettings: SiteSettings;
  about: AboutData;
  projects: Project[];
  posts: BlogPost[];
  services: Service[];
  skills: SkillCategory[];
  submissions: ContactSubmission[];
  aiConfig?: AIConfig[];
  aiCredentials?: AIProviderCredential[];
  aiVersions?: AIConfigVersion[];
  aiUserMemories?: AIUserMemory[];
};

