import type { Metadata } from "next";
import Link from "next/link";
import { getProjects, getBlogPosts, getServices, getSkills } from "@/lib/db";
import { FolderOpen, FileText, Workflow, Sparkles, User, Search, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Content Management · Admin",
};

export default async function ContentPage() {
  const [posts, projects, services, skills] = await Promise.all([
    getBlogPosts(),
    getProjects(),
    getServices(),
    getSkills(),
  ]);

  const cards = [
    {
      title: "Projects & Case Studies",
      description: "Manage project details, workflow diagrams, tech stack, and demos.",
      count: `${projects.length} projects`,
      href: "/admin/projects",
      icon: FolderOpen,
    },
    {
      title: "Journal & Build Notes",
      description: "Write articles, technical logs, prompt teardowns, and learnings.",
      count: `${posts.length} entries`,
      href: "/admin/posts",
      icon: FileText,
    },
    {
      title: "Services & Capabilities",
      description: "Define automation offerings, problem/solution pairs, and CTAs.",
      count: `${services.length} services`,
      href: "/admin/services",
      icon: Workflow,
    },
    {
      title: "Skills & Toolchains",
      description: "Organize categorized skills, Python libraries, APIs, and frameworks.",
      count: `${skills.length} categories`,
      href: "/admin/skills",
      icon: Sparkles,
    },
    {
      title: "About & Story",
      description: "Edit bio, story narrative, mindset, and experience milestones.",
      count: "Bio & Principles",
      href: "/admin/about",
      icon: User,
    },
    {
      title: "SEO & Social Metadata",
      description: "Configure site titles, meta descriptions, and OpenGraph tags.",
      count: "Global SEO",
      href: "/admin/seo",
      icon: Search,
    },
    {
      title: "Settings & Availability",
      description: "Manage contact channels, availability note, and feature flags.",
      count: "Config",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Content Management</h1>
        <p className="text-sm text-slate-400 mt-1">
          Select a content category to manage, create, or update website data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              href={c.href}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-all flex flex-col justify-between group space-y-4 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-violet-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">{c.count}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-violet-400">
                <span>Open Editor</span>
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
