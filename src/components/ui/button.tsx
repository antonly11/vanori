import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = Omit<ComponentPropsWithoutRef<"button">, "className"> & {
  variant?: "primary" | "secondary" | "text";
  fullWidth?: boolean;
  showArrow?: boolean;
};

export function Button({ variant = "secondary", fullWidth = false, showArrow = false, type = "button", children, ...props }: ButtonProps) {
  return <button {...props} type={type} className={`ui-button ui-button-${variant} ${fullWidth ? "w-full" : ""}`}>
    <span className="min-w-0 break-words">{children}</span>
    {showArrow && <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5 shrink-0"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>}
  </button>;
}
