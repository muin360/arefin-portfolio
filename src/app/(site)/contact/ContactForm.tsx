"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { sendContact, type ContactState } from "./actions";

const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 4000;

const TOPICS = [
  "AI Workflow Automation (n8n, Make)",
  "Autonomous AI Agent Build (LangChain, Langflow)",
  "RAG Knowledge Base & Document Retrieval",
  "Multi-Agent Research & Synthesis Crew",
  "Custom API / Webhook Integration",
  "General Consultation & Feasibility",
] as const;

const initialState: ContactState = { ok: false };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // Reset form on success.
  useEffect(() => {
    if (state.ok && formRef.current) {
      formRef.current.reset();
      setMessage("");
    }
  }, [state.ok]);

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-[#121622] text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/50 transition-all font-sans";

  const fieldErr = (k: string) => state.fieldErrors?.[k as never];

  return (
    <form
      ref={formRef}
      action={(fd) => {
        fd.set("elapsed", String(Date.now() - mountedAt.current));
        formAction(fd);
      }}
      noValidate
      autoComplete="off"
      className="space-y-6"
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Project Inquiry Form
        </h3>
        <span className="text-[11px] font-mono text-white/40">Encrypted</span>
      </div>

      {/* Honeypot for bots */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", height: 0, width: 0, overflow: "hidden" }}>
        <label>
          Website (leave empty)
          <input
            tabIndex={-1}
            autoComplete="off"
            name="website"
            type="text"
            defaultValue=""
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-xs font-mono font-semibold uppercase tracking-wider text-white/70">
            Your Name <span className="text-violet-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={MAX_NAME}
            placeholder="Jane Doe"
            className={inputCls}
          />
          {fieldErr("name") && (
            <p className="flex items-center gap-1 text-xs text-rose-400 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{fieldErr("name")}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-mono font-semibold uppercase tracking-wider text-white/70">
            Email Address <span className="text-violet-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={MAX_EMAIL}
            placeholder="jane@company.com"
            className={inputCls}
          />
          {fieldErr("email") && (
            <p className="flex items-center gap-1 text-xs text-rose-400 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{fieldErr("email")}</span>
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-xs font-mono font-semibold uppercase tracking-wider text-white/70">
          Target Focus Area
        </label>
        <select id="subject" name="subject" defaultValue={TOPICS[0]} className={inputCls}>
          {TOPICS.map((t) => (
            <option key={t} value={t} className="bg-[#0c0f18] text-white py-1">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="message" className="block text-xs font-mono font-semibold uppercase tracking-wider text-white/70">
            Workflow Description <span className="text-violet-400">*</span>
          </label>
          <span className="text-[10px] font-mono text-white/40">
            {message.length}/{MAX_MESSAGE}
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={MAX_MESSAGE}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the operational process, current tools, manual pain points, and what success looks like..."
          className={`${inputCls} resize-y leading-relaxed`}
        />
        {fieldErr("message") && (
          <p className="flex items-center gap-1 text-xs text-rose-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{fieldErr("message")}</span>
          </p>
        )}
      </div>

      {state.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs font-mono"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {state.ok && (
        <div
          role="status"
          className="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-mono"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>Inquiry received successfully. I will review and reply within 24 hours.</span>
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={pending}
          icon={pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          className="w-full"
        >
          {pending ? "Sending inquiry..." : "Send Scoping Inquiry"}
        </Button>
      </div>

      <p className="text-[11px] text-white/40 text-center font-mono">
        Submissions deliver directly to Arefin Mueen. No promotional spam.
      </p>
    </form>
  );
}
