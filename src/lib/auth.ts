import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const adminGithubUsers = (process.env.ADMIN_GITHUB_USERS || "").split(",").filter(Boolean);
const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean);

function isAdmin(email?: string, githubLogin?: string): boolean {
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
        const isUserAdmin = isAdmin(user?.email, (user as any)?.login);
        return isUserAdmin;
      }

      return !!auth;
    },
    jwt({ token, profile }) {
      if (profile) {
        token.login = (profile as any).login;
        token.isAdmin = isAdmin((profile as any)?.email, (profile as any)?.login);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).login = token.login;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
