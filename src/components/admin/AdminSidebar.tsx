"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Workflow,
  Sparkles,
  User,
  Search,
  Settings,
  MessageSquare,
  BarChart3,
  Shield,
  ExternalLink,
  LogOut,
  ChevronLeft,
  Server,
  Activity,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  user?: Session["user"];
  unreadCount?: number;
}

export default function AdminSidebar({ user, unreadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-admin-mobile-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-admin-mobile-sidebar", handleToggle);
  }, []);

  const sections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "CONTENT",
      items: [
        { label: "Projects", href: "/admin/projects", icon: FolderOpen },
        { label: "Blog / Journal", href: "/admin/posts", icon: FileText },
        { label: "Services", href: "/admin/services", icon: Workflow },
        { label: "Skills", href: "/admin/skills", icon: Sparkles },
        { label: "About", href: "/admin/about", icon: User },
      ],
    },
    {
      title: "ENGAGEMENT",
      items: [
        {
          label: "Messages",
          href: "/admin/messages",
          icon: MessageSquare,
          badge: unreadCount,
        },
        { label: "Admin Activity", href: "/admin/activity", icon: Activity },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { label: "SEO Control", href: "/admin/seo", icon: Search },
        { label: "Site Settings", href: "/admin/settings", icon: Settings },
        { label: "System Health", href: "/admin/health", icon: Server },
      ],
    },
  ];

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-20 bg-[#0b0e17] border-r border-[#1a202c] flex flex-col transition-all duration-200 shrink-0 select-none ${
          mobileOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "md:w-[68px]" : "md:w-64"}`}
      >
        {/* Brand Header */}
        <div
          className={`flex items-center border-b border-[#1a202c] ${
            collapsed ? "justify-center px-3 py-4" : "justify-between px-5 py-4"
          }`}
        >
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2.5 min-w-0 group">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/20 border border-violet-500/30">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-bold text-sm leading-none tracking-tight">Portfolio OS</p>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    PRO
                  </span>
                </div>
                <p className="text-[#6b7280] text-[10px] font-mono mt-1 truncate">Arefin Mueen · Admin</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center border border-violet-500/30">
              <Shield className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-[#6b7280] hover:text-white hover:bg-[#1a202c] rounded-lg transition-colors md:hidden shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-[#6b7280] hover:text-white hover:bg-[#1a202c] rounded-lg transition-colors hidden md:block shrink-0"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-4 px-2.5 custom-scrollbar">
          {sections.map((section) => (
            <div key={section.title} className="space-y-0.5">
              {!collapsed && (
                <p className="text-[#4b5563] text-[9px] font-mono uppercase tracking-widest px-3 py-1 font-semibold">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-xs font-medium group ${
                      active
                        ? "bg-violet-600/20 text-white font-semibold border border-violet-500/30 shadow-sm shadow-violet-500/10"
                        : "text-[#9ca3af] hover:text-white hover:bg-[#141a29]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        active ? "text-violet-400" : "text-[#6b7280] group-hover:text-violet-300"
                      }`}
                    />
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                            {item.badge > 99 ? "99+" : item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0b0e17]" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer / User Profile & Logout */}
        <div className="border-t border-[#1a202c] p-3 space-y-1 bg-[#090c14]">
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#9ca3af] hover:text-white hover:bg-[#141a29] transition-colors text-xs font-medium ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "View Live Website" : undefined}
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-[#6b7280]" />
            {!collapsed && <span>Live Portfolio ↗</span>}
          </Link>

          <div className={`flex items-center gap-2.5 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 bg-violet-600/30 border border-violet-500/40 rounded-full flex items-center justify-center shrink-0 text-violet-300 text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate leading-none">{user?.name || "Arefin Mueen"}</p>
                <p className="text-[#6b7280] text-[10px] truncate mt-0.5 font-mono">admin</p>
              </div>
            )}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#ef4444] hover:bg-red-500/10 transition-colors text-xs font-medium ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
