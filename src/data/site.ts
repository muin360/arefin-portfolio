import {
  IconAgent,
  IconWorkflow,
  IconChart,
  IconBrain,
  IconCode,
  IconCompass,
  IconLayers,
  IconRocket,
  IconTerminal,
  IconBookmark,
  IconSpark,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const site = {
  name: "Arefin Muin",
  role: "AI Automation & Agent Engineer",
  email: "arefinmuin@gmail.com",
  tagline:
    "I build AI agents that replace manual work — from voice calling bots to multi-agent research systems. Python, n8n, LangChain, LangFlow — real code, real automation.",
};

export const services: {
  Icon: Icon;
  title: string;
  description: string;
}[] = [
  {
    Icon: IconAgent,
    title: "AI Agents",
    description:
      "Custom autonomous agents — voice calling bots, multi-agent research systems, RAG assistants, lead qualifiers — built with LangChain, LangFlow, n8n and modern LLMs.",
  },
  {
    Icon: IconWorkflow,
    title: "Workflow Automation",
    description:
      "End-to-end business automations that connect your apps, databases and APIs across n8n, Zapier and Make — CRM sync, lead routing, AI-enriched workflows and more.",
  },
  {
    Icon: IconChart,
    title: "GoHighLevel Setup",
    description:
      "Sub-account configuration, funnels, calendars, pipelines, SMS and email automations and AI-powered conversation flows tailored to your agency or business.",
  },
  {
    Icon: IconBrain,
    title: "Custom LLM Solutions",
    description:
      "Retrieval-augmented systems, knowledge-base chatbots, prompt engineering and integrating OpenAI, Anthropic and open-source models into your product.",
  },
  {
    Icon: IconCode,
    title: "Python & JavaScript",
    description:
      "Custom Python and JavaScript code to extend any automation — data pipelines, API integrations, web scraping, LLM chaining, or anything a no-code tool can't reach.",
  },
  {
    Icon: IconCompass,
    title: "Audit & Consultation",
    description:
      "Not sure what to automate first? I review your current workflow and recommend the highest-ROI automations and AI integrations.",
  },
];

export const skills: { category: string; items: string[]; Icon: Icon }[] = [
  {
    category: "Automation Platforms",
    Icon: IconWorkflow,
    items: ["n8n", "Zapier", "Make (Integromat)", "GoHighLevel"],
  },
  {
    category: "AI / LLM Tools",
    Icon: IconBrain,
    items: [
      "LangChain",
      "LangFlow",
      "OpenAI API",
      "Anthropic Claude",
      "Prompt Engineering",
      "RAG / Vector DBs",
    ],
  },
  {
    category: "Programming",
    Icon: IconTerminal,
    items: ["Python", "JavaScript", "TypeScript", "Node.js", "REST APIs"],
  },
  {
    category: "Advanced AI",
    Icon: IconRocket,
    items: ["Multi-Agent Systems", "RAG Pipelines", "Voice AI Agents", "LLM Evaluation"],
  },
];

export const projects: {
  title: string;
  summary: string;
  stack: string[];
  Icon: Icon;
  category: string;
}[] = [
  {
    title: "Voice-Enabled Live Calling Agent",
    summary:
      "A real-time AI voice agent that handles inbound calls, answers FAQs, qualifies leads and books appointments — fully autonomous, no human needed for routine calls.",
    stack: ["n8n", "OpenAI", "Twilio", "Python"],
    Icon: IconAgent,
    category: "Voice AI",
  },
  {
    title: "Market Research Multi-Agent System",
    summary:
      "Orchestrated system of 4 specialised agents — researcher, analyst, writer, critic — that produce a full market research report from a single keyword input.",
    stack: ["n8n", "LangChain", "OpenAI", "Python"],
    Icon: IconBrain,
    category: "Multi-Agent",
  },
  {
    title: "Multilingual Full-Stack AI Assistant",
    summary:
      "A production SaaS assistant with payment gateway integration that handles customer queries in 6 languages, routes to the right department and logs every interaction.",
    stack: ["n8n", "OpenAI", "Stripe", "Python"],
    Icon: IconLayers,
    category: "SaaS",
  },
  {
    title: "AI-Powered Invoice Automation System",
    summary:
      "End-to-end invoice pipeline — extracts line items from PDFs using vision LLM, validates against PO data, pushes to accounting software, flags anomalies for review.",
    stack: ["Python", "OpenAI", "n8n", "REST APIs"],
    Icon: IconWorkflow,
    category: "Pipeline",
  },
  {
    title: "Website Lead Generation SaaS (n8n)",
    summary:
      "White-label SaaS product built on n8n: captures website visitor intent via embedded widget, enriches lead with public data, scores and routes to CRM in under 60 seconds.",
    stack: ["n8n", "OpenAI", "Webhook", "CRM API"],
    Icon: IconRocket,
    category: "SaaS",
  },
  {
    title: "Customer Support RAG Bot",
    summary:
      "Retrieval-augmented chatbot trained on company docs, SOPs and Notion workspace. Answers staff questions with source citations and escalates unresolved queries to humans.",
    stack: ["LangFlow", "Pinecone", "OpenAI", "Python"],
    Icon: IconBookmark,
    category: "RAG",
  },
  {
    title: "Full-Stack Dropshipping Automation",
    summary:
      "Complete e-commerce backend: product research agent → listing writer → inventory sync → order routing → customer reply bot. One workflow replacing 3 manual roles.",
    stack: ["n8n", "OpenAI", "Zapier", "Python"],
    Icon: IconChart,
    category: "E-commerce",
  },
  {
    title: "CRM Business Lead Automation",
    summary:
      "Automated lead enrichment and nurture pipeline: scrapes contact data, scores with LLM, triggers personalised email sequences, updates CRM and alerts sales on hot signals.",
    stack: ["n8n", "OpenAI", "Apollo", "SMTP"],
    Icon: IconSpark,
    category: "CRM",
  },
];

export const skillProficiency: Record<string, number> = {
  "n8n": 95,
  "Zapier": 88,
  "Make (Integromat)": 82,
  "GoHighLevel": 78,
  "LangChain": 85,
  "LangFlow": 88,
  "OpenAI API": 92,
  "Anthropic Claude": 90,
  "Prompt Engineering": 93,
  "RAG / Vector DBs": 83,
  "Multi-Agent Systems": 87,
  "Voice AI Agents": 80,
  "LLM Evaluation": 75,
  "Python": 85,
  "JavaScript": 80,
  "TypeScript": 72,
  "Node.js": 75,
  "REST APIs": 90,
};
