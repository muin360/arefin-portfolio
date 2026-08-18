import Script from "next/script";
import { SITE_URL } from "@/lib/site-url";
import { safeJsonLd } from "@/lib/json-ld";

type Crumb = { label: string; href: string };

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
    <Script
      id={`bc-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
