import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Guard for admin server-component pages.
 *
 * Verifies the session and redirects to `/admin/login` when the visitor
 * is unauthenticated or lacks the `isAdmin` flag.  Returns the validated
 * session so callers can forward `session.user` to client components.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }
  return session;
}
