import { scenarioDefinitions, type ScenarioArea, type ScenarioIssue } from "./scenario-content";
import type { SmallAction } from "./support-plan";
import type { ChosenValue } from "./value-connection";
import { getActionPractice } from "./action-practice";
import { manager } from "./workload-conversations";

export type ScenarioAnswer = { issue: string | null; detail: string | null; details: string[]; comment: string };
export const createScenarioAnswer = (): ScenarioAnswer => ({ issue: null, detail: null, details: [], comment: "" });
export const openScenarioChoices = [{ id: "other", label: "Något annat." }, { id: "unsure", label: "Jag vet inte ännu." }] as const;

export function getScenarioIssues(area: ScenarioArea) {
  return [...scenarioDefinitions[area].issues.map(({ id, label }) => ({ id, label })), { id: "other", label: "Något annat eller svårt att säga." }];
}
export function getScenarioIssue(area: ScenarioArea, answer: ScenarioAnswer): ScenarioIssue | null {
  if (answer.issue === "other") {
    const open = scenarioDefinitions.other.issues.find((issue) => issue.id === "unclear");
    return open ? { ...open, id: "other" } : null;
  }
  return scenarioDefinitions[area].issues.find((issue) => issue.id === answer.issue) ?? null;
}
export function getScenarioChoices(area: ScenarioArea, answer: ScenarioAnswer) {
  return [...(getScenarioIssue(area, answer)?.details.map(({ id, label }) => ({ id, label })) ?? []), ...openScenarioChoices];
}
export function changeScenarioIssue(area: ScenarioArea, answer: ScenarioAnswer, issue: string): ScenarioAnswer {
  if (issue === answer.issue || !getScenarioIssues(area).some((item) => item.id === issue)) return answer;
  return { ...createScenarioAnswer(), issue };
}
export function changeScenarioDetails(area: ScenarioArea, answer: ScenarioAnswer, details: string[]): ScenarioAnswer {
  if (!getScenarioIssue(area, answer)) return answer;
  const choices = getScenarioChoices(area, answer);
  const valid = [...new Set(details)].filter((id) => choices.some((choice) => choice.id === id));
  const added = valid.find((id) => !answer.details.includes(id));
  const selected = added === "other" || added === "unsure" ? [added] : valid.length > 1 ? valid.filter((id) => id !== "other" && id !== "unsure") : valid;
  return { ...answer, details: selected, detail: selected.length === 1 ? selected[0] : null };
}
export function hasScenarioDetails(area: ScenarioArea, answer: ScenarioAnswer): boolean {
  return getScenarioIssue(area, answer) !== null && answer.details.length > 0 && answer.details.every((id) => getScenarioChoices(area, answer).some((choice) => choice.id === id));
}
export function getScenarioDetail(area: ScenarioArea, answer: ScenarioAnswer) {
  return answer.detail && hasScenarioDetails(area, answer) && answer.details.includes(answer.detail)
    ? getScenarioIssue(area, answer)?.details.find((detail) => detail.id === answer.detail) ?? null : null;
}
export function getScenarioContext(area: ScenarioArea, answer: ScenarioAnswer) {
  const issue = getScenarioIssue(area, answer);
  if (!issue) return null;
  const detail = getScenarioDetail(area, answer);
  return { suggestedDomain: detail ? detail.domain : issue.domain, message: issue.message };
}
export function getScenarioActions(area: ScenarioArea, answer: ScenarioAnswer): readonly SmallAction[] | null {
  const issue = getScenarioIssue(area, answer);
  return getScenarioDetail(area, answer)?.actions ?? (issue?.support ? issue.details[0].actions : null);
}
export function getScenarioPractice(area: ScenarioArea, action: SmallAction, answer: ScenarioAnswer, value: ChosenValue | null) {
  const detail = getScenarioDetail(area, answer);
  const issue = getScenarioIssue(area, answer);
  const cause = detail?.label ?? (issue?.id !== "other" ? issue?.label : undefined);
  const support = detail?.support ?? issue?.support ?? action.conversation ?? manager("Jag behöver mer stöd kring [arbetssituation]. Kan vi tillsammans bestämma vilken hjälp eller förändring som behövs och när vi följer upp?");
  return getActionPractice(action, value, cause, support);
}
