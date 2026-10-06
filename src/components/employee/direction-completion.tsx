import { useState, type FormEvent } from "react";
import { directionExamples } from "@/lib/employee/support-plan";
import type { ValueDomainId } from "@/lib/employee/values";
import { TextAreaField } from "@/components/ui/text-area-field";
import { TextButton } from "@/components/ui/secondary-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SingleChoiceSelector } from "./single-choice-selector";

export function DirectionCompletion({ domain, onSave, onSkip }: { domain: ValueDomainId; onSave: (direction: string) => void; onSkip: () => void }) {
  const [example, setExample] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const direction = custom.trim() || example || "";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (direction) onSave(direction);
  }
  return <form onSubmit={submit}>
    <p className="text-body text-muted">Här saknas en egen riktning. Vad vill du värna om? Välj en formulering som känns som din, eller skriv med egna ord.</p>
    <div className="mt-4"><SingleChoiceSelector value={custom.trim() ? null : example} onChange={(value) => { setExample(value); setCustom(""); }} choices={directionExamples[domain].map((label) => ({ id: label, label }))} hint="Förslag att utgå från" /></div>
    <div className="mt-4"><TextAreaField label="Min egen formulering" value={custom} onChange={(text) => { setCustom(text); setExample(null); }} maxLength={180} rows={3} showCount={false} hint="Max 180 tecken. Riktningen läggs till i din Bullseye när du väljer ”Använd min riktning”." /></div>
    <div className="mt-5"><PrimaryButton disabled={!direction}>Använd min riktning</PrimaryButton></div>
    <TextButton fullWidth onClick={onSkip}>Fortsätt utan en värdering</TextButton>
  </form>;
}
