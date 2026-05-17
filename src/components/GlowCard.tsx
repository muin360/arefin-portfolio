import { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * GlowCard — Tensorix v3 card surface
 *
 * Dark surface with a hairline border. On hover, it lifts 2px and gains a
 * faint accent ring + outer glow. Pure CSS — no client JS required, so it
 * can be rendered server-side.
 *
 * The polymorphic `as` prop lets callers render as <article>, <a>, <li>,
 * <Link>, etc. without losing the styling. Keep this lightweight — heavier
 * interactive variants should compose this with their own JSX.
 */
type GlowCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export default function GlowCard<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...rest
}: GlowCardProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component className={`glow-card ${className}`} {...rest}>
      {children}
    </Component>
  );
}
