import type { ReactNode } from "react";
import { PageHeading } from "@/components/ui/page-heading";

export function ValuesHeading({ eyebrow, children, description }: { eyebrow: string; children: ReactNode; description?: string }) {
  return <PageHeading eyebrow={eyebrow} description={description}>{children}</PageHeading>;
}
