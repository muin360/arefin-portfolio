"use client";

import React, { useState, useRef, useCallback } from "react";
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showImage = Boolean(profileImage && !imgError);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const yPct = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1

    // Clamp tilt degrees (max 10 degrees)
    setTilt({
      x: -yPct * 10,
      y: xPct * 10,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback(() => {
    setClicked(true);
    setTimeout(() => setClicked(false), 800);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center select-none motion-safe:animate-profile-activate ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label={`${name} — ${role}`}
      style={{
        perspective: "1000px",
      }}
    >
      {/* ─── LAYER 8: DYNAMIC AMBIENT AURORA DEPTH GLOW (FOLLOWS CURSOR) ─── */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-violet-600/30 via-indigo-500/20 to-sky-400/20 blur-3xl pointer-events-none transition-all duration-300 ease-out ${
          isHovered ? "opacity-90 scale-110" : "opacity-45"
        }`}
        style={{
          transform: `translate(-50%, -50%) translate(${tilt.y * 3}px, ${-tilt.x * 3}px)`,
        }}
        aria-hidden="true"
      />

      {/* ─── HUD VISUALIZER CONTAINER WITH 3D PARALLAX TILT ─────────────── */}
      <div
        className="relative flex items-center justify-center w-[215px] h-[215px] sm:w-[260px] sm:h-[260px] md:w-[305px] md:h-[305px] transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.025 : 1}, ${
            isHovered ? 1.025 : 1
          }, 1)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* ─── ORBITAL AUDIO-REACTIVE HUD (Hardware-Accelerated) ─────────── */}
        <ProfileHUD isHovered={isHovered} />

        {/* ─── CLICK IMPULSE SHOCKWAVE RIPPLE ───────────────────────────── */}
        {clicked && (
          <div
            className="absolute inset-0 rounded-full border border-violet-400/80 animate-ping pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* ─── TELEMETRY MICRO-MARKER (Top-Right HUD Tag) ───────────────── */}
        <div
          className="absolute top-2 sm:top-3 right-0 sm:right-1 pointer-events-none z-10 transition-transform duration-300"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#07090e]/95 border border-violet-500/40 backdrop-blur-md shadow-lg shadow-black/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            <span className="font-mono text-[8px] sm:text-[9px] font-bold text-violet-200 tracking-wider">
              AGENT / ONLINE
            </span>
          </div>
        </div>

        {/* ─── LAYER 1: REAL PORTRAIT PHOTO (Upright with 3D Depth Specular) ── */}
        <div
          tabIndex={0}
          role="img"
          aria-label={`${name} portrait photo`}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          className={`relative w-[150px] h-[150px] sm:w-[185px] sm:h-[185px] md:w-[215px] md:h-[215px] rounded-full p-1 bg-[#090c14] border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090e] ${
            isHovered
              ? "border-violet-400/60 shadow-[0_0_35px_rgba(139,92,246,0.35)]"
              : "shadow-black/80"
          }`}
          style={{ transform: "translateZ(20px)" }}
        >
          {showImage ? (
            <Image
              src={profileImage!}
              alt={`${name} — ${role}`}
              width={240}
              height={240}
              priority
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center rounded-full transition-transform duration-500"
              style={{
                transform: `scale(${isHovered ? 1.04 : 1}) translate(${-tilt.y * 0.5}px, ${
                  tilt.x * 0.5
                }px)`,
              }}
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

          {/* Dynamic Specular Sheen Reflection */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${
                50 - tilt.x * 2
              }%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
              opacity: isHovered ? 0.9 : 0.4,
            }}
            aria-hidden="true"
          />

          {/* Top specular depth highlight rim */}
          <div
            className="absolute inset-0 rounded-full border-t border-white/30 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Real Status Badge (Availability indicator below portrait) */}
        {availabilityNote && (
          <div
            className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 bg-[#0c0f18]/95 border border-white/15 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg shadow-black/80 whitespace-nowrap z-20 font-mono text-[10px] backdrop-blur-md transition-transform duration-300"
            style={{ transform: "translateX(-50%) translateZ(25px)" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-status-pulse shadow-[0_0_6px_#34d399]" />
            <span className="text-white/90 font-medium tracking-wider">
              {availabilityNote}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
