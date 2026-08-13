"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { projects } from "@/data/site";
import { useInView } from "@/hooks/useInView";
import TerminalLog, { TerminalLogLine } from "./TerminalLog";
import SpotlightCursor from "@/components/SpotlightCursor";
import { AnimatePresence, motion } from "framer-motion";

const TERMINAL_LINES: Record<string, TerminalLogLine[]> = {
  "Voice-Enabled Live Calling Agent": [
    { time: "09:14:02", type: "agent", message: "call.inbound · twilio · +8801XXXXXXX", status: "12ms" },
    { time: "09:14:02", type: "info", message: 'stt.transcribe · whisper · "appointment booking"', status: "284ms" },
    { time: "09:14:03", type: "agent", message: "intent.classify → booking_flow", status: "8ms" },
    { time: "09:14:03", type: "ok", message: "calendar.check · found 3 open slots", status: "api" },
    { time: "09:14:04", type: "agent", message: "tts.generate · eleven-labs · 2.1s audio", status: "1.1s" },
    { time: "09:14:05", type: "ok", message: "call.response.sent · booked 10am slot", status: "done" },
  ],
  "Market Research Multi-Agent System": [
    { time: "10:22:01", type: "agent", message: "orchestrator.init · target: 'AI SaaS Market'", status: "45ms" },
    { time: "10:22:03", type: "info", message: "agent.researcher · scraping 15 sources", status: "2.1s" },
    { time: "10:22:06", type: "ok", message: "agent.analyst · synthesizing market trends", status: "850ms" },
    { time: "10:22:11", type: "warn", message: "agent.critic · rejecting draft: 'needs data'", status: "retry" },
    { time: "10:22:15", type: "info", message: "agent.writer · generating final report", status: "4.2s" },
    { time: "10:22:20", type: "ok", message: "pipeline.complete · saved to Google Drive", status: "done" },
  ],
  "Multilingual Full-Stack AI Assistant": [
    { time: "14:05:12", type: "info", message: "chat.inbound · msg: 'como pagar?'", status: "10ms" },
    { time: "14:05:13", type: "agent", message: "lang.detect · identified: 'es'", status: "42ms" },
    { time: "14:05:14", type: "info", message: "intent.classify → billing_support", status: "120ms" },
    { time: "14:05:15", type: "agent", message: "stripe.query · fetching active invoice", status: "450ms" },
    { time: "14:05:17", type: "ok", message: "llm.generate_response · model: gpt-4", status: "1.2s" },
    { time: "14:05:18", type: "ok", message: "chat.outbound · sent payment link", status: "done" },
  ],
  "AI-Powered Invoice Automation System": [
    { time: "08:30:00", type: "info", message: "webhook.received · attachment: 'inv_102.pdf'", status: "8ms" },
    { time: "08:30:02", type: "agent", message: "vision.extract · parsing line items", status: "1.8s" },
    { time: "08:30:03", type: "ok", message: "data.validate · PO matched #4492", status: "110ms" },
    { time: "08:30:04", type: "warn", message: "anomaly.check · total differs by $0.05", status: "flag" },
    { time: "08:30:05", type: "agent", message: "accounting.sync · drafted in Xero", status: "320ms" },
    { time: "08:30:06", type: "ok", message: "slack.alert · pending human review", status: "sent" },
  ],
  "Website Lead Generation SaaS (n8n)": [
    { time: "16:44:10", type: "info", message: "widget.submit · email: 'ceo@techstartup.com'", status: "12ms" },
    { time: "16:44:11", type: "agent", message: "enrichment.clearbit · found 50+ employees", status: "450ms" },
    { time: "16:44:12", type: "agent", message: "llm.score · intent: high, fit: A", status: "850ms" },
    { time: "16:44:13", type: "ok", message: "crm.upsert · creating lead in HubSpot", status: "210ms" },
    { time: "16:44:13", type: "info", message: "routing.assign · assigned to 'Enterprise'", status: "5ms" },
    { time: "16:44:14", type: "ok", message: "slack.notify · pinged #sales-hot-leads", status: "done" },
  ],
  "Customer Support RAG Bot": [
    { time: "11:15:02", type: "info", message: "chat.inbound · 'how to reset api key?'", status: "15ms" },
    { time: "11:15:03", type: "agent", message: "embed.generate · text-embedding-3", status: "110ms" },
    { time: "11:15:04", type: "info", message: "vector.search · pinecone · top_k: 3", status: "45ms" },
    { time: "11:15:06", type: "agent", message: "llm.synthesize · context + chat history", status: "1.4s" },
    { time: "11:15:07", type: "ok", message: "citation.append · linked to /docs/api", status: "5ms" },
    { time: "11:15:08", type: "ok", message: "chat.outbound · delivered response", status: "done" },
  ],
  "Full-Stack Dropshipping Automation": [
    { time: "22:00:01", type: "agent", message: "cron.trigger · daily product sync", status: "0ms" },
    { time: "22:00:15", type: "info", message: "scrape.supplier · found 12 new items", status: "14s" },
    { time: "22:00:25", type: "agent", message: "llm.copywrite · generating SEO descriptions", status: "9.5s" },
    { time: "22:00:30", type: "ok", message: "shopify.bulk_upload · creating drafts", status: "4.2s" },
    { time: "22:00:32", type: "info", message: "inventory.sync · updating stock levels", status: "1.1s" },
    { time: "22:00:35", type: "ok", message: "pipeline.complete · store updated", status: "done" },
  ],
  "CRM Business Lead Automation": [
    { time: "13:05:00", type: "info", message: "apollo.webhook · new lead exported", status: "20ms" },
    { time: "13:05:01", type: "agent", message: "llm.analyze · profiling linkedIn data", status: "650ms" },
    { time: "13:05:03", type: "info", message: "personalize.generate · custom email hook", status: "1.2s" },
    { time: "13:05:04", type: "agent", message: "crm.tag · added 'Q3_Outreach'", status: "150ms" },
    { time: "13:05:05", type: "ok", message: "smtp.send · triggered sequence step 1", status: "340ms" },
    { time: "13:05:05", type: "ok", message: "workflow.end · waiting 3 days", status: "done" },
  ]
};

