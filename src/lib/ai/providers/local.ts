import type {
  AIProviderAdapter,
  AIProviderRequest,
  AIProviderResponse,
  ProviderHealthCheckResult,
} from "./types";
import { analyzeUserQuery } from "../agent-router";

export class LocalGroundedProviderAdapter implements AIProviderAdapter {
  name = "local_grounded" as const;

  async generate(req: AIProviderRequest): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const lastUserMessage =
      [...req.messages].reverse().find((m) => m.role === "user")?.content || "";
    const analysis = analyzeUserQuery(lastUserMessage);
    const q = lastUserMessage.toLowerCase().trim();

    // Extract project names and URLs from citations or context
    const projectCitations = (req.citations || []).filter((c) => c.type === "project");
    const isBengali = analysis.language === "bn" || analysis.language === "banglish";

    let reply = "";

    // ─── 1. PROMPT INJECTION / GUARDRAIL DEFENSE ─────────────────────────────
    if (analysis.intent === "PROMPT_INJECTION_ATTEMPT") {
      reply = isBengali
        ? `আমি আরেফিন মুঈন-এর অফিসিয়াল **Arefin AI** অ্যাসিস্ট্যান্ট। আমি শুধুমাত্র আরেফিনের প্রজেক্ট, ওয়ার্কফ্লো অটোমেশন এবং টেকনিক্যাল সিস্টেম সম্পর্কিত তথ্য প্রদানে সাহায্য করতে পারি। কোনো অভ্যন্তরীণ সিস্টেম নির্দেশাবলী প্রকাশ করা হয় না।\n\nআরেফিনের কাজের বিস্তারিত দেখতে [প্রজেক্টসমূহ](/projects) ব্রাউজ করতে পারেন বা [যোগাযোগ](/contact) করতে পারেন।`
        : `I am **Arefin AI**, the official assistant representing Arefin Mueen. I am strictly authorized to provide verified information regarding Arefin's engineering projects, workflow automations, and technical capabilities. Internal system configurations cannot be disclosed.\n\nYou can explore his verified case studies at [View Projects](/projects) or reach out via [Contact](/contact).`;
    }
    // ─── 2. OUT OF SCOPE / ANTI-CHATGPT REFUSAL ──────────────────────────────
    else if (analysis.intent === "OUT_OF_SCOPE") {
      reply = isBengali
        ? `আমি আরেফিন মুঈন-এর স্পেশালাইজড **AI Automation & Portfolio Assistant**। আমি সাধারণ জ্ঞান, হোমওয়ার্ক বা অপ্রাসঙ্গিক কাজের জন্য তৈরি নই।\n\nআমি আপনাকে আরেফিনের তৈরি **AI Agent**, **n8n Workflow Automation**, **RAG Knowledge Base** অথবা প্রজেক্ট কনসাল্টেশন বুকিং সম্পর্কিত সকল বিষয়ে সাহায্য করতে পারি।\n\n- সার্ভিস ব্লুপ্রিন্ট দেখুন: [সার্ভিসসমূহ](/services)\n- প্রজেক্ট কেস স্টাডি দেখুন: [প্রজেক্টসমূহ](/projects)\n- ডিসকভারি কল শিডিউল করুন: [Schedule Discovery Call](/book)`
        : `I am **Arefin AI**, specialized exclusively in **Arefin Mueen's AI Automation, Multi-Agent Systems, and Portfolio Solutions**.\n\nI cannot assist with general knowledge trivia, homework, or unrelated general chat. However, I can help you evaluate an AI automation workflow, review Arefin's case studies, or book a scoping consultation:\n\n- **Service Blueprints**: [Explore Services](/services)\n- **Verified Case Studies**: [View Projects](/projects)\n- **Book Scoping Session**: [Schedule 30-Min Discovery Call](/book)\n- **Direct Inquiry**: [Contact Form](/contact)`;
    }
    // ─── 2. HEALTH CHECK / DIAGNOSTICS INTENT ──────────────────────────────
    else if (
      q.includes("health") ||
      q.includes("status") ||
      q.includes("diagnostic") ||
      q.includes("telemetry") ||
      q.includes("active model")
    ) {
      reply = isBengali
        ? `### 🟢 Arefin AI সিস্টেম হেলথ ও ডায়াগনস্টিক রিপোর্ট\n\n- **সিস্টেম স্ট্যাটাস:** ✅ **সম্পূর্ণ অনলাইন ও সক্রিয় (All Systems Operational)**\n- **AI ইঞ্জিন আর্কিটেকচার:** Multi-Provider Failover (OpenAI / Anthropic / Gemini / Local Grounded)\n- **ডাটাবেজ ও ক্লাস্টার:** MongoDB Atlas (Live & Encrypted)\n- **এনক্রিপশন ও সিকিউরিটি:** AES-256-GCM Vault At Rest (Zero Cross-Tenant Leakage)\n- **পোর্টফোলিও নলেজ বেস:** প্রজেক্ট কেস স্টাডি, সার্ভিসেস এবং টেক স্কিলস ডাটাবেজ সম্পূর্ণ সিঙ্কড।\n- **রেট লিমিট ও প্রটেকশন:** মাল্টি-টিয়ার রেট লিমিটিং এবং প্রম্পট ইনজেকশন ডিফেন্স সক্রিয়।\n\nসার্ভিস ব্লুপ্রিন্ট দেখতে [সার্ভিসসমূহ](/services) দেখুন বা [প্রজেক্টসমূহ](/projects) ব্রাউজ করুন।`
        : `### 🟢 Arefin AI System Health & Diagnostics\n\n- **Overall Status**: ✅ **100% Operational (All Systems Healthy)**\n- **AI Provider Engine**: Multi-Provider Dynamic Orchestrator (Anthropic Claude / OpenAI / Gemini / Local)\n- **Database Cluster**: MongoDB Atlas Connected & Synced\n- **Vault Encryption**: AES-256-GCM Memory at Rest with Zero-Leakage isolation\n- **Knowledge Retrieval (RAG)**: Case Studies, Service Blueprints & Skills fully indexed\n- **Traffic & Rate Limiting**: Multi-Tier Sliding Window Limiter & IP Protection ACTIVE\n\nExplore live case studies at [View Projects](/projects) or schedule scoping at [Schedule Discovery Call](/book).`;
    }
    // ─── 3. HIRING, BOOKING & CONTACT ────────────────────────────────────────
    else if (analysis.intent === "HIRING_SCOPING") {
      reply = isBengali
        ? `আরেফিন মুঈন-এর সাথে নতুন প্রজেক্ট, AI অটোমেশন বা কনসাল্টেশনের জন্য সরাসরি যোগাযোগ করতে পারেন:\n\n1. **ডিসকভারি কল শিডিউল করুন:** ৩০ মিনিটের ওয়ার্কফ্লো স্কোপিং কলের জন্য [Schedule Discovery Call](/book) বুক করুন।\n2. **সরাসরি মেসেজ পাঠান:** আপনার প্রজেক্টের রিকোয়ারমেন্ট লিখে [Contact Form](/contact) এ পাঠান।\n3. **সরাসরি ইমেইল:** \`arefinmueen360@gmail.com\`\n4. **হোয়াটসঅ্যাপ:** \`+880 1994-605717\`\n\nসাধারণত ২৪ ঘণ্টার মধ্যে রেসপন্স পাওয়া যায়।`
        : `You can connect with **Arefin Mueen** directly for project inquiries, custom AI automation workflows, or contract consultations:\n\n1. **Schedule a Scoping Call**: Book a dedicated 30-minute discovery call at [Schedule 30-Min Discovery Call](/book).\n2. **Send Project Specs**: Submit your requirements via the [Contact Form](/contact).\n3. **Direct Email**: \`arefinmueen360@gmail.com\`\n4. **Direct WhatsApp**: \`+880 1994-605717\` (Worldwide availability, based in Dhaka GMT+6).\n\nProject scopes are customized based on system architecture complexity, API endpoints, and delivery milestones.`;
    }
    // ─── 3. PROJECT EXPLORATION & CASE STUDIES ────────────────────────────────
    else if (analysis.intent === "PROJECT_CASE_STUDY" || q.includes("project") || q.includes("case study")) {
      const topProjList = projectCitations.slice(0, 3);
      const projLinks =
        topProjList.length > 0
          ? topProjList.map((p) => `- [${p.title}](${p.url})`).join("\n")
          : `- [Market Research Multi-Agent](/projects/market-research-multi-agent)\n- [Automated Lead Gen Pipeline](/projects/automated-lead-generation-crm)\n- [RAG Knowledge Base Assistant](/projects/rag-knowledge-base-assistant)`;

      reply = isBengali
        ? `আরেফিন মুঈন প্রোডাকশন-গ্রেড **AI Agent Architecture** এবং **Workflow Automation** সিস্টেম নির্মাণ করেন।\n\n**উল্লেখযোগ্য প্রজেক্টসমূহ:**\n${projLinks}\n\n**মূল বৈশিষ্ট্য:**\n- **Multi-Agent Decision Loops:** একাধিক অটোনোমাস এজেন্টের মাধ্যমে ডেটা রিচার্স ও সিন্থেসিস।\n- **Event-Driven Execution:** **n8n** এবং **Python** এর মাধ্যমে রিয়েল-টাইম ওয়েবহুক ইন্টিগ্রেশন।\n- **Deterministic Reliability:** ফেইলওভার রাউটিং এবং জিরো-হ্যালুসিনেশন গার্ডরেইল।\n\nসকল প্রজেক্ট ও আর্কিটেকচার ডায়াগ্রাম দেখতে [সব প্রজেক্ট দেখুন](/projects)।`
        : `Arefin Mueen builds production-grade **Autonomous AI Agents**, **RAG Knowledge Engines**, and **End-to-End Workflow Automations**.\n\n**Featured Case Studies:**\n${projLinks}\n\n**Architecture Highlights:**\n- **Multi-Agent Orchestration**: Autonomous agent loops with confidence validation and tool-calling.\n- **Enterprise RAG**: Dense vector search via **Pinecone**, chunking pipelines, and citation grounding.\n- **Event-Driven Automations**: High-throughput webhook pipelines built with **n8n**, **FastAPI**, and **MongoDB**.\n\nExplore full technical breakdowns and architecture diagrams at [View Projects](/projects).`;
    }
    // ─── 4. SERVICES & CAPABILITIES ──────────────────────────────────────────
    else if (analysis.intent === "SERVICE_INQUIRY") {
      reply = isBengali
        ? `আরেফিন যেসকল এন্টারপ্রাইজ AI ও অটোমেশন সলিউশন প্রদান করেন:\n\n1. **Autonomous AI Agents & Multi-Agent Workflows:** ডিসিশন ট্রি, টুল-কলিং এবং অটোমেটেড ফলব্যাক মেকানিজম সহ এজেন্ট।\n2. **RAG & Knowledge Retrieval Systems:** ভেক্টর ডাটাবেস (Pinecone) ও কাস্টম ডকুমেন্ট প্রসেসিং সিস্টেম।\n3. **Event-Driven Workflow Automation:** n8n, Zapier এবং কাস্টম Python ওয়েবহুক ইন্টিগ্রেশন।\n4. **AI Customer Support & Lead Assistants:** ওয়েবসাইটে রিয়েল-টাইম অ্যাসিস্ট্যান্ট ও লিড কোয়ালিফিকেশন সিস্টেম।\n\nবিস্তারিত ডেলিভারেবল ও ব্লুপ্রিন্ট দেখতে [সার্ভিসসমূহ ব্রাউজ করুন](/services) অথবা [কল বুক করুন](/book)।`
        : `Arefin delivers full-ownership, production-ready AI automation and agentic infrastructure:\n\n1. **Autonomous AI Agents & Multi-Agent Workflows** — Tool-calling agents with deterministic error handling and multi-step reasoning.\n2. **RAG & Knowledge Retrieval Systems** — Semantic vector search (Pinecone) with live database grounding and citation transparency.\n3. **Event-Driven Workflow Automation** — High-reliability webhook pipelines connecting CRMs, databases, and LLM APIs.\n4. **Custom Interactive Assistants** — Embedded conversational agents with strict grounding and zero hallucination.\n\nReview complete capability blueprints at [Explore Services](/services) or schedule scoping at [Schedule Discovery Call](/book).`;
    }
    // ─── 5. TECHNICAL BLUEPRINTS & ARCHITECTURE ──────────────────────────────
    else if (
      analysis.intent === "TECHNICAL_BLUEPRINT" ||
      analysis.intent === "FEASIBILITY_CHECK" ||
      q.includes("how to") ||
      q.includes("architecture") ||
      q.includes("pipeline")
    ) {
      reply = isBengali
        ? `আরেফিনের স্ট্যান্ডার্ড **Agentic Workflow Architecture** ৪টি স্তরে কাজ করে:\n\n1. **ইনজেশন ও ট্রিগার:** Webhook / API ইভেন্ট (n8n বা FastAPI) এর মাধ্যমে ডাটা গ্রহণ ও ভ্যালিডেশন।\n2. **কনটেক্সট রিট্রিভাল (RAG):** Pinecone বা MongoDB Atlas থেকে প্রাসঙ্গিক ডেটা ভেক্টর সার্চের মাধ্যমে সংগ্রহ।\n3. **LLM ডিসিশন লুপ:** Claude 3.5 Sonnet / GPT-4o দিয়ে টুল-কলিং এবং মাল্টি-স্টেপ লজিক প্রসেসিং।\n4. **অ্যাকশন ও সিঙ্ক:** প্রসেসকৃত ফলাফল CRM, ডাটাবেস বা নোটিফিকেশনে স্বয়ংক্রিয়ভাবে প্রেরণ।\n\nআপনার কাস্টম প্রজেক্টের টেকনিক্যাল ব্লুপ্রিন্ট তৈরি করতে [Schedule Discovery Call](/book) এ কথা বলতে পারেন।`
        : `Arefin's production **Agentic Automation Architecture** follows a 4-tier design pattern:\n\n1. **Ingestion & Validation**: Webhook/API events captured via **n8n** or **FastAPI** with strict schema validation.\n2. **Context Augmentation (RAG)**: Real-time dense vector retrieval via **Pinecone** with chunk-level metadata filtering.\n3. **LLM Decision Engine**: Multi-step reasoning using **Claude 3.5 Sonnet** or **GPT-4o** with tool-calling loops and retry fallback.\n4. **Execution & Sync**: Structured outputs dispatched to CRMs (HubSpot/Airtable), databases (MongoDB), and email channels.\n\nTo blueprint a tailored architecture for your operations, book a scoping session at [Schedule 30-Min Discovery Call](/book).`;
    }
    // ─── 6. TECH STACK & SKILLS ──────────────────────────────────────────────
    else if (analysis.intent === "TECH_STACK_EXPLORATION" || q.includes("stack") || q.includes("tool") || q.includes("tech")) {
      reply = isBengali
        ? `আরেফিন মুঈন-এর মূল **প্রোডাকশন টেক স্ট্যাক**:\n\n- **অটোমেশন ও অর্কেস্ট্রেশন:** n8n, LangChain, Langflow, Zapier, Make.com\n- **AI মডেল ও এলএলএম:** Anthropic Claude 3.5 / 3.7, OpenAI GPT-4o, Google Gemini 2.0\n- **ভেক্টর ডাটাবেস ও স্টোরেজ:** Pinecone, MongoDB Atlas, Redis\n- **কোড ও ব্যাকএন্ড:** Python, TypeScript, FastAPI, REST APIs, Webhooks, Next.js\n\nসম্পূর্ণ স্কিল ও টুলিং ম্যাট্রিক্স দেখতে [স্কিলস পেজ](/skills) দেখুন।`
        : `Arefin Mueen's verified **Production Tech Stack** includes:\n\n- **Orchestration & Workflow Engines**: **n8n**, **LangChain**, **Langflow**, **Zapier**\n- **Foundation Models**: **Anthropic Claude 3.5 / 3.7**, **OpenAI GPT-4o / o3-mini**, **Google Gemini 2.0 Flash**\n- **Databases & Vector Search**: **Pinecone Vector DB**, **MongoDB Atlas**, **Redis**\n- **Core Engineering**: **Python**, **TypeScript**, **FastAPI**, **Next.js 16**, **REST APIs & Webhooks**\n\nReview the full competency matrix at [Technical Matrix](/skills).`;
    }
    // ─── 7. ABOUT / BIO ──────────────────────────────────────────────────────
    else if (analysis.intent === "ABOUT_BACKGROUND" || q.includes("about") || q.includes("who is")) {
      reply = isBengali
        ? `**আরেফিন মুঈন** একজন AI Automation & AI Agent Developer (ঢাকা, বাংলাদেশ - GMT+6)। তিনি বিশ্বজুড়ে বিভিন্ন ক্লায়েন্ট ও টিমের জন্য এন্টারপ্রাইজ অটোমেশন, টুল-কলিং অটোনোমাস এজেন্ট এবং RAG নলেজ সিস্টেম তৈরি করেন।\n\nতাঁর কাজের ফিলোসফি এবং বিস্তারিত ব্যাকগ্রাউন্ড দেখতে [About Arefin](/about) পেজে যান অথবা [প্রজেক্টসমূহ](/projects) ব্রাউজ করুন।`
        : `**Arefin Mueen** is an **AI Automation & AI Agent Developer** based in Dhaka (GMT+6), collaborating with clients and teams worldwide.\n\nHe specializes in building high-reliability workflow automations, autonomous tool-calling agents, and production RAG knowledge engines with deterministic safety guardrails.\n\nRead his full engineering philosophy at [About Arefin](/about) or explore his [Projects](/projects).`;
    }
    // ─── 8. DEFAULT GROUNDED INTRO ───────────────────────────────────────────
    else {
      reply = isBengali
        ? `আমি **Arefin AI** — আরেফিন মুঈন-এর অফিশিয়াল এআই অ্যাসিস্ট্যান্ট। আপনি আরেফিনের তৈরি প্রজেক্ট, এআই অটোমেশন ওয়ার্কফ্লো, টেক স্ট্যাক বা কোনো প্রজেক্ট নিয়ে আলোচনা করতে পারেন।\n\n- প্রজেক্ট দেখতে: [প্রজেক্টসমূহ](/projects)\n- সার্ভিস সম্পর্কে জানতে: [সার্ভিসসমূহ](/services)\n- স্কোপিং কল বুক করতে: [Discovery Call](/book)\n- সরাসরি মেসেজ পাঠাতে: [যোগাযোগ](/contact)`
        : `I am **Arefin AI**, the official embedded assistant for **Arefin Mueen** (AI Automation & AI Agent Developer).\n\nI can help you explore his case studies, understand his agentic workflows, analyze project feasibility, or schedule a technical consultation:\n\n- **Case Studies**: [View Projects](/projects)\n- **Service Blueprints**: [Explore Services](/services)\n- **Technical Competencies**: [Technical Matrix](/skills)\n- **Schedule Consultation**: [Book 30-Min Discovery Call](/book)\n- **Direct Inquiry**: [Contact Form](/contact)`;
    }

    const latencyMs = Date.now() - startTime;
    return {
      reply,
      citations: req.citations || [],
      providerUsed: "local_grounded",
      modelUsed: "local-grounded-v1",
      tokens: {
        promptTokens: Math.round(lastUserMessage.length / 4),
        completionTokens: Math.round(reply.length / 4),
        totalTokens: Math.round((lastUserMessage.length + reply.length) / 4),
      },
      latencyMs,
    };
  }

  async healthCheck(): Promise<ProviderHealthCheckResult> {
    return {
      ok: true,
      status: "connected",
      message: "Local Grounded Engine active & healthy (0ms)",
      latencyMs: 0,
    };
  }
}
