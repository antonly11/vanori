import { getScenarioContext, type ScenarioAnswer } from "./scenario-flow";
import { getSmallActions, hasValue, valueDomains, type ValueDomainId, type ValuesProfile } from "./values";
import type { StressCategoryId } from "./stress-categories";
import { hasWorkloadDetail, type WorkloadAnswer, type WorkloadIssueId } from "./workload-flow";

// Transparent prototype suggestions for psychologist review, not clinical matching.
// Suggest an area from explicit choices; never interpret private free text or
// change a Bullseye score. The employee confirms the relevant direction.
// https://contextualscience.org/files/Bull%27s%20Eye-svenska.pdf
type ConnectionContext = { suggestedDomain: ValueDomainId | null; message: string };

const workloadContexts = {
  amount: { suggestedDomain: "work", message: "När mycket behöver rymmas på samma gång kan det vara svårt att ge det viktiga plats. Vad vill du värna om när du väljer nästa steg?" },
  priorities: { suggestedDomain: "work", message: "När förväntningar går åt olika håll kan det vara svårt att veta var du ska börja. Vad vill du hålla fast vid medan du söker tydlighet?" },
  pressure: { suggestedDomain: "work", message: "Pressen behöver inte försvinna helt för att du ska kunna välja ett litet steg. Vad vill du ge mer utrymme åt just nu?" },
  boundaries: { suggestedDomain: "health", message: "Att sätta en gräns kan kännas svårt. Börja gärna med vad du vill värna om, och vad som skulle vara möjligt i din situation." },
  recovery: { suggestedDomain: "health", message: "När återhämtningen får lite plats kan det vara värt att stanna vid det du behöver. Vad vill du ta hand om just nu?" },
  resources: { suggestedDomain: "work", message: "Du behöver inte ha alla svar själv. Vad vill du värna om medan du söker det stöd eller de förutsättningar du behöver?" },
  control: { suggestedDomain: "work", message: "När mycket bestäms av andra kan nästa steg också handla om stöd eller mer inflytande. Vad vill du hålla fast vid på vägen?" },
  other: { suggestedDomain: null, message: "Det är okej att inte ha en tydlig bild ännu. Finns det något viktigt för dig som du vill ge lite plats åt idag?" },
} satisfies Record<WorkloadIssueId, ConnectionContext>;

const areaContexts = {
  workload: { suggestedDomain: "work", message: "Kraven på jobbet och det som är viktigt för dig behöver få plats i samma bild. Vilken riktning vill du ta med dig till nästa steg?" },
  relationships: { suggestedDomain: "relationships", message: "När samspelet med andra känns svårt kan det hjälpa att stanna vid hur du själv vill möta människor, och vilket stöd du behöver." },
  "clarity-control": { suggestedDomain: "work", message: "När mycket känns oklart behöver du inte lösa allt själv. Vad vill du hålla fast vid medan du söker tydlighet eller mer inflytande?" },
  focus: { suggestedDomain: "work", message: "Det kan vara svårt att hitta arbetsro när mycket pockar på uppmärksamheten. Vad vill du ge plats åt i ditt nästa steg?" },
  motivation: { suggestedDomain: "work", message: "När engagemanget känns långt borta kan du börja med det som fortfarande betyder något för dig. Vilken riktning känns relevant idag?" },
  recovery: workloadContexts.recovery,
  other: workloadContexts.other,
} satisfies Record<StressCategoryId, ConnectionContext>;

export function getValueConnectionContext(areas: readonly StressCategoryId[], answer: WorkloadAnswer, scenario?: ScenarioAnswer): ConnectionContext {
  const area = areas[0] ?? "other";
  if (area !== "workload" && scenario) return getScenarioContext(area, scenario) ?? areaContexts[area];
  if (!areas.includes("workload") || answer.issue === null) return areaContexts[area];
  const context: ConnectionContext = workloadContexts[answer.issue];
  if (!hasWorkloadDetail(answer)) return context;
  if (answer.issue === "pressure" && (answer.detail === "self" || answer.detail === "consequences")) return { ...context, suggestedDomain: "health" };
  if ((answer.issue === "amount" || answer.issue === "control") && answer.detail === "schedule") return { ...context, suggestedDomain: "health" };
  if (answer.issue === "other" && answer.detail === "talk") return { ...context, suggestedDomain: "relationships" };
  if (answer.issue === "resources" && answer.detail === "support") return { ...context, suggestedDomain: "relationships" };
  if (answer.issue === "other" && answer.detail === "pause") return { ...context, suggestedDomain: "health" };
  if (answer.issue === "other" && (answer.detail === "overview" || answer.detail === "reduce" || answer.detail === "practical")) return { ...context, suggestedDomain: "work" };
  return context;
}


export function getChosenValue(profile: ValuesProfile, domainId: ValueDomainId | null) {
  if (domainId === null || !hasValue(profile[domainId])) return null;
  const domain = valueDomains.find((item) => item.id === domainId);
  if (!domain) return null;
  return { domainId, label: domain.label, direction: profile[domainId].direction, actions: getSmallActions(profile[domainId]) };
}

export type ChosenValue = NonNullable<ReturnType<typeof getChosenValue>>;
