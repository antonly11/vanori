import { useId, type FormEvent } from "react";
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
  const id = useId();
  const maxLength = limit ?? (short ? 180 : 350);
  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium leading-6">{label}</label>
      <p id={`${id}-hint`} className="mt-1 text-sm leading-5 text-muted">{hint}</p>
      <textarea id={id} value={value} onChange={(event) => onChange(event.target.value.slice(0, maxLength))} maxLength={maxLength} rows={rows ?? (short ? 2 : 3)} aria-describedby={`${id}-hint ${id}-limit`} className="text-field mt-3" />
      <p id={`${id}-limit`} className="mt-1 text-right text-xs text-muted">{value.length}/{maxLength} tecken</p>
      <details className="mt-2 rounded-xl border border-outline px-3 text-sm leading-6">
        <summary aria-label={`Visa exempelsvar för: ${label}`} className="min-h-11 cursor-pointer content-center rounded-sm text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">Visa exempelsvar</summary>
        <p className="whitespace-pre-wrap pb-2">{example}</p>
        <p className="pb-3 text-xs leading-5 text-muted">Ett exempel, inget facit. Använd dina egna ord.</p>
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
    <form onSubmit={handleSubmit} className="rounded-3xl border border-outline bg-surface p-5 sm:p-7">
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
            {answer.alignment !== null && <button type="button" onClick={() => onAlignment(null)} className="mt-2 min-h-11 rounded-lg px-2 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent">Avstå från skattning</button>}
          </fieldset>
          <TextQuestion label={domain.actionQuestion} hint="Skriv gärna flera idéer, en per rad. Välj sådant som passar dig och det som är viktigt för dig. Valfritt." example={domain.examples.action} value={getSmallActionsText(answer)} onChange={(value) => onText("action", value)} limit={1000} rows={5} />
          <TextQuestion label={domain.barrierQuestion} hint="Tankar och känslor, eller omständigheter som tid, resurser och stöd. Valfritt." example={domain.examples.barrier} value={answer.barrier} onChange={(value) => onText("barrier", value)} />
        </>}
      </div>
      <div className="mt-6"><PrimaryButton disabled={!answer.direction.trim()}>{stage === 0 ? "Fortsätt" : editing ? "Klar med området" : last ? "Se min Bullseye" : "Nästa område"}</PrimaryButton></div>
      <button type="button" onClick={onSkip} className="mt-2 min-h-11 w-full rounded-xl text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent">{editing || answer.direction.trim() ? "Lämna området · behåll svaren" : "Hoppa över området"}</button>
    </form>
  );
}
