import { PrimaryButton } from "@/components/ui/primary-button";
import { getSmallActions, hasValue, valueDomains, type ValuesProfile } from "@/lib/employee/values";
import { BullseyeBoard } from "./bullseye-board";
import { ValuesHeading } from "./values-heading";

export function ValuesOverview({ profile, onEdit, onDay }: { profile: ValuesProfile; onEdit: (index: number) => void; onDay: () => void }) {
  const valueCount = valueDomains.filter((domain) => hasValue(profile[domain.id])).length;
  return (
    <>
      <ValuesHeading eyebrow="MINA VÄRDERINGAR" description="Dina egna ord, din egen riktning. Återvänd hit när du vill ändra eller lägga till något.">Din Bullseye</ValuesHeading>
      <div className="rounded-3xl border border-outline bg-surface p-5 sm:p-7">
        <BullseyeBoard profile={profile} />
        <p className="mx-auto max-w-md text-center text-sm leading-6 text-muted">Nära mitten betyder att dina handlingar har följt din riktning. Det är inget betyg på ditt mående.</p>
        <p className="mt-3 text-center text-xs text-muted">Områden utan skattning visas utan markering.</p>
        {valueCount === 0 && <p className="mt-5 rounded-xl border border-outline p-4 text-sm leading-6">Din tavla är öppen. Välj ett område nedan för att börja med dina egna ord.</p>}
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {valueDomains.map((domain, index) => {
          const answer = profile[domain.id];
          const included = hasValue(answer);
          const smallActions = getSmallActions(answer);
          return (
            <section key={domain.id} aria-labelledby={`value-${domain.id}`} className="min-w-0 rounded-2xl border border-outline bg-surface p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-accent-ink" style={{ backgroundColor: domain.color }}>{index + 1}</span>
                <h2 id={`value-${domain.id}`} className="pt-0.5 text-base font-medium leading-6">{domain.label}</h2>
              </div>
              {included ? <>
                <p className="mt-4 whitespace-pre-wrap break-words text-base leading-6">{answer.direction}</p>
                <p className="mt-3 text-xs text-muted">{answer.alignment === null ? "Ingen skattning ännu" : `Din skattning: ${answer.alignment} av 7 · senaste två veckorna`}</p>
                {smallActions.length > 0 && <div className="mt-4 border-t border-outline pt-3"><h3 className="text-xs font-normal text-muted">Mina små handlingar</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6">{smallActions.map((action, actionIndex) => <li key={actionIndex} className="whitespace-pre-wrap break-words">{action}</li>)}</ul></div>}
                {(answer.reflection.trim() || answer.barrier.trim()) && <details className="mt-3 text-sm leading-6"><summary className="min-h-11 cursor-pointer rounded-lg py-2 text-muted focus-visible:outline-2 focus-visible:outline-accent">Mina reflektioner</summary>{answer.reflection.trim() && <div className="mt-2"><p className="text-xs text-muted">Det som betyder något</p><p className="whitespace-pre-wrap break-words">{answer.reflection}</p></div>}{answer.barrier.trim() && <div className="mt-3"><p className="text-xs text-muted">Det som kan stå i vägen</p><p className="whitespace-pre-wrap break-words">{answer.barrier}</p></div>}</details>}
              </> : <p className="mt-4 text-sm leading-6 text-muted">Du har lämnat området öppet. Lägg till det när du vill.</p>}
              <button type="button" onClick={() => onEdit(index)} aria-label={`${included ? "Ändra" : "Utforska"} ${domain.label}`} className="mt-3 min-h-11 rounded-lg px-2 text-sm text-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent">{included ? "Ändra" : "Utforska området"} <span aria-hidden="true">→</span></button>
            </section>
          );
        })}
      </div>
      <div className="mt-6"><PrimaryButton type="button" onClick={onDay}>Till min dag</PrimaryButton></div>
    </>
  );
}
