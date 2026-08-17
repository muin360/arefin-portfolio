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
      className={`relative flex flex-col items-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`${name} — ${role}`}
    >
      {/* ─── 01 CONCENTRATED AMBIENT ATMOSPHERIC HALO ─────────────────────── */}
      <div
        className={`absolute -top-2 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-violet-600/25 blur-3xl pointer-events-none transition-all duration-700 ${
          isHovered ? "opacity-95 scale-105" : "opacity-65"
        }`}
        aria-hidden="true"
      />

      {/* ─── 02 ORBITAL SYSTEM FRAME (280px desktop, 240px tablet, 195px mobile) */}
      <div className="relative flex items-center justify-center w-[195px] h-[195px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px]">
        {/* Single Primary Outer Orbit Ring (32s linear continuous rotation) */}
        <div
          className={`absolute inset-0 rounded-full border border-violet-400/35 motion-safe:animate-orbit-slow pointer-events-none transition-colors duration-500 ${
            isHovered ? "border-violet-400/55 [animation-duration:22s]" : ""
          }`}
          aria-hidden="true"
        >
          {/* Signal Node (Traveling along orbit with soft violet glow and gentle pulse) */}
          <div className="absolute -top-1 sm:-top-1.25 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-violet-300 shadow-[0_0_10px_#a78bfa] border border-[#07090e] motion-safe:animate-orbit-pulse" />
        </div>

        {/* Faint Inner Secondary Depth Ring (48s subtle counter-rotation) */}
        <div
          className="absolute inset-3.5 sm:inset-5 rounded-full border border-white/[0.08] motion-safe:animate-orbit-reverse pointer-events-none"
          aria-hidden="true"
        />

        {/* ─── 03 CIRCULAR PORTRAIT OBJECT (Static upright, subtle scaling) ── */}
        <div
          tabIndex={0}
          role="img"
          aria-label={`${name} portrait photo`}
          className={`relative w-[155px] h-[155px] sm:w-[190px] sm:h-[190px] md:w-[220px] md:h-[220px] rounded-full p-1 bg-[#090c14] border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090e] ${
            isHovered
              ? "border-violet-400/45 shadow-violet-950/40 scale-[1.018]"
              : "shadow-black/80"
          }`}
        >
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
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/80 font-medium tracking-wider">
              {availabilityNote}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
