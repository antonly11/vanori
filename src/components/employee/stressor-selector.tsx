"use client";

import { useId } from "react";
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

          return (
            <label key={category.id} className="relative cursor-pointer">
              <input type="checkbox" name={groupId} value={category.id} checked={checked}
                onChange={() => onChange(checked ? value.filter((id) => id !== category.id) : [...value, category.id])}
                className="peer sr-only"
              />
              <span className="flex h-full min-h-16 items-center gap-3 rounded-xl border border-outline p-3 motion-safe:transition-colors hover:border-accent peer-checked:border-accent peer-checked:bg-accent/10 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent sm:p-4">
                <span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${checked ? "border-accent bg-accent text-accent-ink" : "border-muted"}`}>
                  {checked && <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-3"><path d="m3 8 3 3 7-7" /></svg>}
                </span>
                <span className="text-sm font-medium">{category.label}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
