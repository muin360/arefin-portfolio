import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Update this to your final domain (e.g. https://arefinmuin.com) after deploying.
const SITE_URL = "https://out-azhgzofj.devinapps.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Arefin Muin — AI Automation & Agent Engineer",
  description:
    "Arefin Muin is an AI Automation and Agent expert specializing in n8n, Zapier, Make, LangChain, LangFlow, GoHighLevel, Python and JavaScript — building intelligent workflows and LLM-powered agents.",
  keywords: [
    "Arefin Muin",
    "AI Automation",
    "AI Agents",
    "n8n",
    "Zapier",
    "Make",
    "LangChain",
    "LangFlow",
    "GoHighLevel",
    "LLM Engineer",
    "Python",
    "JavaScript",
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, telephone: false, address: false },
  authors: [{ name: "Arefin Muin" }],
  creator: "Arefin Muin",
  openGraph: {
    type: "website",
    title: "Arefin Muin — AI Automation & Agent Engineer",
    description:
      "Engineering quiet, intelligent systems that work while you sleep.",
    siteName: "Arefin Muin",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Arefin Muin — AI Automation & Agent Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arefin Muin — AI Automation & Agent Engineer",
    description:
      "Engineering quiet, intelligent systems that work while you sleep.",
    images: ["/og.png"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0a14",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        {/* Defense-in-depth: HTTP headers (set by host config) are the primary
            controls. These meta tags add an extra layer for browsers that
            respect them and for hosts where headers aren't configurable. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; connect-src 'self'; form-action 'self' mailto:; manifest-src 'self'; worker-src 'self'; upgrade-insecure-requests"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
