"use client";

import { useEffect, useState } from "react";

const PHONE_E164 = "8801994605717";
const DEFAULT_MSG =
  "Hi Arefin! I saw your website and I'd like to know if AI automation, a Messenger bot, or a new website is right for my business.";

export default function WhatsAppFab({
  phoneE164 = PHONE_E164,
  message = DEFAULT_MSG,
}: {
  phoneE164?: string;
  message?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Arefin on WhatsApp"
      className={`fixed z-[60] bottom-5 right-5 md:bottom-7 md:right-7 transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      <span className="relative flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white pl-3 pr-4 py-3 shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)] hover:shadow-[0_14px_36px_-8px_rgba(37,211,102,0.7)] transition-all">
        <span
          aria-hidden="true"
          className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-md opacity-60"
        />
        <svg
          viewBox="0 0 32 32"
          width="22"
          height="22"
          aria-hidden="true"
          className="relative shrink-0"
          fill="currentColor"
        >
          <path d="M19.11 17.21c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16s-.81 1-.99 1.21c-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.83-1.55-1.84-1.73-2.15-.18-.31-.02-.48.13-.63.13-.13.31-.36.46-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.69-.95-2.32-.25-.6-.51-.52-.7-.53l-.59-.01c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.39 4.75.75.32 1.34.51 1.8.66.75.24 1.44.21 1.98.13.6-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.29-.21-.6-.36zM16 4C9.37 4 4 9.37 4 16c0 2.12.55 4.11 1.5 5.84L4 28l6.32-1.45A11.93 11.93 0 0 0 16 28c6.63 0 12-5.37 12-12S22.63 4 16 4zm0 21.7c-1.94 0-3.74-.55-5.27-1.49l-.38-.23-3.74.86.85-3.65-.25-.4A9.65 9.65 0 0 1 6.3 16C6.3 10.65 10.65 6.3 16 6.3S25.7 10.65 25.7 16 21.35 25.7 16 25.7z" />
        </svg>
        <span className="hidden sm:inline text-sm font-medium pr-1">
          Chat on WhatsApp
        </span>
      </span>
    </a>
  );
}
