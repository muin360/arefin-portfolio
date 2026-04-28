import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Switched off static export so we can use Sanity-backed ISR — content
  // edits in /studio go live in seconds via webhook revalidation, instead of
  // waiting for a full Vercel rebuild on each save.
  trailingSlash: false,
  images: {
    // Sanity's CDN serves all our project/blog images. Allowing it via
    // remotePatterns lets next/image optimize and serve them as AVIF/WebP.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
