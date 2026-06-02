import { requireAdmin } from "@/lib/admin-auth";
import AdminPageShell from "@/components/admin/AdminPageShell";
import { sanityFetch } from "@/sanity/fetch";
import { groq } from "next-sanity";
import SubmissionsClient from "./SubmissionsClient";

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
  const session = await requireAdmin();

  const submissions =
    ((await sanityFetch({
      query: submissionsQuery,
      tags: ["admin", "submissions"],
    })) || []) as any[];

  return (
    <AdminPageShell user={session.user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Contact Submissions
        </h1>
        <p className="text-slate-400">
          Manage all contact form submissions
        </p>
      </div>
      <SubmissionsClient initialSubmissions={submissions} />
    </AdminPageShell>
  );
}
