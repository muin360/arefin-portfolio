"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TerminalLog from "@/components/v2/TerminalLog";
import type { TerminalLogLine } from "@/components/v2/TerminalLog";

type Project = {
  title: string;
  summary: string;
  stack: string[];
  category: string;
};

const TERMINAL_MAP: Record<string, TerminalLogLine[]> = {
  "Voice-Enabled Live Calling Agent": [
    { time: "09:14:02", type: "info",  message: "call.inbound · twilio · +880*****", status: "12ms" },
    { time: "09:14:02", type: "agent", message: "stt.transcribe · whisper · 'book appointment'", status: "284ms" },
    { time: "09:14:03", type: "agent", message: "intent.classify → booking_flow", status: "8ms" },
    { time: "09:14:03", type: "ok",    message: "calendar.check · 3 open slots found", status: "api" },
    { time: "09:14:04", type: "agent", message: "tts.generate · 2.1s audio reply", status: "1.1s" },
    { time: "09:14:05", type: "ok",    message: "call.response.sent · slot booked 10am", status: "done" },
  ],
  "Market Research Multi-Agent System": [
    { time: "10:31:00", type: "info",  message: "task.create · query='EV market Asia 2025'", status: "ok" },
    { time: "10:31:01", type: "agent", message: "agent[researcher] · web.search · k=12", status: "2.1s" },
    { time: "10:31:04", type: "agent", message: "agent[analyst] · summarize · 8400 tokens", status: "1.8s" },
    { time: "10:31:06", type: "agent", message: "agent[writer] · draft.report · 1200 words", status: "2.4s" },
    { time: "10:31:09", type: "ok",    message: "agent[critic] · review.pass · score=91", status: "done" },
    { time: "10:31:10", type: "ok",    message: "report.delivered · PDF + Notion sync", status: "sent" },
  ],
  "Multilingual AI Support Bot": [
    { time: "14:02:11", type: "info",  message: "message.in · lang=Arabic · channel=web", status: "ok" },
    { time: "14:02:11", type: "agent", message: "lang.detect → ar · translate.to_en", status: "120ms" },
    { time: "14:02:12", type: "agent", message: "intent.classify → billing_query", status: "8ms" },
    { time: "14:02:12", type: "ok",    message: "stripe.lookup · sub_xxxxx · active", status: "api" },
    { time: "14:02:13", type: "agent", message: "reply.generate · translate.to_ar", status: "1.2s" },
    { time: "14:02:13", type: "ok",    message: "message.sent · satisfaction.logged", status: "done" },
  ],
  "AI-Powered Invoice Automation System": [
    { time: "11:05:00", type: "info",  message: "email.in · attachment=invoice_4821.pdf", status: "ok" },
    { time: "11:05:01", type: "agent", message: "vision.extract · gpt-4o · line_items=14", status: "1.9s" },
    { time: "11:05:03", type: "agent", message: "po.match · PO-2024-119 · delta=0", status: "220ms" },
    { time: "11:05:03", type: "ok",    message: "accounting.push · xero · inv_4821", status: "api" },
    { time: "11:05:04", type: "ok",    message: "approval.sent · slack · #finance", status: "done" },
    { time: "11:05:04", type: "ok",    message: "audit.logged · zero_touch=true", status: "done" },
  ],
  "Website Lead Generation Bot (n8n)": [
    { time: "16:44:01", type: "info",  message: "visitor.event · time_on_page=142s", status: "ok" },
    { time: "16:44:01", type: "agent", message: "intent.score · model=gpt-4o-mini · 87/100", status: "340ms" },
    { time: "16:44:02", type: "agent", message: "enrichment.run · apollo · found company", status: "1.1s" },
    { time: "16:44:03", type: "ok",    message: "crm.create · hubspot · lead_id=9921", status: "api" },
    { time: "16:44:03", type: "ok",    message: "slack.notify · #sales · hot lead 🔥", status: "sent" },
    { time: "16:44:03", type: "ok",    message: "sequence.start · email_1 queued 9am", status: "done" },
  ],
  "Customer Support RAG Bot": [
    { time: "13:22:05", type: "info",  message: "query.in · 'how to reset API key'", status: "ok" },
    { time: "13:22:05", type: "agent", message: "embed.query · text-ada-003", status: "80ms" },
    { time: "13:22:06", type: "agent", message: "vector.search · pinecone · k=4", status: "95ms" },
    { time: "13:22:06", type: "ok",    message: "chunks.retrieved · doc=api-guide.md", status: "4 hits" },
    { time: "13:22:07", type: "agent", message: "answer.generate · citations=2", status: "1.3s" },
    { time: "13:22:07", type: "ok",    message: "reply.sent · confidence=0.94", status: "done" },
  ],
  "E-Commerce Automation Workflow": [
    { time: "08:00:00", type: "info",  message: "schedule.trigger · daily-product-sync", status: "ok" },
    { time: "08:00:01", type: "agent", message: "research.agent · trending=42 products", status: "8.2s" },
    { time: "08:00:10", type: "agent", message: "listing.writer · 42 descriptions gen", status: "14s" },
    { time: "08:00:25", type: "ok",    message: "shopify.sync · 38 new / 4 updated", status: "api" },
    { time: "08:00:26", type: "ok",    message: "supplier.order · auto-routed · 12 orders", status: "done" },
    { time: "08:00:26", type: "ok",    message: "report.slack · daily summary sent", status: "sent" },
  ],
  "CRM Business Lead Automation": [
    { time: "09:00:00", type: "info",  message: "trigger · new_form_submission", status: "ok" },
    { time: "09:00:00", type: "agent", message: "enrich.contact · clearbit + linkedin", status: "2.1s" },
    { time: "09:00:02", type: "agent", message: "score.lead · llm · intent=high · 82/100", status: "400ms" },
    { time: "09:00:03", type: "ok",    message: "crm.update · stage=hot · owner=assigned", status: "api" },
    { time: "09:00:03", type: "ok",    message: "sequence.start · personalised email 1", status: "queued" },
    { time: "09:00:03", type: "ok",    message: "slack.ping · sales team · hot lead alert", status: "sent" },
  ],
};

