import { useRef } from "react";
import type { EmployeeMenuItem } from "@/lib/employee/experience-navigation";

const items = [
  { id: "day", label: "Min dag", shortLabel: "Min dag", path: "M3 11.5 12 4l9 7.5M5 10v10h5v-6h4v6h5V10" },
  { id: "values", label: "Mina värderingar", shortLabel: "Värderingar", path: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" },
  { id: "actions", label: "Mina handlingar", shortLabel: "Handlingar", path: "m4 6 2 2 4-4M13 6h7M4 13l2 2 4-4M13 13h7M4 20h6M13 20h7" },
] as const;

type Props = { active: EmployeeMenuItem; onSelect: (item: EmployeeMenuItem) => void; onResume?: () => void };

function MenuItems({ active, onSelect, onResume, compact = false }: Props & { compact?: boolean }) {
  return <>
    <ul className="space-y-2">{items.map((item) => <li key={item.id}>
      <button type="button" aria-label={item.label} aria-current={active === item.id ? "page" : undefined} onClick={() => onSelect(item.id)} className={`flex w-full items-center rounded-control py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${compact ? "min-h-20 flex-col justify-center gap-2 px-1 text-center text-[11px]" : "min-h-12 gap-3 px-4 text-left text-sm"} ${active === item.id ? "bg-accent/15 font-medium text-accent" : "text-muted hover:bg-accent/5 hover:text-foreground"}`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={item.path} /></svg>
        <span>{compact ? item.shortLabel : item.label}</span>
      </button>
    </li>)}</ul>
    {onResume && <button type="button" aria-label="Fortsätt min incheckning" onClick={onResume} className={`mt-4 min-h-11 w-full rounded-lg border-t border-outline py-3 text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${compact ? "flex flex-col items-center gap-2 px-1 text-center text-[11px]" : "px-3 text-left text-sm"}`}>
      {compact ? <><span aria-hidden="true" className="text-xl">→</span><span>Fortsätt</span></> : <>Fortsätt min incheckning <span aria-hidden="true">→</span></>}
    </button>}
  </>;
}

export function EmployeeMenu({ active, onSelect, onResume }: Props) {
  const mobileMenu = useRef<HTMLDetailsElement>(null);
  function select(item: EmployeeMenuItem) {
    if (mobileMenu.current) mobileMenu.current.open = false;
    onSelect(item);
  }
  function resume() {
    if (mobileMenu.current) mobileMenu.current.open = false;
    onResume?.();
  }
  return <aside className="self-start">
    <nav aria-label="Din meny" className="fixed inset-y-0 left-0 z-20 hidden w-24 overflow-y-auto border-r border-outline/60 bg-background/95 px-2 py-28 lg:block">
      <MenuItems active={active} onSelect={onSelect} onResume={onResume} compact />
    </nav>
    <details ref={mobileMenu} className="rounded-inset border border-outline bg-surface/50 lg:hidden">
      <summary className="ui-disclosure flex min-h-12 list-none items-center justify-between gap-3 rounded-inset px-4 text-sm [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2"><svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>Meny</span>
        <span className="text-muted">{items.find((item) => item.id === active)?.label}</span>
      </summary>
      <nav aria-label="Din meny" className="border-t border-outline p-2"><MenuItems active={active} onSelect={select} onResume={onResume ? resume : undefined} /></nav>
    </details>
  </aside>;
}
