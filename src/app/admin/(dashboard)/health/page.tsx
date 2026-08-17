import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SystemHealthClient from "@/components/admin/SystemHealthClient";

export const metadata: Metadata = {
  title: "System Health · Admin · Arefin Mueen",
};

export default async function SystemHealthPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/admin/login");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">System Health</h1>
        <p className="text-sm text-[#6b7280] mt-0.5">
          Live status of all portfolio infrastructure components.
        </p>
      </div>
      <SystemHealthClient />
    </div>
  );
}
