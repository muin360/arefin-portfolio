import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const baseProps: IconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconAgent = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <rect x="4" y="7" width="16" height="12" rx="2" />
    <path d="M9 12h.01M15 12h.01" />
    <path d="M12 3v4" />
    <path d="M9 19v2M15 19v2" />
    <circle cx="12" cy="3" r="1" />
  </svg>
);

export const IconWorkflow = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M8 6h8" />
    <path d="M6 8v8" />
    <path d="M18 8v8" />
    <path d="M8 18h8" />
  </svg>
);

export const IconChart = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M3 20h18" />
    <path d="M5 20V10" />
    <path d="M10 20V4" />
    <path d="M15 20v-7" />
    <path d="M20 20V8" />
  </svg>
);

export const IconBrain = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M9 4a3 3 0 0 0-3 3v.5A3 3 0 0 0 4.5 13 3 3 0 0 0 7 18a3 3 0 0 0 5 1 3 3 0 0 0 5-1 3 3 0 0 0 2.5-5A3 3 0 0 0 18 7.5V7a3 3 0 0 0-3-3 3 3 0 0 0-3 1 3 3 0 0 0-3-1z" />
    <path d="M12 5v14" />
  </svg>
);

export const IconCode = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="m8 8-4 4 4 4" />
    <path d="m16 8 4 4-4 4" />
    <path d="m13 6-2 12" />
  </svg>
);

export const IconCompass = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 15 1.5-4.5L15 9l-1.5 4.5z" />
  </svg>
);

export const IconArrow = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const IconMail = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const IconGithub = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M9 19c-4 1.5-4-2-6-2.5" />
    <path d="M15 22v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.7s-1.2-.4-3.9 1.5a13.4 13.4 0 0 0-7 0C5.5 1.4 4.3 1.8 4.3 1.8a5 5 0 0 0-.1 3.7A5.4 5.4 0 0 0 2.7 9.3c0 5.4 3.4 6.6 6.7 7a3.5 3.5 0 0 0-1 2.7v4" />
  </svg>
);

export const IconLinkedin = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M8 10v8" />
    <circle cx="8" cy="7" r="0.5" fill="currentColor" />
    <path d="M12 18v-5a2 2 0 0 1 4 0v5" />
    <path d="M12 11v7" />
  </svg>
);

export const IconX = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M4 4l16 16" />
    <path d="M20 4 4 20" />
  </svg>
);

export const IconFacebook = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M14 8h2.5V5h-2A3.5 3.5 0 0 0 11 8.5V11H8.5v3H11v7h3v-7h2.5l.5-3H14V9a1 1 0 0 1 1-1z" />
  </svg>
);

export const IconInstagram = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

export const IconYoutube = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <rect x="2" y="6" width="20" height="12" rx="3" />
    <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconWhatsapp = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M3 21l1.5-4.4A8 8 0 1 1 8 19.6L3 21z" />
    <path d="M9 9c0 4 3 6 6 6 .5 0 1-.4 1-1 0-.4-.3-.7-.5-.8l-1.4-.8a.7.7 0 0 0-.8.1l-.5.5c-1-.4-1.7-1.1-2.1-2l.5-.5a.7.7 0 0 0 .1-.8L10.6 8a1 1 0 0 0-.8-.5c-.6 0-.9.4-.9 1z" />
  </svg>
);

export const IconSpark = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
);

export const IconLayers = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5" />
    <path d="m3 18 9 5 9-5" />
  </svg>
);

export const IconRocket = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M14 4s5 1 6 6c-5-1-6-6-6-6z" />
    <path d="M14 4 4 14l3 3 1-1 1 3 3 1-1 1 3 3 10-10" />
    <path d="M9 15l-2 2" />
  </svg>
);

export const IconTerminal = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="m7 9 3 3-3 3" />
    <path d="M13 15h4" />
  </svg>
);

export const IconBookmark = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="M5 3h14v18l-7-4-7 4z" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...baseProps} {...p}>
    <path d="m4 12 5 5L20 6" />
  </svg>
);
