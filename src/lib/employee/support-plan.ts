import type { StressCategoryId } from "./stress-categories";
import type { ValueDomainId } from "./values";
import type { WorkloadAnswer } from "./workload-flow";
import { getScenarioActions, type ScenarioAnswer } from "./scenario-flow";
import { getWorkloadSupport } from "./workload-support";
import { manager, requester, listener, type ConversationGuide } from "./workload-conversations";

// Authored mock suggestions for psychologist review. Explicit choices determine
// the route; directions, reflections and workload free text are not interpreted.
export const directionExamples = {
  work: ["Jag vill arbeta med tydlighet och göra det viktigaste med omsorg.", "Jag vill lära med nyfikenhet och kunna be om hjälp.", "Jag vill bidra på ett sätt som är hållbart för mig."],
  relationships: ["Jag vill möta andra med omtanke utan att glömma mina egna behov.", "Jag vill vara tydlig och respektfull när jag ber om stöd.", "Jag vill ge plats åt närvaro och ömsesidighet."],
  health: ["Jag vill ta hand om mig själv med vänlighet och ge plats åt vila.", "Jag vill lyssna på mina behov och värna mina gränser.", "Jag vill ge plats åt rörelse och återhämtning som passar mig."],
  leisure: ["Jag vill ge plats åt sådant jag gör för glädjens skull.", "Jag vill möta min lediga tid med nyfikenhet.", "Jag vill kunna vara närvarande i livet utanför jobbet."],
} satisfies Record<ValueDomainId, readonly string[]>;

export type SmallAction = {
  id: string;
  title: string;
  instruction: string;
  source: "example" | "own" | "adapted";
  basedOn?: string;
  steps?: readonly string[];
  conversation?: ConversationGuide;
};

