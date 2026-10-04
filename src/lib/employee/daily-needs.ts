import type { SmallAction } from "./support-plan";
import type { ValueDomainId } from "./values";
import { manager, requester, listener } from "./workload-conversations";

// Everyday navigation choices inspired by demands, control, support and recovery.
// These express desired help, not measured stress severity or confirmed causes.
// https://www.hse.gov.uk/stress/standards/overview.htm
export const dailyNeeds = [
  { id: "work-peace", label: "Få arbetsro" },
  { id: "prioritize", label: "Prioritera mina uppgifter" },
  { id: "pause", label: "Ta en paus" },
  { id: "clarify", label: "Få lite klarhet" },
  { id: "check-in", label: "Stämma av med någon" },
  { id: "get-started", label: "Komma igång" },
  { id: "something-else", label: "Något annat" },
] as const;

export type DailyNeedId = (typeof dailyNeeds)[number]["id"];

const dailySupport = {
  "work-peace": [
    { id: "daily-focus-small", title: "Ge en uppgift en lugn start", instruction: "Om arbetet tillåter: välj en liten del och stäng ett avbrott du kan påverka.", steps: ["Öppna bara det du behöver för nästa lilla del.", "Låt andra krav vänta under den stunden, om du har utrymme för det."], source: "example" },
    { id: "daily-focus-agree", title: "Stäm av en stund med färre avbrott", instruction: "Behöver du vara tillgänglig? Be om en enkel överenskommelse om arbetsro.", conversation: manager("Kan jag få en kort ostörd stund för [uppgift]? Vilka avbrott måste nå mig och vem kan täcka resten?"), source: "example" },
  ],
  prioritize: [
    { id: "daily-priority-one", title: "Välj en sak först och en som kan vänta", instruction: "Gör nästa stund överskådlig utan att planera hela dagen.", steps: ["Skriv en uppgift du vill börja med.", "Skriv en annan som kan vänta. Är du osäker på prioriteringen, be om ett besked."], source: "example" },
    { id: "daily-priority-check", title: "Be om en snabb prioritering", instruction: "Ta med de två uppgifter som konkurrerar om din tid.", conversation: manager("Jag har [uppgift A] och [uppgift B] framför mig. Vilken ska jag börja med, och vilken kan vänta?"), source: "example" },
  ],
  pause: [
    { id: "daily-pause-screen", title: "Ta en kort paus från skärmen", instruction: "Om en paus får plats: lämna skärmen en stund och välj något enkelt som passar dig.", steps: ["Titta ut, hämta något att dricka eller gå en liten bit.", "Låt pausen vara en paus, utan ett nytt krav på att prestera."], source: "example" },
    { id: "daily-pause-schedule", title: "Ge nästa paus en tydlig plats", instruction: "Välj en möjlig stund senare om du inte kan pausa just nu.", steps: ["Bestäm när en kort paus kan få plats.", "Behöver någon täcka arbetet? Stäm av med arbetsledaren innan du lämnar uppgiften."], conversation: manager("När kan jag ta en kort paus i arbetet idag, och vem kan täcka det som behöver fortsätta?"), source: "example" },
  ],
  clarify: [
    { id: "daily-clarity-question", title: "Gör en oklarhet till en fråga", instruction: "Välj ett besked som skulle göra nästa steg lättare.", conversation: requester("Jag behöver förstå [fråga] för att gå vidare med [uppgift]. Vad ska jag utgå från?"), source: "example" },
    { id: "daily-clarity-check", title: "Kontrollera att ni menar samma sak", instruction: "Skriv din bild av uppgiften i en mening och be ansvarig bekräfta den.", conversation: requester("Jag har förstått att nästa steg är [del] och att den är klar när [resultat]. Stämmer det?"), source: "example" },
  ],
  "check-in": [
    { id: "daily-contact-colleague", title: "Be en trygg kollega om en stund", instruction: "Det räcker att börja med hur dagen känns och vad du behöver just nu.", conversation: listener("Har du en kort stund? Jag skulle vilja stämma av min dag med dig och bli lyssnad på."), source: "example" },
    { id: "daily-contact-manager", title: "Stäm av en praktisk sak med arbetsledaren", instruction: "Välj en konkret sak i arbetet där ett besked eller stöd skulle hjälpa.", conversation: manager("Jag skulle behöva stämma av [sak] idag. Kan vi bestämma ett nästa steg och vem som hjälper till?"), source: "example" },
  ],
  "get-started": [
    { id: "daily-start-first", title: "Gör bara den första lilla delen", instruction: "Välj ett steg som är tillräckligt litet för att börja med.", steps: ["Öppna underlaget eller skriv den första raden.", "Stanna sedan upp och välj nästa del. Du behöver inte lösa hela uppgiften direkt."], source: "example" },
    { id: "daily-start-together", title: "Be en erfaren kollega visa början", instruction: "Om första momentet är oklart kan ni göra det tydligare tillsammans.", conversation: { withWhom: "En erfaren kollega eller din handledare", reason: "Be om praktisk hjälp med första momentet.", opening: "Kan du visa hur du skulle börja med [uppgift]? Jag vill förstå första momentet och prova det själv." }, source: "example" },
  ],
  "something-else": [
    { id: "daily-other-need", title: "Sätt ord på ett litet behov", instruction: "Avsluta meningen: ”Det skulle underlätta om …” Ett kort svar räcker.", steps: ["Välj något som gäller den närmaste stunden.", "Se om du kan börja själv eller behöver ett besked eller stöd."], source: "example" },
    { id: "daily-other-ground", title: "Välj något enkelt du redan känner till", instruction: "Utgå från en liten handling som brukar passa dig, utan att kräva att hela dagen ska förändras.", steps: ["Välj en egen idé som går att genomföra i situationen.", "Ge den en liten plats när det passar arbetet och din riktning."], source: "example" },
  ],
} satisfies Record<DailyNeedId, readonly SmallAction[]>;

const dailyDomains = {
  "work-peace": "work", prioritize: "work", pause: "health", clarify: "work",
  "check-in": "relationships", "get-started": "work", "something-else": null,
} satisfies Record<DailyNeedId, ValueDomainId | null>;

export function getDailySupport(need: DailyNeedId): readonly SmallAction[] {
  return dailySupport[need];
}

export function getDailyValueDomain(need: DailyNeedId): ValueDomainId | null {
  return dailyDomains[need];
}
