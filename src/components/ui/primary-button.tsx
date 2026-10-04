import type { ComponentPropsWithoutRef } from "react";

type PrimaryButtonProps = Omit<ComponentPropsWithoutRef<"button">, "className"> & { showArrow?: boolean };

export function PrimaryButton({ children, type = "submit", showArrow = true, ...props }: PrimaryButtonProps) {
  return (
    <button {...props} type={type} className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-accent px-5 py-3 text-base font-semibold text-accent-ink motion-safe:transition-colors hover:bg-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-outline disabled:text-foreground">
      <span className="min-w-0 break-words">{children}</span>
      {showArrow && <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>}
    </button>
  );
}
