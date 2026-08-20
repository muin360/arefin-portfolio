import { ObjectId, type Filter } from "mongodb";
import { getCollection, ensureIndexes } from "@/lib/mongodb";
import { INITIAL_DATABASE } from "./seed-data";
import { DEFAULT_AI_CONFIG } from "@/lib/ai/defaults";
import { encryptSecret, computeConfigHash } from "@/lib/ai/secrets";
import { validateAIConfigPayload, validateModelAllowlist } from "@/lib/ai/validators";
import type {
  Project,
  BlogPost,
  Service,
  SkillCategory,
  AboutData,
  SiteSettings,
  ContactSubmission,
  AIConfig,
  AIProviderCredential,
  AIConfigVersion,
  AIUsageMetric,
  AIAuditLog,
} from "./types";

// Helper to normalize MongoDB document to Application entity format
function normalizeDoc<T>(doc: unknown): T | null {
  if (!doc) return null;
  const copy = { ...(doc as Record<string, unknown>) };
  if (copy._id) {
    copy.id = String(copy._id);
  }
  return copy as T;
}

function normalizeDocs<T>(docs: unknown[]): T[] {
  return docs.map((d) => normalizeDoc<T>(d)!);
}

// In-memory fallback cache for public reads when MongoDB is offline / initializing
const memoryFallback = JSON.parse(JSON.stringify(INITIAL_DATABASE));

// Helper for checking if test environment allows in-memory mutations
const isTestEnv = process.env.NODE_ENV === "test";

// ─── HIGH SPEED IN-MEMORY TTL CACHE ─────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const MEMORY_CACHE = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 60 * 1000; // 60s TTL

function getFromCache<T>(key: string): T | null {
  if (isTestEnv) return null; // Avoid cache interference in isolated test runner
  const entry = MEMORY_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    MEMORY_CACHE.delete(key);
    return null;
  }
  return entry.data as T;
}

function setInCache<T>(key: string, data: T): void {
  if (isTestEnv) return;
  MEMORY_CACHE.set(key, { data, timestamp: Date.now() });
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    MEMORY_CACHE.clear();
    return;
  }
  for (const key of MEMORY_CACHE.keys()) {
    if (key.startsWith(prefix)) {
      MEMORY_CACHE.delete(key);
    }
  }
}

function handleMutationDbUnavailable(): never {
  throw new Error("Database unavailable. Your changes were not saved.");
}

