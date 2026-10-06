import type { ComponentPropsWithoutRef } from "react";
import { Button } from "./button";

type Props = Omit<ComponentPropsWithoutRef<"button">, "className"> & { showArrow?: boolean };

export function PrimaryButton({ type = "submit", showArrow = true, ...props }: Props) {
  return <Button {...props} type={type} variant="primary" fullWidth showArrow={showArrow} />;
}
