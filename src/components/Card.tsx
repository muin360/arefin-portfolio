import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "standard" | "featured" | "minimal";
  className?: string;
  children: React.ReactNode;
}

export default function Card({
  variant = "standard",
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    standard:
      "bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 text-white shadow-sm",
    featured:
      "bg-[#101424] border border-violet-500/30 hover:border-violet-500/50 text-white shadow-md shadow-violet-950/20",
    minimal:
      "bg-transparent border border-white/[0.06] hover:border-white/15 text-white",
  };

  return (
    <div
      className={`rounded-2xl p-6 sm:p-7 transition-all duration-250 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
