import type { CheckInStep } from "./check-in-flow";
import type { DailyNeedId } from "./daily-needs";
import type { StressCategoryId } from "./stress-categories";
import type { SmallAction } from "./support-plan";

export type DayScreen = {
  view: "day";
  step: CheckInStep;
  area: StressCategoryId | null;
  need: DailyNeedId | null;
  action?: SmallAction;
};
export type ExperienceScreen =
  | { view: "introduction" | "values" | "actions" }
  | DayScreen
  | { view: "setup"; screen: number; editing: boolean; returnTo: DayScreen | { view: "values" | "actions" } };

export type EmployeeMenuItem = "day" | "values" | "actions";

export function getActiveMenu(screen: ExperienceScreen): EmployeeMenuItem {
  if (screen.view === "setup") return screen.returnTo.view === "day" ? "values" : screen.returnTo.view;
  return screen.view === "introduction" ? "values" : screen.view;
}

export type ScreenHistory = {
  entries: { id: number; screen: ExperienceScreen }[];
  index: number;
  nextId: number;
};
export type HistoryMarker = { session: string; entry: number };

export function createDayScreen(): DayScreen {
  return { view: "day", step: "wellbeing", area: null, need: null };
}

export function createScreenHistory(screen: ExperienceScreen = createDayScreen()): ScreenHistory {
  return { entries: [{ id: 0, screen }], index: 0, nextId: 1 };
}

export function appendScreen(history: ScreenHistory, screen: ExperienceScreen): ScreenHistory {
  return {
    entries: [...history.entries.slice(0, history.index + 1), { id: history.nextId, screen }],
    index: history.index + 1,
    nextId: history.nextId + 1,
  };
}

export function restoreScreen(history: ScreenHistory, entry: number): ScreenHistory {
  const index = history.entries.findIndex((item) => item.id === entry);
  return index < 0 ? history : { ...history, index };
}

// Only this opaque marker enters browser history. Answers, routes and custom
// actions stay in React memory; neither URLs nor browser history contain them.
export function readHistoryMarker(state: unknown): HistoryMarker | null {
  if (!state || typeof state !== "object" || !("vanori" in state)) return null;
  const marker = state.vanori;
  if (!marker || typeof marker !== "object" || !("session" in marker) || !("entry" in marker)) return null;
  return typeof marker.session === "string" && typeof marker.entry === "number" && Number.isSafeInteger(marker.entry)
    ? { session: marker.session, entry: marker.entry }
    : null;
}
