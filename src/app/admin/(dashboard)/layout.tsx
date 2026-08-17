import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import CommandPalette from "@/components/admin/CommandPalette";
import { getContactSubmissions } from "@/lib/db";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Arefin Mueen Personal Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user?.isAdmin) {
    redirect("/admin/login");
  }

  // Unread count for the sidebar badge — best-effort, never blocks render
  let unreadCount = 0;
  try {
    const submissions = await getContactSubmissions();
    unreadCount = submissions.filter((s) => s.status === "unread").length;
  } catch {
    unreadCount = 0;
  }

  return (
    <div className="flex h-screen bg-[#07090e] overflow-hidden text-slate-100">
      <CommandPalette />
      {/* Sidebar */}
      <AdminSidebar user={session.user} unreadCount={unreadCount} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0a0e1a]">
        {/* Header */}
        <AdminHeader user={session.user} unreadCount={unreadCount} />

        {/* Content */}
        <main className="flex-1 overflow-auto custom-scrollbar">
          <div className="p-6 md:p-8 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
