import { requireAdmin } from "@/lib/admin-auth";
import AdminPageShell from "@/components/admin/AdminPageShell";
import SettingsForm from "@/components/admin/SettingsForm";
import { sanityFetch } from "@/sanity/fetch";
import { siteConfigQuery } from "@/sanity/queries";
import type { SiteConfig } from "@/sanity/types";

export const metadata = {
  title: "Settings",
  description: "Manage site settings and configuration",
};

export default async function SettingsPage() {
  const session = await requireAdmin();

  const config = (await sanityFetch<SiteConfig>({
    query: siteConfigQuery,
    tags: ["siteConfig"],
  })) || null;

  return (
    <AdminPageShell user={session.user}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">
          Manage your portfolio settings and configuration
        </p>
      </div>

      <SettingsForm initialConfig={config} />
    </AdminPageShell>
  );
}
