import type { SmallAction } from "./support-plan";
import type { ChosenValue } from "./value-connection";
import type { ConversationGuide } from "./workload-conversations";

// Shared presentation plan. Free text is displayed only when explicitly selected;
// no interpretation, diagnosis or automatic change of a Bullseye score.
export function getActionPractice(action: SmallAction, value: ChosenValue | null, cause: string | undefined, support: ConversationGuide) {
  const own = action.source !== "example";
  const fromOwnValue = own && value?.actions.includes(action.basedOn ?? action.title);
  const steps = action.steps?.length ? [...action.steps] : own
    ? [action.source === "adapted" ? action.instruction : `Välj en möjlig stund för din idé: ${action.title}`, "Prova i en omfattning som passar dig och arbetssituationen. Du kan avstå eller avbryta."]
    : [action.instruction];
  const valuePrompt = value ? {
    work: "Kan steget ge mer plats åt det sätt du vill arbeta på?",
    relationships: "Kan steget hjälpa dig värna det som är viktigt i mötet med andra?",
    health: "Kan steget ge plats åt det du vill värna om för dig själv?",
    leisure: "Kan steget ge mer utrymme åt det som är viktigt utanför arbetet?",
  }[value.domainId] : null;
  return {
    title: action.title, steps, smallerStep: steps[0], valuePrompt, conversation: action.conversation, support,
    basis: own ? fromOwnValue && value ? `Din egen idé inom ${value.label.toLocaleLowerCase("sv")}.` : "Du valde den här egna idén." : cause ? `Utifrån ditt val: ${cause}` : "En möjlig början när orsaken ännu är oklar.",
  };
}
export type ActionPracticePlan = ReturnType<typeof getActionPractice>;
