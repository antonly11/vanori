import type { ComponentPropsWithoutRef } from "react";
import { Button } from "./button";

type Props = Omit<ComponentPropsWithoutRef<"button">, "className"> & { fullWidth?: boolean };

export function TextButton({ fullWidth, ...props }: Props) {
  return <span className={fullWidth ? "mt-2 block" : "inline-block"}><Button {...props} variant="text" fullWidth={fullWidth} /></span>;
}
export function SecondaryButton(props: Props) {
  return <Button {...props} variant="secondary" fullWidth />;
}
