import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Arefin Mueen Personal Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      {children}
    </div>
  );
}
