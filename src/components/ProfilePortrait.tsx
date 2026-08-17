"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface ProfilePortraitProps {
  profileImage?: string | null;
  name?: string;
  role?: string;
  availabilityNote?: string;
}

const ORBIT_LABELS = [
  { label: "AI", position: "top-[12%] -left-3 sm:-left-4" },
  { label: "RAG", position: "top-[8%] -right-2 sm:-right-3" },
  { label: "n8n", position: "bottom-[28%] -right-4 sm:-right-5" },
  { label: "AGENT", position: "bottom-[20%] -left-4 sm:-left-5" },
];

export default function ProfilePortrait({
  profileImage,
  name = "Arefin Mueen",
  role = "AI Automation & AI Agent Developer",
  availabilityNote = "Available for projects",
}: ProfilePortraitProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ─── AMBIENT ATMOSPHERIC BACKDROP ───────────────────────────────── */}
      <div
        className={`absolute -top-6 left-1/2 -translate-x-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-violet-600/15 blur-3xl pointer-events-none transition-opacity duration-700 ${
          isHovered ? "opacity-90 scale-105" : "opacity-60"
        }`}
      />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* ─── ORBITAL SYSTEM FRAME (270px desktop, 230px tablet, 190px mobile) ── */}
      <div className="relative flex items-center justify-center w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px]">
        {/* Outer Ring: 32s linear orbit (accelerates on hover) */}
        <div
          className={`absolute inset-0 rounded-full border border-dashed border-violet-500/35 motion-safe:animate-orbit-slow pointer-events-none transition-all ${
            isHovered ? "border-violet-400/60 [animation-duration:18s]" : ""
          }`}
        >
          {/* Orbit Node (12s orbit motion) */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_16px_#a78bfa] border-2 border-[#090b12]" />
        </div>

        {/* Inner Ring: 46s reverse orbit */}
        <div
          className={`absolute inset-3 sm:inset-4 md:inset-5 rounded-full border border-white/10 motion-safe:animate-orbit-reverse pointer-events-none transition-all ${
            isHovered ? "border-emerald-500/30 [animation-duration:24s]" : ""
          }`}
        >
          {/* Secondary Pulse Marker (5s pulse) */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] border border-[#090b12]" />
        </div>

        {/* Orbit Data Labels (AI, RAG, n8n, AGENT) */}
        {ORBIT_LABELS.map((item) => (
          <div
            key={item.label}
            className={`absolute ${item.position} px-2 py-0.5 rounded-md bg-[#090c18]/90 border border-white/10 shadow-lg text-[9px] sm:text-[10px] font-mono text-violet-300/80 tracking-widest uppercase pointer-events-none transition-transform duration-500 ${
              isHovered ? "scale-105 border-violet-500/40 text-violet-200" : ""
            }`}
          >
            {item.label}
          </div>
        ))}

        {/* ─── CIRCULAR PORTRAIT ANCHOR ──────────────────────────────────── */}
        <div
          className={`relative w-[150px] h-[150px] sm:w-[195px] sm:h-[195px] md:w-[215px] md:h-[215px] rounded-full p-1 bg-[#090b14] border-2 border-white/20 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 ${
            isHovered
              ? "border-violet-400/50 shadow-violet-950/60 scale-[1.02]"
              : "shadow-black/80"
          }`}
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${name} — ${role}`}
              width={240}
              height={240}
              priority
              className="w-full h-full object-cover rounded-full transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#13182e] via-[#0b0e1a] to-[#060810] flex flex-col items-center justify-center text-center p-4 relative">
              {/* Inner highlight & geometric monogram */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-1.5 shadow-inner">
                <Sparkles className="w-5 h-5 text-violet-400 motion-safe:animate-orbit-pulse" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white font-mono tracking-widest">
                AM
              </span>
              <span className="text-[9px] sm:text-[10px] text-white/50 font-mono tracking-wider uppercase">
                System Operator
              </span>
            </div>
          )}

          {/* Inner top subtle highlight arc */}
          <div className="absolute inset-0 rounded-full border-t border-white/30 pointer-events-none" />
        </div>

        {/* Active Status Badge */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0a0d18] border border-emerald-500/30 px-3 py-0.5 sm:py-1 rounded-full flex items-center gap-1.5 shadow-xl shadow-black/80 whitespace-nowrap z-20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-mono font-medium text-emerald-300 tracking-wider uppercase">
            {availabilityNote}
          </span>
        </div>
      </div>

      {/* Human Signature Label */}
      <div className="mt-5 text-center">
        <p className="text-xs font-mono text-white/60 tracking-widest uppercase font-semibold">
          {name}
        </p>
        <p className="text-xs text-violet-300/90 font-mono mt-0.5">
          Dhaka · GMT+6 · AI Automation &amp; Agents
        </p>
      </div>
    </div>
  );
}
