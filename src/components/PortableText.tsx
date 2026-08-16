import MarkdownContent from "./MarkdownContent";

export function PortableText({ value }: { value: unknown }) {
  if (!value) return null;
  if (typeof value === "string") {
    return <MarkdownContent content={value} />;
  }
  return null;
}

export default PortableText;
