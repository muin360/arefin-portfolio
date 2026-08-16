import { auth } from "@/lib/auth";
import {
  FolderOpen,
  FileText,
  Workflow,
  MessageSquare,
  ArrowRight,
  Eye,
  Plus,
} from "lucide-react";
import Link from "next/link";
import {
  getProjects,
  getBlogPosts,
  getServices,
  getSkills,
  getContactSubmissions,
  getSiteSettings,
} from "@/lib/db";

export const metadata = {
  title: "Admin Dashboard · Arefin Mueen",
};

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user;

  const [projects, posts, services, skills, submissions, settings] =
    await Promise.all([
      getProjects(),
      getBlogPosts(),
      getServices(),
      getSkills(),
      getContactSubmissions(),
      getSiteSettings(),
    ]);

  const unreadMessages = submissions.filter((s) => s.status === "unread").length;
  const publishedProjects = projects.filter((p) => p.published).length;
  const publishedPosts = posts.filter((p) => p.published).length;

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400">
            Personal Portfolio OS
          </span>
          <h1 className="text-3xl font-bold text-white mt-1">
            Welcome back, {user?.name?.split(" ")[0] || "Arefin"}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Current status:{" "}
            <span className="text-emerald-400 font-medium">
              {settings.availabilityNote || settings.availability}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700"
          >
            <Eye className="w-4 h-4" />
            View Live Site
          </Link>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/projects"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Projects
            </span>
            <FolderOpen className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">{projects.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {publishedProjects} published · {projects.length - publishedProjects} drafts
          </p>
        </Link>

        <Link
          href="/admin/posts"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Journal Entries
            </span>
            <FileText className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">{posts.length}</p>
          <p className="text-xs text-slate-400 mt-1">
            {publishedPosts} published articles
          </p>
        </Link>

        <Link
          href="/admin/messages"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Inquiries
            </span>
            <MessageSquare className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {submissions.length}
          </p>
          <p className="text-xs text-emerald-400 mt-1">
            {unreadMessages} unread messages
          </p>
        </Link>

        <Link
          href="/admin/services"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Services &amp; Skills
            </span>
            <Workflow className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white mt-3">
            {services.length} / {skills.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {services.length} services · {skills.length} skill groups
          </p>
        </Link>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Latest Projects</h2>
            <Link
              href="/admin/projects"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-mono"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800/60">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{p.title}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    /{p.slug} · {p.category}
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
                    p.published
                      ? "bg-emerald-950 text-emerald-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {p.published ? "Live" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inbound Messages */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white">Recent Inquiries</h2>
            <Link
              href="/admin/messages"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-mono"
            >
              Inbox ({submissions.length}) <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-800/60">
            {submissions.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500">
                No inquiries received yet.
              </p>
            ) : (
              submissions.slice(0, 4).map((s) => (
                <div key={s.id} className="py-3 space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{s.name}</span>
                    <span className="text-slate-500 font-mono">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{s.subject}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
