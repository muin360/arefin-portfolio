import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServices } from "@/lib/db";
import ServicesManager from "@/components/admin/ServicesManager";

export const metadata = {
  title: "Manage Services · Admin",
};

export default async function AdminServicesPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  const services = await getServices({ publishedOnly: false });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Services &amp; Capabilities</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your service cards, problems, solutions, outcomes, and CTA prefill copy.
        </p>
      </div>

      <ServicesManager initialServices={services} />
    </div>
  );
}
