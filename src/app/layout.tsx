import type { Metadata, Viewport } from "next";
import {
  Inter,
  Roboto,
  JetBrains_Mono,
  Instrument_Serif,
  Manrope,
  Syne,
  DM_Sans,
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

// Body — Inter is the variable, optically tuned, high-legibility workhorse used
// across Vercel / Stripe / Linear-tier products. Kept as a fallback for any
// legacy --font-inter references.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});


// Body accent — Roboto adds a humanist warmth to complement Inter.
// Used as a secondary body/UI face throughout the site.
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});
// Display — Manrope adds character and slightly humanist warmth for big
// editorial headlines without going full geometric. Retained as a fallback
// for any --font-manrope references.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

// Display — Syne is the primary editorial face. Sharp, slightly engineered
// geometric serif/sans hybrid that anchors the Tensorix headline voice.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// Body — DM Sans is the production-grade reading face used for body copy,
// nav, and UI labels. Pairs cleanly with Syne and JetBrains Mono.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

// Editorial accent — high-contrast didone-style serif for the studio's
// signature italic moments.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Mono — JetBrains Mono has stronger ligatures + character than Geist Mono,
// reads more like real production-engineering text.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arefin Mueen — AI Agent & Automation Engineer",
    template: "%s — Arefin Mueen",
  },
  description:
    "Arefin Mueen is an AI Agent & Automation Engineer based in Dhaka. I build voice AI agents, multi-agent systems, RAG pipelines, and automation workflows with n8n, LangChain, Python, and modern LLMs.",
  applicationName: "Arefin Mueen Portfolio",
  keywords: [
    "AI agent engineer",
    "AI automation engineer",
    "voice AI agent developer",
    "multi-agent system engineer",
    "RAG pipeline developer",
    "n8n expert",
    "LangChain developer",
    "AI automation Bangladesh",
    "AI engineer Dhaka",
    "freelance AI engineer",
    "automation workflow developer",
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
    title: "Arefin Mueen — AI Agent & Automation Engineer",
    description:
      "I build voice AI agents, multi-agent systems, RAG pipelines, and automation workflows. n8n · LangChain · Python · LLMs — real code, real automation.",
    siteName: "Arefin Mueen",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Arefin Mueen — AI Agent & Automation Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arefin Mueen — AI Agent & Automation Engineer",
    description:
      "I build voice AI agents, multi-agent systems, RAG pipelines, and n8n automation workflows. Based in Dhaka, working globally.",
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
    jobTitle: "AI Agent & Automation Engineer",
    description:
      "Independent AI engineer building voice agents, multi-agent systems, RAG pipelines, and automation workflows with n8n, LangChain, LangFlow, Python, and modern LLMs. Based in Dhaka, working globally.",
    image: `${SITE_URL}/og.png`,
    email: "mailto:hello@tensorix.me",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61588840534814",
      "https://wa.me/8801994605717",
    ],
    knowsAbout: [
      "AI Engineering",
      "AI Agents",
      "Workflow Automation",
      "n8n",
      "Zapier",
      "Make",
      "LangChain",
      "LangFlow",
      "GoHighLevel",
      "Large Language Models",
      "Python",
      "TypeScript",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arefin Mueen",
    url: SITE_URL,
    inLanguage: "en",
  },
  // Service schemas — one per productized offering. Helps Google match
  // "AI automation for small business", "Facebook chatbot automation",
  // and "website development for business" search intent to this site.
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Workflow Automation",
    serviceType: "AI Workflow Automation",
    provider: { "@type": "Person", name: "Arefin Mueen", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "Production workflow automation on n8n, Make, Zapier, and GoHighLevel — CRM updates, follow-ups, invoicing, reporting — with proper error handling, logging, and documentation built in.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/services`,
      availability: "https://schema.org/LimitedAvailability",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        description: "Quoted after a free systems audit",
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Agent & Chatbot Systems",
    serviceType: "Conversational AI / AI Agent",
    provider: { "@type": "Person", name: "Arefin Mueen", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "AI chat agents for web, WhatsApp, and Messenger. Trained on your real content, integrated with your existing CRM and tools, with clear human handoff for the cases that matter.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/services`,
      priceCurrency: "USD",
      availability: "https://schema.org/LimitedAvailability",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Conversion Websites with Automation",
    serviceType: "Web Development & Automation",
    provider: { "@type": "Person", name: "Arefin Mueen", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "Fast, mobile-first websites built as web systems — forms, WhatsApp, booking, payments, and AI chat wired into your CRM and automation stack from day one.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/services`,
      priceCurrency: "USD",
      availability: "https://schema.org/LimitedAvailability",
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
      className={`${inter.variable} ${roboto.variable} ${manrope.variable} ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        {/* Defense-in-depth: HTTP headers (set by host config) are the primary
            controls. These meta tags add an extra layer for browsers that
            respect them and for hosts where headers aren't configurable. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https://cdn.sanity.io https://avatars.githubusercontent.com https://lh3.googleusercontent.com; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; worker-src 'self' blob:; connect-src 'self' https://*.api.sanity.io https://cdn.sanity.io https://api.sanity.io wss://*.api.sanity.io https://vitals.vercel-insights.com https://api.anthropic.com; frame-src 'self' https://cal.com https://*.cal.com; manifest-src 'self'; upgrade-insecure-requests"
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
