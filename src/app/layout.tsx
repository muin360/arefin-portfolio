import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CursorRing from "@/components/CursorRing";
import PageLoader from "@/components/PageLoader";
import { SITE_URL, GOOGLE_SITE_VERIFICATION } from "@/lib/site-url";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Body — Inter is the variable, optically tuned, high-legibility workhorse used
// across Vercel / Stripe / Linear-tier products.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display — Manrope adds character and slightly humanist warmth for big
// editorial headlines without going full geometric.
const manrope = Manrope({
  variable: "--font-manrope",
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
    default: "Tensor Studio — AI Engineering for Modern Companies",
    template: "%s — Tensor Studio",
  },
  description:
    "Tensor Studio is an independent AI engineering studio. We design and ship AI agents, automation workflows and LLM-powered systems with n8n, Zapier, Make, LangChain, LangFlow, GoHighLevel, Python and TypeScript — quietly, reliably.",
  applicationName: "Tensor Studio",
  keywords: [
    "Tensor Studio",
    "AI Engineering Studio",
    "AI Automation Agency",
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
    "Arefin Muin",
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
  authors: [{ name: "Tensor Studio", url: SITE_URL }, { name: "Arefin Muin", url: SITE_URL }],
  creator: "Tensor Studio",
  publisher: "Tensor Studio",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Tensor Studio — AI Engineering",
    description:
      "An independent AI engineering studio building quiet, intelligent systems that work while you sleep.",
    siteName: "Tensor Studio",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Tensor Studio — AI Engineering" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tensor Studio — AI Engineering",
    description:
      "An independent AI engineering studio building quiet, intelligent systems that work while you sleep.",
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
// Organization + WebSite, which improves knowledge-panel eligibility and
// rich-result rendering. Inline because the CSP allows 'unsafe-inline' for
// scripts; nothing here is dynamic per-request.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arefin Muin",
    url: SITE_URL,
    jobTitle: "AI Automation & Agent Engineer",
    description:
      "Independent AI engineer building agents, automations and LLM-powered systems with n8n, Zapier, Make, LangChain, LangFlow, GoHighLevel, Python and TypeScript.",
    image: `${SITE_URL}/og.png`,
    email: "mailto:arefinmuin@gmail.com",
    worksFor: {
      "@type": "Organization",
      name: "Tensor Studio",
      url: SITE_URL,
    },
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
    "@type": "Organization",
    name: "Tensor Studio",
    alternateName: "Tensor",
    url: SITE_URL,
    logo: `${SITE_URL}/tensor-logo-256.png`,
    description:
      "An independent AI engineering studio. We design and ship AI agents, automation workflows and LLM-powered systems for modern companies.",
    founder: { "@type": "Person", name: "Arefin Muin" },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tensor Studio",
    url: SITE_URL,
    inLanguage: "en",
  },
];

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
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        {/* Defense-in-depth: HTTP headers (set by host config) are the primary
            controls. These meta tags add an extra layer for browsers that
            respect them and for hosts where headers aren't configurable. */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob: https://cdn.sanity.io; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; connect-src 'self' https://*.api.sanity.io https://cdn.sanity.io https://api.sanity.io wss://*.api.sanity.io https://vitals.vercel-insights.com; form-action 'self'; manifest-src 'self'; worker-src 'self' blob:; upgrade-insecure-requests"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        <meta name="color-scheme" content="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <CursorRing />
        <Navbar />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
