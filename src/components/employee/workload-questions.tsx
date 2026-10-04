import { useId, type FormEvent } from "react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { hasWorkloadDetail, workloadFollowUps, workloadIssues, type WorkloadAnswer, type WorkloadIssueId } from "@/lib/employee/workload-flow";
import { StressorSelector } from "./stressor-selector";
import { SingleChoiceSelector } from "./single-choice-selector";

type Props = {
  stage: 0 | 1;
  answer: WorkloadAnswer;
  hasOtherAreas: boolean;
  onIssue: (issue: WorkloadIssueId) => void;
  onDetail: (details: string[]) => void;
  onComment: (comment: string) => void;
  onContinue: () => void;
  onSkip: () => void;
  onExit: () => void;
};

export function WorkloadQuestions({ stage, answer, hasOtherAreas, onIssue, onDetail, onComment, onContinue, onSkip, onExit }: Props) {
  const commentId = useId();
  const ready = stage === 0 ? answer.issue !== null : hasWorkloadDetail(answer);
  const followUp = answer.issue === null ? null : workloadFollowUps[answer.issue];
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ready) onContinue();
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-3 text-xs text-muted">Arbetsbelastning och krav · {stage + 1} av 2</p>
      {stage === 0 ? <>
        {hasOtherAreas && <p className="mb-3 text-sm leading-6 text-muted">Du valde att börja med arbetsbelastningen. Dina andra val finns kvar.</p>}
        <SingleChoiceSelector value={answer.issue} onChange={onIssue} choices={workloadIssues} hint="Välj det som stämmer bäst just nu. Flera saker kan hänga ihop." />
      </> : followUp && <>
        <StressorSelector value={answer.details} onChange={onDetail} categories={followUp.choices} />
        <details className="mt-4 rounded-xl border border-outline p-3">
          <summary className="min-h-11 cursor-pointer content-center text-sm focus-visible:outline-2 focus-visible:outline-accent">Lägg till något (valfritt){answer.comment.trim() ? " · text finns" : ""}</summary>
          <label htmlFor={commentId} className="mt-2 block text-sm font-medium">Med egna ord</label>
          <p id={`${commentId}-hint`} className="mt-1 text-xs leading-5 text-muted">Valfritt. Beskriv kort med egna ord. Undvik namn och andra personers uppgifter.</p>
          <textarea id={commentId} value={answer.comment} onChange={(event) => onComment(event.target.value.slice(0, 350))} rows={3} maxLength={350} aria-describedby={`${commentId}-hint ${commentId}-limit`} className="text-field mt-2" />
          <p id={`${commentId}-limit`} className="mt-1 text-right text-xs text-muted">{answer.comment.length}/350 tecken</p>
        </details>
      </>}
      <div className="mt-5"><PrimaryButton disabled={!ready}>{stage === 0 ? "Fortsätt" : "Gå vidare till stöd"}</PrimaryButton></div>
      <button type="button" onClick={onSkip} className="mt-2 min-h-11 w-full rounded-lg px-3 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Hoppa över {stage === 0 ? "frågorna" : "följdfrågan"}</button>
      <button type="button" onClick={onExit} className="min-h-11 w-full rounded-lg px-3 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Avsluta för nu</button>
    </form>
  );
}
