"use client";

import { useState, useMemo } from "react";
import {
  Trash2,
  Archive,
  MailOpen,
  Mail,
  Search,
  Reply,
  Clock,
  CheckCircle,
  Download,
  Copy,
  Check,
  MessageCircle,
  Inbox,
} from "lucide-react";
import type { ContactSubmission } from "@/lib/db/types";

interface Props {
  initialSubmissions: ContactSubmission[];
}

type FilterTab = "all" | "unread" | "read" | "archived";

const TAB_LABELS: Record<FilterTab, string> = {
  all: "All Messages",
  unread: "Unread",
  read: "Read",
  archived: "Archived",
};

export default function SubmissionsManager({ initialSubmissions }: Props) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions || []);
  const [activeSub, setActiveSub] = useState<ContactSubmission | null>(
    (initialSubmissions || []).find((s) => s.status === "unread") ?? (initialSubmissions || [])[0] ?? null,
  );
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    let list = submissions;
    if (activeTab !== "all") {
      list = list.filter((s) =>
        activeTab === "archived"
          ? s.archived || s.status === "archived"
          : s.status === activeTab && !s.archived,
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.subject.toLowerCase().includes(q) ||
          s.message.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [submissions, activeTab, search]);

  const counts = useMemo(
    () => ({
      all: submissions.length,
      unread: submissions.filter((s) => s.status === "unread" && !s.archived).length,
      read: submissions.filter((s) => s.status === "read" && !s.archived).length,
      archived: submissions.filter((s) => s.archived || s.status === "archived").length,
    }),
    [submissions],
  );

  const handleStatusChange = async (id: string, status: ContactSubmission["status"]) => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status, archived: status === "archived" } : s)),
        );
        if (activeSub?.id === id) {
          setActiveSub((prev) => (prev ? { ...prev, status, archived: status === "archived" } : null));
        }
        showToast(status === "read" ? "Marked as read" : status === "unread" ? "Marked as unread" : "Archived");
      }
    } catch {
      showToast("Failed to update message status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (activeSub?.id === id) {
          const remaining = submissions.filter((s) => s.id !== id);
          setActiveSub(remaining[0] ?? null);
        }
        setDeleteConfirmId(null);
        showToast("Message deleted permanently");
      }
    } catch {
      showToast("Failed to delete message");
    }
  };

  const copyMessage = async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast("Message text copied to clipboard");
    } catch {
      showToast("Could not copy automatically. Please select text manually.");
    }
  };

  const exportCsv = () => {
    const sanitize = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      if (/^[=+\-@\t\r]/.test(str)) str = "'" + str;
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = [
      ["Date", "Name", "Email", "Subject", "Status", "Message", "IP"],
      ...submissions.map((s) => [
        sanitize(s.createdAt),
        sanitize(s.name),
        sanitize(s.email),
        sanitize(s.subject),
        sanitize(s.status),
        sanitize(s.message),
        sanitize(s.ip || ""),
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inbox_messages_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161d2d] border border-violet-500/40 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toast}
        </div>
      )}

      {/* Top action bar with Search, Tabs, and Export */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#0f111a] p-4 rounded-2xl border border-[#1e2433]">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#141a29] p-1 rounded-xl border border-[#1e2433] overflow-x-auto">
          {(["all", "unread", "read", "archived"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-[#9ca3af] hover:text-white hover:bg-[#1a202c]"
              }`}
            >
              <span>{TAB_LABELS[tab]}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  activeTab === tab
                    ? "bg-white/20 text-white"
                    : "bg-[#1e2433] text-[#6b7280]"
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Export */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7280]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sender, email, subject..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#141a29] border border-[#1e2433] rounded-xl text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            type="button"
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161d2d] hover:bg-[#1f293d] border border-[#252f44] text-white text-xs font-semibold rounded-xl transition-all shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            CSV
          </button>
        </div>
      </div>

      {/* Dual Pane Layout */}
      {submissions.length === 0 ? (
        <div className="p-16 rounded-3xl bg-[#0f111a] border border-[#1e2433] text-center">
          <Inbox className="w-12 h-12 text-[#252f44] mx-auto mb-3" />
          <h2 className="text-white font-bold text-base">Inbox is empty</h2>
          <p className="text-xs text-[#6b7280] mt-1 max-w-sm mx-auto">
            Client inquiries and discovery requests submitted through the contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[620px]">
          {/* Left Pane: Messages List (5 cols) */}
          <div className="lg:col-span-5 bg-[#0f111a] border border-[#1e2433] rounded-2xl p-2.5 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#6b7280] font-mono">
                  No messages match this filter.
                </div>
              ) : (
                filtered.map((s) => {
                  const isSelected = activeSub?.id === s.id;
                  const isUnread = s.status === "unread" && !s.archived;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveSub(s);
                        if (s.status === "unread") {
                          handleStatusChange(s.id, "read");
                        }
                      }}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? "bg-[#161d2d] border-violet-500/40 shadow-sm"
                          : isUnread
                            ? "bg-[#121624] border-[#252f44] hover:bg-[#141a29]"
                            : "bg-[#0b0e17]/60 border-transparent hover:bg-[#141a29]/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {isUnread ? (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 ring-2 ring-[#0f111a]" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" />
                          )}
                          <span
                            className={`text-xs truncate ${
                              isUnread ? "font-bold text-white" : "font-medium text-slate-300"
                            }`}
                          >
                            {s.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#6b7280] shrink-0">
                          {new Date(s.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <p className="text-xs text-violet-300 font-medium truncate mb-1">{s.subject}</p>
                      <p className="text-[11px] text-[#9ca3af] line-clamp-2 leading-relaxed">{s.message}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Message Detail (7 cols) */}
          <div className="lg:col-span-7 bg-[#0f111a] border border-[#1e2433] rounded-2xl p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            {activeSub ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-[#1a202c] pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                          {activeSub.subject}
                        </span>
                        {activeSub.archived && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#1e2433] text-[#6b7280]">
                            Archived
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-white tracking-tight">{activeSub.name}</h2>
                      <p className="text-xs text-violet-400 font-mono mt-0.5">{activeSub.email}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Reply via Email */}
                      <a
                        href={`mailto:${activeSub.email}?subject=Re: ${encodeURIComponent(activeSub.subject)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        Reply
                      </a>

                      {/* WhatsApp Direct */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Hi ${activeSub.name}! Thanks for reaching out regarding "${activeSub.subject}".`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center gap-4 text-[10px] font-mono text-[#6b7280] mt-4 pt-3 border-t border-[#1a202c]/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Received {new Date(activeSub.createdAt).toLocaleString()}
                    </span>
                    {activeSub.ip && <span>IP: {activeSub.ip}</span>}
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-[#141a29]/40 border border-[#1e2433] rounded-xl p-5 relative group">
                  <button
                    type="button"
                    onClick={() => copyMessage(activeSub.message)}
                    className="absolute top-3 right-3 p-1.5 text-[#6b7280] hover:text-white bg-[#1e2433] hover:bg-[#252f44] rounded-lg transition-colors"
                    title="Copy message"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <p className="text-xs font-mono uppercase text-[#6b7280] mb-2 font-semibold">Message Content</p>
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {activeSub.message}
                  </div>
                </div>

                {/* Status & Management Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1a202c]">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeSub.id, activeSub.status === "unread" ? "read" : "unread")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161d2d] hover:bg-[#1f293d] border border-[#252f44] text-[#9ca3af] hover:text-white rounded-xl text-xs font-medium transition-colors"
                    >
                      {activeSub.status === "unread" ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                      Mark {activeSub.status === "unread" ? "Read" : "Unread"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(activeSub.id, activeSub.archived ? "read" : "archived")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161d2d] hover:bg-[#1f293d] border border-[#252f44] text-[#9ca3af] hover:text-white rounded-xl text-xs font-medium transition-colors"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      {activeSub.archived ? "Unarchive" : "Archive"}
                    </button>
                  </div>

                  {/* Delete with Confirmation */}
                  {deleteConfirmId === activeSub.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-400 font-mono">Delete forever?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(activeSub.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 bg-[#1e2433] text-[#9ca3af] rounded-lg text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(activeSub.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-xl text-xs font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-[#6b7280] font-mono">
                Select an inquiry from the left to view details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
