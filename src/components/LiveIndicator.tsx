/**
 * LiveIndicator — green pulsing dot + label, used as a system-status pill
 *
 * Used in the nav, hero, and footer to signal "I am alive and accepting
 * work" with a quiet Bloomberg-terminal energy. Pure CSS animation — the
 * dot keeps pulsing without any JS. The animation is paused automatically
 * for prefers-reduced-motion via the global stylesheet rules.
 */
type LiveIndicatorProps = {
  /** Visible label text. Auto-uppercased + mono-spaced via CSS. */
  children?: React.ReactNode;
  className?: string;
};

export default function LiveIndicator({
  children = "Live",
  className = "",
}: LiveIndicatorProps) {
  return (
    <span className={`live-indicator ${className}`} aria-live="polite">
      <span className="live-indicator__dot" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}
