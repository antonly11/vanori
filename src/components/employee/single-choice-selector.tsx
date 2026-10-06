import { useId } from "react";
import { ChoiceCard } from "@/components/ui/choice-card";

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
      <legend className="text-body text-muted">{hint}</legend>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
        {choices.map((choice) => <ChoiceCard key={choice.id} type="radio" name={id} value={choice.id} checked={value === choice.id} onChange={() => onChange(choice.id)}>{choice.label}</ChoiceCard>)}
      </div>
    </fieldset>
  );
}
