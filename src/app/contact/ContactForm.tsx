"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { IconArrow } from "@/components/icons";
import { sendContact, type ContactState } from "./actions";

const MAX_NAME = 80;
const MAX_EMAIL = 120;
const MAX_MESSAGE = 4000;

const TOPICS = [
  "AI automation project",
  "AI agent build",
  "GoHighLevel setup",
  "Workflow audit",
  "Just saying hi",
] as const;

const initialState: ContactState = { ok: false };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    // Set mount time after the component mounts to avoid impure-function
    // warning during render.
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
    "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400/60 focus:bg-white/[0.06] transition-colors";

  const fieldErr = (k: string) => state.fieldErrors?.[k as never];

  return (
    <form
      ref={formRef}
      action={(fd) => {
        // elapsed = ms since the form was mounted; bots usually fire instantly.
        fd.set("elapsed", String(Date.now() - mountedAt.current));
        formAction(fd);
      }}
      noValidate
      autoComplete="off"
      className="space-y-5"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
        Message form
      </p>

      {/* Honeypot — hidden from real users, irresistible to bots. */}
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
        <div>
          <label htmlFor="name" className="text-sm text-white/65">
            Name
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
            <p className="mt-1 text-xs text-pink-300">{fieldErr("name")}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-white/65">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={MAX_EMAIL}
            placeholder="you@company.com"
            className={inputCls}
          />
          {fieldErr("email") && (
            <p className="mt-1 text-xs text-pink-300">{fieldErr("email")}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="text-sm text-white/65">
          Topic
        </label>
        <select id="subject" name="subject" defaultValue={TOPICS[0]} className={inputCls}>
          {TOPICS.map((t) => (
            <option key={t} className="bg-[#0c0c14] text-white">
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm text-white/65">
          The brief
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={MAX_MESSAGE}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you trying to automate or build?"
          className={inputCls + " resize-y"}
        />
        <p className="mt-1.5 text-[11px] text-white/40 font-mono">
          {message.length}/{MAX_MESSAGE}
        </p>
        {fieldErr("message") && (
          <p className="mt-1 text-xs text-pink-300">{fieldErr("message")}</p>
        )}
      </div>

      {state.error && (
        <p
          role="alert"
          className="text-sm text-white border border-pink-400/40 rounded-xl p-3 bg-pink-500/10"
        >
          {state.error}
        </p>
      )}

      {state.ok && (
        <p
          role="status"
          className="text-sm text-white border border-emerald-400/40 rounded-xl p-3 bg-emerald-500/10"
        >
          Message sent. We&apos;ll get back to you within a day.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary shimmer w-full justify-center disabled:opacity-60 disabled:cursor-wait"
      >
        {pending ? "Sending…" : "Send message"}
        <IconArrow width={16} height={16} />
      </button>

      <p className="text-xs text-white/45 text-center">
        Submissions are emailed directly to the agency. We don&apos;t store them
        anywhere else.
      </p>
    </form>
  );
}
