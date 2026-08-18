import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  target,
  rel,
  icon,
  iconPosition = "right",
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "group inline-flex items-center justify-center font-mono font-semibold transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-xs rounded-xl gap-2",
    lg: "px-7 py-3.5 text-sm rounded-xl gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-white text-black hover:bg-white/90 shadow-md shadow-white/5 active:scale-[0.98]",
    secondary:
      "bg-[#0c0f18] text-white hover:bg-[#121624] border border-white/10 hover:border-white/20 active:scale-[0.98]",
    accent:
      "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 active:scale-[0.98]",
    outline:
      "bg-transparent text-white hover:bg-white/[0.04] border border-white/20 hover:border-violet-400/60 active:scale-[0.98]",
    text: "bg-transparent text-violet-300 hover:text-white p-0 rounded-none border-none hover:bg-transparent shadow-none",
  };

  const combinedClass = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        icon && iconPosition === "left" && (
          <span className="shrink-0 transition-transform group-hover:-translate-x-0.5">
            {icon}
          </span>
        )
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    const isExternal = href.startsWith("http") || target === "_blank";
    if (isExternal) {
      return (
        <a
          href={href}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer"}
          className={combinedClass}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClass}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClass} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
