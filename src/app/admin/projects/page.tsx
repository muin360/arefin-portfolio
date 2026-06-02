import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { sanityFetch } from "@/sanity/fetch";
import { groq } from "next-sanity";
import { FolderOpen, ExternalLink, Globe } from "lucide-react";
import type { AdminProject } from "@/types/admin";

export const metadata = {
  title: "Projects",
  description: "Manage your portfolio projects",
};

const projectsQuery = groq`*[_type == "project"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  summary,
  url,
  tags,
  "coverImage": coverImage.asset->url,
}`;

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const projects = (await sanityFetch<AdminProject[]>({ query: projectsQuery, tags: ["project"] })) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNav user={session.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                <p className="text-slate-400">
                  {projects.length} project{projects.length !== 1 ? "s" : ""} — edit in Sanity Studio
                </p>
              </div>
              <a
                href="/studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Sanity Studio
              </a>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-xl">
              {projects.length > 0 ? (
                <div className="divide-y divide-slate-700/30">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between p-6 hover:bg-slate-700/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{project.title}</h3>
                          {project.summary && (
                            <p className="text-sm text-slate-400 mt-0.5 line-clamp-1">
                              {project.summary}
                            </p>
                          )}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                              {project.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Visit live site"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        {project.slug?.current && (
                          <a
                            href={`/projects/${project.slug.current}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="View project"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FolderOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No projects yet</h3>
                  <p className="text-slate-500 mb-6">Add your first project in Sanity Studio.</p>
                  <a
                    href="/studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Sanity Studio
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
