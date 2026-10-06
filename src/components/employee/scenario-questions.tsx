import type { FormEvent } from "react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextButton } from "@/components/ui/secondary-button";
import { TextAreaField } from "@/components/ui/text-area-field";
import { StressorSelector } from "./stressor-selector";
import { SingleChoiceSelector } from "./single-choice-selector";

type Props<IssueId extends string> = {
  stage: 0 | 1; areaLabel: string; issue: IssueId | null; details: readonly string[]; comment: string;
  issues: readonly { id: IssueId; label: string }[]; choices: readonly { id: string; label: string }[];
  ready: boolean; hasOtherAreas: boolean; otherAreasHint?: string;
  onIssue: (issue: IssueId) => void; onDetail: (details: string[]) => void; onComment: (comment: string) => void;
  onContinue: () => void; onSkip: () => void; onExit: () => void;
};

export function ScenarioQuestions<IssueId extends string>({ stage, areaLabel, issue, details, comment, issues, choices, ready, hasOtherAreas, otherAreasHint, onIssue, onDetail, onComment, onContinue, onSkip, onExit }: Props<IssueId>) {
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (ready) onContinue(); }
  return <form onSubmit={submit}>
    <p className="mb-3 text-caption text-muted">{areaLabel} · {stage + 1} av 2</p>
    {stage === 0 ? <>
      {hasOtherAreas && <p className="mb-3 text-body text-muted">{otherAreasHint ?? "Du börjar med det här området. Dina andra val finns kvar."}</p>}
      <SingleChoiceSelector value={issue} onChange={onIssue} choices={issues} hint="Välj det som stämmer bäst just nu. Flera saker kan hänga ihop." />
    </> : <>
      <StressorSelector value={details} onChange={onDetail} categories={choices} />
      <details className="mt-4 rounded-control border border-outline p-3">
        <summary className="ui-disclosure ui-disclosure">Lägg till något (valfritt){comment.trim() ? " · text finns" : ""}</summary>
        <div className="mt-2"><TextAreaField label="Med egna ord" hint="Valfritt. Beskriv kort med egna ord. Undvik namn och andra personers uppgifter." value={comment} onChange={onComment} maxLength={350} /></div>
      </details>
    </>}
    <div className="mt-5"><PrimaryButton disabled={!ready}>{stage === 0 ? "Fortsätt" : "Gå vidare till stöd"}</PrimaryButton></div>
    <TextButton fullWidth onClick={onSkip}>Hoppa över {stage === 0 ? "frågorna" : "följdfrågan"}</TextButton>
    <TextButton fullWidth onClick={onExit}>Avsluta för nu</TextButton>
  </form>;
}
