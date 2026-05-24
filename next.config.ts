import type { NextConfig } from "next";

/**
 * Production security headers.
 *
 * - CSP: lock down where assets / scripts / connections can come from.
 *   Allows Sanity (CMS), Vercel Analytics, Google Fonts, Cal.com (for
 *   the booking iframe). 'unsafe-inline' for scripts is required for
 *   the inline JSON-LD and Next.js inline boot script — which is fine
 *   because we don't run any untrusted user JS.
 * - HSTS: force HTTPS for one year, eligible for browser preload list.
 * - X-Frame-Options DENY + frame-ancestors 'none': prevent clickjacking.
 * - X-Content-Type-Options nosniff: stop MIME sniffing-based XSS.
 * - Referrer-Policy: don't leak full URLs to other origins.
 * - Permissions-Policy: deny access to powerful sensors we never use.
 * - COOP / CORP / X-DNS-Prefetch-Control: defense-in-depth.
 *
 * Note: HTTP headers (set here) take precedence over the <meta> CSP in
 * layout.tsx. The meta tag stays as a fallback for non-Vercel hosts.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // Images — self, data: for inline SVGs, blob: for runtime canvases,
  // Sanity CDN for editor uploads.
  "img-src 'self' data: blob: https://cdn.sanity.io",
  // Fonts — self + Google Fonts CDN.
  "font-src 'self' data: https://fonts.gstatic.com",
  // Styles — self + inline (required by Next.js + Tailwind 4) + Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Scripts — self + inline (JSON-LD, Next bootstrap) + Vercel Analytics.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  // Workers — self + blob (Sanity Studio uses blob workers).
  "worker-src 'self' blob:",
  // Network — Sanity API + Vercel insights + self.
  "connect-src 'self' https://*.api.sanity.io https://cdn.sanity.io https://api.sanity.io wss://*.api.sanity.io https://vitals.vercel-insights.com",
  // Iframes — self (Sanity Studio embeds) + Cal.com booking widget.
  "frame-src 'self' https://cal.com https://*.cal.com",
  // Manifest.
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "browsing-topics=()",
      "camera=()",
      "display-capture=()",
      "fullscreen=(self)",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "picture-in-picture=()",
      "publickey-credentials-get=()",
      "screen-wake-lock=()",
      "sync-xhr=()",
      "usb=()",
      "xr-spatial-tracking=()",
    ].join(", "),
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  // Old-school anti-XSS header — modern browsers ignore it but some
  // proxies / scanners look for it. Setting "0" is the recommended value.
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  // Switched off static export so we can use Sanity-backed ISR — content
  // edits in /studio go live in seconds via webhook revalidation, instead of
  // waiting for a full Vercel rebuild on each save.
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Sanity's CDN serves all our project/blog images. Allowing it via
    // remotePatterns lets next/image optimize and serve them as AVIF/WebP.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "tensorix.me",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "tensorstudio.vercel.app" }],
        destination: "https://tensorix.me/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "tensorix.ai" }],
        destination: "https://tensorix.me/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply to every route except Sanity Studio, which needs slightly
        // looser CSP for live editing — Studio runs at /studio and is
        // protected by Sanity's own auth.
        source: "/((?!studio).*)",
        headers: securityHeaders,
      },
      {
        // Studio: same hardening but a more permissive frame policy because
        // the Sanity admin embeds preview iframes from cdn.sanity.io.
        source: "/studio/:path*",
        headers: securityHeaders.filter(
          (h) => h.key !== "Content-Security-Policy",
        ),
      },
    ];
  },
};

export default nextConfig;
