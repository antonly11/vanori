"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ValuesHeading({ eyebrow, children, description }: { eyebrow: string; children: ReactNode; description?: string }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <div className="mb-6">
      <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent">{eyebrow}</p>
      <h1 ref={headingRef} tabIndex={-1} className="text-[2rem] leading-[1.15] font-medium tracking-[-0.045em] outline-none sm:text-[2.75rem]">{children}</h1>
      {description && <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{description}</p>}
    </div>
  );
}
