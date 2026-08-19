import {
  getProjects,
  getServices,
  getBlogPosts,
  getSkills,
  getAboutData,
  getSiteSettings,
} from "@/lib/db";
import type {
  Project,
  Service,
  BlogPost,
  SkillCategory,
  AIKnowledgeConfig,
} from "@/lib/db/types";

export type Citation = {
  title: string;
  url: string;
  type: "project" | "service" | "journal" | "contact" | "about" | "skill";
};

export type RetrievalResult = {
  contextText: string;
  relevantCitations: Citation[];
  matchedKeywords: string[];
};

// Tokenizer & normalizer helper
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

// Compute keyword overlap score
function scoreRelevance(queryTokens: string[], targetText: string, boost = 1): number {
  const targetLower = targetText.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    if (targetLower.includes(token)) {
      score += 1 * boost;
      if (token.length > 4) score += 1; // reward longer specific words
    }
  }
  return score;
}

export async function retrievePortfolioContext(
  query: string,
  knowledgeConfig?: Partial<AIKnowledgeConfig>,
): Promise<RetrievalResult> {
  const queryTokens = tokenize(query);
  const qLower = query.toLowerCase();

  const enabled = {
    projects: knowledgeConfig?.enabledCollections?.projects !== false,
    services: knowledgeConfig?.enabledCollections?.services !== false,
    posts: knowledgeConfig?.enabledCollections?.posts !== false,
    skills: knowledgeConfig?.enabledCollections?.skills !== false,
    about: knowledgeConfig?.enabledCollections?.about !== false,
  };

  const topK = knowledgeConfig?.topK ?? 4;
  const minScore = knowledgeConfig?.minRelevanceScore ?? 1;

  // Fetch only enabled, published public portfolio data
  const [projects, services, posts, skills, about, settings] = await Promise.all([
    enabled.projects ? getProjects({ publishedOnly: true }) : Promise.resolve([]),
    enabled.services ? getServices({ publishedOnly: true }) : Promise.resolve([]),
    enabled.posts ? getBlogPosts({ publishedOnly: true }) : Promise.resolve([]),
    enabled.skills ? getSkills({ publishedOnly: true }) : Promise.resolve([]),
    enabled.about ? getAboutData() : Promise.resolve(null),
    getSiteSettings(),
  ]);

  const citations: Citation[] = [];
  const matchedKeywords: string[] = [];

  // Score projects
  const scoredProjects = projects.map((p: Project) => {
    const text = `${p.title} ${p.category} ${p.summary} ${p.problem} ${p.goal} ${p.aiRole} ${p.automationLogic} ${(p.stack || []).join(" ")} ${(p.integrations || []).join(" ")}`;
    const score = scoreRelevance(queryTokens, text, 2);
    return { project: p, score };
  });
  scoredProjects.sort((a, b) => b.score - a.score);

  // Score services
  const scoredServices = services.map((s: Service) => {
    const text = `${s.title} ${s.hook} ${s.problem} ${s.solution} ${s.outcome} ${(s.bullets || []).join(" ")}`;
    const score = scoreRelevance(queryTokens, text, 1.5);
    return { service: s, score };
  });
  scoredServices.sort((a, b) => b.score - a.score);

  // Score blog posts
  const scoredPosts = posts.map((p: BlogPost) => {
    const text = `${p.title} ${p.excerpt} ${p.category} ${(p.tags || []).join(" ")}`;
    const score = scoreRelevance(queryTokens, text, 1.2);
    return { post: p, score };
  });
  scoredPosts.sort((a, b) => b.score - a.score);

  // Pick top items
  const isGeneralQuery =
    queryTokens.length === 0 ||
    qLower.includes("what can") ||
    qLower.includes("build") ||
    qLower.includes("who is") ||
    qLower.includes("overview") ||
    qLower.includes("work");

  const topProjects = isGeneralQuery
    ? scoredProjects.slice(0, topK).map((x) => x.project)
    : scoredProjects.filter((x) => x.score >= minScore).slice(0, topK).map((x) => x.project);

  const topServices = isGeneralQuery
    ? scoredServices.slice(0, Math.min(topK, 3)).map((x) => x.service)
    : scoredServices.filter((x) => x.score >= minScore).slice(0, 3).map((x) => x.service);

  const topPosts = isGeneralQuery
    ? scoredPosts.slice(0, 2).map((x) => x.post)
    : scoredPosts.filter((x) => x.score >= minScore).slice(0, 2).map((x) => x.post);

  // Build context sections
  const contextParts: string[] = [];

  contextParts.push(`DEVELOPER PROFILE:
Name: ${settings.name || "Arefin Mueen"}
Role: ${settings.role || "AI Automation & AI Agent Developer"}
Location: Dhaka, Bangladesh (GMT+6) — Available for remote worldwide projects.
Availability Status: ${settings.availabilityNote || "Available for projects"}
Short Bio: ${settings.shortBio || about?.bio || "Specialist in practical AI workflows, tool-calling autonomous agents, RAG knowledge retrieval, and custom API integrations."}
Core Stack: n8n, LangChain, Langflow, OpenAI & Anthropic Claude APIs, Vector DBs (Pinecone), Python, TypeScript, REST APIs, Webhooks, MongoDB.`);

  if (topProjects.length > 0) {
    contextParts.push(`\nRELEVANT PROJECTS & CASE STUDIES:`);
    for (const p of topProjects) {
      citations.push({
        title: p.title,
        url: `/projects/${p.slug}`,
        type: "project",
      });
      contextParts.push(`- Project: "${p.title}" (URL: /projects/${p.slug})
  Category: ${p.category}
  Summary: ${p.summary}
  Goal & Solution: ${p.goal || p.problem}
  AI Role: ${p.aiRole || "LLM reasoning and dynamic output extraction"}
  Key Stack: ${(p.stack || []).slice(0, 5).join(", ")}`);
    }
  }

  if (topServices.length > 0) {
    contextParts.push(`\nSERVICES & CAPABILITY BLUEPRINTS:`);
    for (const s of topServices) {
      citations.push({
        title: s.title,
        url: "/services",
        type: "service",
      });
      contextParts.push(`- Service: "${s.title}" (URL: /services)
  Solution: ${s.solution || s.hook}
  Key Deliverables: ${(s.bullets || []).slice(0, 3).join("; ")}`);
    }
  }

  if (topPosts.length > 0) {
    contextParts.push(`\nENGINEERING JOURNAL & BUILD NOTES:`);
    for (const p of topPosts) {
      citations.push({
        title: p.title,
        url: `/blog/${p.slug}`,
        type: "journal",
      });
      contextParts.push(`- Note: "${p.title}" (URL: /blog/${p.slug})
  Excerpt: ${p.excerpt}`);
    }
  }

  // Skills overview
  const publishedSkills = skills.filter((s: SkillCategory) => s.published !== false);
  if (publishedSkills.length > 0) {
    contextParts.push(`\nVERIFIED SKILLS & TOOLING:`);
    for (const sk of publishedSkills) {
      contextParts.push(`- ${sk.category}: ${(sk.items || []).join(", ")}`);
    }
  }

  // Engagement & Contact info
  contextParts.push(`\nENGAGEMENT & CONTACT:
- Direct Contact Form: /contact
- Booking Discovery Call: /book (30-minute scoping consultation)
- Direct WhatsApp: ${settings.phoneE164 ? `+${settings.phoneE164}` : "+880 1994-605717"}
- Email: ${settings.email || "arefinmueen360@gmail.com"}
- Pricing & Scoping Policy: Projects are custom-scoped based on workflow complexity, node counts, and integration endpoints.`);

  // Priority citations based on direct intent
  const priorityCitations: Citation[] = [];

  if (qLower.includes("contact") || qLower.includes("hire") || qLower.includes("reach") || qLower.includes("book")) {
    priorityCitations.push({
      title: "Contact & Scoping",
      url: "/contact",
      type: "contact",
    });
    priorityCitations.push({
      title: "Schedule Scoping Call",
      url: "/book",
      type: "contact",
    });
  }

  if (qLower.includes("stack") || qLower.includes("skill") || qLower.includes("tool")) {
    priorityCitations.push({
      title: "Technical Stack",
      url: "/skills",
      type: "skill",
    });
  }

  if (qLower.includes("about") || qLower.includes("who is")) {
    priorityCitations.push({
      title: "About Arefin",
      url: "/about",
      type: "about",
    });
  }

  // Combine priority citations first, then project/service/journal citations
  const allCitations = [...priorityCitations, ...citations];

  // Deduplicate citations by URL
  const uniqueCitations: Citation[] = [];
  const seenUrls = new Set<string>();
  for (const c of allCitations) {
    if (!seenUrls.has(c.url)) {
      seenUrls.add(c.url);
      uniqueCitations.push(c);
    }
  }

  const matchedKeywordSet = new Set<string>();
  for (const token of queryTokens) {
    if (token.length > 2) {
      const matchInProjects = projects.some(
        (p) =>
          p.title.toLowerCase().includes(token) ||
          (p.stack || []).some((s) => s.toLowerCase().includes(token)) ||
          p.category.toLowerCase().includes(token),
      );
      const matchInServices = services.some(
        (s) => s.title.toLowerCase().includes(token) || (s.bullets || []).some((b) => b.toLowerCase().includes(token)),
      );
      const matchInPosts = posts.some(
        (p) => p.title.toLowerCase().includes(token) || (p.tags || []).some((t) => t.toLowerCase().includes(token)),
      );
      const matchInSkills = skills.some(
        (sk) => sk.category.toLowerCase().includes(token) || (sk.items || []).some((i) => i.toLowerCase().includes(token)),
      );

      if (matchInProjects || matchInServices || matchInPosts || matchInSkills) {
        matchedKeywordSet.add(token);
      }
    }
  }

  const rawContext = contextParts.join("\n");
  const boundedContext =
    rawContext.length > (knowledgeConfig?.contextBudgetChars || 5000)
      ? rawContext.slice(0, knowledgeConfig?.contextBudgetChars || 5000) + "\n...[truncated]"
      : rawContext;

  const secureContextText = `<context_knowledge>\n${boundedContext}\n</context_knowledge>`;

  return {
    contextText: secureContextText,
    relevantCitations: uniqueCitations.slice(0, 4),
    matchedKeywords: Array.from(matchedKeywordSet),
  };
}