export default function ProjectsGridV2({
  limit = projects.length,
}: {
  limit?: number;
}) {
  const items = projects.slice(0, limit);
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="v2-project__grid">
        {items.map((p, i) => (
          <Card 
            key={p.title} 
            index={i} 
            project={p} 
            onClick={() => setSelectedProject(p)} 
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="v2-project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="v2-project-modal-surface"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="v2-project-modal-topbar">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="v2-project-modal-title">{selectedProject.title}</div>
                <button
                  className="v2-project-modal-close"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <div className="v2-project-modal-body">
                <TerminalLog 
                  lines={TERMINAL_LINES[selectedProject.title] || TERMINAL_LINES["Voice-Enabled Live Calling Agent"]} 
                  stagger={200}
                />
              </div>

              <div className="v2-project-modal-metrics">
                <div className="v2-project-modal-metric">Status: LIVE</div>
                <div className="v2-project-modal-metric">Latency: 14ms</div>
                <div className="v2-project-modal-metric">Tasks completed: 847</div>
              </div>

              <div className="v2-project-modal-footer">
                <div className="v2-project__stack">
                  {selectedProject.stack.map((s) => (
                    <span key={s} className="v2-project__pill">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Card({
  index,
  project,
  onClick
}: {
  index: number;
  project: (typeof projects)[number];
  onClick: () => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const side = index % 2 === 0 ? "left" : "right";
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`v2-project__card relative cursor-pointer group v2-project__card--${side} ${inView ? "is-in" : ""}`}
    >
      <SpotlightCursor size={400} color="rgba(124, 58, 237, 0.10)" />
      <div className="v2-project__badge" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="v2-project__tag">{project.category}</span>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--t3)" }}
        >
          case · 2024–2025
        </span>
      </div>

      <h3 className="v2-project__title">{project.title}</h3>
      <p className="v2-project__summary">{project.summary}</p>

      <div className="v2-project__stack">
        {project.stack.map((s) => (
          <span key={s} className="v2-project__pill">
            {s}
          </span>
        ))}
      </div>

      <Link
        href="/projects"
        className="v2-project__link"
        aria-label={`Read full case study: ${project.title}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span>Read case study</span>
        <span aria-hidden="true">→</span>
      </Link>
      
      <div className="v2-project__demo-hover absolute bottom-5 right-5 font-mono text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ color: "var(--a1)" }}>
        [ run demo → ]
      </div>
    </div>
  );
}
