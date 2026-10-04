import { useState, type FormEvent } from "react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SingleChoiceSelector } from "./single-choice-selector";

export function FocusChoice<Id extends string>({ choices, initial, onContinue }: { choices: readonly { id: Id; label: string }[]; initial: Id | null; onContinue: (id: Id) => void }) {
  const [selected, setSelected] = useState(choices.some((choice) => choice.id === initial) ? initial : null);
  const valid = choices.some((choice) => choice.id === selected);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected !== null && valid) onContinue(selected);
  }
  return <form onSubmit={submit}>
    <SingleChoiceSelector value={selected} onChange={setSelected} choices={choices} hint="Välj ett fokus för nästa steg. Dina andra svar finns kvar." />
    <div className="mt-5"><PrimaryButton disabled={!valid}>Börja här</PrimaryButton></div>
  </form>;
}
