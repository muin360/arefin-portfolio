import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAboutData } from "@/lib/db";
import AboutEditor from "@/components/admin/AboutEditor";

export const metadata = {
  title: "About & Story · Admin",
};

export default async function AdminAboutPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const about = await getAboutData();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">About &amp; Story</h1>
        <p className="text-sm text-slate-400 mt-1">
          Edit your personal background, journey narrative, mindset, and principles.
        </p>
      </div>

      <AboutEditor initialAbout={about} />
    </div>
  );
}
