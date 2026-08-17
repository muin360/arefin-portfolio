import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import ScrollToTop from "@/components/ScrollToTop";
import CursorRing from "@/components/CursorRing";
import PageLoader from "@/components/PageLoader";
import PageTransition from "@/components/transitions/PageTransition";
import MobileStickyBar from "@/components/MobileStickyBar";
import TrackPageView from "@/components/analytics/TrackPageView";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-foreground focus:text-background focus:px-3 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
      <TrackPageView />
      <PageLoader />
      <PageTransition />
      <CursorRing />
      <Navbar />
      <main id="main" className="flex-1 min-h-screen pt-[calc(var(--nav-height)+env(safe-area-inset-top,0px))]">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      <MobileStickyBar />
      <ScrollToTop />
    </>
  );
}
