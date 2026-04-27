import { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  duration?: number;
  className?: string;
  reverse?: boolean;
};

export default function Marquee({
  children,
  duration = 36,
  className = "",
  reverse = false,
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden relative ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="marquee"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
