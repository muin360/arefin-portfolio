import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type AdminUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
};

export default function AdminNav({ user }: { user: AdminUser }) {
  return (
    <nav className="sticky top-0 z-40 bg-slate-800/50 border-b border-slate-700/50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/admin/dashboard" className="font-bold text-lg text-white">
          ⚡ Tensorix Admin
        </Link>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30">
            {user?.image && (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="p-2 rounded-lg hover:bg-red-600/20 text-slate-400 hover:text-red-400 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
