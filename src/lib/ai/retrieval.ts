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
import { analyzeUserQuery } from "./agent-router";

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

// Compute keyword overlap score with entity and length boosting
function scoreRelevance(queryTokens: string[], targetText: string, boost = 1): number {
  const targetLower = targetText.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    if (targetLower.includes(token)) {
      score += 1 * boost;
      if (token.length > 4) score += 1.5; // reward specific long technical keywords
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
  const analysis = analyzeUserQuery(query);

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

  // Score projects with tech entity boosting
  const scoredProjects = projects.map((p: Project) => {
    const text = `${p.title} ${p.category} ${p.summary} ${p.problem} ${p.goal} ${p.aiRole} ${p.automationLogic} ${(p.stack || []).join(" ")} ${(p.integrations || []).join(" ")}`;
    let score = scoreRelevance(queryTokens, text, 2);

    // Boost if matching extracted tech entities
    for (const tech of analysis.extractedTech) {
      if (text.toLowerCase().includes(tech.toLowerCase())) {
        score += 3;
      }
    }
    if (analysis.intent === "PROJECT_CASE_STUDY" || analysis.intent === "TECHNICAL_BLUEPRINT") {
      score += 2;
    }
    return { project: p, score };
  });
  scoredProjects.sort((a, b) => b.score - a.score);

  // Score services
  const scoredServices = services.map((s: Service) => {
    const text = `${s.title} ${s.hook} ${s.problem} ${s.solution} ${s.outcome} ${(s.bullets || []).join(" ")}`;
    let score = scoreRelevance(queryTokens, text, 1.5);
    if (analysis.intent === "SERVICE_INQUIRY" || analysis.intent === "FEASIBILITY_CHECK") {
      score += 2.5;
    }
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
    qLower.includes("work") ||
    analysis.intent === "GENERAL_INQUIRY";

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
Availability Status: ${settings.availabilityNote || "Available for high-impact AI agent & workflow projects"}
Short Bio: ${settings.shortBio || about?.bio || "Specialist in practical AI workflows, tool-calling autonomous agents, RAG knowledge retrieval, and custom API integrations."}
Core Tech Stack: n8n, LangChain, Langflow, LangGraph, OpenAI GPT-4o, Anthropic Claude 3.5 & 3.7, Google Gemini 2.0, Vector DBs (Pinecone), Python, FastAPI, TypeScript, REST APIs, Webhooks, MongoDB Atlas.`);

  if (topProjects.length > 0) {
    contextParts.push(`\nRELEVANT PROJECTS & CASE STUDIES (AUTHORITATIVE):`);
    for (const p of topProjects) {
      citations.push({
        title: p.title,
        url: `/projects/${p.slug}`,
        type: "project",
      });
      contextParts.push(`- Project: "${p.title}"
  URL: /projects/${p.slug}
  Category: ${p.category}
  Summary: ${p.summary}
  Problem Solved: ${p.problem}
  Goal & Architecture: ${p.goal}
  Automation Logic: ${p.automationLogic || "Event-driven workflow execution"}
  AI Role: ${p.aiRole || "LLM reasoning and dynamic output extraction"}
  Tech Stack: ${(p.stack || []).join(", ")}
  Integrations: ${(p.integrations || []).join(", ")}`);
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
  Hook: ${s.hook}
  Problem Addressed: ${s.problem}
  Solution & Architecture: ${s.solution}
  Client Outcome: ${s.outcome || "Increased operational efficiency and reduced manual overhead"}
  Key Deliverables: ${(s.bullets || []).join("; ")}`);
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
  Category: ${p.category}
  Excerpt: ${p.excerpt}`);
    }
  }

  // Skills overview
  const publishedSkills = skills.filter((s: SkillCategory) => s.published !== false);
  if (publishedSkills.length > 0) {
    contextParts.push(`\nVERIFIED SKILLS & TOOLING MATRIX:`);
    for (const sk of publishedSkills) {
      contextParts.push(`- ${sk.category}: ${(sk.items || []).join(", ")}`);
    }
  }

  // Engagement & Contact info
  contextParts.push(`\nENGAGEMENT & BOOKING CHANNELS:
- Direct Contact Form: /contact
- Booking Discovery Call: /book (30-minute scoping consultation)
- Direct WhatsApp: ${settings.phoneE164 ? `+${settings.phoneE164}` : "+880 1994-605717"}
- Email: ${settings.email || "arefinmueen360@gmail.com"}
- Pricing & Scoping Policy: Custom-scoped based on workflow complexity, node counts, LLM token requirements, and integration endpoints.`);

  // Priority citations based on direct intent
  const priorityCitations: Citation[] = [];

  if (analysis.intent === "HIRING_SCOPING" || qLower.includes("contact") || qLower.includes("hire") || qLower.includes("book")) {
    priorityCitations.push({
      title: "Schedule Discovery Call",
      url: "/book",
      type: "contact",
    });
    priorityCitations.push({
      title: "Contact Form",
      url: "/contact",
      type: "contact",
    });
  }

  if (analysis.intent === "TECH_STACK_EXPLORATION" || qLower.includes("stack") || qLower.includes("skill")) {
    priorityCitations.push({
      title: "Technical Stack Matrix",
      url: "/skills",
      type: "skill",
    });
  }

  if (analysis.intent === "ABOUT_BACKGROUND" || qLower.includes("about") || qLower.includes("who is")) {
    priorityCitations.push({
      title: "About Arefin Mueen",
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

  const matchedKeywordSet = new Set<string>(analysis.extractedTech);
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
