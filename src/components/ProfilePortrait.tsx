"use client";

import { useState } from "react";
import Image from "next/image";

interface ProfilePortraitProps {
  profileImage?: string | null;
  name?: string;
  role?: string;
  availabilityNote?: string;
  className?: string;
}

export default function ProfilePortrait({
  profileImage = "/pp.png",
  name = "Arefin Mueen",
  role = "AI Automation & AI Agent Developer",
  availabilityNote = "Available for projects",
  className = "",
}: ProfilePortraitProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const showImage = Boolean(profileImage && !imgError);

  return (
    <div
      className={`relative flex flex-col items-center select-none motion-safe:animate-profile-activate ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${name} — ${role}`}
    >
      {/* ─── LAYER 7: TWO CONCENTRATED ATMOSPHERIC DEPTH FIELDS ─────────────── */}
      {/* Field A: Soft violet depth */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-violet-600/20 blur-3xl pointer-events-none transition-all duration-500 ease-out ${
          isHovered ? "opacity-90 scale-105" : "opacity-60"
        }`}
        aria-hidden="true"
      />
      {/* Field B: Neutral cool-white depth core */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-white/[0.03] blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ─── SYSTEM FRAME: MULTI-LAYER ORBITAL CANVAS ───────────────────────── */}
      <div className="relative flex items-center justify-center w-[205px] h-[205px] sm:w-[250px] sm:h-[250px] md:w-[290px] md:h-[290px]">
        {/* ─── LAYER 3: PRIMARY DESIGNED ORBITAL ARC (Partial arcs with gradient) ── */}
        <div
          className={`absolute inset-0 motion-safe:animate-orbit-slow pointer-events-none transition-opacity duration-500 ${
            isHovered ? "opacity-100" : "opacity-85"
          }`}
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="primaryArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
                <stop offset="35%" stopColor="#7c3aed" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#c4b5fd" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="url(#primaryArcGrad)"
              strokeWidth="1.2"
              strokeDasharray="160 25 80 35"
              strokeLinecap="round"
            />
          </svg>

          {/* ─── LAYER 5: TRAVELLING SIGNAL NODE (On primary arc path) ──────── */}
          <div className="absolute -top-1 sm:-top-1.25 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-violet-300 shadow-[0_0_10px_#a78bfa] border border-[#07090e] motion-safe:animate-orbit-pulse" />

          {/* ─── LAYER 8: TECHNICAL MICRO-MARKER (Moves with orbit) ─────────── */}
          <div className="absolute top-[18%] -right-1 sm:right-0 -translate-y-1/2 pointer-events-none">
            <span className="inline-block px-1.5 py-0.5 rounded bg-[#07090e]/90 border border-violet-500/25 font-mono text-[7px] sm:text-[8px] text-violet-300/80 tracking-widest shadow-sm">
              SYSTEM / 01
            </span>
          </div>
        </div>

        {/* ─── LAYER 6: SIGNATURE ORBITAL SIGNAL SWEEP ───────────────────────── */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none motion-safe:animate-orbit-sweep"
          aria-hidden="true"
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="orbitSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="url(#orbitSweepGrad)"
              strokeWidth="1.5"
              strokeDasharray="50 260"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* ─── LAYER 4: BROKEN/DASHED SECONDARY ORBIT (Counter-rotating depth) ─ */}
        <div
          className="absolute inset-3 sm:inset-4 pointer-events-none motion-safe:animate-orbit-reverse opacity-40"
          aria-hidden="true"
        >
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="48.5"
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="0.8"
              strokeDasharray="3 7"
            />
          </svg>
        </div>

        {/* ─── LAYER 2: CIRCULAR BOUNDARY FRAME & INNER SPECULAR GLOW ────────── */}
        <div
          tabIndex={0}
          role="img"
          aria-label={`${name} portrait photo`}
          className={`relative w-[155px] h-[155px] sm:w-[190px] sm:h-[190px] md:w-[220px] md:h-[220px] rounded-full p-1 bg-[#090c14] border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090e] ${
            isHovered
              ? "border-violet-400/45 shadow-violet-950/40 scale-[1.015]"
              : "shadow-black/80"
          }`}
        >
          {/* ─── LAYER 1: REAL PORTRAIT PHOTO (Upright, stable, non-rotating) ── */}
          {showImage ? (
            <Image
              src={profileImage!}
              alt={`${name} — ${role}`}
              width={240}
              height={240}
              priority
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center rounded-full transition-transform duration-700 hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#14182a] via-[#0b0e1a] to-[#060810] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center relative">
                <div className="w-7 h-7 rounded-full bg-violet-400/20 border border-violet-400/30 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-2">
                {name}
              </span>
            </div>
          )}

          {/* Top specular depth highlight */}
          <div
            className="absolute inset-0 rounded-full border-t border-white/25 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Real Status Badge (Availability indicator below portrait) */}
        {availabilityNote && (
          <div className="absolute -bottom-3 sm:-bottom-3.5 left-1/2 -translate-x-1/2 bg-[#0c0f18] border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg shadow-black/60 whitespace-nowrap z-20 font-mono text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-status-pulse" />
            <span className="text-white/80 font-medium tracking-wider">
              {availabilityNote}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
