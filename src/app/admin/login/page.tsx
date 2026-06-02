import type { Metadata } from "next";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/admin/Button";
import { Github, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to Tensorix Admin Panel",
};

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
                <Github className="w-5 h-5" />
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
