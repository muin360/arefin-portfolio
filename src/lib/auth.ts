import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import * as Sentry from "@sentry/nextjs";

const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      // Protected admin routes
      if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        // Allow if authenticated and email is in admin list
        return (
          !!auth?.user?.email &&
          adminEmails.includes(auth.user.email)
        );
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.isAdmin = adminEmails.includes(user.email);
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.email = token.email as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      try {
        // Check if user email is in admin list
        if (!user.email || !adminEmails.includes(user.email)) {
          Sentry.captureMessage(
            `Unauthorized login attempt: ${user.email} via ${account?.provider}`,
            "warning",
          );
          return false;
        }
        return true;
      } catch (err) {
        Sentry.captureException(err);
        return false;
      }
    },
  },
});
