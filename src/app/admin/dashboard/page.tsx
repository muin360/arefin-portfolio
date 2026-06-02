import { requireAdmin } from "@/lib/admin-auth";
import { Mail, Eye, CheckCircle, Clock } from "lucide-react";
import AdminPageShell from "@/components/admin/AdminPageShell";
import StatsCard from "@/components/admin/StatsCard";
import { sanityFetch } from "@/sanity/fetch";
import { groq } from "next-sanity";

export const metadata = {
  title: "Admin Dashboard",
  description: "Tensorix Admin Dashboard",
};

// Fetch contact submissions
const contactSubmissionsQuery = groq`*[_type == "contactSubmission"] | order(_createdAt desc) [0...5] {
  _id,
  name,
  email,
  subject,
  _createdAt,
  read,
}`;

// Fetch stats
const statsQuery = groq`{
  "totalPosts": count(*[_type == "post"]),
  "totalProjects": count(*[_type == "project"]),
  "totalSubmissions": count(*[_type == "contactSubmission"]),
  "unreadSubmissions": count(*[_type == "contactSubmission" && read != true]),
}`;

export default async function DashboardPage() {
  const session = await requireAdmin();

  type Stats = {
    totalPosts: number;
    totalProjects: number;
    totalSubmissions: number;
    unreadSubmissions: number;
  };

  const stats = ((await sanityFetch({
    query: statsQuery,
    tags: ["admin", "stats"],
  })) || {
    totalPosts: 0,
    totalProjects: 0,
    totalSubmissions: 0,
    unreadSubmissions: 0,
  }) as Stats;

  const submissions = ((await sanityFetch({
    query: contactSubmissionsQuery,
    tags: ["admin", "submissions"],
  })) || []) as any[];

  return (
    <AdminPageShell user={session.user}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {session.user.name?.split(" ")[0]}
        </h1>
        <p className="text-slate-400">
          Here's an overview of your portfolio and submissions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Posts"
          value={stats.totalPosts}
          icon={Mail}
          color="from-blue-600 to-blue-400"
        />
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={Eye}
          color="from-purple-600 to-purple-400"
        />
        <StatsCard
          title="Contact Submissions"
          value={stats.totalSubmissions}
          icon={CheckCircle}
          color="from-emerald-600 to-emerald-400"
        />
        <StatsCard
          title="Unread"
          value={stats.unreadSubmissions}
          icon={Clock}
          color="from-orange-600 to-orange-400"
        />
      </div>

      {/* Recent Submissions */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Submissions</h2>
            <p className="text-sm text-slate-400 mt-1">
              Latest contact form submissions
            </p>
          </div>
          <a
            href="/admin/submissions"
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
          >
            View all
          </a>
        </div>

        {submissions.length > 0 ? (
          <div className="space-y-3">
            {submissions.map((sub: any) => (
              <div
                key={sub._id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-white font-medium">{sub.name}</h3>
                  <p className="text-sm text-slate-400">
                    {sub.subject} — {sub.email}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(sub._createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!sub.read && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">
            No submissions yet. They will appear here once someone fills
            out the contact form.
          </p>
        )}
      </div>
    </AdminPageShell>
  );
}
