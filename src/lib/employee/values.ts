// Research-informed product copy, not a validated questionnaire or treatment.
// Core: freely chosen directions, values-action alignment, barriers and action.
// https://doi.org/10.1016/j.cbpra.2012.01.004
// https://contextualscience.org/files/Bull%27s%20Eye-svenska.pdf
// https://contextualscience.org/book/export/html/240
// The reflection prompts and two-page flow are Vanori adaptations for review.
export const valueDomains = [
  {
    id: "work", label: "Arbete och utbildning", shortLabel: "Arbete", color: "#c3d2b7",
    reflectionQuestion: "När känns det du gör på jobbet eller i dina studier meningsfullt?",
    reflectionHint: "Tänk på en situation och vad som betydde något i den.",
    directionQuestion: "Vad vill du ska prägla ditt sätt att arbeta eller lära dig?",
    directionHint: "En riktning du kan återvända till, även en svår dag.",
    examples: {
      reflection: "När jag hjälpte en kollega att förstå en uppgift kändes jobbet meningsfullt. Jag uppskattade att vi lärde oss något tillsammans.",
      direction: "Jag vill lära med nyfikenhet och samarbeta med omtanke.",
      barrier: "Många avbrott gör det svårt att lyssna ordentligt. Jag kan också bli rädd att verka okunnig och låta bli att fråga.",
      action: "Ta en kort promenad på rasten för att ge mig utrymme att tänka.\nTa en kaffe med en kollega och fråga hur vi kan hjälpas åt.\nStälla en fråga när något är oklart, så att jag kan lära mig.",
    },
    barrierQuestion: "Vad kan göra det svårt att arbeta eller lära på det sättet?",
    actionQuestion: "Vilka små handlingar kan hjälpa dig i den här riktningen?",
  },
  {
    id: "relationships", label: "Relationer", shortLabel: "Relationer", color: "#91b8b1",
    reflectionQuestion: "Tänk på en stund med någon som betyder mycket för dig. Vad var värdefullt i den?",
    reflectionHint: "Du behöver inte skriva namn eller andra personliga detaljer.",
    directionQuestion: "Hur vill du möta och finnas där för människor som är viktiga för dig?",
    directionHint: "Beskriv ditt sätt att vara, snarare än vad andra ska göra.",
    examples: {
      reflection: "Under ett lugnt samtal med någon nära kunde vi lyssna på varandra utan att skynda. Det betydde mycket att känna närhet.",
      direction: "Jag vill lyssna med närvaro och uttrycka mig ärligt.",
      barrier: "När jag är trött efter jobbet drar jag mig undan, även när jag egentligen vill ha kontakt.",
      action: "Ta en kaffe med någon jag tycker om och lyssna utan telefonen.\nTa en promenad tillsammans och prata en stund.\nSkicka ett kort meddelande till någon jag vill hålla kontakt med.",
    },
    barrierQuestion: "Vad kan göra det svårt att vara så i dina relationer?",
    actionQuestion: "Vilka små handlingar kan hjälpa dig i den här riktningen?",
  },
  {
    id: "leisure", label: "Fritid", shortLabel: "Fritid", color: "#d8c49a",
    reflectionQuestion: "När du gör något för din egen skull på fritiden, vad uppskattar du i det?",
    reflectionHint: "Det kan vara något stilla, socialt, kreativt eller helt annat.",
    directionQuestion: "Vad vill du ge utrymme åt på din fritid, och på vilket sätt?",
    directionHint: "Beskriv det viktiga i aktiviteten, inte bara själva aktiviteten.",
    examples: {
      reflection: "När jag ritade för nöjes skull uppskattade jag att få prova något utan att behöva prestera.",
      direction: "Jag vill ge plats åt skapande och upptäcka saker med nyfikenhet.",
      barrier: "Jag tänker ofta att allt annat måste vara klart innan jag får göra något för min egen skull.",
      action: "Rita i tio minuter utan krav på resultatet.\nTa en promenad och upptäcka något i omgivningen.\nLyssna på en låt jag tycker om och ge mig tid att njuta av den.",
    },
    barrierQuestion: "Vad kan stå i vägen för den fritid du vill ge utrymme åt?",
    actionQuestion: "Vilka små handlingar kan hjälpa dig i den här riktningen?",
  },
  {
    id: "health", label: "Personlig utveckling och hälsa", shortLabel: "Utveckling & hälsa", color: "#b1accd",
    reflectionQuestion: "Tänk på ett tillfälle när du tog hand om dig själv eller lärde dig något viktigt. Vad betydde det för dig?",
    reflectionHint: "Det kan handla om kroppen, återhämtning, lärande eller livsåskådning.",
    directionQuestion: "Hur vill du ta hand om dig själv och möta din egen utveckling?",
    directionHint: "Utgå från din omsorg om dig själv, inte ett krav på prestation.",
    examples: {
      reflection: "När jag tog en paus efter en intensiv stund kändes det viktigt att lyssna på mina behov, i stället för att bara pressa vidare.",
      direction: "Jag vill möta mig själv med vänlighet och respektera mitt behov av vila.",
      barrier: "Jag får ibland dåligt samvete när jag vilar. En full kalender gör det också svårt att få plats med pauser.",
      action: "Ta en kort promenad i en takt som passar mig.\nGöra en kort stund av träning eller rörelse som jag tycker om.\nTa en kaffepaus utan skärmen och ge mig utrymme att vila.",
    },
    barrierQuestion: "Vad kan göra det svårt att ta hand om dig själv på det sättet?",
    actionQuestion: "Vilka små handlingar kan hjälpa dig i den här riktningen?",
  },
] as const;

export type ValueDomainId = (typeof valueDomains)[number]["id"];
export type ValueDomain = (typeof valueDomains)[number];
export type Alignment = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const alignmentLevels: readonly Alignment[] = [1, 2, 3, 4, 5, 6, 7];

export type ValueAnswer = {
  reflection: string;
  direction: string;
  barrier: string;
  action: string;
  alignment: Alignment | null;
};
export type ValuesProfile = Record<ValueDomainId, ValueAnswer>;
export type ValueTextField = "reflection" | "direction" | "barrier" | "action";

export function createEmptyValuesProfile(): ValuesProfile {
  const empty = (): ValueAnswer => ({ reflection: "", direction: "", barrier: "", action: "", alignment: null });
  return { work: empty(), relationships: empty(), leisure: empty(), health: empty() };
}

export function hasValue(answer: ValueAnswer): boolean {
  return answer.direction.trim().length > 0;
}

export function getSmallActionsText(answer: ValueAnswer): string {
  return answer.action;
}

export function getSmallActions(answer: ValueAnswer): string[] {
  return getSmallActionsText(answer).split(/\r?\n/).map((action) => action.trim()).filter(Boolean);
}

export function getValuePosition(index: number, alignment: Alignment) {
  const angle = (-45 + index * 90) * Math.PI / 180;
  const radius = 104 - (alignment - 1) * 15;
  return { x: 180 + Math.cos(angle) * radius, y: 180 + Math.sin(angle) * radius };
}
