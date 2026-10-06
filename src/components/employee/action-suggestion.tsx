import { PrimaryButton } from "@/components/ui/primary-button";
import { TextButton } from "@/components/ui/secondary-button";
import { getOwnActionOptions } from "@/lib/employee/own-actions";
import type { SmallAction } from "@/lib/employee/support-plan";

type Props = {
  suggestions: readonly SmallAction[];
  ownActions: readonly string[];
  selection: SmallAction | null;
  onSelect: (action: SmallAction) => void;
  onTry: (action: SmallAction) => void;
};

export function ActionSuggestion({ suggestions, ownActions, selection, onSelect, onTry }: Props) {
  const ownOptions = getOwnActionOptions(ownActions);
  const ownChoices = ownOptions.flatMap((item) => [item.action, ...item.variations]);
  const action = selection?.source === "own" || selection?.source === "adapted"
    ? ownChoices.find((item) => item.title === selection.title && item.basedOn === selection.basedOn) ?? suggestions[0]
    : suggestions.find((item) => item.id === selection?.id) ?? suggestions[0];
  const index = suggestions.findIndex((item) => item.id === action?.id);
  if (!action) return <p className="text-sm text-muted">Det finns inget förslag för det här valet ännu.</p>;

  return <div className="min-w-0">
    <p className="text-xs text-muted">{action.source === "own" ? "Din egen idé" : action.source === "adapted" ? "En variation av din idé" : "DITT NÄSTA STEG"}</p>
    <div aria-live="polite" aria-atomic="true">
      <h2 className="mt-2 text-title font-medium [overflow-wrap:anywhere]">{action.title}</h2>
      <p className="mt-2 break-words text-body text-muted">{action.instruction}</p>
      {action.basedOn && <p className="mt-2 break-words text-caption text-muted">Utgår från din idé: {action.basedOn}</p>}
      {action.conversation && <p className="mt-3 text-caption text-muted">Samtalsstöd med: <span className="text-foreground">{action.conversation.withWhom}</span></p>}
    </div>
    <div className="mt-5"><PrimaryButton type="button" onClick={() => { onSelect(action); onTry(action); }}>Prova detta</PrimaryButton></div>
    {suggestions.length > 1 && <TextButton fullWidth onClick={() => onSelect(suggestions[(index + 1) % suggestions.length])}>Visa ett annat förslag</TextButton>}
    {ownOptions.length > 0 && <details className="mt-3 rounded-control border border-outline p-3">
      <summary className="ui-disclosure text-sm">Mina idéer och små variationer</summary>
      <p className="my-2 text-caption text-muted">Från din valda riktning. Du avgör vad som passar idag.</p>
      <ul className="space-y-3">{ownOptions.map((item) => <li key={item.action.id}>
        <button type="button" onClick={() => onSelect(item.action)} className="min-h-11 w-full rounded-lg border border-outline p-3 text-left text-body [overflow-wrap:anywhere] hover:border-accent focus-visible:outline-2 focus-visible:outline-accent">{item.action.title}</button>
        {item.variations.length > 0 && <details className="mt-1 pl-2">
          <summary aria-label={`Visa liknande idéer för: ${item.action.title}`} className="ui-disclosure text-xs text-muted">Visa liknande idéer</summary>
          <ul className="space-y-2">{item.variations.map((variation) => <li key={variation.id}><button type="button" onClick={() => onSelect(variation)} className="min-h-11 w-full rounded-lg border border-outline p-3 text-left text-body hover:border-accent focus-visible:outline-2 focus-visible:outline-accent">{variation.title}</button></li>)}</ul>
        </details>}
      </li>)}</ul>
    </details>}
  </div>;
}
