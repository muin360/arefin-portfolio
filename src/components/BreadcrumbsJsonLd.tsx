import Script from "next/script";
import { SITE_URL } from "@/lib/site-url";

type Crumb = { label: string; href: string };

// Emits BreadcrumbList JSON-LD only — no visible UI. Useful when the design
// doesn't have room for a visual breadcrumb but you still want the SEO benefit.
export default function BreadcrumbsJsonLd({
  items,
  id,
}: {
  items: Crumb[];
  id: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <Script id={`bc-${id}`} type="application/ld+json">
      {JSON.stringify(jsonLd)}
    </Script>
  );
}
