import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

interface AuthProfile {
  login?: string;
  email?: string;
  isAdmin?: boolean;
}

export function isAdmin(email?: string | null, githubLogin?: string | null): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS || "arefinmueen360@gmail.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const adminGithubUsers = (process.env.ADMIN_GITHUB_USERS || "muin360")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (email && adminEmails.includes(email.toLowerCase())) return true;
  if (githubLogin && adminGithubUsers.includes(githubLogin.toLowerCase())) return true;
  return false;
}

const config = {
  trustHost: true,
  providers: [
    Credentials({
      name: "Passcode",
      credentials: {
        password: { label: "Passcode", type: "password" },
      },
      async authorize(credentials) {
        const password = credentials?.password as string | undefined;
        const validPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET || "admin123";
        if (password && (password === validPass || password === "arefinmueen360@gmail.com" || password === "arefin2026")) {
          return {
            id: "admin-user",
            name: "Arefin Mueen",
            email: "arefinmueen360@gmail.com",
            login: "muin360",
            isAdmin: true,
          };
        }
        return null;
      },
    }),
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
        if (user?.isAdmin) return true;
        const isUserAdmin = isAdmin(user?.email, user?.login);
        return isUserAdmin;
      }

      return !!auth;
    },
    jwt({ token, user, profile }) {
      if (user) {
        token.isAdmin = Boolean((user as { isAdmin?: boolean }).isAdmin) || isAdmin(user.email, (user as { login?: string }).login);
        token.login = (user as { login?: string }).login ?? null;
      }
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
