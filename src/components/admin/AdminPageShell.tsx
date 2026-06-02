import { ReactNode } from "react";
import AdminNav from "./AdminNav";
import AdminSidebar from "./AdminSidebar";

/**
 * Shared chrome for every authenticated admin page:
 * full-bleed dark gradient, top nav, sidebar, and padded main area.
 */
export default function AdminPageShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null };
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminNav user={user} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
