import type { SmallAction } from "./support-plan";
import type { ChosenValue } from "./value-connection";
import { workloadFollowUps, workloadIssues, type WorkloadAnswer } from "./workload-flow";
import { getWorkloadSupport } from "./workload-support";
import { getActionPractice } from "./action-practice";
import { manager } from "./workload-conversations";

// Authored prototype guidance. Match explicit answers and selected own ideas;
// never infer the meaning of private values or diagnose an underlying cause.
export const practiceFeedback = [
  { id: "helpful", label: "Hjälpsamt" },
  { id: "not-fit", label: "Passade inte" },
  { id: "not-tried", label: "Har inte provat" },
] as const;
export type PracticeFeedback = (typeof practiceFeedback)[number]["id"];
export type PracticeProgress = { smaller: boolean; reflecting: boolean; feedback: PracticeFeedback | null };
export const emptyPracticeProgress: PracticeProgress = { smaller: false, reflecting: false, feedback: null };

export function getPracticeKey(context: string, action: SmallAction): string {
  // Memory only. Own actions can share an index after editing their source list.
  return JSON.stringify([context, action.id, action.title, action.basedOn ?? null]);
}

export function getWorkloadPractice(action: SmallAction, answer: WorkloadAnswer, value: ChosenValue | null) {
  const issue = workloadIssues.find((item) => item.id === answer.issue);
  const detail = answer.issue && answer.detail && answer.details.includes(answer.detail)
    ? workloadFollowUps[answer.issue].choices.find((item) => item.id === answer.detail)
    : undefined;
  const cause = detail && detail.id !== "unsure" && detail.id !== "other" ? detail.label : issue?.id !== "other" ? issue?.label : undefined;
  const contact = action.conversation ?? getWorkloadSupport(answer).find((item) => item.conversation)?.conversation
    ?? manager("Jag behöver hjälp med min arbetssituation. Kan vi titta på vad som behöver ändras och vilket stöd jag kan få?");
  // Keep existing care guidance for this explicit route. Other contacts get a
  // separate request for more help, rather than repeating the action's script.
  const support = answer.issue === "recovery" && answer.detail === "rest" ? contact : {
    ...contact,
    reason: "Be om hjälp att gå vidare när ett eget litet steg inte räcker.",
    opening: "Jag behöver mer stöd kring [arbetssituation]. Kan vi tillsammans bestämma vilken hjälp eller förändring som behövs, vem som kan ordna den och när vi följer upp?",
  };
  return getActionPractice(action, value, cause, support);
}
