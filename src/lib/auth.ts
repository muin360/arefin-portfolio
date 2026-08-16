import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

interface AuthProfile {
  login?: string;
  email?: string;
}

export function isAdmin(email?: string | null, githubLogin?: string | null): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const adminGithubUsers = (process.env.ADMIN_GITHUB_USERS || "").split(",").map((s) => s.trim()).filter(Boolean);

  if (email && adminEmails.includes(email)) return true;
  if (githubLogin && adminGithubUsers.includes(githubLogin)) return true;
  return false;
}

const config = {
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
    async authorized({ auth, request }) {
      const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPath = request.nextUrl.pathname === "/admin/login";

      if (isLoginPath) return true;

      if (isAdminPath && auth) {
        const user = auth.user;
        const isUserAdmin = isAdmin(user?.email, user?.login);
        return isUserAdmin;
      }

      return !!auth;
    },
    jwt({ token, profile }) {
      if (profile) {
        const p = profile as AuthProfile;
        token.login = p.login ?? null;
        token.isAdmin = isAdmin(p.email, p.login);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.login = typeof token.login === "string" ? token.login : null;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);

