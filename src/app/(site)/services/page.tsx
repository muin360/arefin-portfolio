import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getProjects } from "@/lib/db";
import type { Service, Project } from "@/lib/db/types";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import {
  Workflow,
  Bot,
  Brain,
  Layers,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services & Capabilities",
  description:
    "Practical AI workflow automation, autonomous tool-calling agents, RAG knowledge retrieval, and multi-agent systems engineered under 100% client ownership.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services & Capabilities — Arefin Mueen",
    description:
      "Practical AI workflow automation, autonomous tool-calling agents, RAG knowledge retrieval, and multi-agent systems.",
    url: "/services",
  },
};

const SERVICE_SCHEMAS: Record<
  string,
  {
    inputs: string[];
    outputs: string[];
    icon: typeof Workflow;
  }
> = {
  "AI Workflow Automation": {
    inputs: ["Webhooks", "Customer Forms", "CRM Events", "Incoming Emails"],
    outputs: ["Slack / Email Alerts", "Document Gen", "Database Updates", "Automated Actions"],
    icon: Workflow,
  },
  "AI Agents": {
    inputs: ["Natural Language Queries", "API Payloads", "Unstructured Files"],
    outputs: ["Tool Invocations", "Validated JSON", "Multi-Step Action Execution"],
    icon: Bot,
  },
  "RAG & Knowledge Systems": {
    inputs: ["PDFs / Notion Docs", "Internal FAQs", "Product Catalogs"],
    outputs: ["Vector Embeddings", "Cited Answers", "Semantic Search Traces"],
    icon: Brain,
  },
  "Multi-Agent Systems": {
    inputs: ["Complex High-Level Tasks", "Research Objectives", "Raw Datasets"],
    outputs: ["Synthesized Reports", "Peer-Reviewed Code", "Orchestrated Artifacts"],
    icon: Layers,
  },
};

const ENGAGEMENTS = [
  {
    name: "Discovery & Scoping",
    cadence: "1–2 Days",
    summary: "30-min architecture conversation mapping bottlenecks, API feasibility, and step-by-step automation scope.",
    deliverables: ["Process flowchart", "Tool & API inventory", "Defined scope & quote"],
    badge: "Free Discovery",
  },
  {
    name: "Single Workflow Build",
    cadence: "1–2 Weeks",
    summary: "One end-to-end event-driven automation or AI agent built, tested, and handed over under your accounts.",
    deliverables: ["Production n8n/Python pipeline", "Prompt tuning & API keys", "Error recovery & docs"],
    badge: "Most Popular",
  },
  {
    name: "Custom Agent / RAG System",
    cadence: "2–4 Weeks",
    summary: "Custom tool-calling agent, vector search RAG pipeline, or multi-agent network integrated into your database.",
    deliverables: ["Full agentic architecture", "Semantic chunking & vector store", "100% Client ownership"],
    badge: "Deep Integration",
  },
];

