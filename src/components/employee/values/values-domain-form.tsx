import { useId, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { TextAreaField } from "@/components/ui/text-area-field";
import { TextButton } from "@/components/ui/secondary-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { alignmentLevels, getSmallActionsText, type Alignment, type ValueAnswer, type ValueDomain, type ValueTextField } from "@/lib/employee/values";

type Props = {
  domain: ValueDomain;
  answer: ValueAnswer;
  stage: 0 | 1;
  last: boolean;
  editing: boolean;
  onText: (field: ValueTextField, value: string) => void;
  onAlignment: (alignment: Alignment | null) => void;
  onContinue: () => void;
  onSkip: () => void;
};

function TextQuestion({ label, hint, example, value, onChange, short = false, limit, rows }: { label: string; hint: string; example: string; value: string; onChange: (value: string) => void; short?: boolean; limit?: number; rows?: number }) {
  const maxLength = limit ?? (short ? 180 : 350);
  return (
    <div>
      <TextAreaField label={label} hint={hint} value={value} onChange={onChange} maxLength={maxLength} rows={rows ?? (short ? 2 : 3)} />
      <details className="mt-2 rounded-control border border-outline px-3 text-body">
        <summary aria-label={`Visa exempelsvar för: ${label}`} className="ui-disclosure text-muted">Visa exempelsvar</summary>
        <p className="whitespace-pre-wrap pb-2">{example}</p>
        <p className="pb-3 text-caption text-muted">Ett exempel, inget facit. Använd dina egna ord.</p>
      </details>
    </div>
  );
}

export function ValuesDomainForm({ domain, answer, stage, last, editing, onText, onAlignment, onContinue, onSkip }: Props) {
  const scaleId = useId();
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (answer.direction.trim()) onContinue();
  }
  return (
    <Card><form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {stage === 0 ? <>
          <TextQuestion label={domain.reflectionQuestion} hint={`${domain.reflectionHint} Valfritt.`} example={domain.examples.reflection} value={answer.reflection} onChange={(value) => onText("reflection", value)} />
          <TextQuestion label={domain.directionQuestion} hint={`${domain.directionHint} Skriv en kort mening för att fortsätta, eller lämna området.`} example={domain.examples.direction} value={answer.direction} onChange={(value) => onText("direction", value)} short />
        </> : <>
          <div className="border-l-2 border-accent pl-4"><p className="text-xs text-muted">Din egen riktning</p><p className="mt-1 whitespace-pre-wrap break-words text-base leading-6">{answer.direction}</p></div>
          <fieldset aria-describedby={`${scaleId}-hint`}>
            <legend className="text-base font-medium leading-6">De senaste två veckorna: hur mycket har dina handlingar följt den här riktningen?</legend>
            <p id={`${scaleId}-hint`} className="mt-1 text-sm leading-5 text-muted">Valfritt. 1 är längre från mitten, 7 är nära mitten.</p>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {alignmentLevels.map((level) => <label key={level} className="relative cursor-pointer">
                <input type="radio" name={scaleId} value={level} checked={answer.alignment === level} onChange={() => onAlignment(level)} aria-label={`${level} av 7`} className="peer sr-only" />
                <span className="flex min-h-11 items-center justify-center rounded-lg border border-outline text-sm peer-checked:border-accent peer-checked:bg-accent peer-checked:font-semibold peer-checked:text-accent-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">{level}</span>
              </label>)}
            </div>
            <div className="mt-2 flex justify-between gap-3 text-xs text-muted"><span>Längre ifrån</span><span>Nära min riktning</span></div>
            {answer.alignment !== null && <div className="mt-2"><TextButton onClick={() => onAlignment(null)}>Avstå från skattning</TextButton></div>}
          </fieldset>
          <TextQuestion label={domain.actionQuestion} hint="Skriv gärna flera idéer, en per rad. Välj sådant som passar dig och det som är viktigt för dig. Valfritt." example={domain.examples.action} value={getSmallActionsText(answer)} onChange={(value) => onText("action", value)} limit={1000} rows={5} />
          <TextQuestion label={domain.barrierQuestion} hint="Tankar och känslor, eller omständigheter som tid, resurser och stöd. Valfritt." example={domain.examples.barrier} value={answer.barrier} onChange={(value) => onText("barrier", value)} />
        </>}
      </div>
      <div className="mt-6"><PrimaryButton disabled={!answer.direction.trim()}>{stage === 0 ? "Fortsätt" : editing ? "Klar med området" : last ? "Se min Bullseye" : "Nästa område"}</PrimaryButton></div>
      <TextButton fullWidth onClick={onSkip}>{editing || answer.direction.trim() ? "Lämna området · behåll svaren" : "Hoppa över området"}</TextButton>
    </form></Card>
  );
}
