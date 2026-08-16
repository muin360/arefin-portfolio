import fs from "fs";
import path from "path";
import { INITIAL_DATABASE } from "./seed-data";
import type {
  DatabaseSchema,
  Project,
  BlogPost,
  Service,
  SkillCategory,
  AboutData,
  SiteSettings,
  ContactSubmission,
} from "./types";

// Database storage location
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// In-memory cache
let cachedDb: DatabaseSchema | null = null;

/**
 * Ensures data directory and file exist, loading seed data on first initialize.
 */
function getDatabase(): DatabaseSchema {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
      cachedDb = {
        siteSettings: parsed.siteSettings ?? INITIAL_DATABASE.siteSettings,
        about: parsed.about ?? INITIAL_DATABASE.about,
        projects: parsed.projects ?? INITIAL_DATABASE.projects,
        posts: parsed.posts ?? INITIAL_DATABASE.posts,
        services: parsed.services ?? INITIAL_DATABASE.services,
        skills: parsed.skills ?? INITIAL_DATABASE.skills,
        submissions: parsed.submissions ?? INITIAL_DATABASE.submissions,
      };
      return cachedDb;
    }
  } catch (err) {
    console.warn("Could not read db.json file, falling back to initial data:", err);
  }

  // Fallback to initial seed and attempt to persist
  cachedDb = JSON.parse(JSON.stringify(INITIAL_DATABASE));
  saveDatabase(cachedDb!);
  return cachedDb!;
}

/**
 * Persists the in-memory database to disk.
 */
function saveDatabase(db: DatabaseSchema): void {
  cachedDb = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // In serverless / read-only filesystem environments, file persistence might fail;
    // in-memory state remains updated during execution.
    console.warn("Filesystem write warning (in-memory state updated):", err);
  }
}

// ─── SITE SETTINGS ─────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = getDatabase();
  return db.siteSettings;
}

