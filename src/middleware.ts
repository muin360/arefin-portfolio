import { auth } from "@/lib/auth";

/**
 * NextAuth middleware for protecting admin routes.
 * Runs on the edge and checks authentication status.
 */
export const middleware = auth((request) => {
  // NextAuth.js automatically handles redirects
  // If we reach here, the user is authenticated
  return undefined;
});

export const config = {
  matcher: ["/admin/:path*"],
};
