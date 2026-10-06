import { useEffect, useId, useRef } from "react";
import { getChosenValue, getValueConnectionContext } from "@/lib/employee/value-connection";
import { getActionSuggestions, type SmallAction } from "@/lib/employee/support-plan";
import { hasValue, valueDomains, type ValueDomainId, type ValuesProfile } from "@/lib/employee/values";
import type { StressCategoryId } from "@/lib/employee/stress-categories";
import { Card } from "@/components/ui/card";
import type { ScenarioAnswer } from "@/lib/employee/scenario-flow";
import type { WorkloadAnswer } from "@/lib/employee/workload-flow";
import { TextButton } from "@/components/ui/secondary-button";
import { BullseyeBoard } from "./values/bullseye-board";
import { DirectionCompletion } from "./direction-completion";
import { ActionSuggestion } from "./action-suggestion";

type Props = {
  profile: ValuesProfile;
  area: StressCategoryId;
  workload: WorkloadAnswer;
  scenario?: ScenarioAnswer;
  selected: ValueDomainId | null;
  skipValue: boolean;
  selection: SmallAction | null;
  onAction: (action: SmallAction) => void;
  onSelect: (domain: ValueDomainId) => void;
  onSave: (domain: ValueDomainId, direction: string) => void;
  onEdit: (domain: ValueDomainId) => void;
  onTry: (action: SmallAction) => void;
  onSkip: () => void;
};

export function ValueConnection({ profile, area, workload, scenario, selected, skipValue, selection, onAction, onSelect, onSave, onEdit, onTry, onSkip }: Props) {
  const id = useId();
  const context = getValueConnectionContext([area], workload, scenario);
  const domainId = skipValue ? null : selected ?? context.suggestedDomain;
  const chosen = getChosenValue(profile, domainId);
  const domain = valueDomains.find((item) => item.id === domainId);
  const directionRef = useRef<HTMLHeadingElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const hasDirection = chosen !== null;
  const previous = useRef({ hasDirection, skipValue });
  useEffect(() => {
    if (hasDirection && !previous.current.hasDirection) directionRef.current?.focus();
    else if (skipValue && !previous.current.skipValue) actionRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    previous.current = { hasDirection, skipValue };
  }, [hasDirection, skipValue]);

  return <div>
    <div ref={actionRef}><ActionSuggestion suggestions={getActionSuggestions(area, workload, scenario)} ownActions={chosen?.actions ?? []} selection={selection} onSelect={onAction} onTry={onTry} /></div>
    {chosen && <Card as="aside" variant="quiet" className="mt-4">
      <h2 ref={directionRef} tabIndex={-1} className="rounded-lg text-xs text-muted focus-visible:outline-2 focus-visible:outline-accent">Din riktning</h2>
      <p className="mt-1 break-words text-body">{chosen.direction}</p>
    </Card>}
    <details className="mt-3 border-t border-outline pt-2">
      <summary className="ui-disclosure text-sm text-muted">{chosen ? "Bullseye och mina värderingar" : "Lägg till en riktning (valfritt)"}</summary>
      <p className="my-3 text-body text-muted">{context.message}</p>
      {domain && !chosen && <DirectionCompletion key={domain.id} domain={domain.id} onSave={(direction) => onSave(domain.id, direction)} onSkip={onSkip} />}
      {domain && <div className="mx-auto my-4 max-w-80"><BullseyeBoard profile={profile} highlightedDomain={domain.id} /></div>}
      <fieldset className="mt-2">
        <legend className="text-sm text-muted">Vilket område känns mer relevant?</legend>
        <div className="mt-2 space-y-2">{valueDomains.map((item) => <label key={item.id} className="flex min-h-11 cursor-pointer gap-3 rounded-control border border-outline p-3 text-sm">
          <input type="radio" name={id} checked={domainId === item.id} onChange={() => onSelect(item.id)} className="mt-1 accent-accent focus-visible:outline-2 focus-visible:outline-accent" />
          <span className="min-w-0 break-words">{item.label}{hasValue(profile[item.id]) && <span className="mt-1 block text-muted">{profile[item.id].direction}</span>}</span>
        </label>)}</div>
      </fieldset>
      {chosen && <TextButton fullWidth onClick={() => onEdit(chosen.domainId)}>Ändra mina ord eller handlingar</TextButton>}
      {!skipValue && (chosen || !domain) && <TextButton fullWidth onClick={onSkip}>Fortsätt utan en värdering</TextButton>}
      {skipValue && <p className="mt-2 text-xs text-muted">Välj ett område ovan om du vill koppla ditt stöd till en riktning igen.</p>}
      <p className="mt-3 text-caption text-muted">Råden följer dina val om situationen. Dina egna idéer kommer från riktningen du väljer.</p>
    </details>
    <p className="mt-3 text-xs text-muted">Utkast för psykologgranskning.</p>
  </div>;
}
