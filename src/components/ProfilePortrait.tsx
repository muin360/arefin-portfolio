"use client";

import { useState } from "react";
import Image from "next/image";
import ProfileHUD from "./hud/ProfileHUD";

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
      {/* ─── LAYER 8: CONCENTRATED AMBIENT ATMOSPHERIC DEPTH ────────────────── */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none transition-all duration-500 ease-out ${
          isHovered ? "opacity-90 scale-105" : "opacity-55"
        }`}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/[0.03] blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ─── HUD VISUALIZER CONTAINER (210px mobile, 260px tablet, 305px desktop) ─ */}
      <div className="relative flex items-center justify-center w-[215px] h-[215px] sm:w-[260px] sm:h-[260px] md:w-[305px] md:h-[305px]">
        {/* ─── ORBITAL AUDIO-REACTIVE HUD (Pure CSS/SVG Hardware-Accelerated) ── */}
        <ProfileHUD isHovered={isHovered} />

        {/* ─── TELEMETRY MICRO-MARKER (Anchored top-right outside portrait) ─── */}
        <div className="absolute top-2 sm:top-3 right-0 sm:right-1 pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#07090e]/95 border border-violet-500/30 backdrop-blur-sm shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[8px] sm:text-[9px] font-bold text-violet-200 tracking-wider">
              AGENT / ONLINE
            </span>
          </div>
        </div>

        {/* ─── LAYER 1: REAL PORTRAIT PHOTO (Upright, stable, non-rotating) ── */}
        <div
          tabIndex={0}
          role="img"
          aria-label={`${name} portrait photo`}
          className={`relative w-[150px] h-[150px] sm:w-[185px] sm:h-[185px] md:w-[215px] md:h-[215px] rounded-full p-1 bg-[#090c14] border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090e] ${
            isHovered
              ? "border-violet-400/50 shadow-violet-950/40 scale-[1.015]"
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
          <div className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-[#0c0f18]/95 border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg shadow-black/60 whitespace-nowrap z-20 font-mono text-[10px] backdrop-blur-sm">
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
