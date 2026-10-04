import { useId } from "react";

type Props<ChoiceId extends string> = {
  value: ChoiceId | null;
  onChange: (value: ChoiceId) => void;
  choices: readonly { id: ChoiceId; label: string }[];
  hint: string;
};

export function SingleChoiceSelector<ChoiceId extends string>({ value, onChange, choices, hint }: Props<ChoiceId>) {
  const id = useId();
  return (
    <fieldset>
      <legend className="text-sm leading-6 text-muted">{hint}</legend>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
        {choices.map((choice) => <label key={choice.id} className="relative cursor-pointer">
          <input type="radio" name={id} value={choice.id} checked={value === choice.id} onChange={() => onChange(choice.id)} className="peer sr-only" />
          <span className="flex h-full min-h-16 items-center gap-3 rounded-xl border border-outline p-3 motion-safe:transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent sm:p-4">
            <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full border border-muted">{value === choice.id && <span className="size-2.5 rounded-full bg-accent" />}</span>
            <span className="text-sm font-medium leading-5">{choice.label}</span>
          </span>
        </label>)}
      </div>
    </fieldset>
  );
}
