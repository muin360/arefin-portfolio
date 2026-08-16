import type { Metadata, Viewport } from "next";
import {
  Syne,
  DM_Sans,
  JetBrains_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollToTop from "@/components/ScrollToTop";
import CursorRing from "@/components/CursorRing";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/transitions/PageTransition";
import MobileStickyBar from "@/components/MobileStickyBar";
import { SITE_URL, GOOGLE_SITE_VERIFICATION } from "@/lib/site-url";
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
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Arefin Mueen — AI Automation & AI Agent Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arefin Mueen — AI Automation & AI Agent Developer",
    description:
      "I build practical AI agents, RAG systems, multi-agent workflows, and business automations using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    images: ["/og.png"],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
};

// JSON-LD structured data — helps Google understand the site as a Person +
// WebSite, which improves knowledge-panel eligibility and
// rich-result rendering. Inline because the CSP allows 'unsafe-inline' for
// scripts; nothing here is dynamic per-request.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arefin Mueen",
    url: SITE_URL,
    jobTitle: "AI Automation & AI Agent Developer",
    description:
      "Independent developer specializing in AI automation, AI agents, RAG systems, and multi-agent workflows using n8n, LangChain, Langflow, LLMs, APIs, and Python.",
    image: `${SITE_URL}/og.png`,
    email: "mailto:hello@tensorix.me",
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
      "JavaScript",
      "JSON",
      "LLM Integrations",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arefin Mueen",
    url: SITE_URL,
    inLanguage: "en",
  },
  // Service schemas — productized capabilities
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Workflow Automation",
    serviceType: "Workflow Automation & Webhook Integration",
    provider: { "@type": "Person", name: "Arefin Mueen", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "Automating manual business processes and connecting disparate apps using n8n, Zapier, APIs, and LLMs.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/services`,
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Agents & Autonomous Assistants",
    serviceType: "AI Agent Development",
    provider: { "@type": "Person", name: "Arefin Mueen", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "Custom tool-calling AI agents and conversational assistants built with LangChain, Langflow, and leading LLM APIs.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/services`,
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "RAG & Knowledge Systems",
    serviceType: "Retrieval-Augmented Generation",
    provider: { "@type": "Person", name: "Arefin Mueen", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "Document ingestion, vector search, and context-grounded AI knowledge assistants.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/services`,
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
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
        {/* Defense-in-depth: HTTP headers (set by host config) are the primary
            controls. These meta tags add an extra layer for browsers that
            respect them and for hosts where headers aren't configurable. */}
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
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-foreground focus:text-background focus:px-3 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <PageLoader />
        <PageTransition />
        <CursorRing />
        <Navbar />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
        <MobileStickyBar />
        <ScrollToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
