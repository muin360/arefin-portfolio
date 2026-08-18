import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "standard" | "featured" | "minimal" | "glass";
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Card({
  variant = "standard",
  hoverEffect = true,
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    standard:
      "bg-[#0c0f18]/90 border border-white/[0.08] hover:border-violet-500/30 text-white shadow-sm",
    featured:
      "bg-gradient-to-b from-[#121626] to-[#0c0f18] border border-violet-500/35 hover:border-violet-400/60 text-white shadow-lg shadow-violet-950/30",
    minimal:
      "bg-transparent border border-white/[0.06] hover:border-white/20 text-white",
    glass:
      "bg-[#07090e]/80 backdrop-blur-xl border border-white/10 hover:border-violet-500/40 text-white shadow-2xl",
  };

  const hoverClass = hoverEffect
    ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
    : "transition-colors duration-200";

  return (
    <div
      className={`rounded-2xl p-6 sm:p-7 relative overflow-hidden ${variantStyles[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
