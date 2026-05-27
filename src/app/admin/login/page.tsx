import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Github, Mail, AlertCircle } from "lucide-react";
import OAuthButtons from "@/components/admin/OAuthButtons";

export const metadata = {
  title: "Admin Login",
  description: "Tensorix Admin Portal — Login with GitHub or Google",
};

export default async function LoginPage() {
  const session = await auth();

  // If already authenticated, redirect to dashboard
  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-violet-600/20 border border-violet-500/30 mb-4">
            <span className="text-2xl font-bold text-violet-400">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Tensorix Admin</h1>
          <p className="text-slate-400">Manage your portfolio and content</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl">
          <div className="space-y-4">
            {/* Info Box */}
            <div className="flex gap-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-200">
                Login with GitHub or Google to access the admin panel.
              </p>
            </div>

            <OAuthButtons />

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800/50 text-slate-400">Or</span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <Github className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-semibold text-white">GitHub</h3>
                  <p className="text-xs text-slate-400">
                    Quick login with your GitHub account
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Google</h3>
                  <p className="text-xs text-slate-400">
                    Sign in with your Google account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>
            Back to{" "}
            <Link href="/" className="text-violet-400 hover:text-violet-300">
              home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