const DEFAULT_LINES: TerminalLogLine[] = [
  { time: "00:00:01", type: "info",  message: "agent.init · loading project context", status: "ok" },
  { time: "00:00:02", type: "agent", message: "tools.load · api + llm + webhook", status: "ready" },
  { time: "00:00:03", type: "ok",    message: "agent.ready · awaiting task", status: "live" },
];

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const lines = project
    ? (TERMINAL_MAP[project.title] ?? DEFAULT_LINES)
    : DEFAULT_LINES;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            background: "rgba(4,4,10,0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            style={{
              width: "100%",
              maxWidth: "680px",
              background: "#0a0a12",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              overflow: "hidden",
              fontFamily: "var(--font-jetbrains-mono), monospace",
            }}
          >
            {/* Top bar */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
            }}>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f43f5e", border: "none", cursor: "pointer" }}
                />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22d3a5" }} />
              </div>
              <span style={{ fontSize: "11px", color: "var(--t3)", marginLeft: "8px" }}>
                arefin · {project.category.toLowerCase()}-agent · live
              </span>
              <span style={{ marginLeft: "auto", fontSize: "9px", color: "var(--green)",
                display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%",
                  background: "var(--green)", boxShadow: "0 0 6px var(--green)",
                  display: "inline-block" }} />
                running
              </span>
            </div>

            {/* Project title */}
            <div style={{ padding: "16px 20px 0" }}>
              <p style={{ fontSize: "10px", color: "var(--t4)", textTransform: "uppercase",
                letterSpacing: "0.15em", marginBottom: "4px" }}>{project.category}</p>
              <h3 style={{ fontSize: "16px", fontFamily: "var(--font-syne), sans-serif", fontWeight: 600,
                color: "var(--t1)", marginBottom: "8px" }}>{project.title}</h3>
              <p style={{ fontSize: "12px", color: "var(--t2)", lineHeight: 1.6,
                marginBottom: "16px", fontFamily: "var(--font-dm-sans), sans-serif" }}>{project.summary}</p>
            </div>

            {/* Terminal */}
            <div style={{ padding: "0 20px" }}>
              <TerminalLog lines={lines} stagger={180} />
            </div>

            {/* Metrics row */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)",
              gap: "1px", margin: "16px 20px",
              background: "rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden"
            }}>
              {[
                { label: "Status", value: "LIVE", color: "var(--green)" },
                { label: "Latency", value: `${12 + (project.title.length % 7)}ms`, color: "var(--accent-bright)" },
                { label: "Tasks", value: `${840 + (project.title.length * 17) % 150}`, color: "var(--t1)" },
              ].map((m) => (
                <div key={m.label} style={{
                  padding: "12px", background: "#0a0a12",
                  display: "flex", flexDirection: "column", gap: "2px"
                }}>
                  <span style={{ fontSize: "9px", color: "var(--t4)", textTransform: "uppercase",
                    letterSpacing: "0.12em" }}>{m.label}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Stack pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "0 20px 20px" }}>
              {project.stack.map((s) => (
                <span key={s} style={{
                  fontSize: "10px", padding: "3px 8px", borderRadius: "4px",
                  border: "1px solid rgba(91,110,245,0.25)",
                  color: "var(--accent-bright)", background: "rgba(91,110,245,0.08)"
                }}>{s}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
