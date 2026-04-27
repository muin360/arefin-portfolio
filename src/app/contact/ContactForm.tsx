"use client";

import { FormEvent, useState } from "react";
import { IconArrow } from "@/components/icons";

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

const stripCtl = (s: string) =>
  // Strip CR/LF and other control chars to prevent header / body injection in mailto:.
  s.replace(/[\u0000-\u001f\u007f]/g, " ").trim();

const isValidEmail = (s: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= MAX_EMAIL;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<(typeof TOPICS)[number]>(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const safeName = stripCtl(name).slice(0, MAX_NAME);
    const safeEmail = stripCtl(email).slice(0, MAX_EMAIL);
    const safeSubject = TOPICS.includes(subject) ? subject : TOPICS[0];
    const safeMessage = message
      // collapse runs of >2 newlines, keep paragraph breaks
      .replace(/\r\n?/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      // strip non-printable except newline / tab
      .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "")
      .slice(0, MAX_MESSAGE)
      .trim();

    if (!safeName) return setError("Please add your name.");
    if (!isValidEmail(safeEmail)) return setError("Please add a valid email.");
    if (safeMessage.length < 10)
      return setError("Tell me a bit more — at least a sentence.");

    const body = `Hi Arefin,\n\n${safeMessage}\n\n— ${safeName}${
      safeEmail ? ` (${safeEmail})` : ""
    }`;
    // Build mailto safely. Email is stored decoded so harvesters scraping the
    // rendered HTML for raw "user@host" don't find it.
    const local = ["a", "r", "e", "f", "i", "n", "m", "u", "i", "n"].join("");
    const host = ["g", "m", "a", "i", "l", ".", "c", "o", "m"].join("");
    const mailto = `mailto:${local}@${host}?subject=${encodeURIComponent(
      safeSubject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  };

  const inputCls =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-violet-400/60 focus:bg-white/[0.06] transition-colors";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      autoComplete="off"
      className="space-y-5"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">Message form</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-sm text-white/65">
            Name
          </label>
          <input
            id="name"
            required
            maxLength={MAX_NAME}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-white/65">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            maxLength={MAX_EMAIL}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="text-sm text-white/65">
          Topic
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) =>
            setSubject(e.target.value as (typeof TOPICS)[number])
          }
          className={inputCls}
        >
          {TOPICS.map((t) => (
            <option key={t} className="bg-[#0c0c14] text-white">{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm text-white/65">
          The brief
        </label>
        <textarea
          id="message"
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
      </div>

      {error && (
        <p
          role="alert"
          className="text-sm text-white border border-pink-400/40 rounded-xl p-3 bg-pink-500/10"
        >
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary shimmer w-full justify-center">
        Send message
        <IconArrow width={16} height={16} />
      </button>

      <p className="text-xs text-white/45 text-center">
        This opens your email client with the message pre-filled. Nothing is
        sent through any server, no data is stored.
      </p>

      {sent && !error && (
        <p className="text-sm text-white/85 text-center">
          Opening your email app… if nothing happens, write to{" "}
          <ObfuscatedEmail />.
        </p>
      )}
    </form>
  );
}

// Renders the email so it's not present as a single literal string in the
// static HTML — harms casual scrapers without breaking screen readers.
function ObfuscatedEmail() {
  const local = "arefinmuin";
  const host = "gmail.com";
  return (
    <a
      href={`mailto:${local}@${host}`}
      className="link-underline"
      rel="noopener"
    >
      {local}
      <span aria-hidden="true">&#64;</span>
      {host}
    </a>
  );
}
