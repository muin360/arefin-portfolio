// Single source of truth for the canonical site URL.
//
// Set NEXT_PUBLIC_SITE_URL in Vercel → Project Settings → Environment Variables
// (and in your local .env.local) once you have a custom domain. The fallback is
// only used until that env var is configured.
//
// IMPORTANT for SEO: Google heavily de-prioritizes free shared subdomains like
// *.vercel.app. The single biggest ranking improvement you can make is moving
// to a real custom domain and pointing this env var at it.
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tensorstudio.vercel.app"
).replace(/\/+$/, "");

// Optional: paste the content value of the Google Search Console
// "HTML tag" verification meta tag here, or set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
// in your environment. Leave undefined until you've verified the property.
export const GOOGLE_SITE_VERIFICATION: string | undefined =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;
