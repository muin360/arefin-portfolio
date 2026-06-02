import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Tensorix Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const isAdmin = (session.user as any)?.isAdmin;
  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <AdminSidebar user={session.user} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader user={session.user} />

        {/* Content */}
        <main className="flex-1 overflow-auto bg-slate-800">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
