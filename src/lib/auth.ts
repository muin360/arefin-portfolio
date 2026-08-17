import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

interface AuthProfile {
  login?: string;
  email?: string;
  isAdmin?: boolean;
}

/**
 * Constant-time passcode comparison to eliminate timing attacks.
 * Pure implementation compatible with both Node.js and Next.js Edge Runtime.
 */
export function timingSafePasscodeCheck(provided?: string, expected?: string): boolean {
  if (!provided || !expected) return false;
  if (typeof provided !== "string" || typeof expected !== "string") return false;

  const a = provided;
  const b = expected;
  let mismatch = a.length === b.length ? 0 : 1;

  for (let i = 0; i < a.length; i++) {
    const charA = a.charCodeAt(i);
    const charB = b.charCodeAt(i % b.length);
    mismatch |= charA ^ charB;
  }

  return mismatch === 0 && a.length === b.length;
}

export function isAdmin(email?: string | null, githubLogin?: string | null): boolean {
  const adminEmails = (
    process.env.ADMIN_EMAILS || "hmmuhammadmuin50@gmail.com,arefinmueen360@gmail.com"
  )
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
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  basePath: "/api/auth",
  trustHost: true,
  providers: [
    Credentials({
      name: "Passcode",
      credentials: {
        password: { label: "Passcode", type: "password" },
      },
      async authorize(credentials) {
        const password = credentials?.password as string | undefined;
        const validPass = process.env.ADMIN_PASSWORD || process.env.ADMIN_SECRET;

        // Strict constant-time passcode check
        if (validPass && password && timingSafePasscodeCheck(password, validPass)) {
          return {
            id: "admin-user",
            name: "Arefin Mueen",
            email: process.env.ADMIN_EMAILS?.split(",")[0]?.trim() || "hmmuhammadmuin50@gmail.com",
            login: process.env.ADMIN_GITHUB_USERS?.split(",")[0]?.trim() || "muin360",
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
      const pathname = request.nextUrl.pathname;
      const isLoginPath = pathname === "/admin/login";
      const isAdminPath = pathname.startsWith("/admin");

      if (isLoginPath) return true;

      if (isAdminPath) {
        if (!auth || !auth.user) return false;
        const user = auth.user;
        if (user.isAdmin) return true;
        const isUserAdmin = isAdmin(user.email, user.login);
        return isUserAdmin;
      }

      return !!auth;
    },
    jwt({ token, user, profile }) {
      if (user) {
        const u = user as { id?: string; email?: string; login?: string; isAdmin?: boolean };
        token.id = u.id ?? token.id;
        token.login = u.login ?? token.login ?? null;
        token.email = u.email ?? token.email ?? null;
        token.isAdmin = Boolean(u.isAdmin) || isAdmin(token.email, token.login);
      }
      if (profile) {
        const p = profile as AuthProfile;
        if (p.login) token.login = p.login;
        if (p.email) token.email = p.email;
        token.isAdmin = isAdmin(token.email, token.login);
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
