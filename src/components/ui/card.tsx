import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLElement> & { as?: "div" | "section" | "aside"; variant?: "surface" | "inset" | "quiet" };

export function Card({ as: Element = "div", variant = "surface", className = "", ...props }: Props) {
  return <Element {...props} className={`ui-card ui-card-${variant} ${className}`} />;
}
