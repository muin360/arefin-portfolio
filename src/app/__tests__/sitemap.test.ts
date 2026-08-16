import { describe, it, expect, vi } from "vitest";

// Mock sanityFetch so tests run offline
vi.mock("@/sanity/fetch", () => ({
  sanityFetch: vi.fn().mockResolvedValue([]),
}));

import sitemap from "../sitemap";
import { SITE_URL } from "@/lib/site-url";

describe("sitemap generator", () => {
  it("generates static, project, and fallback blog routes", async () => {
    const entries = await sitemap();
    expect(entries.length).toBeGreaterThan(10);

    const urls = entries.map((e) => e.url);

    // Verify key core pages
    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/projects`);
    expect(urls).toContain(`${SITE_URL}/services`);
    expect(urls).toContain(`${SITE_URL}/blog`);
    expect(urls).toContain(`${SITE_URL}/contact`);

    // Verify fallback blog posts are generated
    expect(urls).toContain(`${SITE_URL}/blog/why-every-business-needs-ai-automation`);
    expect(urls).toContain(`${SITE_URL}/blog/n8n-vs-zapier-vs-make`);

    // Verify fallback project routes are generated
    expect(urls).toContain(`${SITE_URL}/projects/ai-lead-qualification-agent`);
  });
});

