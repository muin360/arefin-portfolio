"use client";

import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Command, ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";

interface AdminHeaderProps {
  user?: Session["user"];
  unreadCount?: number;
}

const BREADCRUMB_MAP: Record<string, string> = {
  admin: "Dashboard",
  analytics: "Analytics",
  projects: "Projects",
  posts: "Journal",
  services: "Services",
  skills: "Skills",
  about: "About",
  messages: "Messages",
  activity: "Activity",
  seo: "SEO Control",
  settings: "Settings",
  health: "System Health",
  submissions: "Messages",
  new: "New",
  edit: "Edit",
};

export default function AdminHeader({ user, unreadCount = 0 }: AdminHeaderProps) {
  const pathname = usePathname();

  // Build breadcrumbs
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: BREADCRUMB_MAP[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "Arefin";

  const triggerCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      }),
    );
  };

  const toggleMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-admin-mobile-sidebar"));
  };

  return (
    <header className="bg-[#0b0e17] border-b border-[#1a202c] px-4 sm:px-6 py-3 shrink-0 z-10">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="p-1.5 text-[#9ca3af] hover:text-white bg-[#141a29] hover:bg-[#1e2433] rounded-lg md:hidden border border-[#1e2433] transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs min-w-0 font-medium">
            {crumbs.map((crumb, idx) => (
              <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#4b5563] shrink-0" />}
                {crumb.isLast ? (
                  <span className="text-white font-semibold truncate bg-[#141a29] px-2 py-0.5 rounded-md border border-[#1e2433]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-[#6b7280] hover:text-white transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick Search / Command Palette Button */}
          <button
            type="button"
            onClick={triggerCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] hover:bg-[#161f33] border border-[#1e2433] hover:border-violet-500/30 rounded-xl text-xs text-[#9ca3af] transition-all shadow-sm group"
          >
            <Command className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search or command...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-[#1a202c] text-[#6b7280] text-[10px] font-mono rounded border border-[#2d3748]">
              ⌘K
            </kbd>
          </button>

          {/* Time greeting */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#6b7280]">
            <span>{greeting},</span>
            <span className="text-white font-semibold">{firstName}</span>
          </div>

          <div className="h-4 w-px bg-[#1a202c] hidden lg:block" />

          {/* Messages / Notifications */}
          <Link
            href="/admin/messages"
            className="relative p-2 text-[#9ca3af] hover:text-white hover:bg-[#141a29] rounded-xl transition-colors border border-transparent hover:border-[#1e2433]"
            aria-label={`Inquiries: ${unreadCount} unread`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0b0e17]" />
            )}
          </Link>

          {/* External site link */}
          <Link
            href="/"
            target="_blank"
            className="p-2 text-[#9ca3af] hover:text-white hover:bg-[#141a29] rounded-xl transition-colors border border-transparent hover:border-[#1e2433]"
            title="Open Live Portfolio"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
