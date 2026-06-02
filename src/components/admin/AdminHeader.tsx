"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import type { Session } from "next-auth";

interface AdminHeaderProps {
  user?: Session["user"];
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length <= 1) return "Dashboard";
    return segments[segments.length - 1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-8 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">{getPageTitle(pathname)}</h2>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-slate-700 rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent ml-2 outline-none text-white placeholder-slate-400 text-sm w-48"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
