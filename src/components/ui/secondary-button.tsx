import type { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"button">, "className"> & { fullWidth?: boolean };

export function TextButton({ fullWidth, type = "button", ...props }: Props) {
  return <button {...props} type={type} className={`min-h-11 rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${fullWidth ? "mt-2 w-full" : ""}`} />;
}

export function SecondaryButton({ type = "button", ...props }: Props) {
  return <button {...props} type={type} className="flex min-h-12 w-full items-center justify-center rounded-xl border border-outline px-4 py-3 text-sm font-medium hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" />;
}
