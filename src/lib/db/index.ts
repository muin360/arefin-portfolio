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

// In-memory fallback cache if MongoDB is offline or unconfigured
const memoryFallback = JSON.parse(JSON.stringify(INITIAL_DATABASE));

// ─── SITE SETTINGS ─────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const col = await getCollection<SiteSettings>("site_settings");
  if (!col) return memoryFallback.siteSettings;

  try {
    const doc = await col.findOne({});
    if (!doc) {
      // Seed initial settings document
      const initial = { ...INITIAL_DATABASE.siteSettings };
      await col.insertOne(initial);
      return initial;
    }
    return normalizeDoc(doc) as SiteSettings;
  } catch (err) {
    console.error("MongoDB getSiteSettings error:", err);
    return memoryFallback.siteSettings;
  }
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const col = await getCollection<SiteSettings>("site_settings");
  if (!col) {
    memoryFallback.siteSettings = {
      ...memoryFallback.siteSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return memoryFallback.siteSettings;
  }

  const now = new Date().toISOString();
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
    return normalizeDoc(updated) as SiteSettings;
  } catch (err) {
    console.error("MongoDB updateSiteSettings error:", err);
    memoryFallback.siteSettings = {
      ...memoryFallback.siteSettings,
      ...updates,
      updatedAt: now,
    };
    return memoryFallback.siteSettings;
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
    return normalizeDoc(doc) as AboutData;
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
    memoryFallback.about = {
      ...memoryFallback.about,
      ...updates,
      updatedAt: now,
    };
    return memoryFallback.about;
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
    return normalizeDoc(updated) as AboutData;
  } catch (err) {
    console.error("MongoDB updateAboutData error:", err);
    memoryFallback.about = {
      ...memoryFallback.about,
      ...updates,
      updatedAt: now,
    };
    return memoryFallback.about;
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
    if (options?.publishedOnly) list = list.filter((p) => p.published !== false);
    if (options?.featuredOnly) list = list.filter((p) => p.featured);
    return list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }

  try {
    await ensureIndexes();
    const count = await col.countDocuments({});
    if (count === 0) {
      // Auto-seed initial projects
      await col.insertMany(
        INITIAL_DATABASE.projects.map((p) => {
          const { id, ...rest } = p;
          void id;
          return rest as unknown as Project;
        }),
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
    return normalizeDocs(docs);
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
    return normalizeDoc(doc);
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
    return normalizeDoc(doc);
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
    const item = { ...newProject, id: `proj-${Date.now()}` } as Project;
    memoryFallback.projects.unshift(item);
    return item;
  }

  const result = await col.insertOne(newProject as unknown as Project);
  return normalizeDoc<Project>({ ...newProject, _id: result.insertedId })!;
}

export async function updateProject(
  id: string,
  updates: Partial<Project>,
): Promise<Project | null> {
  const col = await getCollection<Project>("projects");
  const now = new Date().toISOString();

  if (!col) {
    const idx = memoryFallback.projects.findIndex((p: Project) => p.id === id);
    if (idx === -1) return null;
    memoryFallback.projects[idx] = {
      ...memoryFallback.projects[idx],
      ...updates,
      updatedAt: now,
    };
    return memoryFallback.projects[idx];
  }

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
  return normalizeDoc(updated);
}

export async function deleteProject(id: string): Promise<boolean> {
  const col = await getCollection<Project>("projects");
  if (!col) {
    const initialLen = memoryFallback.projects.length;
    memoryFallback.projects = memoryFallback.projects.filter((p: Project) => p.id !== id);
    return memoryFallback.projects.length !== initialLen;
  }

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
  const res = await col.deleteOne(filter as Filter<Project>);
  return res.deletedCount > 0;
}

// ─── BLOG POSTS ────────────────────────────────────────────────────────────

export async function getBlogPosts(options?: {
  publishedOnly?: boolean;
  tag?: string;
}): Promise<BlogPost[]> {
  const col = await getCollection<BlogPost>("posts");
  if (!col) {
    let list = [...memoryFallback.posts];
    if (options?.publishedOnly) list = list.filter((p) => p.published !== false);
    if (options?.tag) list = list.filter((p) => p.tags.includes(options.tag!));
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  try {
    await ensureIndexes();
    const count = await col.countDocuments({});
    if (count === 0) {
      await col.insertMany(
        INITIAL_DATABASE.posts.map((p) => {
          const { id, ...rest } = p;
          void id;
          return rest as unknown as BlogPost;
        }),
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
    return normalizeDocs(docs);
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
    return normalizeDoc(doc);
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
  return normalizeDoc(doc);
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
    const item = { ...newPost, id: `post-${Date.now()}` } as BlogPost;
    memoryFallback.posts.unshift(item);
    return item;
  }

  const result = await col.insertOne(newPost as unknown as BlogPost);
  return normalizeDoc<BlogPost>({ ...newPost, _id: result.insertedId })!;
}

export async function updateBlogPost(
  id: string,
  updates: Partial<BlogPost>,
): Promise<BlogPost | null> {
  const col = await getCollection<BlogPost>("posts");
  const now = new Date().toISOString();

  if (!col) {
    const idx = memoryFallback.posts.findIndex((p: BlogPost) => p.id === id);
    if (idx === -1) return null;
    memoryFallback.posts[idx] = {
      ...memoryFallback.posts[idx],
      ...updates,
      updatedAt: now,
    };
    return memoryFallback.posts[idx];
  }

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
  return normalizeDoc(updated);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const col = await getCollection<BlogPost>("posts");
  if (!col) {
    const initialLen = memoryFallback.posts.length;
    memoryFallback.posts = memoryFallback.posts.filter((p: BlogPost) => p.id !== id);
    return memoryFallback.posts.length !== initialLen;
  }

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
  const res = await col.deleteOne(filter as Filter<BlogPost>);
  return res.deletedCount > 0;
}

// ─── SERVICES ──────────────────────────────────────────────────────────────

export async function getServices(options?: {
  publishedOnly?: boolean;
}): Promise<Service[]> {
  const col = await getCollection<Service>("services");
  if (!col) {
    let list = [...memoryFallback.services];
    if (options?.publishedOnly) list = list.filter((s) => s.published !== false);
    return list.sort((a, b) => a.order - b.order);
  }

  try {
    await ensureIndexes();
    const count = await col.countDocuments({});
    if (count === 0) {
      await col.insertMany(
        INITIAL_DATABASE.services.map((s) => {
          const { id, ...rest } = s;
          void id;
          return rest as unknown as Service;
        }),
      );
    }

    const query: Filter<Service> = {};
    if (options?.publishedOnly) {
      query.published = true;
    }

    const docs = await col.find(query).sort({ order: 1 }).toArray();
    return normalizeDocs(docs);
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
  return normalizeDoc(doc);
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
    const item = { ...newService, id: `service-${Date.now()}` } as Service;
    memoryFallback.services.push(item);
    return item;
  }

  const result = await col.insertOne(newService as unknown as Service);
  return normalizeDoc<Service>({ ...newService, _id: result.insertedId })!;
}

export async function updateService(
  id: string,
  updates: Partial<Service>,
): Promise<Service | null> {
  const col = await getCollection<Service>("services");
  const now = new Date().toISOString();

  if (!col) {
    const idx = memoryFallback.services.findIndex((s: Service) => s.id === id);
    if (idx === -1) return null;
    memoryFallback.services[idx] = {
      ...memoryFallback.services[idx],
      ...updates,
      updatedAt: now,
    };
    return memoryFallback.services[idx];
  }

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
  return normalizeDoc(updated);
}

export async function deleteService(id: string): Promise<boolean> {
  const col = await getCollection<Service>("services");
  if (!col) {
    const initialLen = memoryFallback.services.length;
    memoryFallback.services = memoryFallback.services.filter((s: Service) => s.id !== id);
    return memoryFallback.services.length !== initialLen;
  }

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
  const res = await col.deleteOne(filter as Filter<Service>);
  return res.deletedCount > 0;
}

// ─── SKILLS ────────────────────────────────────────────────────────────────

export async function getSkills(options?: {
  publishedOnly?: boolean;
}): Promise<SkillCategory[]> {
  const col = await getCollection<SkillCategory>("skills");
  if (!col) {
    let list = [...memoryFallback.skills];
    if (options?.publishedOnly) list = list.filter((s) => s.published !== false);
    return list.sort((a, b) => a.order - b.order);
  }

  try {
    await ensureIndexes();
    const count = await col.countDocuments({});
    if (count === 0) {
      await col.insertMany(
        INITIAL_DATABASE.skills.map((s) => {
          const { id, ...rest } = s;
          void id;
          return rest as unknown as SkillCategory;
        }),
      );
    }

    const query: Filter<SkillCategory> = {};
    if (options?.publishedOnly) {
      query.published = true;
    }

    const docs = await col.find(query).sort({ order: 1 }).toArray();
    return normalizeDocs(docs);
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
  return normalizeDoc(doc);
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
    const item = { ...newSkill, id: `skill-${Date.now()}` } as SkillCategory;
    memoryFallback.skills.push(item);
    return item;
  }

  const result = await col.insertOne(newSkill as unknown as SkillCategory);
  return normalizeDoc<SkillCategory>({ ...newSkill, _id: result.insertedId })!;
}

export async function updateSkill(
  id: string,
  updates: Partial<SkillCategory>,
): Promise<SkillCategory | null> {
  const col = await getCollection<SkillCategory>("skills");
  const now = new Date().toISOString();

  if (!col) {
    const idx = memoryFallback.skills.findIndex((s: SkillCategory) => s.id === id);
    if (idx === -1) return null;
    memoryFallback.skills[idx] = {
      ...memoryFallback.skills[idx],
      ...updates,
      updatedAt: now,
    };
    return memoryFallback.skills[idx];
  }

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
  return normalizeDoc(updated);
}

export async function deleteSkill(id: string): Promise<boolean> {
  const col = await getCollection<SkillCategory>("skills");
  if (!col) {
    const initialLen = memoryFallback.skills.length;
    memoryFallback.skills = memoryFallback.skills.filter((s: SkillCategory) => s.id !== id);
    return memoryFallback.skills.length !== initialLen;
  }

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
  const res = await col.deleteOne(filter as Filter<SkillCategory>);
  return res.deletedCount > 0;
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
    return normalizeDocs(docs);
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
    memoryFallback.submissions.unshift(submission);
    return submission;
  }

  const { id, ...cleanSubmission } = submission;
  void id;
  const result = await col.insertOne(cleanSubmission as unknown as ContactSubmission);
  return normalizeDoc({ ...submission, _id: result.insertedId }) as ContactSubmission;
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
    const idx = memoryFallback.submissions.findIndex((s: ContactSubmission) => s.id === id);
    if (idx === -1) return null;
    memoryFallback.submissions[idx] = {
      ...memoryFallback.submissions[idx],
      ...updates,
      updatedAt: now,
    };
    return memoryFallback.submissions[idx];
  }

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
  return normalizeDoc(updated);
}

export async function deleteContactSubmission(id: string): Promise<boolean> {
  const col = await getCollection<ContactSubmission>("contact_submissions");
  if (!col) {
    const initialLen = memoryFallback.submissions.length;
    memoryFallback.submissions = memoryFallback.submissions.filter((s: ContactSubmission) => s.id !== id);
    return memoryFallback.submissions.length !== initialLen;
  }

  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id as unknown as ObjectId };
  const res = await col.deleteOne(filter as Filter<ContactSubmission>);
  return res.deletedCount > 0;
}

export * from "./types";
