import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { getSmallActions, hasValue, valueDomains, type ValuesProfile } from "@/lib/employee/values";
import { BullseyeBoard } from "./bullseye-board";
import { ValuesHeading } from "./values-heading";
import { TextButton } from "@/components/ui/secondary-button";

export function ValuesOverview({ profile, onEdit, onDay, onIntroduction, onDelete, deleteError }: { profile: ValuesProfile; onEdit: (index: number) => void; onDay: () => void; onIntroduction: () => void; onDelete: () => void; deleteError: boolean }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const confirmation = useRef<HTMLDivElement>(null);
  const wasConfirming = useRef(false);
  useEffect(() => {
    if (confirmDelete || wasConfirming.current) confirmation.current?.querySelector<HTMLButtonElement>("button")?.focus();
    wasConfirming.current = confirmDelete;
  }, [confirmDelete]);
  const valueCount = valueDomains.filter((domain) => hasValue(profile[domain.id])).length;
  return (
    <>
      <ValuesHeading eyebrow="MINA VÄRDERINGAR" description="Dina egna ord, din egen riktning. Återvänd hit när du vill ändra eller lägga till något.">Din Bullseye</ValuesHeading>
      <div className="mb-3"><TextButton onClick={onIntroduction}>Vad är Bullseye?</TextButton></div>
      <Card>
        <BullseyeBoard profile={profile} />
        <p className="mx-auto max-w-md text-center text-body text-muted">Nära mitten betyder att dina handlingar har följt din riktning. Det är inget betyg på ditt mående.</p>
        <p className="mt-3 text-center text-xs text-muted">Områden utan skattning visas utan markering.</p>
        {valueCount === 0 && <p className="mt-5 rounded-control border border-outline p-4 text-body">Din tavla är öppen. Välj ett område nedan för att börja med dina egna ord.</p>}
      </Card>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {valueDomains.map((domain, index) => {
          const answer = profile[domain.id];
          const included = hasValue(answer);
          const smallActions = getSmallActions(answer);
          return (
            <Card as="section" key={domain.id} aria-labelledby={`value-${domain.id}`}>
              <div className="flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-accent-ink" style={{ backgroundColor: domain.color }}>{index + 1}</span>
                <h2 id={`value-${domain.id}`} className="pt-0.5 text-base font-medium leading-6">{domain.label}</h2>
              </div>
              {included ? <>
                <p className="mt-4 whitespace-pre-wrap break-words text-base leading-6">{answer.direction}</p>
                <p className="mt-3 text-xs text-muted">{answer.alignment === null ? "Ingen skattning ännu" : `Din skattning: ${answer.alignment} av 7 · senaste två veckorna`}</p>
                {smallActions.length > 0 && <div className="mt-4 border-t border-outline pt-3"><h3 className="text-xs font-normal text-muted">Mina små handlingar</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-body">{smallActions.map((action, actionIndex) => <li key={actionIndex} className="whitespace-pre-wrap break-words">{action}</li>)}</ul></div>}
                {(answer.reflection.trim() || answer.barrier.trim()) && <details className="mt-3 text-body"><summary className="ui-disclosure text-muted">Mina reflektioner</summary>{answer.reflection.trim() && <div className="mt-2"><p className="text-xs text-muted">Det som betyder något</p><p className="whitespace-pre-wrap break-words">{answer.reflection}</p></div>}{answer.barrier.trim() && <div className="mt-3"><p className="text-xs text-muted">Det som kan stå i vägen</p><p className="whitespace-pre-wrap break-words">{answer.barrier}</p></div>}</details>}
              </> : <p className="mt-4 text-body text-muted">Du har lämnat området öppet. Lägg till det när du vill.</p>}
              <div className="mt-3"><TextButton onClick={() => onEdit(index)} aria-label={`${included ? "Ändra" : "Utforska"} ${domain.label}`}>{included ? "Ändra" : "Utforska området"} <span aria-hidden="true">→</span></TextButton></div>
            </Card>
          );
        })}
      </div>
      <div className="mt-6"><PrimaryButton type="button" onClick={onDay}>Till min dag</PrimaryButton></div>
      <details className="mt-4 border-t border-outline pt-2">
        <summary className="ui-disclosure text-sm text-muted">Lagring i den här prototypen</summary>
        <p className="mt-2 text-xs leading-6 text-muted">Bullseye och egna handlingar sparas i denna webbläsare tills du raderar dem. Inget konto eller åtkomstskydd finns här. Använd påhittade svar på en egen testenhet. Måendesvar sparas inte mellan besöken.</p>
        <div ref={confirmation}>{confirmDelete ? <div role="group" aria-label="Bekräfta radering av Bullseye" className="mt-3 rounded-control border border-outline p-3">
          <p className="text-body">Radera Bullseye och egna handlingar? Det går inte att ångra. Sidan börjar sedan om med välkomstsidan.</p>
          <TextButton onClick={onDelete}>Ja, radera min Bullseye</TextButton>
          <TextButton onClick={() => setConfirmDelete(false)}>Behåll mina uppgifter</TextButton>
        </div> : <TextButton onClick={() => setConfirmDelete(true)}>Radera Bullseye i denna webbläsare</TextButton>}</div>
        {deleteError && <p role="alert" className="ui-error mt-2">Det gick inte att radera. Prova igen eller rensa webbplatsens data i webbläsaren.</p>}
      </details>
    </>
  );
}
