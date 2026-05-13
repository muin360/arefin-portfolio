import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollToTop from "@/components/ScrollToTop";
import CursorRing from "@/components/CursorRing";
import PageLoader from "@/components/PageLoader";
import { SITE_URL, GOOGLE_SITE_VERIFICATION } from "@/lib/site-url";
import { safeJsonLd } from "@/lib/json-ld";
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
    default: "Tensorix — AI Automation, Intelligent Systems & Future Solutions",
    template: "%s — Tensorix",
  },
  description:
    "Tensorix builds AI chatbots, Facebook & Messenger automation, and high-converting websites for small businesses. Done-for-you systems built in days, not months. Free 30-min audit. Reply on WhatsApp within 1 hour.",
  applicationName: "Tensorix",
  keywords: [
    "AI automation for small business",
    "Facebook chatbot automation",
    "Messenger bot for small business",
    "website development Bangladesh",
    "AI chatbot for business",
    "small business automation",
    "AI agency Bangladesh",
    "AI engineer Dhaka",
    "n8n consultant",
    "Zapier consultant",
    "GoHighLevel agency",
    "LLM engineer",
    "AI workflow automation",
    "lead generation automation",
    "WhatsApp automation for business",
    "Tensorix",
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
  authors: [{ name: "Tensorix", url: SITE_URL }, { name: "Arefin Muin", url: SITE_URL }],
  creator: "Tensorix",
  publisher: "Tensorix",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Tensorix — AI Automation Agency",
    description:
      "We build intelligent AI systems, automation workflows, and high-converting websites for small businesses — done for you, owned by you.",
    siteName: "Tensorix",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Tensorix — AI Automation Agency" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tensorix — AI Automation Agency",
    description:
      "We build intelligent AI systems, automation workflows, and high-converting websites — done for you, owned by you.",
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
      "Founder of Tensorix. Independent AI engineer building agents, automations and LLM-powered systems with n8n, Zapier, Make, LangChain, LangFlow, GoHighLevel, Python and TypeScript.",
    image: `${SITE_URL}/og.png`,
    email: "mailto:hello@tensorix.ai",
    worksFor: {
      "@type": "Organization",
      name: "Tensorix",
      url: SITE_URL,
    },
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
    "@type": "Organization",
    name: "Tensorix",
    alternateName: ["Tensorix Agency", "Tensor"],
    url: SITE_URL,
    logo: `${SITE_URL}/tensorix-logo-256.png`,
    description:
      "Tensorix is an AI engineering agency. We design, ship and maintain AI agents, automation workflows and LLM-powered systems for modern companies.",
    founder: { "@type": "Person", name: "Arefin Muin" },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61588840534814",
      "https://wa.me/8801994605717",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tensorix",
    url: SITE_URL,
    inLanguage: "en",
  },
  // Service schemas — one per productized offering. Helps Google match
  // "AI automation for small business", "Facebook chatbot automation",
  // and "website development for business" search intent to this site.
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Automation for Small Business",
    serviceType: "AI Automation",
    provider: { "@type": "Organization", name: "Tensorix", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "Custom AI workflow automation on n8n, Zapier, Make and GoHighLevel for small businesses. Lead qualification, follow-ups, CRM updates and AI replies — built around the tools you already use.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/services`,
      availability: "https://schema.org/LimitedAvailability",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        description: "Flat price · custom quote per scope",
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Facebook & Messenger Chatbot Automation",
    serviceType: "Conversational AI / Chatbot",
    provider: { "@type": "Organization", name: "Tensorix", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "24/7 AI Messenger bot for Facebook business pages. Answers FAQs in your brand voice, qualifies buyers, books appointments and hands off to humans only when it really matters.",
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
    name: "Website Development for Small Business",
    serviceType: "Web Development",
    provider: { "@type": "Organization", name: "Tensorix", url: SITE_URL },
    areaServed: ["BD", "AE", "SA", "QA", "KW", "OM", "BH", "US", "CA", "GB"],
    description:
      "Fast, mobile-first websites built around conversion. WhatsApp, booking and payment built in. Owner-editable copy, no developer needed for small changes.",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/services`,
      priceCurrency: "USD",
      availability: "https://schema.org/LimitedAvailability",
    },
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
          content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https://cdn.sanity.io; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; worker-src 'self' blob:; connect-src 'self' https://*.api.sanity.io https://cdn.sanity.io https://api.sanity.io wss://*.api.sanity.io https://vitals.vercel-insights.com; frame-src 'self' https://cal.com https://*.cal.com; manifest-src 'self'; upgrade-insecure-requests"
        />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
        <meta name="color-scheme" content="light" />
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
        <CursorRing />
        <Navbar />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
        <ScrollToTop />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
