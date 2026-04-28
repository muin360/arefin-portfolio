import { PortableText as PT, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

type CodeBlockValue = { language?: string; code?: string };

type ImageValue = {
  asset?: { _ref: string };
  alt?: string;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="display text-2xl md:text-3xl mt-12 mb-5 tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="display text-xl md:text-2xl mt-10 mb-4 tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-7 border-l-2 border-foreground/40 pl-5 italic text-foreground/85">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-5 text-foreground/85 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 space-y-3 pl-5 list-disc marker:text-muted text-foreground/85 leading-relaxed">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 space-y-3 pl-5 list-decimal marker:text-muted text-foreground/85 leading-relaxed">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="link-underline text-foreground"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1600).url();
      return (
        <figure className="my-8">
          <Image
            src={src}
            alt={value.alt ?? ""}
            width={1600}
            height={900}
            sizes="(max-width: 768px) 100vw, 768px"
            className="rounded-2xl border border-line"
          />
          {value.alt ? (
            <figcaption className="mt-3 text-xs mono uppercase tracking-[0.14em] text-muted">
              {value.alt}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    codeBlock: ({ value }: { value: CodeBlockValue }) => (
      <pre className="my-7 overflow-x-auto rounded-2xl border border-line bg-foreground/[0.04] p-5 text-sm leading-relaxed">
        <code className="font-mono">{value?.code}</code>
      </pre>
    ),
  },
};

export function PortableText({ value }: { value: PortableTextBlock[] | null | undefined }) {
  if (!value || value.length === 0) return null;
  return <PT value={value} components={components} />;
}
