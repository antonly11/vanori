// Product groupings, not a validated questionnaire or diagnostic scale.
// https://www.hse.gov.uk/stress/standards/overview.htm
// https://www.av.se/halsa-och-sakerhet/organisatorisk-och-social-arbetsmiljo/
// https://pmc.ncbi.nlm.nih.gov/articles/PMC7337889/
export const stressCategories = [
  { id: "workload", label: "Arbetsbelastning och krav", description: "Mycket att göra, högt tempo eller press att prestera." },
  { id: "relationships", label: "Relationer och stöd", description: "Samarbete, bemötande eller stöd från chef och kollegor." },
  { id: "clarity-control", label: "Tydlighet och inflytande", description: "Oklara förväntningar, liten möjlighet att påverka eller oro inför förändringar." },
  { id: "focus", label: "Arbetsro och fokus", description: "Avbrott, störande miljö eller svårt att koncentrera sig." },
  { id: "motivation", label: "Motivation och uppskattning", description: "Engagemang, meningsfullhet eller att känna sig uppskattad." },
  { id: "recovery", label: "Återhämtning och gränser", description: "Pauser, vila eller svårt att släppa jobbet när dagen är slut." },
  { id: "other", label: "Något annat", description: "Oro eller något som inte passar in i de andra områdena." },
] as const;

export type StressCategoryId = (typeof stressCategories)[number]["id"];

// Separate positive wording; shared IDs keep the underlying areas consistent.
export const positiveCategories = [
  { id: "workload", label: "Lagom arbetsbelastning" },
  { id: "relationships", label: "Bra samarbete och stöd" },
  { id: "clarity-control", label: "Tydlighet och inflytande" },
  { id: "focus", label: "Arbetsro" },
  { id: "motivation", label: "Meningsfullhet och uppskattning" },
  { id: "recovery", label: "Bra återhämtning" },
  { id: "other", label: "Något annat" },
] as const satisfies readonly { id: StressCategoryId; label: string }[];
