import type { WellbeingLevel } from "@/lib/employee/wellbeing";

export const wellbeingLevels = [
  { value: "very-low", label: "Mycket tungt", mouth: "M10 23 Q16 15 22 23" },
  { value: "low", label: "Tungt", mouth: "M10 22 Q16 18 22 22" },
  { value: "neutral", label: "Okej", mouth: "M10 21 H22" },
  { value: "good", label: "Bra", mouth: "M10 20 Q16 25 22 20" },
  { value: "very-good", label: "Mycket bra", mouth: "M9 19 Q16 29 23 19" },
] as const satisfies readonly { value: WellbeingLevel; label: string; mouth: string }[];

export type { WellbeingLevel } from "@/lib/employee/wellbeing";
