import type { WellbeingLevel } from "./wellbeing";
import type { StressCategoryId } from "./stress-categories";

export type FollowUpStep = "support" | "neutral" | "positive";
export type CheckInStep = "wellbeing" | FollowUpStep | "explore" | "daily-focus" | "daily-support" | "reflection" | "support-focus" | "workload-detail-focus" | "workload-situation" | "workload-detail" | "value-connection" | "support-preview" | "workload-practice" | "scenario-situation" | "scenario-detail" | "scenario-detail-focus" | "scenario-practice" | "done";

const followUpByLevel = {
  "very-low": "support",
  low: "support",
  neutral: "neutral",
  good: "positive",
  "very-good": "positive",
} as const satisfies Record<WellbeingLevel, FollowUpStep>;

export function getFollowUpStep(level: WellbeingLevel): FollowUpStep {
  return followUpByLevel[level];
}

export function getSupportStep(categories: readonly StressCategoryId[]): "support-focus" | "workload-situation" | "scenario-situation" | "value-connection" {
  if (categories.length > 1) return "support-focus";
  return categories[0] === "workload" ? "workload-situation" : categories.length === 1 ? "scenario-situation" : "value-connection";
}

export function getPracticeStep(area: StressCategoryId | null): "workload-practice" | "scenario-practice" | null {
  return area === "workload" ? "workload-practice" : area ? "scenario-practice" : null;
}

export function getCheckInHeading(step: CheckInStep, level: WellbeingLevel | null): string {
  switch (step) {
    case "wellbeing": return "Hur känns det på jobbet idag?";
    case "positive": return "Skönt att dagen känns bra.";
    case "neutral": return "Vill du utforska din dag?";
    case "explore": return "Vad skulle hjälpa dig nu?";
    case "daily-focus": return "Vad vill du börja med?";
    case "daily-support": return "En liten hjälp för din dag";
    case "reflection": return "Vad har fungerat bra idag?";
    case "support-focus": return "Vad vill du börja med?";
    case "scenario-detail-focus":
    case "workload-detail-focus": return "Vad skulle göra störst skillnad att börja med?";
    case "scenario-situation":
    case "workload-situation": return "Vad känns svårast just nu?";
    case "scenario-detail":
    case "workload-detail": return "Lite mer om din situation";
    case "value-connection": return "Ett steg som kan hjälpa";
    case "support-preview": return "Ett möjligt nästa steg";
    case "scenario-practice":
    case "workload-practice": return "Ta ett litet steg";
    case "done": return "Klart för idag.";
    case "support":
      if (level === "good" || level === "very-good") return "Vad vill du ha stöd med?";
      if (level === "neutral") return "Vad vill du ha stöd med?";
      return "Vad känns svårt på jobbet idag?";
  }
}
