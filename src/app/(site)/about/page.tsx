import type { Metadata } from "next";
import Link from "next/link";
import { getAboutData, getSiteSettings, getProjects, getBlogPosts } from "@/lib/db";
import ProfilePortrait from "@/components/ProfilePortrait";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import {
  Workflow,
  Bot,
  Brain,
  Code2,
  Database,
  ArrowRight,
  Sparkles,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About — Arefin Mueen",
  description:
    "Hi, I'm Arefin Mueen — an AI Automation & AI Agent Developer. I build practical AI agents, RAG systems, and business automations.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Arefin Mueen",
    description:
      "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    url: "/about",
  },
};

const STACK_GROUPS = [
  {
    category: "AI & Autonomous Agents",
    icon: Bot,
    items: ["LangChain", "OpenAI & Anthropic APIs", "RAG Vector Search", "LangGraph", "Embeddings"],
  },
  {
    category: "Workflow Automation",
    icon: Workflow,
    items: ["n8n (Self-Hosted & Cloud)", "Make / Integromat", "Webhooks & HTTP Nodes", "Retry Loops"],
  },
  {
    category: "Full-Stack Development",
    icon: Code2,
    items: ["Python", "JavaScript / TypeScript", "Next.js", "REST APIs & JSON", "Git & CI/CD"],
  },
  {
    category: "Data & Storage",
    icon: Database,
    items: ["MongoDB Atlas", "Pinecone Vector Store", "Structured JSON Schemas"],
  },
];

export default async function AboutPage() {
  const [about, settings, projects, posts] = await Promise.all([
    getAboutData(),
    getSiteSettings(),
    getProjects({ publishedOnly: true }),
    getBlogPosts({ publishedOnly: true }),
  ]);

  const selectedProjects = projects.filter((p) => p.featured).slice(0, 3);
  const selectedPosts = posts.slice(0, 2);

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="space-y-4 max-w-4xl">
          <SectionPlate
            index="ABOUT"
            title="HUMAN IDENTITY &amp; MINDSET"
            meta="Arefin Mueen · Dhaka · GMT+6"
          />

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
            I build systems to understand how they work, and{" "}
            <span className="serif italic text-violet-300">
              automate real friction.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans max-w-3xl">
            {about.bio || "Independent developer specializing in practical AI workflows, tool-calling agents, and API integrations. Based in Dhaka, working globally."}
          </p>
        </div>

        {/* ─── 01 PORTRAIT & PERSONAL STORY ──────────────────────────────── */}
        <section className="space-y-6" aria-label="Story">
          <SectionPlate
            index="01"
            title="MY STORY &amp; DIRECTION"
            meta="developer journey &amp; focus"
          />

          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Dominant Profile Portrait */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <ProfilePortrait
                profileImage={settings.profileImage}
                name={settings.name}
                role={settings.role}
                availabilityNote={settings.availabilityNote}
              />
            </div>

            {/* Right: Personal Narrative */}
            <div className="lg:col-span-7 space-y-5 text-sm sm:text-base leading-relaxed text-white/80 font-sans">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How I think about <span className="serif italic text-violet-300">software &amp; intelligence.</span>
              </h2>

              {about.story && about.story.length > 0 ? (
                about.story.map((para, i) => (
                  <p key={i} className="text-white/70 leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-white/70 leading-relaxed">
                    I believe the best way to master modern software is by building systems that actually work in production. Rather than getting stuck in abstract tutorials, I build complete end-to-end automations, agentic workflows, and RAG knowledge bases.
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    My focus is on practical AI: connecting webhooks, parsing unstructured data, orchestrating LLM reasoning, and integrating APIs cleanly so that businesses save real hours of repetitive work.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ─── 02 CURRENT FOCUS ────────────────────────────────────────────── */}
        <section className="space-y-6" aria-label="Current Focus">
          <SectionPlate
            index="02"
            title="CURRENT FOCUS"
            meta="active learning &amp; engineering areas"
          />

          <div className="rounded-2xl bg-[#0c0f18] border border-violet-500/30 p-8 sm:p-10 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-violet-400">
              <Compass className="w-4 h-4" />
              <span className="font-semibold uppercase tracking-wider">
                What I am building and exploring right now
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {settings.nowBuildingTitle || "Multi-Agent Coordination & Production RAG Pipelines"}
            </h3>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans max-w-3xl">
              {settings.nowBuildingDescription ||
                "Deepening multi-agent orchestration architectures with LangGraph, optimizing semantic chunking strategies for enterprise vector retrieval, and hardening webhook failure recovery loops."}
            </p>
          </div>
        </section>

        {/* ─── 03 ORGANIZED TECHNICAL STACK ───────────────────────────────── */}
        <section className="space-y-6" aria-label="Technical Stack">
          <SectionPlate
            index="03"
            title="TECHNICAL TOOLCHAIN"
            meta="technologies verified in real builds"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STACK_GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.category}
                  className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-6 space-y-4"
                >
                  <div className="flex items-center gap-2.5 font-mono text-xs">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-white tracking-tight text-sm">
                      {group.category}
                    </span>
                  </div>

                  <ul className="space-y-2 font-mono text-xs text-white/70">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-center gap-1.5">
                        <span className="text-violet-400 text-[10px]">▹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── 04 SELECTED WORK CONNECTOR ──────────────────────────────────── */}
        {selectedProjects.length > 0 && (
          <section className="space-y-6" aria-label="Selected Builds">
            <SectionPlate
              index="04"
              title="SELECTED BUILDS"
              meta="demonstrating these principles"
              action={
                <Link
                  href="/projects"
                  className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
                >
                  <span>All projects ({projects.length})</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedProjects.map((p, idx) => (
                <div
                  key={p.slug || p.id}
                  className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 p-6 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                      <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">
                        {p.category}
                      </span>
                      <span className="text-white/30 font-bold">0{idx + 1}</span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                      <Link href={`/projects/${p.slug}`}>
                        {p.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed font-sans">
                      {p.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
                    <span className="text-[10px] text-white/40">
                      {p.stack?.[0] || "AI System"}
                    </span>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="inline-flex items-center gap-1 text-violet-300 hover:text-white transition-colors"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 05 LATEST BUILD NOTES CONNECTOR ─────────────────────────────── */}
        {selectedPosts.length > 0 && (
          <section className="space-y-6" aria-label="Build Notes">
            <SectionPlate
              index="05"
              title="LATEST BUILD NOTES"
              meta="recent thoughts and lessons"
              action={
                <Link
                  href="/blog"
                  className="text-white/40 hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
                >
                  <span>All journal entries</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="p-5 rounded-2xl bg-[#0c0f18] hover:bg-[#121622] border border-white/[0.08] group transition-colors space-y-2 block"
                >
                  <span className="text-[10px] font-mono uppercase text-violet-400 font-semibold">
                    {post.category}
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-200 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-white/50 line-clamp-2 font-sans">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ─── 06 DIRECT HUMAN CTA ─────────────────────────────────────────── */}
        <div className="pt-6">
          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-8 sm:p-14 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Have a workflow worth{" "}
                <span className="serif italic text-violet-300">automating?</span>
              </h2>

              <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                I am currently open to automation sprints, AI agent builds, and RAG architectures. Let&rsquo;s start a conversation.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Start a Conversation
                </Button>

                <Button href="/projects" variant="secondary" size="lg">
                  View Selected Work
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