const generalActions = {
  relationships: [
    { id: "relationships-listen", title: "Be en trygg kollega att lyssna", instruction: "Välj ett möte eller en situation du vill sätta ord på.", steps: ["Beskriv vad som hände utan att behöva förklara allt.", "Säg om du främst behöver bli lyssnad på eller vill tänka tillsammans."], conversation: listener("Har du en stund att lyssna? Jag blev påverkad av [situation] och skulle vilja sätta ord på det med någon jag känner mig trygg med."), source: "example" },
    { id: "relationships-request", title: "Förbered en tydlig önskan i samarbetet", instruction: "Utgå från ett konkret beteende och vad som skulle underlätta.", steps: ["Skriv: när [situation] händer blir det svårt att [uppgift].", "Formulera en liten förändring du vill be om."], conversation: { withWhom: "Kollegan du samarbetar med, om kontakten känns trygg", reason: "Be om en konkret förändring i ert samarbete.", opening: "När [situation] händer blir det svårt för mig att [uppgift]. Kan vi prova [förändring] och stämma av hur det fungerar?", alternative: "Om kontakten inte känns trygg: be närmaste chef eller skyddsombudet om stöd. Gäller problemet din chef kan du vända dig till chefens chef." }, source: "example" },
  ],
  "clarity-control": [
    { id: "clarity-decision", title: "Be om ett besked du kan utgå från", instruction: "Välj den oklarhet som hindrar ditt nästa steg.", steps: ["Skriv vilken uppgift du behöver besked om.", "Be ansvarig bekräfta vad som gäller och när ni följer upp."], conversation: requester("För [uppgift] behöver jag veta [fråga]. Vilket besked ska jag utgå från, och när stämmer vi av om det ändras?"), source: "example" },
    { id: "clarity-influence", title: "Hitta en del du kan påverka", instruction: "Skilj på vad du kan besluta om och vad som behöver någon annans besked.", steps: ["Välj en liten del där du redan har handlingsutrymme.", "Be om tydlighet i en del där mandatet saknas."], conversation: manager("Vilka delar av [uppgift] kan jag själv besluta om? Jag behöver hjälp att påverka [hinder]. Vad kan vi ändra?"), source: "example" },
  ],
  focus: [
    { id: "focus-one-window", title: "Gör en uppgift lättare att stanna i", instruction: "Om arbetet tillåter: välj en uppgift och stäng ett avbrott du kan påverka.", steps: ["Bestäm vad du vill få en liten bit vidare med.", "Lägg undan ett störande fönster eller en onödig notis under den stunden."], source: "example" },
    { id: "focus-conditions", title: "Be om arbetsro med rätt täckning", instruction: "Om du behöver vara tillgänglig för andra ska arbetsro planeras tillsammans.", steps: ["Beskriv när avbrotten hindrar en viktig uppgift.", "Be arbetsledaren bestämma täckning och vilka avbrott som måste nå dig."], conversation: manager("Jag behöver arbetsro för [uppgift]. När kan det fungera, vem täcker andra behov och vilka avbrott måste jag fortfarande ta?"), source: "example" },
  ],
  motivation: [
    { id: "motivation-contribution", title: "Ge en viktig del av jobbet lite plats", instruction: "Välj en uppgift där du kan se ett litet värde för dig eller någon annan.", steps: ["Skriv vad som gör just den delen betydelsefull för dig.", "Välj ett genomförbart steg utan att kräva att motivationen först ska komma tillbaka."], source: "example" },
    { id: "motivation-feedback", title: "Be om konkret återkoppling", instruction: "Utgå från en insats där du vill förstå ditt bidrag eller din utveckling.", steps: ["Välj en uppgift du nyligen arbetat med.", "Be om ett exempel på vad som fungerade och ett möjligt nästa steg."], conversation: manager("Jag skulle vilja förstå mitt bidrag i [uppgift]. Vad fungerade, och vilken del vore meningsfull att utveckla härnäst?", "Be om återkoppling och tydligare utrymme för utveckling."), source: "example" },
  ],
  recovery: [
    { id: "recovery-small-rest", title: "Välj en paus som faktiskt får plats", instruction: "Om arbetssituationen tillåter: välj en kort stund med mindre krav.", steps: ["Välj det som brukar passa dig: stillhet, något att dricka eller en kort stund ute.", "Ge pausen utrymme utan att lägga till ett nytt prestationskrav."], source: "example" },
    { id: "recovery-space", title: "Be om förutsättningar för återhämtning", instruction: "När pauser eller vila inte får plats behövs också en förändring i arbetet.", steps: ["Beskriv vad som gör återhämtning svår.", "Be om en konkret förändring av täckning, arbetstid eller tillgänglighet."], conversation: manager("Jag får inte utrymme för återhämtning när [situation]. Kan vi ändra [täckning, arbetstid eller tillgänglighet] och bestämma när vi följer upp?"), source: "example" },
  ],
  other: [
    { id: "other-one-moment", title: "Börja med ett enda ögonblick", instruction: "Du behöver inte hitta rätt kategori för att börja förstå dagen.", steps: ["Välj en stund som blev svår och skriv vad som hände.", "Sätt ord på vad du hade behövt just då: ett besked, stöd, utrymme eller något annat."], source: "example" },
    { id: "other-sort-together", title: "Sortera situationen med en trygg kollega", instruction: "Be om hjälp att förstå vad som är svårt innan ni försöker lösa det.", steps: ["Ta med ett konkret exempel från dagen.", "Be kollegan hjälpa dig formulera ett behov eller en fråga."], conversation: listener("Jag har svårt att sätta fingret på vad som blev jobbigt i [situation]. Kan du hjälpa mig sortera det och vad jag skulle behöva?"), source: "example" },
  ],
} satisfies Record<Exclude<StressCategoryId, "workload">, readonly SmallAction[]>;

export function getActionSuggestions(area: StressCategoryId, answer: WorkloadAnswer, scenario?: ScenarioAnswer): SmallAction[] {
  if (area === "workload") return getWorkloadSupport(answer).map((support) => ({ ...support, source: "example" }));
  const specific = scenario ? getScenarioActions(area, scenario) : null;
  return [...(specific ?? generalActions[area])];
}
