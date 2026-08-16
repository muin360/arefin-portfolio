import {
  IconAgent,
  IconWorkflow,
  IconChart,
  IconBrain,
  IconCode,
  IconCompass,
  IconLayers,
  IconBookmark,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";


type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const site = {
  name: "Arefin Mueen",
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
    category: "AI",
    Icon: IconBrain,
    items: [
      "LLMs",
      "AI Agents",
      "RAG",
      "Prompt Engineering",
      "Multi-Agent Systems",
    ],
  },
  {
    category: "Automation",
    Icon: IconWorkflow,
    items: ["n8n", "Workflow Design", "Webhooks", "Event-Driven Automation"],
  },
  {
    category: "Engineering",
    Icon: IconCode,
    items: ["Python", "APIs", "JSON", "Authentication", "Data Processing"],
  },
  {
    category: "Infrastructure",
    Icon: IconLayers,
    items: ["GitHub", "Vercel", "Databases", "Deployment", "Monitoring"],
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
    title: "Market Research Multi-Agent System",
    summary:
      "Orchestrated system of 4 specialised agents — researcher, analyst, writer, critic — that produce a full market research report from a single keyword input.",
    stack: ["n8n", "LangChain", "OpenAI", "Python"],
    Icon: IconBrain,
    category: "Multi-Agent",
  },
  {
    title: "Voice-Enabled Live Calling Agent",
    summary:
      "A real-time AI voice agent that handles inbound calls, answers FAQs, qualifies leads and books appointments — fully autonomous, no human needed for routine calls.",
    stack: ["n8n", "OpenAI", "Twilio", "Python"],
    Icon: IconAgent,
    category: "Voice AI",
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
];
