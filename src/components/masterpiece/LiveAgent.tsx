"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; text: string };

const SYSTEM = `You are Tensorix's AI assistant on Arefin Muin's portfolio website.
Arefin is an AI Automation & Agent Engineer based in Dhaka, Bangladesh.
He builds: Voice AI agents, Multi-agent research systems, RAG chatbots,
n8n automation pipelines, LangChain/LangFlow agents, invoice automation,
CRM pipelines, and full-stack AI SaaS products.
His stack: n8n, LangChain, LangFlow, Python, JavaScript, OpenAI, Anthropic,
Pinecone, Zapier, Make, GoHighLevel, Twilio.
Respond in 1-3 short sentences. Be direct, technical, and confident.
If asked about pricing, say "Book a free 30-min audit at tensorix.me/book".
If asked something unrelated to Arefin's work, politely redirect.`;

const STARTERS = [
  "What kind of agents do you build?",
  "How long does a project take?",
  "Can you build a voice AI agent?",
  "What's your tech stack?",
];

export default function LiveAgent() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", text };
    const next = [...msgs, userMsg];
    setMsgs(next);
    setInput("");
    setLoading(true);
    setStarted(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM,
          messages: next.map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", text: data.reply ?? "Something went wrong." },
      ]);
    } catch {
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", text: "Connection error. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        overflow: "hidden",
        marginTop: "1rem",
        fontFamily: "var(--font-jetbrains-mono), monospace",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span style={{ fontSize: "11px", color: "var(--t3)" }}>
          tensorix · live-agent
        </span>
        <span
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "10px",
            color: "var(--green)",
          }}
        >
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: "var(--green)",
              display: "inline-block",
              boxShadow: "0 0 6px var(--green)",
            }}
          />
          online
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          minHeight: "140px",
          maxHeight: "220px",
          overflowY: "auto",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          scrollbarWidth: "none",
        }}
      >
        {!started && msgs.length === 0 && (
          <div style={{ marginBottom: "8px" }}>
            <p
              style={{
                fontSize: "11px",
                color: "var(--t3)",
                marginBottom: "8px",
              }}
            >
              // ask the agent anything
            </p>
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
            >
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    fontSize: "10px",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "transparent",
                    color: "var(--t2)",
                    cursor: "pointer",
                    transition: "border-color 150ms, color 150ms",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.borderColor =
                      "var(--accent-core)";
                    (e.target as HTMLButtonElement).style.color =
                      "var(--accent-bright)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,0.1)";
                    (e.target as HTMLButtonElement).style.color =
                      "var(--t2)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems:
                m.role === "user" ? "flex-end" : "flex-start",
              gap: "3px",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                color: "var(--t4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {m.role === "user" ? "you" : "tensorix-agent"}
            </span>
            <div
              style={{
                maxWidth: "90%",
                padding: "8px 12px",
                borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                background:
                  m.role === "user"
                    ? "rgba(91,110,245,0.18)"
                    : "rgba(255,255,255,0.04)",
                border:
                  m.role === "user"
                    ? "1px solid rgba(91,110,245,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
                fontSize: "11px",
                color: m.role === "user" ? "var(--accent-bright)" : "var(--t1)",
                lineHeight: "1.6",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 0" }}>
            <span style={{ fontSize: "9px", color: "var(--t4)", marginRight: "6px" }}>
              agent
            </span>
            <span className="agent-dot" />
            <span className="agent-dot" />
            <span className="agent-dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "10px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="ask about my work..."
          disabled={loading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "11px",
            color: "var(--t1)",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          style={{
            fontSize: "10px",
            padding: "4px 10px",
            borderRadius: "4px",
            border: "1px solid rgba(91,110,245,0.4)",
            background:
              loading || !input.trim()
                ? "transparent"
                : "rgba(91,110,245,0.15)",
            color: "var(--accent-bright)",
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "all 150ms",
          }}
        >
          send →
        </button>
      </div>
    </div>
  );
}
