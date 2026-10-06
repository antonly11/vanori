import { changeScenarioIssue, changeScenarioDetails, createScenarioAnswer, type ScenarioAnswer } from "./scenario-flow";
import type { ScenarioArea } from "./scenario-content";
import type { WellbeingLevel } from "./wellbeing";
import type { DailyNeedId } from "./daily-needs";
import type { StressCategoryId } from "./stress-categories";
import type { SmallAction } from "./support-plan";
import type { ValueDomainId } from "./values";
import type { PracticeProgress } from "./workload-practice";
import { changeWorkloadDetails, changeWorkloadIssue, createEmptyWorkloadAnswer, type WorkloadAnswer, type WorkloadIssueId } from "./workload-flow";

export type CheckInAnswers = {
  level: WellbeingLevel | null;
  supportCategories: StressCategoryId[];
  reflectionCategories: StressCategoryId[];
  needs: DailyNeedId[];
  reflectionComment: string;
  workload: WorkloadAnswer;
  scenarios: Partial<Record<ScenarioArea, ScenarioAnswer>>;
  exploredAreas: StressCategoryId[];
  exploredNeeds: DailyNeedId[];
  domains: Partial<Record<StressCategoryId, ValueDomainId>>;
  skippedValues: StressCategoryId[];
  actions: Record<string, SmallAction | undefined>;
  practice: Record<string, PracticeProgress | undefined>;
};

export function createCheckInAnswers(level: WellbeingLevel | null = null): CheckInAnswers {
  return { level, supportCategories: [], reflectionCategories: [], needs: [], reflectionComment: "", workload: createEmptyWorkloadAnswer(), scenarios: {}, exploredAreas: [], exploredNeeds: [], domains: {}, skippedValues: [], actions: {}, practice: {} };
}

type Event =
  | { type: "scenario-issue"; area: ScenarioArea; issue: string }
  | { type: "scenario-details"; area: ScenarioArea; details: string[] }
  | { type: "scenario-focus"; area: ScenarioArea; detail: string }
  | { type: "scenario-comment"; area: ScenarioArea; text: string }
  | { type: "skip-scenario"; area: ScenarioArea; stage: 0 | 1 }
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
  | { type: "practice"; key: string; progress: PracticeProgress }
  | { type: "clear-reflection" | "clear-needs" | "clear-support" | "restart" };

function resetWorkloadDirection(state: CheckInAnswers, workload: WorkloadAnswer): CheckInAnswers {
  const domains = { ...state.domains };
  delete domains.workload;
  return { ...state, workload, domains, skippedValues: state.skippedValues.filter((area) => area !== "workload") };
}

function resetScenarioDirection(state: CheckInAnswers, area: ScenarioArea, answer: ScenarioAnswer): CheckInAnswers {
  const domains = { ...state.domains }; delete domains[area];
  return { ...state, scenarios: { ...state.scenarios, [area]: answer }, domains, skippedValues: state.skippedValues.filter((id) => id !== area) };
}

export function checkInReducer(state: CheckInAnswers, event: Event): CheckInAnswers {
  switch (event.type) {
    case "level": return event.level === state.level ? state : createCheckInAnswers(event.level);
    case "scenario-issue": {
      const current = state.scenarios[event.area] ?? createScenarioAnswer();
      const next = changeScenarioIssue(event.area, current, event.issue);
      return next === current ? state : resetScenarioDirection(state, event.area, next);
    }
    case "scenario-details": return resetScenarioDirection(state, event.area, changeScenarioDetails(event.area, state.scenarios[event.area] ?? createScenarioAnswer(), event.details));
    case "scenario-focus": {
      const current = state.scenarios[event.area] ?? createScenarioAnswer();
      return current.details.includes(event.detail) ? resetScenarioDirection(state, event.area, { ...current, detail: event.detail }) : state;
    }
    case "scenario-comment": return { ...state, scenarios: { ...state.scenarios, [event.area]: { ...(state.scenarios[event.area] ?? createScenarioAnswer()), comment: event.text.slice(0, 350) } } };
    case "skip-scenario": return resetScenarioDirection(state, event.area, event.stage === 0 ? createScenarioAnswer() : { ...(state.scenarios[event.area] ?? createScenarioAnswer()), details: [], detail: null, comment: "" });
    case "support-categories": return {
      ...state, supportCategories: event.categories, exploredAreas: [], domains: {}, skippedValues: [], actions: {}, practice: {},
      scenarios: Object.fromEntries(Object.entries(state.scenarios).filter(([area]) => event.categories.some((id) => id === area))),
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
    case "practice": return { ...state, practice: { ...state.practice, [event.key]: event.progress } };
    case "clear-reflection": return { ...state, reflectionCategories: [], reflectionComment: "" };
    case "clear-needs": return { ...state, needs: [], exploredNeeds: [] };
    case "clear-support": return { ...state, supportCategories: [], workload: createEmptyWorkloadAnswer(), scenarios: {}, exploredAreas: [], domains: {}, skippedValues: [], actions: {}, practice: {} };
    case "restart": return createCheckInAnswers();
  }
}

export function getActionContext(area: StressCategoryId | null, workload: WorkloadAnswer, domain: ValueDomainId | null, need: DailyNeedId | null = null, scenario?: ScenarioAnswer): string {
  return [area ?? "daily", area === "workload" ? workload.issue ?? "open" : scenario?.issue ?? "", area === "workload" ? workload.detail ?? "general" : scenario?.detail ?? "", domain ?? "none", need ?? ""].join(":");
}
