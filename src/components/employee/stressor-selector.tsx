"use client";

import { useId } from "react";
import { ChoiceCard } from "@/components/ui/choice-card";
type StressorSelectorProps<CategoryId extends string> = {
  value: readonly CategoryId[];
  onChange: (value: CategoryId[]) => void;
  categories: readonly { id: CategoryId; label: string }[];
};

export function StressorSelector<CategoryId extends string>({ value, onChange, categories }: StressorSelectorProps<CategoryId>) {
  const groupId = useId();

  return (
    <fieldset aria-describedby={`${groupId}-hint`}>
      <legend id={`${groupId}-hint`} className="text-sm text-muted">Välj ett eller flera alternativ.</legend>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 sm:gap-3">
        {categories.map((category) => {
          const checked = value.includes(category.id);

          return <ChoiceCard key={category.id} type="checkbox" name={groupId} value={category.id} checked={checked}
            onChange={() => onChange(checked ? value.filter((id) => id !== category.id) : [...value, category.id])}>{category.label}</ChoiceCard>;
        })}
      </div>
    </fieldset>
  );
}
