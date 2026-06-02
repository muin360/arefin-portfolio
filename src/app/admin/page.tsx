import { auth } from "@/lib/auth";
import {
  BarChart3,
  MessageSquare,
  FileText,
  Eye,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import { allPostsQuery, allProjectsQuery } from "@/sanity/queries";
import type { PostListItem, ProjectDoc } from "@/sanity/types";

export const metadata = {
  title: "Admin Dashboard",
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
}) => (
  <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && <p className="text-green-400 text-xs mt-2">{trend}</p>}
      </div>
      <Icon className="w-8 h-8 text-violet-400" />
    </div>
  </div>
);

const QuickActionButton = ({
  label,
  href,
  icon: Icon,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
}) => (
  <Link
    href={href}
    className="flex items-center gap-3 p-4 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
  >
    <Icon className="w-5 h-5 text-violet-400" />
    <span className="text-white font-medium">{label}</span>
  </Link>
);

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user;

  // Fetch data for stats
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

  const postCount = posts?.length || 0;
  const projectCount = projects?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-2">
            Welcome back, {user?.name || "Admin"}!
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          label="Blog Posts"
          value={postCount}
          trend="Up 12% from last month"
        />
        <StatCard
          icon={BarChart3}
          label="Projects"
          value={projectCount}
          trend="All published"
        />
        <StatCard
          icon={Eye}
          label="Page Views"
          value="2,384"
          trend="Up 23% from last week"
        />
        <StatCard
          icon={TrendingUp}
          label="Engagement"
          value="94%"
          trend="Very high"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            label="New Blog Post"
            href="/admin/content/posts/new"
            icon={FileText}
          />
          <QuickActionButton
            label="New Project"
            href="/admin/content/projects/new"
            icon={BarChart3}
          />
          <QuickActionButton
            label="View Messages"
            href="/admin/messages"
            icon={MessageSquare}
          />
          <QuickActionButton
            label="Analytics"
            href="/admin/analytics"
            icon={TrendingUp}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="bg-slate-700 border border-slate-600 rounded-lg p-6">
          <p className="text-slate-400">Recent activity will appear here...</p>
        </div>
      </div>
    </div>
  );
}
