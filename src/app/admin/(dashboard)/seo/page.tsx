import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/db";
import SeoEditor from "@/components/admin/SeoEditor";

export const metadata = {
  title: "SEO & Metadata · Admin",
};

export default async function AdminSeoPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Search &amp; Social Metadata</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage global site titles, meta descriptions, OpenGraph tags, and canonical links.
        </p>
      </div>

      <SeoEditor initialSeo={settings.seo} />
    </div>
  );
}
