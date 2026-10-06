import { useId } from "react";

type Props = {
  label: string; hint?: string; value: string; onChange: (value: string) => void;
  maxLength: number; rows?: number; showCount?: boolean; error?: string;
};

export function TextAreaField({ label, hint, value, onChange, maxLength, rows = 3, showCount = true, error }: Props) {
  const id = useId();
  return <div>
    <label htmlFor={id} className="block text-base font-medium leading-6">{label}</label>
    {hint && <p id={`${id}-hint`} className="mt-1 text-body text-muted">{hint}</p>}
    <textarea id={id} value={value} onChange={(event) => onChange(event.target.value.slice(0, maxLength))} maxLength={maxLength} rows={rows}
      aria-invalid={error ? true : undefined} aria-describedby={[hint && `${id}-hint`, showCount && `${id}-count`, error && `${id}-error`].filter(Boolean).join(" ") || undefined} className="text-field mt-3" />
    {showCount && <p id={`${id}-count`} className="mt-1 text-right text-caption text-muted">{value.length}/{maxLength} tecken</p>}
    {error && <p id={`${id}-error`} role="alert" className="ui-error mt-2">{error}</p>}
  </div>;
}