export async function updateSiteSettings(
  updates: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const db = getDatabase();
  db.siteSettings = {
    ...db.siteSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  return db.siteSettings;
}

// ─── ABOUT DATA ────────────────────────────────────────────────────────────

export async function getAboutData(): Promise<AboutData> {
  const db = getDatabase();
  return db.about;
}

export async function updateAboutData(
  updates: Partial<AboutData>,
): Promise<AboutData> {
  const db = getDatabase();
  db.about = {
    ...db.about,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  return db.about;
}

// ─── PROJECTS ──────────────────────────────────────────────────────────────

export async function getProjects(options?: {
  publishedOnly?: boolean;
}): Promise<Project[]> {
  const db = getDatabase();
  let list = [...db.projects];
  if (options?.publishedOnly) {
    list = list.filter((p) => p.published !== false);
  }
  return list.sort((a, b) => a.order - b.order);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = getDatabase();
  const found = db.projects.find((p) => p.id === id);
  return found ? { ...found } : null;
}

export async function getProjectBySlug(
  slug: string,
  options?: { publishedOnly?: boolean },
): Promise<Project | null> {
  const db = getDatabase();
  const found = db.projects.find((p) => p.slug === slug);
  if (!found) return null;
  if (options?.publishedOnly && found.published === false) return null;
  return { ...found };
}

export async function createProject(
  data: Omit<Project, "id" | "createdAt" | "updatedAt">,
): Promise<Project> {
  const db = getDatabase();
  const id = `project-${Date.now()}`;
  const now = new Date().toISOString();
  const newProject: Project = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  db.projects.push(newProject);
  saveDatabase(db);
  return newProject;
}

export async function updateProject(
  id: string,
  updates: Partial<Project>,
): Promise<Project | null> {
  const db = getDatabase();
  const idx = db.projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  db.projects[idx] = {
    ...db.projects[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  return db.projects[idx];
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = getDatabase();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ─── BLOG POSTS ────────────────────────────────────────────────────────────

export async function getBlogPosts(options?: {
  publishedOnly?: boolean;
}): Promise<BlogPost[]> {
  const db = getDatabase();
  let list = [...db.posts];
  if (options?.publishedOnly) {
    list = list.filter((p) => p.published !== false);
  }
  return list.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const db = getDatabase();
  const found = db.posts.find((p) => p.id === id);
  return found ? { ...found } : null;
}

export async function getBlogPostBySlug(
  slug: string,
  options?: { publishedOnly?: boolean },
): Promise<BlogPost | null> {
  const db = getDatabase();
  const found = db.posts.find((p) => p.slug === slug);
  if (!found) return null;
  if (options?.publishedOnly && found.published === false) return null;
  return { ...found };
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
): Promise<BlogPost> {
  const db = getDatabase();
  const id = `post-${Date.now()}`;
  const now = new Date().toISOString();
  const newPost: BlogPost = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  db.posts.unshift(newPost);
  saveDatabase(db);
  return newPost;
}

export async function updateBlogPost(
  id: string,
  updates: Partial<BlogPost>,
): Promise<BlogPost | null> {
  const db = getDatabase();
  const idx = db.posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  db.posts[idx] = {
    ...db.posts[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  return db.posts[idx];
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const db = getDatabase();
  const initialLength = db.posts.length;
  db.posts = db.posts.filter((p) => p.id !== id);
  if (db.posts.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ─── SERVICES ──────────────────────────────────────────────────────────────

export async function getServices(options?: {
  publishedOnly?: boolean;
}): Promise<Service[]> {
  const db = getDatabase();
  let list = [...db.services];
  if (options?.publishedOnly) {
    list = list.filter((s) => s.published !== false);
  }
  return list.sort((a, b) => a.order - b.order);
}

export async function getServiceById(id: string): Promise<Service | null> {
  const db = getDatabase();
  const found = db.services.find((s) => s.id === id);
  return found ? { ...found } : null;
}

export async function createService(
  data: Omit<Service, "id" | "createdAt" | "updatedAt">,
): Promise<Service> {
  const db = getDatabase();
  const id = `service-${Date.now()}`;
  const now = new Date().toISOString();
  const newService: Service = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  db.services.push(newService);
  saveDatabase(db);
  return newService;
}

export async function updateService(
  id: string,
  updates: Partial<Service>,
): Promise<Service | null> {
  const db = getDatabase();
  const idx = db.services.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  db.services[idx] = {
    ...db.services[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  return db.services[idx];
}

export async function deleteService(id: string): Promise<boolean> {
  const db = getDatabase();
  const initialLength = db.services.length;
  db.services = db.services.filter((s) => s.id !== id);
  if (db.services.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ─── SKILLS ────────────────────────────────────────────────────────────────

export async function getSkills(options?: {
  publishedOnly?: boolean;
}): Promise<SkillCategory[]> {
  const db = getDatabase();
  let list = [...db.skills];
  if (options?.publishedOnly) {
    list = list.filter((s) => s.published !== false);
  }
  return list.sort((a, b) => a.order - b.order);
}

export async function getSkillById(id: string): Promise<SkillCategory | null> {
  const db = getDatabase();
  const found = db.skills.find((s) => s.id === id);
  return found ? { ...found } : null;
}

export async function createSkill(
  data: Omit<SkillCategory, "id" | "createdAt" | "updatedAt">,
): Promise<SkillCategory> {
  const db = getDatabase();
  const id = `skill-${Date.now()}`;
  const now = new Date().toISOString();
  const newSkill: SkillCategory = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };
  db.skills.push(newSkill);
  saveDatabase(db);
  return newSkill;
}

export async function updateSkill(
  id: string,
  updates: Partial<SkillCategory>,
): Promise<SkillCategory | null> {
  const db = getDatabase();
  const idx = db.skills.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  db.skills[idx] = {
    ...db.skills[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  return db.skills[idx];
}

export async function deleteSkill(id: string): Promise<boolean> {
  const db = getDatabase();
  const initialLength = db.skills.length;
  db.skills = db.skills.filter((s) => s.id !== id);
  if (db.skills.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ─── CONTACT SUBMISSIONS ───────────────────────────────────────────────────

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const db = getDatabase();
  return [...db.submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createContactSubmission(
  data: Omit<ContactSubmission, "id" | "createdAt" | "updatedAt" | "status" | "read" | "archived">,
): Promise<ContactSubmission> {
  const db = getDatabase();
  const id = `sub-${Date.now()}`;
  const now = new Date().toISOString();
  const submission: ContactSubmission = {
    ...data,
    id,
    status: "unread",
    read: false,
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
  db.submissions.unshift(submission);
  saveDatabase(db);
  return submission;
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
  const db = getDatabase();
  const idx = db.submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  db.submissions[idx] = {
    ...db.submissions[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  return db.submissions[idx];
}

export async function deleteContactSubmission(id: string): Promise<boolean> {
  const db = getDatabase();
  const initialLength = db.submissions.length;
  db.submissions = db.submissions.filter((s) => s.id !== id);
  if (db.submissions.length !== initialLength) {
    saveDatabase(db);
    return true;
  }
  return false;
}

export * from "./types";
