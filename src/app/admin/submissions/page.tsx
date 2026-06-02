import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { sanityFetch } from "@/sanity/fetch";
import { groq } from "next-sanity";
import SubmissionsClient from "./SubmissionsClient";
import type { AdminSubmission } from "@/types/admin";

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

  const submissions =
    (await sanityFetch<AdminSubmission[]>({
      query: submissionsQuery,
      tags: ["admin", "submissions"],
    })) ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNav user={session.user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Contact Submissions
              </h1>
              <p className="text-slate-400">
                Manage all contact form submissions
              </p>
            </div>
            <SubmissionsClient initialSubmissions={submissions} />
          </div>
        </main>
      </div>
    </div>
  );
}
