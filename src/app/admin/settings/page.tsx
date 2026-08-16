import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/db";

export const metadata = {
  title: "Settings & Availability · Admin",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings &amp; Availability</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your portfolio identity, availability badge, contact channels, and features.
        </p>
      </div>

      <SettingsForm initialConfig={settings} />
    </div>
  );
}
