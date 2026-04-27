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
    "I build AI agents and automation workflows that take repetitive work off your plate so you can focus on growth.",
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
      "Custom autonomous and semi-autonomous agents that research, write, summarize, qualify leads or operate other tools — built with LangChain, LangFlow and modern LLMs.",
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
      "Custom scripts and small services to glue systems together, scrape data, batch-process content or extend a no-code workflow with real code.",
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
    category: "Currently Learning",
    Icon: IconRocket,
    items: ["LLM Engineering", "Fine-tuning", "Evaluation & Observability"],
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
    title: "AI Lead Qualification Agent",
    summary:
      "An LLM-powered agent that ingests inbound leads, enriches them with public data, scores them, and routes hot ones to the sales team via Slack.",
    stack: ["LangChain", "n8n", "OpenAI", "Slack API"],
    Icon: IconAgent,
    category: "Agent",
  },
  {
    title: "GoHighLevel Booking Bot",
    summary:
      "Conversational SMS and email bot built on GoHighLevel that books appointments, answers FAQs, and hands off to a human when the conversation requires it.",
    stack: ["GoHighLevel", "OpenAI", "Twilio"],
    Icon: IconChart,
    category: "Bot",
  },
  {
    title: "Content Repurposing Pipeline",
    summary:
      "A Make.com workflow that turns one long-form video into 10+ pieces of social content using LLM summarization and templated rendering.",
    stack: ["Make", "OpenAI", "FFmpeg"],
    Icon: IconLayers,
    category: "Pipeline",
  },
  {
    title: "Internal Knowledge-Base Chatbot",
    summary:
      "A retrieval-augmented chatbot over a company's docs, SOPs and Notion workspace — answers staff questions in seconds with source citations.",
    stack: ["LangFlow", "Pinecone", "OpenAI", "Python"],
    Icon: IconBookmark,
    category: "RAG",
  },
  {
    title: "E-commerce Auto-Reply Agent",
    summary:
      "Zapier and OpenAI automation that drafts and sends personalized customer support replies, escalating complex tickets to humans.",
    stack: ["Zapier", "OpenAI", "Gmail API"],
    Icon: IconSpark,
    category: "Agent",
  },
  {
    title: "AI Cold-Outreach System",
    summary:
      "Multi-step sequence that researches each prospect, generates a personalized opener, and sends through a warmed-up inbox at scale.",
    stack: ["n8n", "OpenAI", "Apollo", "SMTP"],
    Icon: IconRocket,
    category: "Outreach",
  },
];
