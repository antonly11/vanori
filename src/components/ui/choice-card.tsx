import type { ReactNode } from "react";

type Props = { type: "radio" | "checkbox"; name: string; value: string; checked: boolean; onChange: () => void; children: ReactNode };

export function ChoiceCard({ type, name, value, checked, onChange, children }: Props) {
  return <label className="relative cursor-pointer">
    <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="peer sr-only" />
    <span className="ui-choice">
      <span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center border ${type === "radio" ? "rounded-full" : "rounded-md"} ${checked ? "border-accent" : "border-muted"} ${type === "checkbox" && checked ? "bg-accent text-accent-ink" : ""}`}>
        {checked && (type === "radio" ? <span className="size-2.5 rounded-full bg-accent" /> : <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-3"><path d="m3 8 3 3 7-7" /></svg>)}
      </span>
      <span className="min-w-0 break-words text-sm font-medium leading-5">{children}</span>
    </span>
  </label>;
}
