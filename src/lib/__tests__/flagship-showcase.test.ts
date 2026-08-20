import { describe, it, expect } from "vitest";
import type { Project } from "@/lib/db/types";

describe("Flagship Showcase Filtering & Selection Logic", () => {
  const mockProjects: Project[] = [
    {
      id: "p1",
      title: "Project 1 Non-Featured",
      slug: "project-1",
      category: "Automation",
      summary: "First non-featured project",
      featured: false,
      published: true,
      order: 1,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "p2",
      title: "Project 2 Featured Hero",
      slug: "project-2",
      category: "AI Agents",
      summary: "Featured AI Agent project",
      featured: true,
      published: true,
      order: 2,
      createdAt: "2026-01-02T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    },
    {
      id: "p3",
      title: "Project 3 Featured Secondary",
      slug: "project-3",
      category: "RAG Systems",
      summary: "Featured RAG project",
      featured: true,
      published: true,
      order: 3,
      createdAt: "2026-01-03T00:00:00Z",
      updatedAt: "2026-01-03T00:00:00Z",
    },
    {
      id: "p4",
      title: "Project 4 Draft",
      slug: "project-4",
      category: "Automation",
      summary: "Unpublished draft project",
      featured: true,
      published: false,
      order: 4,
      createdAt: "2026-01-04T00:00:00Z",
      updatedAt: "2026-01-04T00:00:00Z",
    },
    {
      id: "p5",
      title: "Project 5 Backup",
      slug: "project-5",
      category: "Automation",
      summary: "Fifth project",
      featured: false,
      published: true,
      order: 5,
      createdAt: "2026-01-05T00:00:00Z",
      updatedAt: "2026-01-05T00:00:00Z",
    },
  ];

  function getFlagshipProjects(projects: Project[]) {
    const published = projects.filter((p) => p.published !== false);
    const featured = published.filter((p) => p.featured);
    const nonFeatured = published.filter((p) => !p.featured);
    return [...featured, ...nonFeatured].slice(0, 3);
  }

  it("prioritizes featured projects and limits the showcase to exactly 3 projects", () => {
    const flagship = getFlagshipProjects(mockProjects);

    expect(flagship.length).toBe(3);
    // p2 and p3 are featured and published
    expect(flagship[0].slug).toBe("project-2");
    expect(flagship[1].slug).toBe("project-3");
    // p1 fills the 3rd slot (p4 is skipped because published: false)
    expect(flagship[2].slug).toBe("project-1");
  });

  it("never includes unpublished draft projects", () => {
    const flagship = getFlagshipProjects(mockProjects);
    const hasUnpublished = flagship.some((p) => p.published === false);
    expect(hasUnpublished).toBe(false);
  });

  it("handles fewer than 3 projects gracefully without creating fake placeholders", () => {
    const single = [mockProjects[1]];
    const flagship = getFlagshipProjects(single);
    expect(flagship.length).toBe(1);
    expect(flagship[0].slug).toBe("project-2");
  });

  it("returns an empty array when no published projects exist", () => {
    const emptyFlagship = getFlagshipProjects([]);
    expect(emptyFlagship).toEqual([]);

    const onlyDrafts = [mockProjects[3]];
    expect(getFlagshipProjects(onlyDrafts)).toEqual([]);
  });
});
