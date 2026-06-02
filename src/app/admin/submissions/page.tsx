import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { sanityFetch } from "@/sanity/fetch";
import { groq } from "next-sanity";
import { Mail, Trash2, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Contact Submissions",
  description: "View and manage contact form submissions",
};

const submissionsQuery = groq`*[_type == "contactSubmission"] | order(_createdAt desc) {
  _id,
  name,
  email,
  subject,
  message,
  _createdAt,
  read,
}`;

export default async function SubmissionsPage() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const submissions = (await sanityFetch({
    query: submissionsQuery,
    tags: ["admin", "submissions"],
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNav user={session.user} />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Contact Submissions
              </h1>
              <p className="text-slate-400">
                Manage all contact form submissions
              </p>
            </div>

            {/* Submissions List */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden backdrop-blur-xl">
              {submissions.length > 0 ? (
                <div className="divide-y divide-slate-700/30">
                  {submissions.map((submission: any) => (
                    <div
                      key={submission._id}
                      className="p-6 hover:bg-slate-700/20 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {submission.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {submission.name}
                              </h3>
                              <p className="text-sm text-slate-400">{submission.email}</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-sm text-slate-300 font-medium">
                              {submission.subject}
                            </p>
                            <p className="text-sm text-slate-400 mt-2 whitespace-pre-wrap">
                              {submission.message}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <time>
                              {new Date(submission._createdAt).toLocaleString()}
                            </time>
                            {submission.read && (
                              <span className="flex items-center gap-1 text-emerald-400">
                                <CheckCircle className="w-3 h-3" />
                                Read
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <a
                            href={`mailto:${submission.email}`}
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Reply via email"
                          >
                            <Mail className="w-5 h-5" />
                          </a>
                          <button
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-red-600/50 text-slate-300 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Mail className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">
                    No submissions yet
                  </h3>
                  <p className="text-slate-500">
                    Contact form submissions will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