export default async function ServicesPage() {
  const [services, allProjects] = await Promise.all([
    getServices({ publishedOnly: true }),
    getProjects({ publishedOnly: true }),
  ]);

  const featuredService = services.find((s) => s.isFeatured) || services[0];
  const otherServices = services.filter((s) => s.id !== featuredService?.id);

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="space-y-4 max-w-4xl">
          <SectionPlate
            index="SERVICES"
            title="CAPABILITIES &amp; SYSTEMS"
            meta={`${services.length} published blueprints`}
          />

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            What I build when a workflow needs{" "}
            <span className="serif italic text-violet-300">
              intelligence and automation.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans max-w-3xl">
            From event-driven webhook automations to autonomous tool-calling agents and RAG retrieval pipelines. All systems are deployed directly into your own infrastructure with 100% account and code ownership.
          </p>
        </div>

        {/* ─── 01 FEATURED FLAGSHIP SERVICE ──────────────────────────────── */}
        {featuredService && (
          <div className="space-y-6">
            <SectionPlate
              index="01"
              title="FLAGSHIP CAPABILITY"
              meta="highest demand architecture"
            />
            <ServiceCard
              service={featuredService}
              projects={allProjects}
              isFlagship
            />
          </div>
        )}

        {/* ─── 02 SECONDARY SPECIALIZED SERVICES ──────────────────────────── */}
        {otherServices.length > 0 && (
          <div className="space-y-6">
            <SectionPlate
              index="02"
              title="SPECIALIZED BLUEPRINTS"
              meta="modular autonomous systems"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {otherServices.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  projects={allProjects}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── 03 ENGAGEMENT & SCOPING MODELS ────────────────────────────── */}
        <div className="space-y-6">
          <SectionPlate
            index="03"
            title="HOW TO WORK TOGETHER"
            meta="flexible project-based scoping"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ENGAGEMENTS.map((eng) => (
              <div
                key={eng.name}
                className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-violet-600/20 text-violet-300 border border-violet-500/30">
                      {eng.badge}
                    </span>
                    <span className="text-white/40">{eng.cadence}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {eng.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                    {eng.summary}
                  </p>

                  <div className="pt-3 border-t border-white/5 space-y-1.5 font-mono text-xs">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                      Deliverables:
                    </span>
                    <ul className="space-y-1 text-white/80">
                      {eng.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-violet-400">▹</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button href="/contact" variant="secondary" size="md">
                  <span>Inquire on {eng.name}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 04 DIRECT SCOPING CTA ──────────────────────────────────────── */}
        <div className="pt-6">
          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Want to automate{" "}
                <span className="serif italic text-violet-300">something?</span>
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                Free 30-min scoping call — let&rsquo;s evaluate your manual bottleneck, map the data endpoints, and build a deterministic automation pipeline.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Let&rsquo;s Build an Automation
                </Button>

                <Button href="/projects" variant="secondary" size="lg">
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  projects,
  isFlagship = false,
}: {
  service: Service;
  projects: Project[];
  isFlagship?: boolean;
}) {
  const schema = SERVICE_SCHEMAS[service.title] || {
    inputs: ["Webhooks", "JSON Payloads", "User Requests"],
    outputs: ["Structured Actions", "Database Entries", "Notifications"],
    icon: Workflow,
  };

  const Icon = schema.icon;

  const relatedProjects = projects.filter(
    (p) =>
      service.relatedProjectIds?.includes(p.id) ||
      p.category.toLowerCase().includes(service.title.toLowerCase().split(" ")[0])
  ).slice(0, isFlagship ? 2 : 1);

  return (
    <div
      className={`rounded-2xl bg-[#0c0f18] border transition-all p-6 sm:p-8 flex flex-col justify-between group ${
        isFlagship
          ? "border-violet-500/40 hover:border-violet-500/60 shadow-xl"
          : "border-white/[0.08] hover:border-violet-500/30"
      }`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-white/40 font-mono">
                {isFlagship ? "Flagship System Blueprint" : "Specialized Automation Blueprint"}
              </p>
            </div>
          </div>
        </div>

        {/* Explanation & Problem Solved */}
        <p className="text-sm text-white/70 leading-relaxed font-sans">
          {service.hook || service.solution || "Custom autonomous automation and intelligence pipeline engineered for reliability."}
        </p>

        {/* Inputs vs Outputs Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#121622] border border-white/5 font-mono text-xs">
          <div>
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-wider block mb-1">
              Typical Inputs:
            </span>
            <ul className="space-y-1 text-white/70 text-[11px]">
              {schema.inputs.map((inp, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-white/30">→</span>
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-1">
              Typical Outputs:
            </span>
            <ul className="space-y-1 text-white/70 text-[11px]">
              {schema.outputs.map((out, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="text-emerald-400/60">✓</span>
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Connected Real Projects from MongoDB */}
        {relatedProjects.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
              Demonstrated in Live Case Studies:
            </span>
            <div className="space-y-2">
              {relatedProjects.map((p) => (
                <Link
                  key={p.slug || p.id}
                  href={`/projects/${p.slug}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#121622] hover:bg-[#181e2e] border border-white/5 group/link transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Workflow className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs font-bold text-white group-hover/link:text-violet-300 transition-colors">
                      {p.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover/link:translate-x-1 transition-transform text-violet-400" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Tools + Direct Scope Action */}
      <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap gap-1.5">
          {(service.bullets && service.bullets.length > 0 ? service.bullets : ["n8n", "Python", "APIs"]).slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded bg-[#121622] border border-white/5 text-[10px] text-white/50"
            >
              {t}
            </span>
          ))}
        </div>

        <Link
          href={`/contact?prefill=${encodeURIComponent(`Hi Arefin, I am interested in ${service.title}`)}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-white transition-colors shrink-0 group/btn"
        >
          <span>Scope this build</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-violet-400" />
        </Link>
      </div>
    </div>
  );
}
