"use client";

import { signIn } from "next-auth/react";
import { Github, Mail } from "lucide-react";
import { useState } from "react";

export default function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setLoading(provider);
    try {
      await signIn(provider, { redirectTo: "/admin/dashboard" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleSignIn("github")}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "github" ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </>
        )}
      </button>
      <button
        onClick={() => handleSignIn("google")}
        disabled={loading !== null}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "google" ? (
          <>
            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <Mail className="w-5 h-5" />
            <span>Continue with Google</span>
          </>
        )}
      </button>
    </div>
  );
}
