import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProjects } from "@/lib/db";
import ProjectsManager from "@/components/admin/ProjectsManager";

export const metadata = {
  title: "Manage Projects · Admin",
};

export default async function AdminProjectsPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const projects = await getProjects({ publishedOnly: false });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <p className="text-sm text-slate-400 mt-1">
          Create, edit, reorder, and publish your AI automation &amp; agent projects.
        </p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
