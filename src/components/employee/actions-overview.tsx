import { Card } from "@/components/ui/card";
import { TextAreaField } from "@/components/ui/text-area-field";
import { useId } from "react";
import { getSmallActions, hasValue, valueDomains, type ValueDomain, type ValueDomainId, type ValuesProfile } from "@/lib/employee/values";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextButton } from "@/components/ui/secondary-button";
import { ValuesHeading } from "./values/values-heading";

type Props = { profile: ValuesProfile; onChange: (domain: ValueDomainId, text: string) => void; onValues: () => void; onDay: () => void };

function ActionGroup({ domain, profile, onChange }: { domain: ValueDomain; profile: ValuesProfile; onChange: Props["onChange"] }) {
  const id = useId();
  const answer = profile[domain.id];
  const actions = getSmallActions(answer);
  return <Card as="section" aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`} className="flex items-center gap-3 text-base font-medium"><span aria-hidden="true" className="size-3 shrink-0 rounded-full" style={{ backgroundColor: domain.color }} />{domain.label}</h2>
    {actions.length ? <ul className="mt-4 list-disc space-y-2 pl-5 text-body">{actions.map((action, index) => <li key={index} className="[overflow-wrap:anywhere]">{action}</li>)}</ul> : <p className="mt-4 text-body text-muted">Här kan du samla små saker som passar dig, till exempel en promenad eller en stund med någon.</p>}
    <details className="mt-3">
      <summary aria-label={`${actions.length ? "Ändra handlingar" : "Lägg till handlingar"} för ${domain.label}`} className="ui-disclosure text-sm text-accent">{actions.length ? "Ändra handlingar" : "Lägg till handlingar"}</summary>
      <TextAreaField label={`Mina handlingar inom ${domain.shortLabel.toLocaleLowerCase("sv")}`} hint="En idé per rad · max 1 000 tecken. Ändringar gäller direkt." value={answer.action} onChange={(text) => onChange(domain.id, text)} rows={5} maxLength={1000} />
      <details className="mt-2">
        <summary className="ui-disclosure text-sm text-muted">Exempel att inspireras av</summary>
        <p className="whitespace-pre-wrap text-body text-muted">{domain.examples.action}</p>
      </details>
    </details>
    {!hasValue(answer) && actions.length > 0 && <p className="mt-3 text-caption text-muted">Lägg också till en riktning i Mina värderingar för att få med de här idéerna i ditt personliga stöd.</p>}
  </Card>;
}

export function ActionsOverview({ profile, onChange, onValues, onDay }: Props) {
  return <>
    <ValuesHeading eyebrow="MINA HANDLINGAR" description="Dina egna idéer för små steg och stunder av andrum. Du väljer vad som passar just nu.">Små steg för dig</ValuesHeading>
    <div className="grid gap-3 sm:grid-cols-2">{valueDomains.map((domain) => <ActionGroup key={domain.id} domain={domain} profile={profile} onChange={onChange} />)}</div>
    <div className="mt-6"><PrimaryButton type="button" onClick={onDay}>Till min dag</PrimaryButton></div>
    <TextButton fullWidth onClick={onValues}>Till mina värderingar</TextButton>
  </>;
}
