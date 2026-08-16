import type { NextConfig } from "next";

/**
 * Production security headers.
 *
 * - CSP: lock down where assets / scripts / connections can come from.
 * - HSTS: force HTTPS for one year, eligible for browser preload list.
 * - X-Frame-Options DENY + frame-ancestors 'none': prevent clickjacking.
 * - X-Content-Type-Options nosniff: stop MIME sniffing-based XSS.
 * - Referrer-Policy: don't leak full URLs to other origins.
 * - Permissions-Policy: deny access to powerful sensors we never use.
 * - COOP / CORP / X-DNS-Prefetch-Control: defense-in-depth.
 */
const ContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  // Images — self, data: for inline SVGs, blob: for runtime canvases, OAuth avatars.
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://lh3.googleusercontent.com",
  // Fonts — self + Google Fonts CDN.
  "font-src 'self' data: https://fonts.gstatic.com",
  // Styles — self + inline (required by Next.js + Tailwind 4) + Google Fonts.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Scripts — self + inline (JSON-LD, Next bootstrap) + Vercel Analytics.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  // Workers — self + blob.
  "worker-src 'self' blob:",
  // Network — Vercel insights + self + Anthropic API.
  "connect-src 'self' https://vitals.vercel-insights.com https://api.anthropic.com",
  // Iframes — Cal.com booking widget.
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
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
