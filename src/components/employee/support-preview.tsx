import { PrimaryButton } from "@/components/ui/primary-button";
import type { SmallAction } from "@/lib/employee/support-plan";
import { ConversationSupport } from "./conversation-support";

export function SupportPreview({ action, onExit, onOther, hasOther, otherLabel = "Utforska ett annat valt område" }: { action: SmallAction | null; onExit: () => void; onOther: () => void; hasOther: boolean; otherLabel?: string }) {
  return <div>
    <p className="text-xs text-muted">{action?.source === "own" ? "Din egen idé" : action?.source === "adapted" ? "En variation av din idé" : "Ditt valda steg"}</p>
    <h2 className="mt-2 text-lg font-medium [overflow-wrap:anywhere]">{action?.title ?? "Ge dig själv en stund"}</h2>
    {action?.basedOn && <p className="mt-2 break-words text-xs text-muted">Utgår från din idé: {action.basedOn}</p>}
    {action?.conversation ? <>
      <p className="mt-3 text-sm leading-7">{action.steps?.[0] ?? action.instruction}</p>
      <ConversationSupport guide={action.conversation} />
    </> : action?.steps ? <ol className="mt-4 space-y-3">{action.steps.map((instruction, index) => <li key={index} className="flex gap-3 text-sm leading-7"><span aria-hidden="true" className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">{index + 1}</span><span>{instruction}</span></li>)}</ol> : <p className="mt-3 text-sm leading-7 text-muted">{action?.instruction ?? "Du väljer vad som är möjligt idag."}</p>}
    <p className="mt-4 text-sm leading-6">Pröva när det passar. Du kan avsluta här.</p>
    <div className="mt-5"><PrimaryButton type="button" showArrow={false} onClick={onExit}>Klart för nu</PrimaryButton></div>
    {hasOther && <button type="button" onClick={onOther} className="mt-2 min-h-11 w-full rounded-lg text-sm text-muted focus-visible:outline-2 focus-visible:outline-accent">{otherLabel}</button>}
    <p className="mt-4 text-xs leading-5 text-muted">Utkast för psykologgranskning.</p>
  </div>;
}
