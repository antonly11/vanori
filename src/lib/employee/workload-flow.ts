// Product questions for psychologist review, not a validated clinical assessment.
// Work design: demands, control, support, role and change.
// https://www.hse.gov.uk/stress/standards/overview.htm
export const workloadIssues = [
  { id: "amount", label: "Jag hinner inte med arbetet." },
  { id: "priorities", label: "Jag vet inte vad som förväntas eller ska prioriteras." },
  { id: "pressure", label: "Jag känner press att prestera eller göra allt rätt." },
  { id: "boundaries", label: "Jag har svårt att sätta gränser för arbetet." },
  { id: "recovery", label: "Jag får för lite utrymme för återhämtning." },
  { id: "resources", label: "Jag saknar stöd, kunskap eller fungerande verktyg." },
  { id: "control", label: "Jag vet vad som krävs men har liten möjlighet att påverka." },
  { id: "other", label: "Flera saker, något annat eller svårt att säga." },
] as const;

export type WorkloadIssueId = (typeof workloadIssues)[number]["id"];
type FollowUp = { question: string; choices: readonly { id: string; label: string }[] };

const openChoices = [
  { id: "other", label: "Något annat." },
  { id: "unsure", label: "Jag vet inte ännu." },
] as const;

export const workloadFollowUps = {
  amount: {
    question: "Vad gör det svårast att hinna med?",
    choices: [
      { id: "volume", label: "Mer arbete än tiden räcker till." },
      { id: "deadlines", label: "En tidsram eller ett arbetstempo som är för snävt." },
      { id: "interruptions", label: "Avbrott eller nya uppgifter som kommer emellan." },
      { id: "schedule", label: "Arbetstider eller arbetsuppgifter som blir svåra att få ihop." },
      ...openChoices,
    ],
  },
  priorities: {
    question: "Vad är otydligt eller krockar?",
    choices: [
      { id: "order", label: "Vad som ska göras först eller kan vänta." },
      { id: "standard", label: "Vad som räknas som ett tillräckligt bra resultat." },
      { id: "conflict", label: "Olika personer ställer krav som krockar." },
      { id: "role", label: "Vad som ingår i mitt ansvar." },
      { id: "change", label: "Uppgifter eller förväntningar ändras utan tydlig information." },
      ...openChoices,
    ],
  },
  pressure: {
    question: "Vad bidrar till pressen?",
    choices: [
      { id: "external", label: "Krav eller förväntningar från andra." },
      { id: "self", label: "Mina egna krav på att prestera eller göra rätt." },
      { id: "consequences", label: "Oro för kritik eller konsekvenser om något blir fel." },
      { id: "confidence", label: "Nya eller svåra uppgifter där jag känner mig osäker." },
      ...openChoices,
    ],
  },
  boundaries: {
    question: "Vad gör det svårt att sätta en gräns?",
    choices: [
      { id: "reaction", label: "Oro för hur andra ska reagera." },
      { id: "availability", label: "Förväntningar på att vara tillgänglig eller ta på mig mer." },
      { id: "capacity", label: "Svårt att veta när det blir för mycket för mig." },
      { id: "influence", label: "Liten möjlighet att säga nej eller ändra arbetet." },
      { id: "responsibility", label: "Ansvar för andra eller rädsla att svika någon." },
      ...openChoices,
    ],
  },
  recovery: {
    question: "Vad hindrar återhämtningen?",
    choices: [
      { id: "no-time", label: "Arbetsmängden lämnar inget utrymme för pauser." },
      { id: "no-control", label: "Jag kan inte påverka när jag får ta en paus." },
      { id: "off-hours", label: "Arbetet fortsätter in på min lediga tid." },
      { id: "thoughts", label: "Tankar eller oro om jobbet följer med efter arbetsdagen." },
      { id: "rest", label: "Sömn, ledighet eller vila räcker inte till just nu." },
      ...openChoices,
    ],
  },
  resources: {
    question: "Vad saknas för att arbetet ska bli hanterbart?",
    choices: [
      { id: "staff", label: "Tillräcklig bemanning eller avlastning." },
      { id: "guidance", label: "Vägledning eller beslut från den som ansvarar." },
      { id: "training", label: "Introduktion, kunskap eller tid att lära mig uppgiften." },
      { id: "tools", label: "Fungerande verktyg, system eller arbetsmiljö." },
      { id: "support", label: "Någon att prata med eller få stöd av." },
      ...openChoices,
    ],
  },
  control: {
    question: "Vad har du svårt att påverka?",
    choices: [
      { id: "pace", label: "Arbetsmängden eller tempot." },
      { id: "order", label: "Prioriteringar eller sättet att göra arbetet." },
      { id: "schedule", label: "Arbetstider eller pauser." },
      { id: "change", label: "Förändringar eller beslut som påverkar mitt arbete." },
      ...openChoices,
    ],
  },
  other: {
    question: "Vad skulle du vilja ha hjälp med just nu?",
    choices: [
      { id: "understand", label: "Förstå vad som känns svårt." },
      { id: "overview", label: "Få överblick och tydligare prioriteringar." },
      { id: "reduce", label: "Minska eller förändra arbetsbelastningen." },
      { id: "pressure", label: "Utforska pressen eller det som gör gränser svåra." },
      { id: "practical", label: "Hitta ett praktiskt nästa steg." },
      { id: "talk", label: "Få stöd av någon." },
      { id: "pause", label: "Få lite utrymme och återhämtning." },
      ...openChoices,
    ],
  },
} as const satisfies Record<WorkloadIssueId, FollowUp>;

export type WorkloadAnswer = {
  issue: WorkloadIssueId | null;
  detail: string | null;
  details: string[];
  comment: string;
};

export function createEmptyWorkloadAnswer(): WorkloadAnswer {
  return { issue: null, detail: null, details: [], comment: "" };
}

export function changeWorkloadIssue(answer: WorkloadAnswer, issue: WorkloadIssueId): WorkloadAnswer {
  return answer.issue === issue ? answer : { issue, detail: null, details: [], comment: "" };
}

export function hasWorkloadDetail(answer: WorkloadAnswer): boolean {
  if (answer.issue === null || answer.details.length === 0) return false;
  const choices = workloadFollowUps[answer.issue].choices;
  return answer.details.every((detail) => choices.some((choice) => choice.id === detail));
}


// Unknown/other are exclusive so an uncertain response is never counted as a cause.
export function changeWorkloadDetails(answer: WorkloadAnswer, details: string[]): WorkloadAnswer {
  if (answer.issue === null) return answer;
  const allowed = workloadFollowUps[answer.issue].choices.map((choice) => String(choice.id));
  const valid = [...new Set(details)].filter((detail) => allowed.includes(detail));
  const added = valid.find((detail) => !answer.details.includes(detail));
  const exclusive = added === "unsure" || added === "other";
  const selected = exclusive ? [added] : valid.length > 1 ? valid.filter((detail) => detail !== "unsure" && detail !== "other") : valid;
  return { ...answer, details: selected, detail: selected.length === 1 ? selected[0] : null };
}
