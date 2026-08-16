// Single source of truth for the canonical site URL.
//
// Set NEXT_PUBLIC_SITE_URL in Vercel → Project Settings → Environment Variables
// (and in your local .env.local). The default is https://tensorstudio.vercel.app.
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://tensorstudio.vercel.app"
).replace(/\/+$/, "");

// Google Search Console "HTML tag" verification — content value of the meta
// tag Google issued for this property. Can be overridden via the
// NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION env var if you ever need a new token.
export const GOOGLE_SITE_VERIFICATION: string =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  "v1dlYhce2C26iEpbBI1F9mDAwEL40Sh_A_0X1L8j4NU";
