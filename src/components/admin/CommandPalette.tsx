"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Plus,
  FileText,
  Workflow,
  Sparkles,
  User,
  MessageSquare,
  Search,
  Settings,
  Server,
  Activity,
  ExternalLink,
  LogOut,
  Command,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface CommandItem {
  id: string;
  label: string;
  category: "Navigation" | "Quick Action" | "System";
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Listen for ⌘K or Ctrl+K or Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelectedIndex(0);
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const items: CommandItem[] = useMemo(
    () => [
      {
        id: "nav-dashboard",
        label: "Dashboard Overview",
        category: "Navigation",
        icon: LayoutDashboard,
        action: () => router.push("/admin"),
      },
      {
        id: "nav-analytics",
        label: "Traffic & Engagement Analytics",
        category: "Navigation",
        icon: BarChart3,
        action: () => router.push("/admin/analytics"),
      },
      {
        id: "nav-projects",
        label: "Projects & Case Studies",
        category: "Navigation",
        icon: FolderOpen,
        action: () => router.push("/admin/projects"),
      },
      {
        id: "act-new-project",
        label: "Create New Project",
        category: "Quick Action",
        icon: Plus,
        shortcut: "N P",
        action: () => router.push("/admin/projects?new=1"),
      },
      {
        id: "nav-posts",
        label: "Journal / Blog Articles",
        category: "Navigation",
        icon: FileText,
        action: () => router.push("/admin/posts"),
      },
      {
        id: "act-new-post",
        label: "Create New Article",
        category: "Quick Action",
        icon: Plus,
        shortcut: "N A",
        action: () => router.push("/admin/posts?new=1"),
      },
      {
        id: "nav-services",
        label: "Services & Capabilities",
        category: "Navigation",
        icon: Workflow,
        action: () => router.push("/admin/services"),
      },
      {
        id: "nav-skills",
        label: "Skills & Toolchain",
        category: "Navigation",
        icon: Sparkles,
        action: () => router.push("/admin/skills"),
      },
      {
        id: "nav-about",
        label: "About & Principles",
        category: "Navigation",
        icon: User,
        action: () => router.push("/admin/about"),
      },
      {
        id: "nav-messages",
        label: "Inquiries & Messages",
        category: "Navigation",
        icon: MessageSquare,
        action: () => router.push("/admin/messages"),
      },
      {
        id: "nav-activity",
        label: "Admin Activity Audit",
        category: "Navigation",
        icon: Activity,
        action: () => router.push("/admin/activity"),
      },
      {
        id: "nav-seo",
        label: "SEO Control & Metadata",
        category: "System",
        icon: Search,
        action: () => router.push("/admin/seo"),
      },
      {
        id: "nav-settings",
        label: "Site Settings & Live Stats",
        category: "System",
        icon: Settings,
        action: () => router.push("/admin/settings"),
      },
      {
        id: "nav-health",
        label: "System Health & Diagnostics",
        category: "System",
        icon: Server,
        action: () => router.push("/admin/health"),
      },
      {
        id: "act-view-site",
        label: "Open Live Public Website",
        category: "Quick Action",
        icon: ExternalLink,
        action: () => window.open("/", "_blank"),
      },
      {
        id: "act-signout",
        label: "Sign Out of Admin",
        category: "System",
        icon: LogOut,
        action: () => signOut({ callbackUrl: "/" }),
      },
    ],
    [router],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  const handleSelect = (item: CommandItem) => {
    setOpen(false);
    item.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(filtered.length - 1, 0) : prev - 1,
      );
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-[#0f111a] border border-[#1e2433] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1e2433] bg-[#111827]">
          <Command className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, page, or action..."
            className="flex-1 bg-transparent text-white placeholder-[#6b7280] text-sm focus:outline-none"
          />
          <kbd className="px-2 py-0.5 bg-[#1e2433] text-[#9ca3af] text-[10px] font-mono rounded border border-[#2d3748]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto py-2 px-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6b7280] font-mono">
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs text-left transition-colors ${
                    isSelected
                      ? "bg-violet-600/20 text-white border border-violet-500/30"
                      : "text-[#9ca3af] hover:text-white hover:bg-[#141a29]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-violet-400" : "text-[#6b7280]"}`} />
                    <span className="font-medium truncate">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 bg-[#1e2433] text-[#9ca3af] text-[10px] font-mono rounded">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#0b0e17] border-t border-[#1e2433] flex items-center justify-between text-[11px] font-mono text-[#6b7280]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>Portfolio OS Command Center</span>
        </div>
      </div>
    </div>
  );
}
