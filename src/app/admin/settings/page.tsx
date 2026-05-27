import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SettingsForm from "@/components/admin/SettingsForm";
import { sanityFetch } from "@/sanity/fetch";
import { siteConfigQuery } from "@/sanity/queries";
import type { SiteConfig } from "@/sanity/types";

export const metadata = {
  title: "Settings",
  description: "Manage site settings and configuration",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const config = (await sanityFetch<SiteConfig>({
    query: siteConfigQuery,
    tags: ["siteConfig"],
  })) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNav user={session.user} />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
              <p className="text-slate-400">
                Manage your portfolio settings and configuration
              </p>
            </div>

            <SettingsForm initialConfig={config} />
          </div>
        </main>
      </div>
    </div>
  );
}
