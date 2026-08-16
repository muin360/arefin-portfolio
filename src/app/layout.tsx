import type { Metadata, Viewport } from "next";
import {
  Syne,
  DM_Sans,
  JetBrains_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import { safeJsonLd } from "@/lib/json-ld";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Display — Syne is the primary editorial & headline face.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Body & UI — DM Sans is the production reading face for body copy, UI, and navigation.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Editorial Accent — Instrument Serif for signature editorial moments.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Mono — JetBrains Mono for code, system traces, status tags, and technical labels.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arefin Mueen — AI Automation & AI Agent Developer",
    template: "%s — Arefin Mueen",
  },
  description:
    "Arefin Mueen is an AI Automation & AI Agent Developer based in Dhaka. I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
  applicationName: "Arefin Mueen Portfolio",
  keywords: [
    "AI Automation Developer",
    "AI Agent Developer",
    "n8n Developer",
    "LangChain Developer",
    "Langflow",
    "RAG Systems",
    "Multi-Agent Systems",
    "AI Chatbots",
    "Voice AI",
    "API Automation",
    "Webhooks",
    "Python Automation",
    "Workflow Automation",
    "Arefin Mueen",
  ],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, telephone: false, address: false },
  authors: [{ name: "Arefin Mueen", url: SITE_URL }],
  creator: "Arefin Mueen",
  publisher: "Arefin Mueen",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Arefin Mueen — AI Automation & AI Agent Developer",
    description:
      "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    siteName: "Arefin Mueen",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arefin Mueen — AI Automation & AI Agent Developer",
    description:
      "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    creator: "@arefin_muin",
    site: "@arefin_muin",
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arefin Mueen",
    url: SITE_URL,
    description:
      "Arefin Mueen — AI Automation & AI Agent Developer. Practical AI agents, RAG systems, and workflow automation.",
    author: {
      "@type": "Person",
      name: "Arefin Mueen",
    },
    inLanguage: "en-US",
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arefin Mueen",
    url: SITE_URL,
    jobTitle: "AI Automation & AI Agent Developer",
    description:
      "Independent developer specializing in AI automation, AI agents, RAG systems, and multi-agent workflows using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    image: `${SITE_URL}/og.png`,
    email: "mailto:arefinmueen360@gmail.com",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61588840534814",
      "https://wa.me/8801994605717",
      "https://github.com/arefinmuin",
      "https://www.linkedin.com/in/arefin-muin/",
    ],
    knowsAbout: [
      "AI Agents",
      "AI Automation",
      "n8n",
      "LangChain",
      "Langflow",
      "RAG Systems",
      "Multi-Agent Systems",
      "APIs & Webhooks",
      "Python",
    ],
  },
];

export const viewport: Viewport = {
  themeColor: "#04040a",
  colorScheme: "dark",
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
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https://avatars.githubusercontent.com https://lh3.googleusercontent.com; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; worker-src 'self' blob:; connect-src 'self' https://vitals.vercel-insights.com https://api.anthropic.com; frame-src 'self' https://cal.com https://*.cal.com; manifest-src 'self'; upgrade-insecure-requests"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
