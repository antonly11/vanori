import { useId, useState, type FormEvent } from "react";
import { directionExamples } from "@/lib/employee/support-plan";
import type { ValueDomainId } from "@/lib/employee/values";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SingleChoiceSelector } from "./single-choice-selector";

export function DirectionCompletion({ domain, onSave, onSkip }: { domain: ValueDomainId; onSave: (direction: string) => void; onSkip: () => void }) {
  const [example, setExample] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const id = useId();
  const direction = custom.trim() || example || "";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (direction) onSave(direction);
  }
  return <form onSubmit={submit}>
    <p className="text-sm leading-6 text-muted">Här saknas en egen riktning. Vad vill du värna om? Välj en formulering som känns som din, eller skriv med egna ord.</p>
    <div className="mt-4"><SingleChoiceSelector value={custom.trim() ? null : example} onChange={(value) => { setExample(value); setCustom(""); }} choices={directionExamples[domain].map((label) => ({ id: label, label }))} hint="Förslag att utgå från" /></div>
    <label htmlFor={id} className="mt-4 block text-sm font-medium">Min egen formulering</label>
    <textarea id={id} value={custom} onChange={(event) => { setCustom(event.target.value); setExample(null); }} maxLength={180} rows={3} aria-describedby={`${id}-hint`} className="text-field mt-2" />
    <p id={`${id}-hint`} className="mt-1 text-xs leading-5 text-muted">Max 180 tecken. Riktningen läggs till för det här besöket när du väljer ”Använd min riktning”.</p>
    <div className="mt-5"><PrimaryButton disabled={!direction}>Använd min riktning</PrimaryButton></div>
    <button type="button" onClick={onSkip} className="mt-2 min-h-11 w-full rounded-lg text-sm text-muted focus-visible:outline-2 focus-visible:outline-accent">Fortsätt utan en värdering</button>
  </form>;
}
