import type { SmallAction } from "./support-plan";

// Recognize only explicit everyday activities the employee chose to enter.
// Never interpret wellbeing, values, barriers or names. Unrecognized or negated
// ideas stay as written. All variations are authored options for review.
export function getOwnActionOptions(ideas: readonly string[]): { action: SmallAction; variations: SmallAction[] }[] {
  return [...new Set(ideas.map((idea) => idea.trim()).filter(Boolean))].map((idea, index) => {
    const action: SmallAction = { id: `own-${index}`, title: idea, instruction: "Välj en liten version som passar situationen och din riktning. Du bestämmer om och när du vill pröva den.", source: "own" };
    if (/\b(?:inte|undvik|aldrig)\b/iu.test(idea)) return { action, variations: [] };
    let options: readonly (readonly [string, string])[] = [];
    if (/(?:promenad|promenera)/iu.test(idea)) options = [
      ["Ta ett kort varv utomhus", "Om det passar arbetet: välj en kort runda utan krav på tempo eller sträcka."],
      ["Gå en liten bit och lägg märke till omgivningen", "Välj en kort promenad. Ge något i omgivningen din uppmärksamhet en stund, om det passar dig."],
    ];
    else if (/\b(?:kaffe|kaffepaus|tepaus)\b/iu.test(idea)) options = /(?:kollega|vän|tillsammans)/iu.test(idea) ? [
      ["Ta en kort fikastund tillsammans", "Fråga en kollega du känner dig trygg med om en kort paus. Ge samtalet plats om ni båda vill."],
      ["Stäm av över något att dricka", "Välj en lugn stund med en person du vill ha kontakt med. Fråga hur ni har det, utan att behöva lösa något."],
    ] : [
      ["Ta något att dricka utan skärmen", "Om en paus är möjlig: lägg undan skärmen och låt stunden vara enkel."],
      ["Flytta din fikapaus till en lugn plats", "Välj en plats där du kan pausa en liten stund med mindre intryck."],
    ];
    else if (/(?:träning|träna|rörelsepaus)/iu.test(idea)) options = [
      ["Gör en kort stund av rörelse du tycker om", "Välj en liten version av rörelse som redan passar dig, din kropp och arbetssituationen."],
      ["Planera en lagom stund för din rörelse", "Välj när din egen tränings- eller rörelseidé får plats, utan krav på ett visst resultat."],
    ];
    return { action, variations: options.map(([title, instruction], variant) => ({ id: `adapted-${index}-${variant}`, title, instruction, basedOn: idea, source: "adapted" })) };
  });
}
