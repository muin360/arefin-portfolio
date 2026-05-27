import { auth } from "@/lib/auth";

export const middleware = auth((req) => {
  // Protected admin routes
  if (req.nextUrl.pathname.startsWith("/admin") && 
      req.nextUrl.pathname !== "/admin/login") {
    
    // Auth.js automatically handles redirects via the authorized callback
    // If we get here, the user is already authenticated
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
