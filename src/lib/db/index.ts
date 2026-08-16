import { ObjectId, type Filter } from "mongodb";
import { getCollection, ensureIndexes } from "@/lib/mongodb";
import { INITIAL_DATABASE } from "./seed-data";
import type {
  Project,
  BlogPost,
  Service,
  SkillCategory,
  AboutData,
  SiteSettings,
  ContactSubmission,
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

function handleMutationDbUnavailable(): never {
  throw new Error("Database unavailable. Your changes were not saved.");
}

// ─── SITE SETTINGS ─────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const col = await getCollection<SiteSettings>("site_settings");
  if (!col) return memoryFallback.siteSettings;

  try {
    const doc = await col.findOne({});
    if (!doc) {
      const initial = { ...INITIAL_DATABASE.siteSettings };
      await col.insertOne(initial);
      return initial;
    }
    return normalizeDoc<SiteSettings>(doc) as SiteSettings;
  } catch (err) {
    console.error("MongoDB getSiteSettings error:", err);
    return memoryFallback.siteSettings;
  }
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>,
): Promise<SiteSettings> {
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
  const col = await getCollection<AboutData>("about");
  if (!col) return memoryFallback.about;

  try {
    const doc = await col.findOne({});
    if (!doc) {
      const initial = { ...INITIAL_DATABASE.about };
      await col.insertOne(initial);
      return initial;
    }
    return normalizeDoc<AboutData>(doc) as AboutData;
  } catch (err) {
    console.error("MongoDB getAboutData error:", err);
    return memoryFallback.about;
  }
}

export async function updateAboutData(
  updates: Partial<AboutData>,
): Promise<AboutData> {
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
    return memoryFallback.projects;
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
    return memoryFallback.posts;
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
    return normalizeDocs<Service>(docs);
  } catch (err) {
    console.error("MongoDB getServices error:", err);
    return memoryFallback.services;
  }
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
    return normalizeDocs<SkillCategory>(docs);
  } catch (err) {
    console.error("MongoDB getSkills error:", err);
    return memoryFallback.skills;
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

export * from "./types";
