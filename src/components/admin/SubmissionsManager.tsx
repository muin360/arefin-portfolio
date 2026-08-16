"use client";

import { useState } from "react";
import { Trash2, Mail, Archive, MessageSquare } from "lucide-react";
import type { ContactSubmission } from "@/lib/db/types";

interface Props {
  initialSubmissions: ContactSubmission[];
}

export default function SubmissionsManager({ initialSubmissions }: Props) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(initialSubmissions);
  const [activeSub, setActiveSub] = useState<ContactSubmission | null>(
    initialSubmissions[0] || null,
  );

  const handleStatusChange = async (
    id: string,
    status: ContactSubmission["status"],
  ) => {
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status } : s)),
        );
        if (activeSub?.id === id) {
          setActiveSub((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (activeSub?.id === id) {
          setActiveSub(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          {submissions.length} total message{submissions.length !== 1 ? "s" : ""} received.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="p-16 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 space-y-3">
          <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-sm">No contact inquiries yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Column */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/80 max-h-[75vh] overflow-y-auto">
            {submissions.map((s) => (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSub(s);
                  if (s.status === "unread") {
                    handleStatusChange(s.id, "read");
                  }
                }}
                className={`p-4 cursor-pointer transition-colors space-y-1 ${
                  activeSub?.id === s.id
                    ? "bg-slate-800 border-l-4 border-l-violet-500"
                    : s.status === "unread"
                    ? "bg-slate-900 font-semibold"
                    : "hover:bg-slate-800/40 text-slate-400"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-medium truncate">{s.name}</span>
                  <span className="text-slate-500 font-mono">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 truncate">{s.subject}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{s.message}</p>
              </div>
            ))}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            {activeSub ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeSub.subject}</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      From: <strong className="text-white">{activeSub.name}</strong> (
                      <a
                        href={`mailto:${activeSub.email}`}
                        className="text-violet-400 hover:underline"
                      >
                        {activeSub.email}
                      </a>
                      )
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Received: {new Date(activeSub.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${activeSub.email}?subject=Re: ${encodeURIComponent(
                        activeSub.subject,
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Reply via Email
                    </a>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          activeSub.id,
                          activeSub.status === "archived" ? "read" : "archived",
                        )
                      }
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                      title="Archive message"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(activeSub.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {activeSub.message}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Status:</span>
                  {(["unread", "read", "replied", "archived"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeSub.id, st)}
                      className={`px-3 py-1 rounded-full uppercase tracking-wider font-mono text-[10px] transition-colors ${
                        activeSub.status === st
                          ? "bg-violet-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-sm">
                Select a message on the left to read details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
