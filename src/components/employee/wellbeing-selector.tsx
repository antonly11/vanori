"use client";

import { useId } from "react";
import { wellbeingLevels, type WellbeingLevel } from "./wellbeing-levels";

type WellbeingSelectorProps = {
  value: WellbeingLevel | null;
  onChange: (value: WellbeingLevel) => void;
};

export function WellbeingSelector({ value, onChange }: WellbeingSelectorProps) {
  const groupId = useId();

  return (
    <fieldset aria-describedby={`${groupId}-hint`}>
      <legend className="text-base font-medium">Välj det som stämmer bäst</legend>
      <p id={`${groupId}-hint`} className="mt-2 text-body text-muted">
        Du kan ändra ditt val.
      </p>
      <div className="mt-5 grid grid-cols-5 gap-1 sm:gap-3">
        {wellbeingLevels.map((level) => (
          <label key={level.value} className="relative cursor-pointer">
            <input
              type="radio"
              name={groupId}
              value={level.value}
              checked={value === level.value}
              onChange={() => onChange(level.value)}
              className="peer sr-only"
            />
            <span className="flex h-full min-h-32 flex-col items-center justify-center gap-2 rounded-control border border-outline px-0.5 py-3 text-muted motion-safe:transition-colors hover:border-accent hover:text-foreground peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-foreground peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent sm:min-h-36 sm:gap-3 sm:rounded-inset sm:px-2 sm:py-4">
              <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="size-7 shrink-0 sm:size-9">
                <circle cx="16" cy="16" r="14" />
                <path d="M11 12h.01M21 12h.01" strokeWidth="3" />
                <path d={level.mouth} />
              </svg>
              <span className="flex min-h-9 items-center justify-center text-center text-xs leading-[1.125rem] font-medium sm:text-sm sm:leading-5">{level.label}</span>
              <span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${value === level.value ? "border-accent bg-accent text-accent-ink" : "border-muted"}`}>
                {value === level.value && (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-3"><path d="m3 8 3 3 7-7" /></svg>
                )}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
