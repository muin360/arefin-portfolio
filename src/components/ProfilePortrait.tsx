"use client";

import { useState } from "react";
import Image from "next/image";

interface ProfilePortraitProps {
  profileImage?: string | null;
  name?: string;
  role?: string;
  availabilityNote?: string;
}

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
      {/* ─── AMBIENT ATMOSPHERIC HALO ───────────────────────────────────── */}
      <div
        className={`absolute -top-4 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-violet-600/15 blur-3xl pointer-events-none transition-all duration-700 ${
          isHovered ? "opacity-90 scale-105" : "opacity-50"
        }`}
      />

      {/* ─── ORBITAL FRAME (280px desktop, 240px tablet, 190px mobile) ─── */}
      <div className="relative flex items-center justify-center w-[190px] h-[190px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px]">
        {/* Single Refined Orbit Ring (36s linear) */}
        <div
          className={`absolute inset-0 rounded-full border border-violet-500/25 motion-safe:animate-orbit-slow pointer-events-none transition-all ${
            isHovered ? "border-violet-400/50 [animation-duration:22s]" : ""
          }`}
        >
          {/* Signal Node (14s orbit) */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-violet-400 shadow-[0_0_14px_#a78bfa] border-2 border-[#090b12]" />
        </div>

        {/* Inner Subtle Depth Halo */}
        <div className="absolute inset-4 sm:inset-5 rounded-full border border-white/[0.06] pointer-events-none" />

        {/* ─── CIRCULAR PORTRAIT ANCHOR ──────────────────────────────────── */}
        <div
          className={`relative w-[150px] h-[150px] sm:w-[190px] sm:h-[190px] md:w-[220px] md:h-[220px] rounded-full p-1 bg-[#090b14] border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 ${
            isHovered
              ? "border-violet-400/40 shadow-violet-950/40 scale-[1.02]"
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
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#12162a] via-[#090c16] to-[#04050a] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
              {/* Minimal intentional abstract placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center relative">
                <div className="w-8 h-8 rounded-full bg-violet-400/20 border border-violet-400/30 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-2">
                Arefin Mueen
              </span>
            </div>
          )}

          {/* Inner subtle top highlight */}
          <div className="absolute inset-0 rounded-full border-t border-white/25 pointer-events-none" />
        </div>

        {/* Real Status Badge (Green dot for availability) */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#090c16] border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg shadow-black/60 whitespace-nowrap z-20 font-mono text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/80 font-medium tracking-wider">
            {availabilityNote}
          </span>
        </div>
      </div>

      {/* Human Signature Identity */}
      <div className="mt-5 text-center">
        <p className="text-xs font-mono text-white tracking-wider uppercase font-semibold">
          {name}
        </p>
        <p className="text-xs text-white/50 font-mono mt-0.5">
          Dhaka · GMT+6 · AI Automation &amp; Agents
        </p>
      </div>
    </div>
  );
}
