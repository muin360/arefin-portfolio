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
  role: "AI Automation & AI Agent Developer",
  email: "hello@tensorix.me",
  tagline:
    "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
};

export const services: {
  Icon: Icon;
  title: string;
  description: string;
}[] = [
  {
    Icon: IconWorkflow,
    title: "AI Workflow Automation",
    description:
      "Automate repetitive operational tasks by connecting business apps, databases, and APIs using n8n, Zapier, and LLMs.",
  },
  {
    Icon: IconAgent,
    title: "AI Agents & Assistants",
    description:
      "Autonomous agents that reason through multi-step tasks, call tools, query data, and execute real actions.",
  },
  {
    Icon: IconBrain,
    title: "RAG & Knowledge Retrieval",
    description:
      "Context-aware AI assistants that answer questions accurately by retrieving information from documents, SOPs, and knowledge bases.",
  },
  {
    Icon: IconLayers,
    title: "Multi-Agent Systems",
    description:
      "Coordinated networks of specialized AI agents working together on complex research, data synthesis, and analysis workflows.",
  },
  {
    Icon: IconBookmark,
    title: "AI Chatbots & Lead Capture",
    description:
      "Website, WhatsApp, and Messenger conversational bots for instant FAQ responses, lead qualification, and human handoff.",
  },
  {
    Icon: IconCode,
    title: "API & Webhook Integrations",
    description:
      "Connecting third-party services, writing custom Python/JavaScript integration glue, and building event-driven webhooks.",
  },
];

export const skills: { category: string; items: string[]; Icon: Icon }[] = [
  {
    category: "AI & Agents",
    Icon: IconBrain,
    items: [
      "AI Agents",
      "RAG Systems",
      "Multi-Agent Systems",
      "Prompt Engineering",
      "OpenAI & Claude APIs",
      "LangChain",
    ],
  },
  {
    category: "Automation & Workflows",
    Icon: IconWorkflow,
    items: [
      "n8n",
      "Zapier",
      "Langflow",
      "Workflow Design",
      "Webhooks",
      "API Integrations",
    ],
  },
  {
    category: "Development Fundamentals",
    Icon: IconCode,
    items: [
      "Python",
      "JavaScript",
      "JSON",
      "Git & GitHub",
      "REST APIs",
      "Web Fundamentals",
    ],
  },
];

export const projects: {
  title: string;
  summary: string;
  stack: string[];
  Icon: Icon;
  category: string;
  projectType: string;
}[] = [
  {
    title: "Email Automation & Smart Triage",
    summary:
      "Automated inbox triage workflow built with n8n and OpenAI that categorizes incoming emails, drafts context-aware replies, and routes priority notifications.",
    stack: ["n8n", "OpenAI", "Gmail API", "Webhooks"],
    Icon: IconWorkflow,
    category: "AI Automation",
    projectType: "Automation Project",
  },
  {
    title: "Social Media Content Generator",
    summary:
      "Automated pipeline that takes a core article or topic, generates tailored cross-platform posts via LLMs, and organizes draft schedules in Google Sheets.",
    stack: ["Make", "OpenAI", "Google Sheets", "Webhooks"],
    Icon: IconLayers,
    category: "AI Workflow",
    projectType: "Learning Project",
  },
  {
    title: "Customer Support Q&A Bot",
    summary:
      "Conversational support assistant built in Langflow that parses customer questions against product knowledge data with structured human escalation.",
    stack: ["Langflow", "OpenAI", "Webhooks", "JSON"],
    Icon: IconBookmark,
    category: "AI Chatbot",
    projectType: "AI Agent Project",
  },
  {
    title: "Market Research Multi-Agent System",
    summary:
      "Orchestrated crew of 4 specialized agents (Researcher, Data Analyst, Writer, Critic) that collaborate to generate structured market research briefs from keyword inputs.",
    stack: ["n8n", "LangChain", "Python", "Claude API"],
    Icon: IconBrain,
    category: "Multi-Agent",
    projectType: "AI Agent Project",
  },
  {
    title: "Stock Analysis & Research Agent",
    summary:
      "Financial research agent built in Python with LangChain that queries live stock data, evaluates quarterly earnings metrics, and outputs structured summaries.",
    stack: ["Python", "LangChain", "Yahoo Finance API", "OpenAI"],
    Icon: IconChart,
    category: "AI Agent",
    projectType: "Personal Project",
  },
  {
    title: "Multilingual Customer Support Bot",
    summary:
      "Real-time multilingual chat workflow that automatically detects incoming language, translates inquiries, and provides localized responses from standard FAQs.",
    stack: ["Langflow", "OpenAI", "Webhooks", "Translation API"],
    Icon: IconAgent,
    category: "AI Chatbot",
    projectType: "Learning Project",
  },
  {
    title: "Website Lead Generation Bot",
    summary:
      "Interactive lead qualification workflow connecting website forms, AI scoring logic, and instant notifications to Slack and spreadsheets.",
    stack: ["n8n", "OpenAI", "Typeform", "Slack API"],
    Icon: IconCompass,
    category: "AI Automation",
    projectType: "Automation Project",
  },
  {
    title: "E-Commerce Chatbot Integration",
    summary:
      "E-commerce assistant integrating Shopify order lookups and OpenAI to resolve tracking queries and draft customer service responses automatically.",
    stack: ["Zapier", "OpenAI", "Shopify Webhooks", "Gmail API"],
    Icon: IconChart,
    category: "E-Commerce Bot",
    projectType: "Automation Project",
  },
  {
    title: "Mobile App FAQ & Documentation Bot",
    summary:
      "RAG assistant indexed over mobile application documentation, enabling fast search and citation-backed troubleshooting for common user questions.",
    stack: ["LangChain", "Pinecone", "Python", "OpenAI"],
    Icon: IconBookmark,
    category: "RAG Assistant",
    projectType: "RAG Project",
  },
  {
    title: "Voice-Enabled Appointment Scheduler",
    summary:
      "Conversational voice agent integrating Twilio Voice and OpenAI to handle incoming call inquiries, verify calendar availability, and confirm bookings.",
    stack: ["n8n", "OpenAI", "Twilio Voice", "Google Calendar"],
    Icon: IconAgent,
    category: "Voice AI",
    projectType: "Voice AI Project",
  },
];
