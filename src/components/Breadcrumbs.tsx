import Link from "next/link";
import Script from "next/script";
import { SITE_URL } from "@/lib/site-url";

type Crumb = {
  label: string;
  href?: string;
};

// Renders a visual breadcrumb trail and emits BreadcrumbList JSON-LD for
// rich-result eligibility in Google. Last item is the current page (no link).
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <Script
        id={`breadcrumbs-jsonld-${items.map((i) => i.label).join("-")}`}
        type="application/ld+json"
      >
        {JSON.stringify(jsonLd)}
      </Script>
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className="flex items-center gap-2">
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined}>{item.label}</span>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
