import { useId } from "react";

type Props = {
  size?: number;
  className?: string;
  animated?: boolean;
};

/**
 * Tensor Studio neural-brain mark.
 * Two-lobe brain silhouette with a small neural network rendered inside.
 * Strokes use a violet → pink → cyan gradient. A handful of nodes pulse
 * softly to keep the mark feeling alive.
 */
export default function BrainMark({
  size = 40,
  className = "",
  animated = true,
}: Props) {
  const id = useId().replace(/:/g, "");
  const grad = `brain-grad-${id}`;
  const pulse = `brain-pulse-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Tensor Studio"
    >
      <defs>
        <linearGradient id={grad} x1="2" y1="6" x2="30" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="0.55" stopColor="#ec4899" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <radialGradient id={pulse} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ec4899" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Brain silhouette — two organic lobes with a notch on top */}
      <path
        d="M11 8.4 C 8 7.4, 5 9.5, 5 12.5 C 3.5 14, 3.5 17, 5.4 18.4 C 5.2 21, 7.4 23.2, 10.2 23 C 11 24.6, 13.4 25.2, 14.8 24 L 14.8 8.6 C 13.6 7.4, 12 7.6, 11 8.4 Z"
        stroke={`url(#${grad})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8.4 C 24 7.4, 27 9.5, 27 12.5 C 28.5 14, 28.5 17, 26.6 18.4 C 26.8 21, 24.6 23.2, 21.8 23 C 21 24.6, 18.6 25.2, 17.2 24 L 17.2 8.6 C 18.4 7.4, 20 7.6, 21 8.4 Z"
        stroke={`url(#${grad})`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center synapse — dashed divider between hemispheres */}
      <line
        x1="16"
        y1="8"
        x2="16"
        y2="24"
        stroke={`url(#${grad})`}
        strokeWidth="0.9"
        strokeDasharray="1.2 1.6"
        opacity="0.55"
      />

      {/* Connecting lines (neural network) */}
      <g stroke={`url(#${grad})`} strokeWidth="0.7" opacity="0.85">
        <line x1="9" y1="13" x2="12.5" y2="17" />
        <line x1="12.5" y1="17" x2="10.5" y2="20" />
        <line x1="9" y1="13" x2="13" y2="11" />
        <line x1="23" y1="13" x2="19.5" y2="17" />
        <line x1="19.5" y1="17" x2="21.5" y2="20" />
        <line x1="23" y1="13" x2="19" y2="11" />
        <line x1="12.5" y1="17" x2="19.5" y2="17" opacity="0.5" />
      </g>

      {/* Network nodes */}
      <g fill={`url(#${grad})`}>
        <circle cx="9" cy="13" r="1.4" />
        <circle cx="13" cy="11" r="0.9" />
        <circle cx="12.5" cy="17" r="1.2" />
        <circle cx="10.5" cy="20" r="0.9" />
        <circle cx="23" cy="13" r="1.4" />
        <circle cx="19" cy="11" r="0.9" />
        <circle cx="19.5" cy="17" r="1.2" />
        <circle cx="21.5" cy="20" r="0.9" />
      </g>

      {/* Subtle pulse on two key synapses */}
      {animated && (
        <>
          <circle cx="12.5" cy="17" r="2.4" fill={`url(#${pulse})`}>
            <animate attributeName="r" values="1.4;3.6;1.4" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="19.5" cy="17" r="2.4" fill={`url(#${pulse})`}>
            <animate attributeName="r" values="1.4;3.6;1.4" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" begin="1.2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}
