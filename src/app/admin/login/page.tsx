import type { Metadata } from "next";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/admin/Button";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to Arefin Mueen Admin Panel",
  robots: { index: false, follow: false },
};

function GitHubSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = Boolean(params?.error);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo / Title */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/20 text-violet-400 mb-4 border border-violet-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Arefin Mueen
            </h1>
            <p className="text-sm text-slate-400 mt-1 font-mono">
              [ Personal Admin Panel ]
            </p>
          </div>

          {hasError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
              Invalid credentials or unauthorized access. Please verify your passcode.
            </div>
          )}

          {/* Passcode Login Form */}
          <form
            action={async (formData: FormData) => {
              "use server";
              const password = formData.get("password") as string;
              await signIn("credentials", {
                password,
                redirectTo: "/admin",
              });
            }}
            className="space-y-4 mb-6"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2"
              >
                Admin Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter admin passcode"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25"
            >
              Sign In to Admin
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-3 items-center mb-6">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-mono uppercase text-slate-500">
              Or sign in with OAuth
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {/* GitHub Login */}
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/admin" });
              }}
            >
              <Button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl border border-slate-700/60 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <GitHubSVG className="w-4 h-4" />
                Sign in with GitHub
              </Button>
            </form>

            {/* Google Login */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/admin" });
              }}
            >
              <Button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl border border-slate-700/60 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                Sign in with Google
              </Button>
            </form>
          </div>

          {/* Footer note */}
          <p className="text-slate-500 text-[11px] text-center mt-6">
            Works across local development and any deployment domain.
          </p>
        </div>
      </div>
    </div>
  );
}
