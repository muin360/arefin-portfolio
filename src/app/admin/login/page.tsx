import type { Metadata } from "next";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/admin/Button";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to Tensorix Admin Panel",
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

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Logo / Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Tensorix</h1>
            <p className="text-slate-400">Admin Panel</p>
          </div>

          {/* Description */}
          <p className="text-slate-400 text-center mb-8 text-sm">
            Sign in with GitHub or Google to access the admin dashboard
          </p>

          {/* Login Buttons */}
          <div className="space-y-4">
            {/* GitHub Login */}
            <form
              action={async () => {
                "use server";
                await signIn("github", { redirectTo: "/admin" });
              }}
            >
              <Button
                type="submit"
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <GitHubSVG className="w-5 h-5" />
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Sign in with Google
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-slate-500 text-xs text-center mt-8">
            Only authorized users can access this panel.
          </p>
        </div>
      </div>
    </div>
  );
}
