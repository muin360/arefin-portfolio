import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSkills } from "@/lib/db";
import SkillsManager from "@/components/admin/SkillsManager";

export const metadata = {
  title: "Manage Skills · Admin",
};

export default async function AdminSkillsPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const skills = await getSkills({ publishedOnly: false });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Technical Skills &amp; Stack</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your categorized skills, toolchains, APIs, and frameworks.
        </p>
      </div>

      <SkillsManager initialSkills={skills} />
    </div>
  );
}
