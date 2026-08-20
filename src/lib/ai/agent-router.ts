/**
 * Advanced Agentic AI Intent Classifier & Entity Extractor
 * High-speed, zero-dependency natural language intent routing engine with strict scope boundaries.
 */

export type AgentIntent =
  | "PROJECT_CASE_STUDY"
  | "SERVICE_INQUIRY"
  | "TECHNICAL_BLUEPRINT"
  | "TECH_STACK_EXPLORATION"
  | "HIRING_SCOPING"
  | "ROI_ESTIMATION"
  | "FEASIBILITY_CHECK"
  | "ABOUT_BACKGROUND"
  | "GENERAL_INQUIRY"
  | "OUT_OF_SCOPE"
  | "PROMPT_INJECTION_ATTEMPT";

export type DetectedLanguage = "en" | "bn" | "banglish";

export interface AgentAnalysis {
  intent: AgentIntent;
  language: DetectedLanguage;
  entities: string[];
  extractedTech: string[];
  requiresCitations: boolean;
  suggestedAction?:
    | "view_projects"
    | "view_services"
    | "book_call"
    | "contact_form"
    | "view_skills"
    | "estimate_workflow";
}

const TECH_KEYWORD_MAP: Record<string, string> = {
  n8n: "n8n",
  langchain: "LangChain",
  langflow: "Langflow",
  langgraph: "LangGraph",
  crewai: "CrewAI Multi-Agent Swarms",
  autogen: "Microsoft AutoGen",
  python: "Python",
  typescript: "TypeScript",
  pinecone: "Pinecone Vector DB",
  qdrant: "Qdrant Vector DB",
  weaviate: "Weaviate Vector DB",
  chromadb: "ChromaDB",
  mongodb: "MongoDB Atlas",
  openai: "OpenAI GPT-4o / o3-mini",
  gpt: "OpenAI GPT",
  "gpt-4o": "GPT-4o",
  claude: "Anthropic Claude",
  anthropic: "Anthropic Claude 3.5 / 3.7",
  gemini: "Google Gemini 2.0 Flash",
  deepseek: "DeepSeek R1 / V3",
  ollama: "Ollama Local LLMs",
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
  temporal: "Temporal Workflow Orchestration",
  celery: "Celery Distributed Task Queue",
  redis: "Redis Cache & Pub/Sub",
  docker: "Docker Containerization",
  langsmith: "LangSmith AI Tracing",
  helicone: "Helicone AI Observability",
};

// Bengali character unicode range
const BENGALI_REGEX = /[\u0980-\u09FF]/;

// Off-topic patterns to block public ChatGPT/Gemini misuse
const OUT_OF_SCOPE_PATTERNS = [
  /\b(poem|poetry|story|song|essay|joke|riddle|love letter|speech|novel|script for a movie)\b/i,
  /\b(solve|calculate|equation|calculus|physics|math|chemistry|algebra|geometry)\b/i,
  /\b(homework|assignment|exam questions|quiz questions)\b/i,
  /\b(recipe|how to cook|ingredients for|baking)\b/i,
  /\b(weather in|temperature in|forecast for)\b/i,
  /\b(president of|prime minister of|capital of|population of|distance between|history of)\b/i,
  /\b(snake game|flappy bird|tic tac toe|calculator code|leetcode)\b/i,
  /\b(translate this text|summarize this article|proofread this)\b/i,
  /\b(roast me|tell me a joke|dating advice|horoscope|astrology)\b/i,
  /\b(kabita|golpo|gaan|ranna|khabar|songbad|somadhan|ongko|porikkha)\b/i, // Bengali off-topic terms
];

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
    /\b(koro|korba|kivabe|bhalo|kichu|apnar|tumi|amake|dekhao|bolo|achen|ache|lagbe|hobe|jani|parba|dorkar|khoroch)\b/i.test(
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
    q.includes("print env") ||
    q.includes("pretend you are");

  if (isInjection) {
    return {
      intent: "PROMPT_INJECTION_ATTEMPT",
      language,
      entities: ["security_guardrail"],
      extractedTech: [],
      requiresCitations: false,
    };
  }

  // 3. Check for Out-of-Scope / General AI misuse FIRST
  const isExplicitlyOutOfScope = OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(q));
  if (isExplicitlyOutOfScope) {
    return {
      intent: "OUT_OF_SCOPE",
      language,
      entities: [],
      extractedTech: [],
      requiresCitations: false,
      suggestedAction: "view_services",
    };
  }

  // 4. Extract Technical Entities
  const extractedTech: string[] = [];
  for (const [key, formalName] of Object.entries(TECH_KEYWORD_MAP)) {
    if (q.includes(key)) {
      extractedTech.push(formalName);
    }
  }

  // 5. Classify In-Scope Intents
  let intent: AgentIntent = "GENERAL_INQUIRY";
  let suggestedAction: AgentAnalysis["suggestedAction"];

  if (
    /\b(estimate|roi|calculator|cost calculation|pricing breakdown|how much does|how much will|koto khoroch)\b/i.test(
      q,
    )
  ) {
    intent = "ROI_ESTIMATION";
    suggestedAction = "estimate_workflow";
  } else if (
    /\b(contact|hire|book|call|meet|rate|rates|price|pricing|cost|reach|jogajog|kotha bola|schedule a call|schedule call)\b/i.test(
      q,
    )
  ) {
    intent = "HIRING_SCOPING";
    suggestedAction = "book_call";
  } else if (
    /\b(project|projects|case study|case studies|built|demo|example|dekhao|portfolio)\b/i.test(q)
  ) {
    intent = "PROJECT_CASE_STUDY";
    suggestedAction = "view_projects";
  } else if (
    /\b(service|services|offer|solutions|can you build|help with|ki ki service|ki banate paro)\b/i.test(
      q,
    )
  ) {
    intent = "SERVICE_INQUIRY";
    suggestedAction = "view_services";
  } else if (
    /\b(how to build|architecture|pipeline|workflow|diagram|nodes|step by step|kivabe banabo)\b/i.test(
      q,
    )
  ) {
    intent = "TECHNICAL_BLUEPRINT";
    suggestedAction = "view_projects";
  } else if (
    /\b(feasible|possible to|can we automate|automate our|integrate|somvob)\b/i.test(q)
  ) {
    intent = "FEASIBILITY_CHECK";
    suggestedAction = "book_call";
  } else if (
    /\b(stack|tools|tooling|tech|technology|language|framework|skill|skills|dakshata)\b/i.test(q)
  ) {
    intent = "TECH_STACK_EXPLORATION";
    suggestedAction = "view_skills";
  } else if (
    /\b(who is arefin|about arefin|about you|who are you|your background|experience|location|country|dhaka|ke arefin)\b/i.test(
      q,
    )
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
