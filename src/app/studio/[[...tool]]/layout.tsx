import type { Metadata, Viewport } from "next";

// Override the root metadata for /studio so the Studio chrome takes over the
// full viewport and search engines never index it.
export const metadata: Metadata = {
  title: "Tensorix CMS",
  robots: { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
