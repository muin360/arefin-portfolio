import { auth } from "@/lib/auth";

/**
 * NextAuth proxy for protecting admin routes.
 *
 * Next.js 16 renamed the "middleware" file convention to "proxy".
 * This replaces src/middleware.ts and removes the deprecation warning.
 */
export const proxy = auth(() => {
  // NextAuth.js handles redirects via its `authorized` callback.
  // Reaching here means the request is permitted to proceed.
  return undefined;
});

export const config = {
  matcher: ["/admin/:path*"],
};
