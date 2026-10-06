"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = { eyebrow: string; children: ReactNode; description?: string; centered?: boolean; focusKey?: unknown; navigation?: ReactNode };

export function PageHeading({ eyebrow, children, description, centered = false, focusKey, navigation }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [focusKey]);
  return <div className={`mb-6 ${centered ? "sm:mb-8 sm:text-center" : ""}`}>
    <p className="mb-3 text-caption font-medium tracking-[0.18em] text-accent">{eyebrow}</p>
    <h1 ref={heading} tabIndex={-1} className={`ui-page-heading ${centered ? "sm:mx-auto" : ""}`}>{children}</h1>
    {description && <p className="mt-3 max-w-xl text-body text-muted">{description}</p>}
    {navigation}
  </div>;
}
