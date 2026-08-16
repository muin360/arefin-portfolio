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
  role: "AI-Powered Full-Stack Developer & Web Designer",
  email: "hello@tensorix.me",
  tagline:
    "I design and build intelligent web applications, conversion-driven websites, AI agents, and production automation systems. Next.js, React, TypeScript, Python, and modern LLMs.",
};

export const services: {
  Icon: Icon;
  title: string;
  description: string;
}[] = [
  {
    Icon: IconCode,
    title: "AI-Powered Websites & Web Design",
    description:
      "Bespoke, high-performance web design with integrated AI capabilities, CMS-editable content, fluid animations, and conversion-optimized architecture.",
  },
  {
    Icon: IconLayers,
    title: "Full-Stack Web Applications & SaaS",
    description:
      "End-to-end web apps, dashboards, and SaaS platforms built with Next.js, React, TypeScript, Node.js/Python, databases, and secure authentication.",
  },
  {
    Icon: IconAgent,
    title: "AI Agents & Intelligent Assistants",
    description:
      "Autonomous AI agents, conversational voice/chat assistants, and multi-agent workflows engineered with LangChain, Python, and leading foundation models.",
  },
  {
    Icon: IconWorkflow,
    title: "Business Automation & n8n Workflows",
    description:
      "Production-grade workflow automations that connect your CRM, databases, payment gateways, and communication channels with error handling and logging.",
  },
  {
    Icon: IconBrain,
    title: "RAG & Knowledge Systems",
    description:
      "Retrieval-augmented generation systems over company documentation, Notion workspaces, and databases with semantic vector search and source citations.",
  },
  {
    Icon: IconChart,
    title: "E-Commerce & Digital Commerce Systems",
    description:
      "Custom e-commerce platforms, ordering systems, and automated fulfillment pipelines wired directly to inventory, Stripe, and customer support bots.",
  },
];

export const skills: { category: string; items: string[]; Icon: Icon }[] = [
  {
    category: "Web & Frontend",
    Icon: IconCode,
    items: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "UI/UX Design",
      "Framer Motion",
    ],
  },
  {
    category: "Full-Stack & Backend",
    Icon: IconLayers,
    items: [
      "Node.js",
      "Python",
      "PostgreSQL",
      "REST & Webhooks",
      "Auth & Security",
      "Prisma / Drizzle",
    ],
  },
  {
    category: "AI & Agents",
    Icon: IconBrain,
    items: [
      "LangChain",
      "LLM Engineering",
      "RAG & Vector DBs",
      "Multi-Agent Systems",
      "Prompt Engineering",
      "OpenAI & Claude",
    ],
  },
  {
    category: "Automation & Infrastructure",
    Icon: IconWorkflow,
    items: [
      "n8n",
      "Make & Zapier",
      "Vercel & Supabase",
      "Docker / Cloud VPS",
      "CI/CD & Git",
      "System Observability",
    ],
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
    title: "Intelligent SaaS Workspace & AI Copilot",
    summary:
      "Modern multi-tenant web application featuring a real-time AI document copilot, vector semantic search, role-based auth, and automated background jobs.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "LangChain", "OpenAI"],
    Icon: IconCode,
    category: "Full-Stack SaaS",
  },
  {
    title: "Luxury Medical Clinic Digital Platform",
    summary:
      "High-converting clinic web platform with bespoke editorial design, dynamic CMS service catalog, interactive appointment intake, and direct CRM sync.",
    stack: ["Next.js", "React", "Tailwind CSS", "Sanity CMS", "WhatsApp API", "Framer Motion"],
    Icon: IconCompass,
    category: "Web Design & System",
  },
  {
    title: "Autonomous Commerce & Operations Engine",
    summary:
      "End-to-end e-commerce operations backend: AI product catalog generation, real-time inventory synchronization, order routing, and automated customer support.",
    stack: ["Shopify API", "Node.js", "n8n", "OpenAI", "Stripe API", "Python"],
    Icon: IconChart,
    category: "E-Commerce System",
  },
  {
    title: "Multi-Agent Market Intelligence System",
    summary:
      "Orchestrated crew of 4 specialized AI agents (Researcher, Data Extractor, Financial Analyst, Executive Summarizer) producing structured market briefs from live web data.",
    stack: ["n8n", "LangChain", "Python", "Claude 3.5", "pgvector"],
    Icon: IconBrain,
    category: "AI Multi-Agent",
  },
  {
    title: "Operational Analytics & Workflow Dashboard",
    summary:
      "Executive internal dashboard providing real-time pipeline monitoring, automated deal scoring, team task dispatching, and webhook health analytics.",
    stack: ["React", "TypeScript", "Tailwind CSS", "FastAPI", "PostgreSQL", "n8n"],
    Icon: IconLayers,
    category: "Internal Tool & Dashboard",
  },
  {
    title: "Enterprise Knowledge RAG Copilot",
    summary:
      "Retrieval-augmented conversational copilot indexed over internal documentation, technical SOPs, and Notion wikis with strict permission filtering and source citations.",
    stack: ["Python", "LangChain", "Pinecone", "OpenAI", "Slack API"],
    Icon: IconBookmark,
    category: "RAG & Knowledge",
  },
];