// ─── SITE SETTINGS ─────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const cached = getFromCache<SiteSettings>("site_settings");
  if (cached) return cached;

  const col = await getCollection<SiteSettings>("site_settings");
  if (!col) return memoryFallback.siteSettings;

  try {
    const doc = await col.findOne({});
    if (!doc) {
      const initial = { ...INITIAL_DATABASE.siteSettings };
      await col.insertOne(initial);
      setInCache("site_settings", initial);
      return initial;
    }
    const result = normalizeDoc<SiteSettings>(doc) as SiteSettings;
    if (!result.profileImage) {
      result.profileImage = INITIAL_DATABASE.siteSettings.profileImage || "/pp.png";
    }
    setInCache("site_settings", result);
    return result;
  } catch (err) {
    console.error("MongoDB getSiteSettings error:", err);
    return memoryFallback.siteSettings;
  }
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>,
): Promise<SiteSettings> {
  invalidateCache("site_settings");
  const col = await getCollection<SiteSettings>("site_settings");
  const now = new Date().toISOString();

  if (!col) {
    if (isTestEnv) {
      memoryFallback.siteSettings = {
        ...memoryFallback.siteSettings,
        ...updates,
        updatedAt: now,
      };
      return memoryFallback.siteSettings;
    }
    handleMutationDbUnavailable();
  }

  try {
    const existing = await col.findOne({});
    if (!existing) {
      const newDoc = {
        ...INITIAL_DATABASE.siteSettings,
        ...updates,
        updatedAt: now,
      };
      await col.insertOne(newDoc);
      return newDoc;
    }

    const { _id, ...cleanUpdates } = updates as { _id?: unknown; [key: string]: unknown };
    void _id;

    await col.updateOne(
      { _id: existing._id },
      { $set: { ...cleanUpdates, updatedAt: now } },
    );
    const updated = await col.findOne({ _id: existing._id });
    return normalizeDoc<SiteSettings>(updated) as SiteSettings;
  } catch (err) {
    console.error("MongoDB updateSiteSettings error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

// ─── ABOUT DATA ────────────────────────────────────────────────────────────

export async function getAboutData(): Promise<AboutData> {
  const cached = getFromCache<AboutData>("about_data");
  if (cached) return cached;

  const col = await getCollection<AboutData>("about");
  if (!col) return memoryFallback.about;

  try {
    const doc = await col.findOne({});
    if (!doc) {
      const initial = { ...INITIAL_DATABASE.about };
      await col.insertOne(initial);
      setInCache("about_data", initial);
      return initial;
    }
    const result = normalizeDoc<AboutData>(doc) as AboutData;
    setInCache("about_data", result);
    return result;
  } catch (err) {
    console.error("MongoDB getAboutData error:", err);
    return memoryFallback.about;
  }
}

export async function updateAboutData(
  updates: Partial<AboutData>,
): Promise<AboutData> {
  invalidateCache("about_data");
  const col = await getCollection<AboutData>("about");
  const now = new Date().toISOString();

  if (!col) {
    if (isTestEnv) {
      memoryFallback.about = {
        ...memoryFallback.about,
        ...updates,
        updatedAt: now,
      };
      return memoryFallback.about;
    }
    handleMutationDbUnavailable();
  }

  try {
    const existing = await col.findOne({});
    if (!existing) {
      const newDoc = { ...INITIAL_DATABASE.about, ...updates, updatedAt: now };
      await col.insertOne(newDoc);
      return newDoc;
    }

    const { _id, ...cleanUpdates } = updates as { _id?: unknown; [key: string]: unknown };
    void _id;

    await col.updateOne(
      { _id: existing._id },
      { $set: { ...cleanUpdates, updatedAt: now } },
    );
    const updated = await col.findOne({ _id: existing._id });
    return normalizeDoc<AboutData>(updated) as AboutData;
  } catch (err) {
    console.error("MongoDB updateAboutData error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

// ─── PROJECTS ──────────────────────────────────────────────────────────────

export async function getProjects(options?: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
}): Promise<Project[]> {
  const col = await getCollection<Project>("projects");
  if (!col) {
    let list = [...memoryFallback.projects];
    if (options?.publishedOnly) list = list.filter((p: Project) => p.published !== false);
    if (options?.featuredOnly) list = list.filter((p: Project) => p.featured);
    return list.sort((a: Project, b: Project) => (a.order ?? 99) - (b.order ?? 99));
  }

  try {
    await ensureIndexes();
    const count = await col.countDocuments({});
    if (count === 0) {
      // Use upsert so concurrent cold-starts and re-deployments never throw duplicate key errors
      await col.bulkWrite(
        INITIAL_DATABASE.projects.map((p) => {
          const { id, ...rest } = p;
          void id;
          return {
            updateOne: {
              filter: { slug: rest.slug },
              update: { $setOnInsert: rest as unknown as Project },
              upsert: true,
            },
          };
        }),
        { ordered: false },
      );
    }

    const query: Filter<Project> = {};
    if (options?.publishedOnly) {
      query.published = true;
    }
    if (options?.featuredOnly) {
      query.featured = true;
    }

    const docs = await col.find(query).sort({ order: 1, createdAt: -1 }).toArray();
    return normalizeDocs<Project>(docs);
  } catch (err) {
    console.error("MongoDB getProjects error:", err);
    let list = [...memoryFallback.projects];
    if (options?.publishedOnly) list = list.filter((p: Project) => p.published !== false);
    if (options?.featuredOnly) list = list.filter((p: Project) => p.featured === true);
    return list;
  }
}

export async function getProjectBySlug(
  slug: string,
  options?: { publishedOnly?: boolean },
): Promise<Project | null> {
  const col = await getCollection<Project>("projects");
  if (!col) {
    const p = memoryFallback.projects.find((item: Project) => item.slug === slug);
    if (!p) return null;
    if (options?.publishedOnly && p.published === false) return null;
    return p;
  }

  try {
    const query: Filter<Project> = { slug };
    if (options?.publishedOnly) {
      query.published = true;
    }
    const doc = await col.findOne(query);
    return normalizeDoc<Project>(doc);
  } catch (err) {
    console.error("MongoDB getProjectBySlug error:", err);
    return null;
  }
}

export async function getPublishedProjects(): Promise<Project[]> {
  return getProjects({ publishedOnly: true });
}

export async function getProjectById(id: string): Promise<Project | null> {
  const col = await getCollection<Project>("projects");
  if (!col) {
    return memoryFallback.projects.find((p: Project) => p.id === id) ?? null;
  }

  try {
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    const doc = await col.findOne(filter as Filter<Project>);
    return normalizeDoc<Project>(doc);
  } catch {
    return null;
  }
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">,
): Promise<Project> {
  const col = await getCollection<Project>("projects");
  const now = new Date().toISOString();
  const newProject = {
    ...data,
    published: data.published ?? true,
    order: data.order ?? 99,
    createdAt: now,
    updatedAt: now,
  };

  if (!col) {
    if (isTestEnv) {
      const item = { ...newProject, id: `proj-${Date.now()}` } as Project;
      memoryFallback.projects.unshift(item);
      return item;
    }
    handleMutationDbUnavailable();
  }

  try {
    const result = await col.insertOne(newProject as unknown as Project);
    return normalizeDoc<Project>({ ...newProject, _id: result.insertedId })!;
  } catch (err) {
    console.error("MongoDB createProject error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function updateProject(
  id: string,
  updates: Partial<Project>,
): Promise<Project | null> {
  const col = await getCollection<Project>("projects");
  const now = new Date().toISOString();

  if (!col) {
    if (isTestEnv) {
      const idx = memoryFallback.projects.findIndex((p: Project) => p.id === id);
      if (idx === -1) return null;
      memoryFallback.projects[idx] = {
        ...memoryFallback.projects[idx],
        ...updates,
        updatedAt: now,
      };
      return memoryFallback.projects[idx];
    }
    handleMutationDbUnavailable();
  }

  try {
    const { _id, id: _cleanId, ...cleanUpdates } = updates as {
      _id?: unknown;
      id?: unknown;
      [key: string]: unknown;
    };
    void _id;
    void _cleanId;

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    await col.updateOne(
      filter as Filter<Project>,
      { $set: { ...cleanUpdates, updatedAt: now } },
    );
    const updated = await col.findOne(filter as Filter<Project>);
    return normalizeDoc<Project>(updated);
  } catch (err) {
    console.error("MongoDB updateProject error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  const col = await getCollection<Project>("projects");
  if (!col) {
    if (isTestEnv) {
      const initialLen = memoryFallback.projects.length;
      memoryFallback.projects = memoryFallback.projects.filter((p: Project) => p.id !== id);
      return memoryFallback.projects.length !== initialLen;
    }
    handleMutationDbUnavailable();
  }

  try {
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    const res = await col.deleteOne(filter as Filter<Project>);
    return res.deletedCount > 0;
  } catch (err) {
    console.error("MongoDB deleteProject error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

// ─── BLOG POSTS ────────────────────────────────────────────────────────────

export async function getBlogPosts(options?: {
  publishedOnly?: boolean;
  tag?: string;
}): Promise<BlogPost[]> {
  const col = await getCollection<BlogPost>("posts");
  if (!col) {
    let list = [...memoryFallback.posts];
    if (options?.publishedOnly) list = list.filter((p: BlogPost) => p.published !== false);
    if (options?.tag) list = list.filter((p: BlogPost) => p.tags.includes(options.tag!));
    return list.sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  try {
    await ensureIndexes();
    const count = await col.countDocuments({});
    if (count === 0) {
      // Use upsert so concurrent cold-starts and re-deployments never throw duplicate key errors
      await col.bulkWrite(
        INITIAL_DATABASE.posts.map((p) => {
          const { id, ...rest } = p;
          void id;
          return {
            updateOne: {
              filter: { slug: rest.slug },
              update: { $setOnInsert: rest as unknown as BlogPost },
              upsert: true,
            },
          };
        }),
        { ordered: false },
      );
    }

    const query: Filter<BlogPost> = {};
    if (options?.publishedOnly) {
      query.published = true;
    }
    if (options?.tag) {
      query.tags = options.tag;
    }

    const docs = await col.find(query).sort({ date: -1, createdAt: -1 }).toArray();
    return normalizeDocs<BlogPost>(docs);
  } catch (err) {
    console.error("MongoDB getBlogPosts error:", err);
    let list = [...memoryFallback.posts];
    if (options?.publishedOnly) list = list.filter((p: BlogPost) => p.published !== false);
    if (options?.tag) list = list.filter((p: BlogPost) => p.tags.includes(options.tag!));
    return list.sort((a: BlogPost, b: BlogPost) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

export async function getBlogPostBySlug(
  slug: string,
  options?: { publishedOnly?: boolean },
): Promise<BlogPost | null> {
  const col = await getCollection<BlogPost>("posts");
  if (!col) {
    const p = memoryFallback.posts.find((item: BlogPost) => item.slug === slug);
    if (!p) return null;
    if (options?.publishedOnly && p.published === false) return null;
    return p;
  }

  try {
    const query: Filter<BlogPost> = { slug };
    if (options?.publishedOnly) {
      query.published = true;
    }
    const doc = await col.findOne(query);
    return normalizeDoc<BlogPost>(doc);
  } catch (err) {
    console.error("MongoDB getBlogPostBySlug error:", err);
    return null;
  }
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  return getBlogPosts({ publishedOnly: true });
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const col = await getCollection<BlogPost>("posts");
  if (!col) {
    return memoryFallback.posts.find((p: BlogPost) => p.id === id) ?? null;
  }

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
  const doc = await col.findOne(filter as Filter<BlogPost>);
  return normalizeDoc<BlogPost>(doc);
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
): Promise<BlogPost> {
  const col = await getCollection<BlogPost>("posts");
  const now = new Date().toISOString();
  const newPost = {
    ...data,
    published: data.published ?? true,
    createdAt: now,
    updatedAt: now,
  };

  if (!col) {
    if (isTestEnv) {
      const item = { ...newPost, id: `post-${Date.now()}` } as BlogPost;
      memoryFallback.posts.unshift(item);
      return item;
    }
    handleMutationDbUnavailable();
  }

  try {
    const result = await col.insertOne(newPost as unknown as BlogPost);
    return normalizeDoc<BlogPost>({ ...newPost, _id: result.insertedId })!;
  } catch (err) {
    console.error("MongoDB createBlogPost error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function updateBlogPost(
  id: string,
  updates: Partial<BlogPost>,
): Promise<BlogPost | null> {
  const col = await getCollection<BlogPost>("posts");
  const now = new Date().toISOString();

  if (!col) {
    if (isTestEnv) {
      const idx = memoryFallback.posts.findIndex((p: BlogPost) => p.id === id);
      if (idx === -1) return null;
      memoryFallback.posts[idx] = {
        ...memoryFallback.posts[idx],
        ...updates,
        updatedAt: now,
      };
      return memoryFallback.posts[idx];
    }
    handleMutationDbUnavailable();
  }

  try {
    const { _id, id: _cleanId, ...cleanUpdates } = updates as {
      _id?: unknown;
      id?: unknown;
      [key: string]: unknown;
    };
    void _id;
    void _cleanId;

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    await col.updateOne(
      filter as Filter<BlogPost>,
      { $set: { ...cleanUpdates, updatedAt: now } },
    );
    const updated = await col.findOne(filter as Filter<BlogPost>);
    return normalizeDoc<BlogPost>(updated);
  } catch (err) {
    console.error("MongoDB updateBlogPost error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const col = await getCollection<BlogPost>("posts");
  if (!col) {
    if (isTestEnv) {
      const initialLen = memoryFallback.posts.length;
      memoryFallback.posts = memoryFallback.posts.filter((p: BlogPost) => p.id !== id);
      return memoryFallback.posts.length !== initialLen;
    }
    handleMutationDbUnavailable();
  }

  try {
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    const res = await col.deleteOne(filter as Filter<BlogPost>);
    return res.deletedCount > 0;
  } catch (err) {
    console.error("MongoDB deleteBlogPost error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

// ─── SERVICES ──────────────────────────────────────────────────────────────

export async function getServices(options?: {
  publishedOnly?: boolean;
}): Promise<Service[]> {
  const cacheKey = "services_" + (options?.publishedOnly ? "pub" : "all");
  const cached = getFromCache<Service[]>(cacheKey);
  if (cached) return cached;

  const col = await getCollection<Service>("services");
  if (!col) {
    let list = [...memoryFallback.services];
    if (options?.publishedOnly) list = list.filter((s: Service) => s.published !== false);
    return list.sort((a: Service, b: Service) => a.order - b.order);
  }

  try {
    await ensureIndexes();
    const count = await col.countDocuments({});
    if (count === 0) {
      await col.bulkWrite(
        INITIAL_DATABASE.services.map((s) => {
          const { id, ...rest } = s;
          void id;
          return {
            updateOne: {
              filter: { order: rest.order, title: rest.title },
              update: { $setOnInsert: rest as unknown as Service },
              upsert: true,
            },
          };
        }),
        { ordered: false },
      );
    }

    const query: Filter<Service> = {};
    if (options?.publishedOnly) {
      query.published = true;
    }

    const docs = await col.find(query).sort({ order: 1 }).toArray();
    const result = normalizeDocs<Service>(docs);
    setInCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error("MongoDB getServices error:", err);
    let list = [...memoryFallback.services];
    if (options?.publishedOnly) list = list.filter((s: Service) => s.published !== false);
    return list.sort((a: Service, b: Service) => a.order - b.order);
  }
}

export async function getPublishedServices(): Promise<Service[]> {
  return getServices({ publishedOnly: true });
}

export async function getServiceById(id: string): Promise<Service | null> {
  const col = await getCollection<Service>("services");
  if (!col) {
    return memoryFallback.services.find((s: Service) => s.id === id) ?? null;
  }

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
  const doc = await col.findOne(filter as Filter<Service>);
  return normalizeDoc<Service>(doc);
}

export async function createService(
  data: Omit<Service, "id" | "createdAt" | "updatedAt">,
): Promise<Service> {
  invalidateCache("services");
  const col = await getCollection<Service>("services");
  const now = new Date().toISOString();
  const newService = {
    ...data,
    published: data.published ?? true,
    order: data.order ?? 99,
    createdAt: now,
    updatedAt: now,
  };

  if (!col) {
    if (isTestEnv) {
      const item = { ...newService, id: `service-${Date.now()}` } as Service;
      memoryFallback.services.push(item);
      return item;
    }
    handleMutationDbUnavailable();
  }

  try {
    const result = await col.insertOne(newService as unknown as Service);
    return normalizeDoc<Service>({ ...newService, _id: result.insertedId })!;
  } catch (err) {
    console.error("MongoDB createService error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function updateService(
  id: string,
  updates: Partial<Service>,
): Promise<Service | null> {
  invalidateCache("services");
  const col = await getCollection<Service>("services");
  const now = new Date().toISOString();

  if (!col) {
    if (isTestEnv) {
      const idx = memoryFallback.services.findIndex((s: Service) => s.id === id);
      if (idx === -1) return null;
      memoryFallback.services[idx] = {
        ...memoryFallback.services[idx],
        ...updates,
        updatedAt: now,
      };
      return memoryFallback.services[idx];
    }
    handleMutationDbUnavailable();
  }

  try {
    const { _id, id: _cleanId, ...cleanUpdates } = updates as {
      _id?: unknown;
      id?: unknown;
      [key: string]: unknown;
    };
    void _id;
    void _cleanId;

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    await col.updateOne(
      filter as Filter<Service>,
      { $set: { ...cleanUpdates, updatedAt: now } },
    );
    const updated = await col.findOne(filter as Filter<Service>);
    return normalizeDoc<Service>(updated);
  } catch (err) {
    console.error("MongoDB updateService error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function deleteService(id: string): Promise<boolean> {
  invalidateCache("services");
  const col = await getCollection<Service>("services");
  if (!col) {
    if (isTestEnv) {
      const initialLen = memoryFallback.services.length;
      memoryFallback.services = memoryFallback.services.filter((s: Service) => s.id !== id);
      return memoryFallback.services.length !== initialLen;
    }
    handleMutationDbUnavailable();
  }

  try {
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    const res = await col.deleteOne(filter as Filter<Service>);
    return res.deletedCount > 0;
  } catch (err) {
    console.error("MongoDB deleteService error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

// ─── SKILLS ────────────────────────────────────────────────────────────────

export async function getSkills(options?: {
  publishedOnly?: boolean;
}): Promise<SkillCategory[]> {
  const cacheKey = "skills_" + (options?.publishedOnly ? "pub" : "all");
  const cached = getFromCache<SkillCategory[]>(cacheKey);
  if (cached) return cached;

  const col = await getCollection<SkillCategory>("skills");
  if (!col) {
    let list = [...memoryFallback.skills];
    if (options?.publishedOnly) list = list.filter((s: SkillCategory) => s.published !== false);
    return list.sort((a: SkillCategory, b: SkillCategory) => a.order - b.order);
  }

  try {
    await ensureIndexes();
    const count = await col.countDocuments({});
    if (count === 0) {
      await col.bulkWrite(
        INITIAL_DATABASE.skills.map((s) => {
          const { id, ...rest } = s;
          void id;
          return {
            updateOne: {
              filter: { category: rest.category },
              update: { $setOnInsert: rest as unknown as SkillCategory },
              upsert: true,
            },
          };
        }),
        { ordered: false },
      );
    }

    const query: Filter<SkillCategory> = {};
    if (options?.publishedOnly) {
      query.published = true;
    }

    const docs = await col.find(query).sort({ order: 1 }).toArray();
    const result = normalizeDocs<SkillCategory>(docs);
    setInCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error("MongoDB getSkills error:", err);
    let list = [...memoryFallback.skills];
    if (options?.publishedOnly) list = list.filter((s: SkillCategory) => s.published !== false);
    return list.sort((a: SkillCategory, b: SkillCategory) => a.order - b.order);
  }
}

export async function getSkillById(id: string): Promise<SkillCategory | null> {
  const col = await getCollection<SkillCategory>("skills");
  if (!col) {
    return memoryFallback.skills.find((s: SkillCategory) => s.id === id) ?? null;
  }

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
  const doc = await col.findOne(filter as Filter<SkillCategory>);
  return normalizeDoc<SkillCategory>(doc);
}

export async function createSkill(
  data: Omit<SkillCategory, "id" | "createdAt" | "updatedAt">,
): Promise<SkillCategory> {
  invalidateCache("skills");
  const col = await getCollection<SkillCategory>("skills");
  const now = new Date().toISOString();
  const newSkill = {
    ...data,
    published: data.published ?? true,
    order: data.order ?? 99,
    createdAt: now,
    updatedAt: now,
  };

  if (!col) {
    if (isTestEnv) {
      const item = { ...newSkill, id: `skill-${Date.now()}` } as SkillCategory;
      memoryFallback.skills.push(item);
      return item;
    }
    handleMutationDbUnavailable();
  }

  try {
    const result = await col.insertOne(newSkill as unknown as SkillCategory);
    return normalizeDoc<SkillCategory>({ ...newSkill, _id: result.insertedId })!;
  } catch (err) {
    console.error("MongoDB createSkill error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function updateSkill(
  id: string,
  updates: Partial<SkillCategory>,
): Promise<SkillCategory | null> {
  invalidateCache("skills");
  const col = await getCollection<SkillCategory>("skills");
  const now = new Date().toISOString();

  if (!col) {
    if (isTestEnv) {
      const idx = memoryFallback.skills.findIndex((s: SkillCategory) => s.id === id);
      if (idx === -1) return null;
      memoryFallback.skills[idx] = {
        ...memoryFallback.skills[idx],
        ...updates,
        updatedAt: now,
      };
      return memoryFallback.skills[idx];
    }
    handleMutationDbUnavailable();
  }

  try {
    const { _id, id: _cleanId, ...cleanUpdates } = updates as {
      _id?: unknown;
      id?: unknown;
      [key: string]: unknown;
    };
    void _id;
    void _cleanId;

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    await col.updateOne(
      filter as Filter<SkillCategory>,
      { $set: { ...cleanUpdates, updatedAt: now } },
    );
    const updated = await col.findOne(filter as Filter<SkillCategory>);
    return normalizeDoc<SkillCategory>(updated);
  } catch (err) {
    console.error("MongoDB updateSkill error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  invalidateCache("skills");
  const col = await getCollection<SkillCategory>("skills");
  if (!col) {
    if (isTestEnv) {
      const initialLen = memoryFallback.skills.length;
      memoryFallback.skills = memoryFallback.skills.filter((s: SkillCategory) => s.id !== id);
      return memoryFallback.skills.length !== initialLen;
    }
    handleMutationDbUnavailable();
  }

  try {
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    const res = await col.deleteOne(filter as Filter<SkillCategory>);
    return res.deletedCount > 0;
  } catch (err) {
    console.error("MongoDB deleteSkill error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

// ─── CONTACT SUBMISSIONS ───────────────────────────────────────────────────

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const col = await getCollection<ContactSubmission>("contact_submissions");
  if (!col) {
    return [...memoryFallback.submissions].sort(
      (a: ContactSubmission, b: ContactSubmission) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  try {
    await ensureIndexes();
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    return normalizeDocs<ContactSubmission>(docs);
  } catch (err) {
    console.error("MongoDB getContactSubmissions error:", err);
    return memoryFallback.submissions;
  }
}

export async function createContactSubmission(
  data: Omit<ContactSubmission, "id" | "createdAt" | "updatedAt" | "status" | "read" | "archived">,
): Promise<ContactSubmission> {
  const col = await getCollection<ContactSubmission>("contact_submissions");
  const now = new Date().toISOString();
  const submission: ContactSubmission = {
    ...data,
    id: `sub-${Date.now()}`,
    status: "unread",
    read: false,
    archived: false,
    createdAt: now,
    updatedAt: now,
  };

  if (!col) {
    // In memory fallback for contact form during temporary network hiccup
    memoryFallback.submissions.unshift(submission);
    return submission;
  }

  try {
    const { id, ...cleanSubmission } = submission;
    void id;
    const result = await col.insertOne(cleanSubmission as unknown as ContactSubmission);
    return normalizeDoc<ContactSubmission>({ ...submission, _id: result.insertedId })!;
  } catch (err) {
    console.error("MongoDB createContactSubmission error:", err);
    memoryFallback.submissions.unshift(submission);
    return submission;
  }
}

export async function markSubmissionRead(
  id: string,
  read = true,
): Promise<ContactSubmission | null> {
  return updateContactSubmission(id, {
    read,
    status: read ? "read" : "unread",
  });
}

export async function archiveSubmission(
  id: string,
  archived = true,
): Promise<ContactSubmission | null> {
  return updateContactSubmission(id, {
    archived,
    status: archived ? "archived" : "read",
  });
}

export async function updateContactSubmission(
  id: string,
  updates: Partial<ContactSubmission>,
): Promise<ContactSubmission | null> {
  const col = await getCollection<ContactSubmission>("contact_submissions");
  const now = new Date().toISOString();

  if (!col) {
    if (isTestEnv) {
      const idx = memoryFallback.submissions.findIndex((s: ContactSubmission) => s.id === id);
      if (idx === -1) return null;
      memoryFallback.submissions[idx] = {
        ...memoryFallback.submissions[idx],
        ...updates,
        updatedAt: now,
      };
      return memoryFallback.submissions[idx];
    }
    handleMutationDbUnavailable();
  }

  try {
    const { _id, id: _cleanId, ...cleanUpdates } = updates as {
      _id?: unknown;
      id?: unknown;
      [key: string]: unknown;
    };
    void _id;
    void _cleanId;

    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    await col.updateOne(
      filter as Filter<ContactSubmission>,
      { $set: { ...cleanUpdates, updatedAt: now } },
    );
    const updated = await col.findOne(filter as Filter<ContactSubmission>);
    return normalizeDoc<ContactSubmission>(updated);
  } catch (err) {
    console.error("MongoDB updateContactSubmission error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function deleteContactSubmission(id: string): Promise<boolean> {
  const col = await getCollection<ContactSubmission>("contact_submissions");
  if (!col) {
    if (isTestEnv) {
      const initialLen = memoryFallback.submissions.length;
      memoryFallback.submissions = memoryFallback.submissions.filter((s: ContactSubmission) => s.id !== id);
      return memoryFallback.submissions.length !== initialLen;
    }
    handleMutationDbUnavailable();
  }

  try {
    const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
    const res = await col.deleteOne(filter as Filter<ContactSubmission>);
    return res.deletedCount > 0;
  } catch (err) {
    console.error("MongoDB deleteContactSubmission error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

// ─── AI CONTROL CENTER DATABASE OPERATIONS ───────────────────────────────

export async function getAIConfig(status: "active" | "draft" = "active"): Promise<AIConfig> {
  const cacheKey = `ai_config_${status}`;
  const cached = getFromCache<AIConfig>(cacheKey);
  if (cached) return cached;

  const col = await getCollection<AIConfig>("ai_config");
  if (!col) {
    const list = memoryFallback.aiConfig || [];
    const found = list.find((c: AIConfig) => c.status === status);
    if (found) return found;
    return { ...DEFAULT_AI_CONFIG, status };
  }

  try {
    const doc = await col.findOne({ status } as Filter<AIConfig>);
    if (!doc) {
      if (status === "draft") {
        // Fallback draft to active config
        const active = await getAIConfig("active");
        return { ...active, status: "draft" };
      }
      // Initialize active config
      const initial: AIConfig = {
        ...DEFAULT_AI_CONFIG,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await col.insertOne(initial as unknown as AIConfig);
      setInCache(cacheKey, initial);
      return initial;
    }
    const result = normalizeDoc<AIConfig>(doc) as AIConfig;
    setInCache(cacheKey, result);
    return result;
  } catch (err) {
    console.error("MongoDB getAIConfig error:", err);
    return { ...DEFAULT_AI_CONFIG, status };
  }
}

export async function saveDraftAIConfig(
  updates: Partial<AIConfig>,
  updatedBy = "admin",
): Promise<AIConfig> {
  invalidateCache("ai_config");
  const col = await getCollection<AIConfig>("ai_config");
  const now = new Date().toISOString();

  const currentActive = await getAIConfig("active");
  const currentDraft = await getAIConfig("draft");

  const baseConfig = currentDraft || currentActive || DEFAULT_AI_CONFIG;
  const merged: AIConfig = {
    ...baseConfig,
    ...updates,
    brain: { ...baseConfig.brain, ...(updates.brain || {}) },
    model: { ...baseConfig.model, ...(updates.model || {}) },
    knowledge: {
      ...baseConfig.knowledge,
      ...(updates.knowledge || {}),
      enabledCollections: {
        ...baseConfig.knowledge?.enabledCollections,
        ...(updates.knowledge?.enabledCollections || {}),
      },
    },
    safety: { ...baseConfig.safety, ...(updates.safety || {}) },
    limits: { ...baseConfig.limits, ...(updates.limits || {}) },
    status: "draft",
    updatedAt: now,
    updatedBy,
  };
  merged.promptHash = computeConfigHash(merged.brain);

  if (!col) {
    if (isTestEnv) {
      memoryFallback.aiConfig = (memoryFallback.aiConfig || []).filter((c: AIConfig) => c.status !== "draft");
      memoryFallback.aiConfig.push(merged);
      return merged;
    }
    handleMutationDbUnavailable();
  }

  try {
    const { _id, id: _cleanId, ...cleanDoc } = merged as unknown as {
      _id?: unknown;
      id?: unknown;
      [key: string]: unknown;
    };
    void _id;
    void _cleanId;

    await col.updateOne(
      { status: "draft" } as Filter<AIConfig>,
      { $set: cleanDoc },
      { upsert: true },
    );
    const updated = await col.findOne({ status: "draft" } as Filter<AIConfig>);
    return normalizeDoc<AIConfig>(updated) || merged;
  } catch (err) {
    console.error("MongoDB saveDraftAIConfig error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function activateAIConfig(
  updatedBy = "admin",
  changeSummary = "Configuration activated",
): Promise<{ activeConfig: AIConfig; version: AIConfigVersion }> {
  invalidateCache("ai_config");
  const configCol = await getCollection<AIConfig>("ai_config");
  const versionCol = await getCollection<AIConfigVersion>("ai_config_versions");
  const now = new Date().toISOString();

  const draft = await getAIConfig("draft");
  const active = await getAIConfig("active");
  const configToActivate = draft || active || DEFAULT_AI_CONFIG;

  // 1. REVALIDATE ENTIRE CONFIG SERVER-SIDE BEFORE ACTIVATION
  const validation = validateAIConfigPayload(configToActivate);
  if (!validation.success) {
    const errorMsg = validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`AI Configuration validation failed: ${errorMsg}`);
  }

  // 2. Validate model allowlist
  if (configToActivate.model.provider !== "local_grounded") {
    if (!validateModelAllowlist(configToActivate.model.provider, configToActivate.model.modelId)) {
      throw new Error(
        `Model '${configToActivate.model.modelId}' is not allowlisted for provider '${configToActivate.model.provider}'.`,
      );
    }
  }

  // 3. Validate failover model allowlist if enabled
  if (
    configToActivate.model.enableFailover &&
    configToActivate.model.fallbackProvider &&
    configToActivate.model.fallbackProvider !== "local_grounded"
  ) {
    if (
      configToActivate.model.fallbackModelId &&
      !validateModelAllowlist(configToActivate.model.fallbackProvider, configToActivate.model.fallbackModelId)
    ) {
      throw new Error(
        `Fallback model '${configToActivate.model.fallbackModelId}' is not allowlisted for fallback provider '${configToActivate.model.fallbackProvider}'.`,
      );
    }
  }

  // Compute next version number
  let nextVersion = (active?.versionNumber || 0) + 1;
  if (versionCol) {
    try {
      const latest = await versionCol.findOne({}, { sort: { versionNumber: -1 } });
      if (latest && latest.versionNumber >= nextVersion) {
        nextVersion = latest.versionNumber + 1;
      }
    } catch {
      // ignore
    }
  }

  const activeConfig: AIConfig = {
    ...configToActivate,
    status: "active",
    versionNumber: nextVersion,
    promptHash: computeConfigHash(configToActivate.brain),
    updatedAt: now,
    updatedBy,
  };

  const versionSnapshot: AIConfigVersion = {
    versionNumber: nextVersion,
    status: "active",
    promptHash: activeConfig.promptHash || "hash",
    config: JSON.parse(JSON.stringify(activeConfig)),
    changeSummary,
    createdAt: now,
    createdBy: updatedBy,
  };

  if (!configCol || !versionCol) {
    if (isTestEnv) {
      memoryFallback.aiConfig = (memoryFallback.aiConfig || []).filter((c: AIConfig) => c.status !== "active");
      memoryFallback.aiConfig.push(activeConfig);
      memoryFallback.aiVersions = memoryFallback.aiVersions || [];
      memoryFallback.aiVersions.unshift(versionSnapshot);
      return { activeConfig, version: versionSnapshot };
    }
    handleMutationDbUnavailable();
  }

  try {
    // 1. Ensure exactly ONE active config: archive or replace all existing active configs
    await configCol.updateMany(
      { status: "active" } as Filter<AIConfig>,
      { $set: { status: "archived" } as Partial<AIConfig> },
    );

    // 2. Insert or upsert the new active configuration
    const { _id, id: _cleanId, ...cleanActive } = activeConfig as unknown as {
      _id?: unknown;
      id?: unknown;
      [key: string]: unknown;
    };
    void _id;
    void _cleanId;

    await configCol.updateOne(
      { status: "active" } as Filter<AIConfig>,
      { $set: cleanActive },
      { upsert: true },
    );

    // 3. Mark previous versions archived
    await versionCol.updateMany(
      { status: "active" } as Filter<AIConfigVersion>,
      { $set: { status: "archived" } },
    );

    // 4. Insert new version
    await versionCol.insertOne(versionSnapshot as unknown as AIConfigVersion);

    // 5. Record audit log
    await logAIAudit({
      action: "config_activated",
      actor: updatedBy,
      target: `v${nextVersion}`,
      metadata: {
        provider: activeConfig.model.provider,
        modelId: activeConfig.model.modelId,
        changeSummary,
      },
    });

    return { activeConfig, version: versionSnapshot };
  } catch (err) {
    console.error("MongoDB activateAIConfig error:", err);
    throw new Error("Database unavailable. Your changes were not saved.");
  }
}

export async function getAIVersions(limit = 20): Promise<AIConfigVersion[]> {
  const col = await getCollection<AIConfigVersion>("ai_config_versions");
  if (!col) {
    return (memoryFallback.aiVersions || []).slice(0, limit);
  }

  try {
    const docs = await col.find({}).sort({ versionNumber: -1 }).limit(limit).toArray();
    return normalizeDocs<AIConfigVersion>(docs);
  } catch (err) {
    console.error("MongoDB getAIVersions error:", err);
    return [];
  }
}

export async function restoreAIVersion(
  versionNumber: number,
  updatedBy = "admin",
  activateNow = false,
): Promise<AIConfig> {
  invalidateCache("ai_config");
  const versionCol = await getCollection<AIConfigVersion>("ai_config_versions");
  let versionDoc: AIConfigVersion | null = null;

  if (!versionCol) {
    if (isTestEnv) {
      const v = (memoryFallback.aiVersions || []).find((x: AIConfigVersion) => x.versionNumber === versionNumber);
      if (!v) throw new Error(`Version v${versionNumber} not found`);
      versionDoc = v;
    } else {
      handleMutationDbUnavailable();
    }
  } else {
    try {
      const doc = await versionCol.findOne({ versionNumber });
      if (!doc) throw new Error(`Version v${versionNumber} not found`);
      versionDoc = normalizeDoc<AIConfigVersion>(doc)!;
    } catch (err) {
      if (err instanceof Error && err.message.includes("not found")) throw err;
      console.error("MongoDB restoreAIVersion error:", err);
      throw new Error("Database unavailable. Could not restore version.");
    }
  }

  if (!versionDoc) {
    throw new Error(`Version v${versionNumber} not found`);
  }

  // REVALIDATE HISTORICAL CONFIG AGAINST CURRENT SCHEMA AND ALLOWLISTS
  const targetConfig = versionDoc.config;
  const validation = validateAIConfigPayload(targetConfig);
  if (!validation.success) {
    const errorMsg = validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Target version v${versionNumber} fails current schema validation: ${errorMsg}`);
  }

  if (targetConfig.model.provider !== "local_grounded") {
    if (!validateModelAllowlist(targetConfig.model.provider, targetConfig.model.modelId)) {
      throw new Error(
        `Target version v${versionNumber} uses model '${targetConfig.model.modelId}' which is no longer allowlisted for provider '${targetConfig.model.provider}'.`,
      );
    }
  }

  if (
    targetConfig.model.enableFailover &&
    targetConfig.model.fallbackProvider &&
    targetConfig.model.fallbackProvider !== "local_grounded"
  ) {
    if (
      targetConfig.model.fallbackModelId &&
      !validateModelAllowlist(targetConfig.model.fallbackProvider, targetConfig.model.fallbackModelId)
    ) {
      throw new Error(
        `Target version v${versionNumber} fallback model '${targetConfig.model.fallbackModelId}' is not allowlisted for provider '${targetConfig.model.fallbackProvider}'.`,
      );
    }
  }

  if (activateNow) {
    await saveDraftAIConfig(targetConfig, updatedBy);
    const { activeConfig } = await activateAIConfig(
      updatedBy,
      `Rolled back to snapshot version v${versionNumber}`,
    );
    return activeConfig;
  } else {
    return saveDraftAIConfig(targetConfig, updatedBy);
  }
}

// ─── AI PROVIDER CREDENTIALS ──────────────────────────────────────────────

export async function getAIProviderCredentials(): Promise<AIProviderCredential[]> {
  const col = await getCollection<AIProviderCredential>("ai_provider_credentials");
  if (!col) {
    return memoryFallback.aiCredentials || [];
  }

  try {
    const docs = await col.find({}).toArray();
    return normalizeDocs<AIProviderCredential>(docs);
  } catch (err) {
    console.error("MongoDB getAIProviderCredentials error:", err);
    return [];
  }
}

export async function getAIProviderCredential(
  provider: "openai" | "anthropic" | "google",
): Promise<AIProviderCredential | null> {
  const col = await getCollection<AIProviderCredential>("ai_provider_credentials");
  if (!col) {
    const found = (memoryFallback.aiCredentials || []).find(
      (c: AIProviderCredential) => c.provider === provider,
    );
    return found || null;
  }

  try {
    const doc = await col.findOne({ provider });
    return normalizeDoc<AIProviderCredential>(doc);
  } catch (err) {
    console.error("MongoDB getAIProviderCredential error:", err);
    return null;
  }
}

export async function saveAIProviderCredential(input: {
  provider: "openai" | "anthropic" | "google";
  secret: string;
  baseUrl?: string;
  organizationId?: string;
  actor?: string;
}): Promise<AIProviderCredential> {
  const col = await getCollection<AIProviderCredential>("ai_provider_credentials");
  const now = new Date().toISOString();

  const encrypted = await encryptSecret(input.secret);
  const credentialDoc: AIProviderCredential = {
    provider: input.provider,
    encryptedSecret: encrypted.encryptedSecret,
    iv: encrypted.iv,
    authTag: encrypted.authTag,
    keyFingerprint: encrypted.keyFingerprint,
    baseUrl: input.baseUrl?.trim() || undefined,
    organizationId: input.organizationId?.trim() || undefined,
    status: "connected",
    lastRotatedAt: now,
    updatedAt: now,
  };

  if (!col) {
    if (isTestEnv) {
      memoryFallback.aiCredentials = (memoryFallback.aiCredentials || []).filter(
        (c: AIProviderCredential) => c.provider !== input.provider,
      );
      memoryFallback.aiCredentials.push(credentialDoc);
      return credentialDoc;
    }
    handleMutationDbUnavailable();
  }

  try {
    const { _id, id: _cleanId, ...cleanUpdates } = credentialDoc as unknown as {
      _id?: unknown;
      id?: unknown;
      [key: string]: unknown;
    };
    void _id;
    void _cleanId;

    await col.updateOne(
      { provider: input.provider },
      { $set: cleanUpdates },
      { upsert: true },
    );

    await logAIAudit({
      action: "secret_rotated",
      actor: input.actor || "admin",
      target: input.provider,
      metadata: {
        fingerprint: encrypted.keyFingerprint,
      },
    });

    const updated = await col.findOne({ provider: input.provider });
    return normalizeDoc<AIProviderCredential>(updated) || credentialDoc;
  } catch (err) {
    console.error("MongoDB saveAIProviderCredential error:", err);
    throw new Error("Database unavailable. Could not save provider credentials.");
  }
}

export async function disableAIProviderCredential(
  provider: "openai" | "anthropic" | "google",
  actor = "admin",
): Promise<boolean> {
  const col = await getCollection<AIProviderCredential>("ai_provider_credentials");
  if (!col) {
    if (isTestEnv) {
      const idx = (memoryFallback.aiCredentials || []).findIndex(
        (c: AIProviderCredential) => c.provider === provider,
      );
      if (idx !== -1) {
        memoryFallback.aiCredentials[idx].status = "unavailable";
        return true;
      }
      return false;
    }
    handleMutationDbUnavailable();
  }

  try {
    const res = await col.updateOne(
      { provider },
      { $set: { status: "unavailable", updatedAt: new Date().toISOString() } },
    );

    await logAIAudit({
      action: "secret_disabled",
      actor,
      target: provider,
    });

    return res.matchedCount > 0;
  } catch (err) {
    console.error("MongoDB disableAIProviderCredential error:", err);
    return false;
  }
}

export async function updateAIProviderStatus(
  provider: "openai" | "anthropic" | "google",
  status: "connected" | "invalid" | "unavailable" | "not_configured",
  lastError?: string,
): Promise<void> {
  const col = await getCollection<AIProviderCredential>("ai_provider_credentials");
  const now = new Date().toISOString();
  if (!col) return;

  try {
    await col.updateOne(
      { provider },
      {
        $set: {
          status,
          lastError: lastError || undefined,
          lastTestedAt: now,
          updatedAt: now,
        },
      },
    );
  } catch (err) {
    console.error("MongoDB updateAIProviderStatus error:", err);
  }
}

// ─── AI USAGE & LOGS ──────────────────────────────────────────────────────

export async function logAIUsage(metric: Omit<AIUsageMetric, "id" | "timestamp">): Promise<void> {
  const col = await getCollection<AIUsageMetric>("ai_usage");
  const doc: AIUsageMetric = {
    ...metric,
    timestamp: new Date().toISOString(),
  };

  if (!col) {
    if (isTestEnv) {
      memoryFallback.aiUsage = memoryFallback.aiUsage || [];
      memoryFallback.aiUsage.push(doc);
    }
    return;
  }

  try {
    await col.insertOne(doc as unknown as AIUsageMetric);
  } catch (err) {
    console.error("MongoDB logAIUsage error:", err);
  }
}

export async function getAIUsageStats(days = 7): Promise<{
  totalRequests: number;
  successCount: number;
  errorCount: number;
  avgLatencyMs: number;
  providerBreakdown: Record<string, number>;
  requestsToday: number;
}> {
  const col = await getCollection<AIUsageMetric>("ai_usage");
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

  if (!col) {
    const list: AIUsageMetric[] = (memoryFallback.aiUsage || []).filter(
      (m: AIUsageMetric) => m.timestamp >= since,
    );
    const success = list.filter((m) => m.status === "success").length;
    const error = list.filter((m) => m.status === "error").length;
    const today = list.filter((m) => m.timestamp >= startOfToday).length;
    const avgLatency = list.length > 0
      ? Math.round(list.reduce((acc, m) => acc + (m.latencyMs || 0), 0) / list.length)
      : 0;

    const breakdown: Record<string, number> = {};
    for (const m of list) {
      breakdown[m.provider] = (breakdown[m.provider] || 0) + 1;
    }

    return {
      totalRequests: list.length,
      successCount: success,
      errorCount: error,
      avgLatencyMs: avgLatency,
      providerBreakdown: breakdown,
      requestsToday: today,
    };
  }

  try {
    const docs = await col.find({ timestamp: { $gte: since } }).toArray();
    const success = docs.filter((m) => m.status === "success").length;
    const error = docs.filter((m) => m.status === "error").length;
    const today = docs.filter((m) => m.timestamp >= startOfToday).length;
    const avgLatency = docs.length > 0
      ? Math.round(docs.reduce((acc, m) => acc + (m.latencyMs || 0), 0) / docs.length)
      : 0;

    const breakdown: Record<string, number> = {};
    for (const m of docs) {
      breakdown[m.provider] = (breakdown[m.provider] || 0) + 1;
    }

    return {
      totalRequests: docs.length,
      successCount: success,
      errorCount: error,
      avgLatencyMs: avgLatency,
      providerBreakdown: breakdown,
      requestsToday: today,
    };
  } catch (err) {
    console.error("MongoDB getAIUsageStats error:", err);
    return {
      totalRequests: 0,
      successCount: 0,
      errorCount: 0,
      avgLatencyMs: 0,
      providerBreakdown: {},
      requestsToday: 0,
    };
  }
}

export async function getAILogs(limit = 50): Promise<AIUsageMetric[]> {
  const col = await getCollection<AIUsageMetric>("ai_usage");
  if (!col) {
    return (memoryFallback.aiUsage || []).slice(-limit).reverse();
  }

  try {
    const docs = await col.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
    return normalizeDocs<AIUsageMetric>(docs);
  } catch (err) {
    console.error("MongoDB getAILogs error:", err);
    return [];
  }
}

// ─── AI AUDIT LOGS ────────────────────────────────────────────────────────

export async function logAIAudit(log: Omit<AIAuditLog, "id" | "timestamp">): Promise<void> {
  const col = await getCollection<AIAuditLog>("ai_audit_logs");
  const doc: AIAuditLog = {
    ...log,
    timestamp: new Date().toISOString(),
  };

  if (!col) {
    if (isTestEnv) {
      memoryFallback.aiAuditLogs = memoryFallback.aiAuditLogs || [];
      memoryFallback.aiAuditLogs.push(doc);
    }
    return;
  }

  try {
    await col.insertOne(doc as unknown as AIAuditLog);
  } catch (err) {
    console.error("MongoDB logAIAudit error:", err);
  }
}

export async function getAIAuditLogs(limit = 50): Promise<AIAuditLog[]> {
  const col = await getCollection<AIAuditLog>("ai_audit_logs");
  if (!col) {
    return (memoryFallback.aiAuditLogs || []).slice(-limit).reverse();
  }

  try {
    const docs = await col.find({}).sort({ timestamp: -1 }).limit(limit).toArray();
    return normalizeDocs<AIAuditLog>(docs);
  } catch (err) {
    console.error("MongoDB getAIAuditLogs error:", err);
    return [];
  }
}

export * from "./types";
