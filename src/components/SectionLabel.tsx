/**
 * SectionLabel (v2).
 *
 * The bracketed monospace label that introduces every section, e.g.
 * `[  02  ]  SERVICES`. Index lives in a separate span so we can give
 * it a colored accent (`--a2`) without affecting the surrounding text.
 * The thin rule fills the remaining horizontal space — section labels
 * always live at the top of a content band, never inline.
 */
type SectionLabelProps = {
  /** Two-digit index. Rendered inside square brackets in accent color. */
  index: string;
  /** Visible label text. Auto-uppercased via CSS. */
  children: React.ReactNode;
  /** Optional supporting copy rendered next to the label rule. */
  hint?: string;
  className?: string;
};

export default function SectionLabel({
  index,
  children,
  hint,
  className = "",
}: SectionLabelProps) {
  return (
    <div className={`v2-section-label ${className}`}>
      <span aria-hidden="true">[</span>
      <span className="v2-section-label__index">{index}</span>
      <span aria-hidden="true">]</span>
      <span className="v2-section-label__text">{children}</span>
      <span className="v2-section-label__rule" aria-hidden="true" />
      {hint && <span className="v2-section-label__hint">{hint}</span>}
    </div>
  );
}
