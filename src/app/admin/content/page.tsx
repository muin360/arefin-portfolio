import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { sanityFetch } from "@/sanity/fetch";
import { allPostsQuery, allProjectsQuery } from "@/sanity/queries";
import type { PostListItem, ProjectDoc } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Content Management",
};

const ContentCard = ({
  title,
  description,
  items,
  href,
}: {
  title: string;
  description: string;
  items: number;
  href: string;
}) => (
  <Link
    href={href}
    className="bg-slate-700 border border-slate-600 rounded-lg p-6 hover:border-violet-500 transition-all hover:shadow-lg"
  >
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm mb-4">{description}</p>
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-sm">{items} items</span>
      <span className="text-violet-400 font-medium">Manage →</span>
    </div>
  </Link>
);

export default async function ContentPage() {
  const [posts, projects] = await Promise.all([
    sanityFetch<PostListItem[]>({
      query: allPostsQuery,
      tags: ["post"],
    }),
    sanityFetch<ProjectDoc[]>({
      query: allProjectsQuery,
      tags: ["project"],
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Content Management</h1>
          <p className="text-slate-400 mt-2">
            Manage all your portfolio content
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContentCard
          title="Blog Posts"
          description="Create, edit, and manage your blog articles"
          items={posts?.length || 0}
          href="/admin/content/posts"
        />
        <ContentCard
          title="Projects"
          description="Showcase your best work and case studies"
          items={projects?.length || 0}
          href="/admin/content/projects"
        />
        <ContentCard
          title="Services"
          description="Update your service offerings and pricing"
          items={0}
          href="/admin/content/services"
        />
        <ContentCard
          title="Skills"
          description="Manage your skills and expertise areas"
          items={0}
          href="/admin/content/skills"
        />
      </div>
    </div>
  );
}
