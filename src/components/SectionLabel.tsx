/**
 * SectionLabel — Tensorix v3 section header label
 *
 * Renders the bracketed monospace label used to introduce every section,
 * e.g. `[ 02 ] · SERVICES`. Built as a static server-side component so it
 * stays in the static HTML — no client JS needed.
 *
 * Example:
 *   <SectionLabel index="02">Services</SectionLabel>
 */
type SectionLabelProps = {
  /** Two-digit index. Rendered inside square brackets in accent color. */
  index: string;
  /** Visible label text. Auto-uppercased via CSS. */
  children: React.ReactNode;
  className?: string;
};

export default function SectionLabel({
  index,
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <p className={`section-label ${className}`}>
      <span aria-hidden="true">[</span>
      <span className="section-label__index">{index}</span>
      <span aria-hidden="true">]</span>
      <span className="section-label__rule" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
