import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getContactSubmissions } from "@/lib/db";
import SubmissionsManager from "@/components/admin/SubmissionsManager";

export const metadata = {
  title: "Inbox & Inquiries · Admin",
};

export default async function AdminMessagesPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const submissions = await getContactSubmissions();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Inquiries &amp; Messages</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review and respond to client inquiries sent via the website contact forms.
        </p>
      </div>

      <SubmissionsManager initialSubmissions={submissions} />
    </div>
  );
}
