import Link from "next/link";
import Script from "next/script";
import { SITE_URL } from "@/lib/site-url";
import { safeJsonLd } from "@/lib/json-ld";

type Crumb = {
  label: string;
  href?: string;
};

// Renders a visual breadcrumb trail and emits BreadcrumbList JSON-LD for rich results
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 select-none"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={`${item.label}-${i}`} className="flex items-center gap-2">
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-violet-300 font-semibold" aria-current={last ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
                {!last && <span className="text-white/20" aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
