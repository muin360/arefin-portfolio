/**
 * Advanced Agentic AI Intent Classifier & Entity Extractor
 * High-speed, zero-dependency natural language intent routing engine.
 */

export type AgentIntent =
  | "PROJECT_CASE_STUDY"
  | "SERVICE_INQUIRY"
  | "TECHNICAL_BLUEPRINT"
  | "TECH_STACK_EXPLORATION"
  | "HIRING_SCOPING"
  | "FEASIBILITY_CHECK"
  | "ABOUT_BACKGROUND"
  | "GENERAL_INQUIRY"
  | "PROMPT_INJECTION_ATTEMPT";

export type DetectedLanguage = "en" | "bn" | "banglish";

export interface AgentAnalysis {
  intent: AgentIntent;
  language: DetectedLanguage;
  entities: string[];
  extractedTech: string[];
  requiresCitations: boolean;
  suggestedAction?: "view_projects" | "view_services" | "book_call" | "contact_form" | "view_skills";
}

const TECH_KEYWORD_MAP: Record<string, string> = {
  n8n: "n8n",
  langchain: "LangChain",
  langflow: "Langflow",
  langgraph: "LangGraph",
  python: "Python",
  typescript: "TypeScript",
  pinecone: "Pinecone Vector DB",
  mongodb: "MongoDB Atlas",
  openai: "OpenAI GPT-4o",
  gpt: "OpenAI GPT",
  "gpt-4o": "GPT-4o",
  claude: "Anthropic Claude",
  anthropic: "Anthropic Claude 3.5 / 3.7",
  gemini: "Google Gemini 2.0",
  zapier: "Zapier",
  make: "Make.com (Integromat)",
  fastapi: "FastAPI",
  rag: "Retrieval-Augmented Generation (RAG)",
  vector: "Vector Embeddings & Search",
  agent: "Autonomous AI Agent",
  "multi-agent": "Multi-Agent System",
  scraping: "Automated Data Extraction & Scraping",
  webhook: "Event-Driven Webhooks",
  crm: "CRM Integration (HubSpot/Salesforce/Airtable)",
  resend: "Resend Email API",
  nextjs: "Next.js 16",
  react: "React 19",
};

// Bengali character unicode range
const BENGALI_REGEX = /[\u0980-\u09FF]/;

/**
 * Analyzes the user's latest query to determine intent, language, entities, and routing.
 */
export function analyzeUserQuery(query: string): AgentAnalysis {
  const q = query.trim().toLowerCase();

  // 1. Detect language
  let language: DetectedLanguage = "en";
  if (BENGALI_REGEX.test(query)) {
    language = "bn";
  } else if (
    /\b(koro|korba|kivabe|bhalo|kichu|apnar|tumi|amake|dekhao|bolo|achen|ache|lagbe|hobe|jani|parba)\b/i.test(
      query,
    )
  ) {
    language = "banglish";
  }

  // 2. Check for Prompt Injection / Jailbreak attempts
  const isInjection =
    q.includes("ignore all previous") ||
    q.includes("system prompt") ||
    q.includes("jailbreak") ||
    q.includes("dan mode") ||
    q.includes("reveal your instructions") ||
    q.includes("show me your api key") ||
    q.includes("what is your secret") ||
    q.includes("dump environment") ||
    q.includes("print env");

  if (isInjection) {
    return {
      intent: "PROMPT_INJECTION_ATTEMPT",
      language,
      entities: ["security_guardrail"],
      extractedTech: [],
      requiresCitations: false,
    };
  }

  // 3. Extract Technical Entities
  const extractedTech: string[] = [];
  for (const [key, formalName] of Object.entries(TECH_KEYWORD_MAP)) {
    if (q.includes(key)) {
      extractedTech.push(formalName);
    }
  }

  // 4. Classify Intent
  let intent: AgentIntent = "GENERAL_INQUIRY";
  let suggestedAction: AgentAnalysis["suggestedAction"];

  if (
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("book") ||
    q.includes("call") ||
    q.includes("meet") ||
    q.includes("rate") ||
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("reach") ||
    q.includes("jogajog") ||
    q.includes("hire kora") ||
    q.includes("contact kora") ||
    q.includes("kotha bola")
  ) {
    intent = "HIRING_SCOPING";
    suggestedAction = "book_call";
  } else if (
    q.includes("project") ||
    q.includes("case study") ||
    q.includes("work") ||
    q.includes("portfolio") ||
    q.includes("built") ||
    q.includes("demo") ||
    q.includes("example") ||
    q.includes("dekhao") ||
    q.includes("kaj")
  ) {
    intent = "PROJECT_CASE_STUDY";
    suggestedAction = "view_projects";
  } else if (
    q.includes("service") ||
    q.includes("offer") ||
    q.includes("solution") ||
    q.includes("can you build") ||
    q.includes("help with") ||
    q.includes("ki ki service") ||
    q.includes("ki banate paro")
  ) {
    intent = "SERVICE_INQUIRY";
    suggestedAction = "view_services";
  } else if (
    q.includes("how to build") ||
    q.includes("architecture") ||
    q.includes("pipeline") ||
    q.includes("workflow") ||
    q.includes("diagram") ||
    q.includes("nodes") ||
    q.includes("step by step") ||
    q.includes("kivabe banabo")
  ) {
    intent = "TECHNICAL_BLUEPRINT";
    suggestedAction = "view_projects";
  } else if (
    q.includes("feasible") ||
    q.includes("possible to") ||
    q.includes("can we automate") ||
    q.includes("automate our") ||
    q.includes("integrate") ||
    q.includes("somvob")
  ) {
    intent = "FEASIBILITY_CHECK";
    suggestedAction = "book_call";
  } else if (
    q.includes("stack") ||
    q.includes("tool") ||
    q.includes("tech") ||
    q.includes("language") ||
    q.includes("framework") ||
    q.includes("skill") ||
    q.includes("dakshata")
  ) {
    intent = "TECH_STACK_EXPLORATION";
    suggestedAction = "view_skills";
  } else if (
    q.includes("about") ||
    q.includes("who is") ||
    q.includes("background") ||
    q.includes("experience") ||
    q.includes("location") ||
    q.includes("country") ||
    q.includes("dhaka") ||
    q.includes("ke arefin")
  ) {
    intent = "ABOUT_BACKGROUND";
  }

  return {
    intent,
    language,
    entities: extractedTech,
    extractedTech,
    requiresCitations: true,
    suggestedAction,
  };
}
