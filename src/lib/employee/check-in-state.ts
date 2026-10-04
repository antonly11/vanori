import type { WellbeingLevel } from "./wellbeing";
import type { DailyNeedId } from "./daily-needs";
import type { StressCategoryId } from "./stress-categories";
import type { SmallAction } from "./support-plan";
import type { ValueDomainId } from "./values";
import { changeWorkloadDetails, changeWorkloadIssue, createEmptyWorkloadAnswer, type WorkloadAnswer, type WorkloadIssueId } from "./workload-flow";

export type CheckInAnswers = {
  level: WellbeingLevel | null;
  supportCategories: StressCategoryId[];
  reflectionCategories: StressCategoryId[];
  needs: DailyNeedId[];
  reflectionComment: string;
  workload: WorkloadAnswer;
  exploredAreas: StressCategoryId[];
  exploredNeeds: DailyNeedId[];
  domains: Partial<Record<StressCategoryId, ValueDomainId>>;
  skippedValues: StressCategoryId[];
  actions: Record<string, SmallAction | undefined>;
};

export function createCheckInAnswers(level: WellbeingLevel | null = null): CheckInAnswers {
  return { level, supportCategories: [], reflectionCategories: [], needs: [], reflectionComment: "", workload: createEmptyWorkloadAnswer(), exploredAreas: [], exploredNeeds: [], domains: {}, skippedValues: [], actions: {} };
}

type Event =
  | { type: "level"; level: WellbeingLevel }
  | { type: "support-categories" | "reflection-categories"; categories: StressCategoryId[] }
  | { type: "needs"; needs: DailyNeedId[] }
  | { type: "reflection-comment" | "workload-comment"; text: string }
  | { type: "workload-issue"; issue: WorkloadIssueId }
  | { type: "workload-details"; details: string[] }
  | { type: "workload-focus"; detail: string }
  | { type: "skip-workload"; stage: 0 | 1 }
  | { type: "domain"; area: StressCategoryId; domain: ValueDomainId }
  | { type: "skip-value" | "finish-area"; area: StressCategoryId }
  | { type: "finish-need"; need: DailyNeedId }
  | { type: "action"; key: string; action: SmallAction }
  | { type: "clear-reflection" | "clear-needs" | "clear-support" | "restart" };

function resetWorkloadDirection(state: CheckInAnswers, workload: WorkloadAnswer): CheckInAnswers {
  const domains = { ...state.domains };
  delete domains.workload;
  return { ...state, workload, domains, skippedValues: state.skippedValues.filter((area) => area !== "workload") };
}

export function checkInReducer(state: CheckInAnswers, event: Event): CheckInAnswers {
  switch (event.type) {
    case "level": return event.level === state.level ? state : createCheckInAnswers(event.level);
    case "support-categories": return {
      ...state, supportCategories: event.categories, exploredAreas: [], domains: {}, skippedValues: [], actions: {},
      workload: event.categories.includes("workload") ? state.workload : createEmptyWorkloadAnswer(),
    };
    case "reflection-categories": return { ...state, reflectionCategories: event.categories, reflectionComment: event.categories.includes("other") ? state.reflectionComment : "" };
    case "needs": return { ...state, needs: event.needs, exploredNeeds: [] };
    case "reflection-comment": return { ...state, reflectionComment: event.text.slice(0, 200) };
    case "workload-comment": return { ...state, workload: { ...state.workload, comment: event.text.slice(0, 350) } };
    case "workload-issue": return event.issue === state.workload.issue ? state : resetWorkloadDirection(state, changeWorkloadIssue(state.workload, event.issue));
    case "workload-details": return resetWorkloadDirection(state, changeWorkloadDetails(state.workload, event.details));
    case "workload-focus": return state.workload.details.includes(event.detail) ? resetWorkloadDirection(state, { ...state.workload, detail: event.detail }) : state;
    case "skip-workload": return resetWorkloadDirection(state, event.stage === 0 ? createEmptyWorkloadAnswer() : { ...state.workload, detail: null, details: [], comment: "" });
    case "domain": return { ...state, domains: { ...state.domains, [event.area]: event.domain }, skippedValues: state.skippedValues.filter((area) => area !== event.area) };
    case "skip-value": return { ...state, skippedValues: [...new Set([...state.skippedValues, event.area])] };
    case "finish-area": return { ...state, exploredAreas: [...new Set([...state.exploredAreas, event.area])] };
    case "finish-need": return { ...state, exploredNeeds: [...new Set([...state.exploredNeeds, event.need])] };
    case "action": return { ...state, actions: { ...state.actions, [event.key]: event.action } };
    case "clear-reflection": return { ...state, reflectionCategories: [], reflectionComment: "" };
    case "clear-needs": return { ...state, needs: [], exploredNeeds: [] };
    case "clear-support": return { ...state, supportCategories: [], workload: createEmptyWorkloadAnswer(), exploredAreas: [], domains: {}, skippedValues: [], actions: {} };
    case "restart": return createCheckInAnswers();
  }
}

export function getActionContext(area: StressCategoryId | null, workload: WorkloadAnswer, domain: ValueDomainId | null, need: DailyNeedId | null = null): string {
  return [area ?? "daily", area === "workload" ? workload.issue ?? "open" : "", area === "workload" ? workload.detail ?? "general" : "", domain ?? "none", need ?? ""].join(":");
}
