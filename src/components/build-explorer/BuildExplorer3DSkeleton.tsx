"use client";

import React from "react";
import { Box } from "lucide-react";

export default function BuildExplorer3DSkeleton() {
  return (
    <div className="w-full h-[380px] sm:h-[440px] md:h-[480px] rounded-2xl bg-[#080b12] border border-white/[0.08] relative overflow-hidden flex flex-col items-center justify-center p-6 space-y-4">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 animate-pulse">
        <Box className="w-6 h-6" />
      </div>

      <div className="text-center space-y-1 z-10">
        <span className="font-mono text-xs text-white/80 font-medium block">
          Initializing 3D Spatial Canvas
        </span>
        <span className="font-mono text-[10px] text-white/40 block">
          Loading isolated WebGL shaders...
        </span>
      </div>

      {/* Shimmer line */}
      <div className="w-48 h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-violet-400/60 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
    </div>
  );
}
