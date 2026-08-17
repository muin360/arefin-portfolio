import type { Metadata } from "next";
import { signIn } from "@/lib/auth";
import { Lock, Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Passcode Login · Portfolio OS",
  description: "Sign in to Arefin Mueen Portfolio OS",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  let errorMessage: string | null = null;
  if (params?.error) {
    const err = params.error.toLowerCase();
    if (err === "credentialssignin") {
      errorMessage = "Invalid passcode. Please verify your admin secret and try again.";
    } else {
      errorMessage = "Authentication failed. Please verify your passcode.";
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#07090e] px-4 py-12 text-slate-100 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0f111a] border border-[#1e2433] rounded-3xl p-8 shadow-2xl">
          {/* Logo / Title */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-400 mb-3 border border-violet-500/20 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h1 className="text-xl font-bold text-white tracking-tight">Portfolio OS</h1>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-[#6b7280] font-mono">
              Arefin Mueen · Secure Control Center
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium animate-in fade-in duration-150">
              {errorMessage}
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
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-mono uppercase tracking-wider text-[#9ca3af] mb-2 font-semibold"
              >
                Admin Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter passcode..."
                  className="w-full bg-[#141a29] border border-[#1e2433] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md shadow-violet-600/25"
            >
              Sign In to Portfolio OS
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer note */}
          <p className="text-[#6b7280] text-[11px] text-center mt-6 font-mono">
            Encrypted session protected by NextAuth JWT
          </p>
        </div>
      </div>
    </div>
  );
}
