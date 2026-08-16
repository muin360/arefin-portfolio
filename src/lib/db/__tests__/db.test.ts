import { describe, it, expect, beforeEach } from "vitest";
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getServices,
  getSkills,
  getAboutData,
  getSiteSettings,
  updateSiteSettings,
  createContactSubmission,
  getContactSubmissions,
  markSubmissionRead,
  archiveSubmission,
  deleteContactSubmission,
} from "@/lib/db";

describe("Application Database & Content Store", () => {
  it("fetches seeded projects", async () => {
    const projects = await getProjects();
    expect(projects.length).toBeGreaterThan(0);
    const published = await getProjects({ publishedOnly: true });
    expect(published.every((p) => p.published)).toBe(true);
  });

  it("creates, updates, and deletes a project", async () => {
    const newProject = await createProject({
      title: "Test AI Workflow",
      slug: "test-ai-workflow-temp",
      category: "AI Automation",
      summary: "A test automation workflow for verification",
      problem: "Manual testing takes time",
      goal: "Automate test suite",
      stack: ["n8n", "Python"],
      iconName: "workflow",
      published: true,
      featured: false,
    });

    expect(newProject.id).toBeDefined();
    expect(newProject.slug).toBe("test-ai-workflow-temp");

    const found = await getProjectBySlug("test-ai-workflow-temp");
    expect(found).toBeDefined();
    expect(found?.title).toBe("Test AI Workflow");

    const updated = await updateProject(newProject.id, {
      title: "Updated AI Workflow",
    });
    expect(updated?.title).toBe("Updated AI Workflow");

    const deleted = await deleteProject(newProject.id);
    expect(deleted).toBe(true);

    const checkGone = await getProjectBySlug("test-ai-workflow-temp");
    expect(checkGone).toBeNull();
  });

  it("creates, reads, and updates blog posts", async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);

    const newPost = await createBlogPost({
      title: "Testing Database Post",
      slug: "testing-db-post-temp",
      excerpt: "A temporary post for test verification",
      content: "# Hello World\nThis is a test post content.",
      date: new Date().toISOString(),
      category: "Build Notes",
      tags: ["Test", "DB"],
      published: true,
      featured: false,
    });

    expect(newPost.id).toBeDefined();
    const found = await getBlogPostBySlug("testing-db-post-temp");
    expect(found?.title).toBe("Testing Database Post");

    await deleteBlogPost(newPost.id);
    const checkGone = await getBlogPostBySlug("testing-db-post-temp");
    expect(checkGone).toBeNull();
  });

  it("reads services, skills, and about data", async () => {
    const services = await getServices();
    expect(services.length).toBeGreaterThan(0);

    const skills = await getSkills();
    expect(skills.length).toBeGreaterThan(0);

    const about = await getAboutData();
    expect(about.bio).toBeDefined();
    expect(about.principles.length).toBeGreaterThan(0);
  });

  it("reads and updates site settings", async () => {
    const settings = await getSiteSettings();
    expect(settings.name).toBe("Arefin Mueen");

    const updated = await updateSiteSettings({
      availabilityNote: "Open for Q3 projects",
    });
    expect(updated.availabilityNote).toBe("Open for Q3 projects");
  });

  it("manages contact form submissions", async () => {
    const sub = await createContactSubmission({
      name: "John Doe",
      email: "john@example.com",
      subject: "AI automation project",
      message: "Hello, looking to build an n8n integration.",
    });

    expect(sub.id).toBeDefined();
    expect(sub.read).toBe(false);

    const allSubs = await getContactSubmissions();
    expect(allSubs.some((s) => s.id === sub.id)).toBe(true);

    const marked = await markSubmissionRead(sub.id, true);
    expect(marked?.read).toBe(true);

    const archived = await archiveSubmission(sub.id, true);
    expect(archived?.archived).toBe(true);

    const deleted = await deleteContactSubmission(sub.id);
    expect(deleted).toBe(true);
  });
});
