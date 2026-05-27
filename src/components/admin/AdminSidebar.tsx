import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Settings,
  FileText,
  FolderOpen,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Submissions", icon: Mail },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  // Note: usePathname doesn't work in async components
  // This is a limitation of Next.js RSC. Consider making this a client component
  // or implement server-side active detection.

  return (
    <aside className="w-64 bg-slate-800/30 border-r border-slate-700/50 p-6 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors group"
            >
              <Icon className="w-5 h-5 group-hover:text-violet-400" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
