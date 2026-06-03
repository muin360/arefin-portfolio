"use client";

import { signIn } from "next-auth/react";
import { Mail } from "lucide-react";
import { useState } from "react";

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

export default function OAuthButtons() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    setLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/admin/dashboard" });
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
            <GitHubSVG className="w-5 h-5" />
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
