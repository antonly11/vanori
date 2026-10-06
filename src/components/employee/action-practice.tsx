import { useEffect, useRef } from "react";
import type { ActionPracticePlan } from "@/lib/employee/action-practice";
import type { ChosenValue } from "@/lib/employee/value-connection";
import { practiceFeedback, type PracticeProgress } from "@/lib/employee/workload-practice";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton, TextButton } from "@/components/ui/secondary-button";
import { SingleChoiceSelector } from "./single-choice-selector";
import { ConversationSupport } from "./conversation-support";

type Props = {
  plan: ActionPracticePlan;
  value: ChosenValue | null;
  progress: PracticeProgress;
  onProgress: (progress: PracticeProgress) => void;
  onAnother: () => void;
  onExit: () => void;
  onOther: () => void;
  hasOther: boolean;
};

export function ActionPractice({ plan, value, progress, onProgress, onAnother, onExit, onOther, hasOther }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(progress);
  useEffect(() => {
    if (progress.reflecting !== previous.current.reflecting || progress.smaller !== previous.current.smaller) heading.current?.focus();
    previous.current = progress;
  }, [progress]);

  return <div>
    <p className="text-xs text-muted">{plan.basis}</p>
    <h2 ref={heading} tabIndex={-1} className="mt-3 rounded-lg text-title font-medium [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-accent">
      {progress.reflecting ? "Hur fungerade steget för dig?" : progress.smaller ? "En mindre början" : plan.title}
    </h2>
    {progress.reflecting ? <>
      <p className="mt-2 text-body text-muted">Valfritt. Steget behöver inte ha gjort att allt känns bättre.</p>
      <div className="mt-4"><SingleChoiceSelector hint="Din upplevelse av steget" choices={practiceFeedback} value={progress.feedback} onChange={(feedback) => onProgress({ ...progress, feedback })} /></div>
      <p role="status" className="mt-4 text-body">{progress.feedback === "helpful" ? "Ta med dig det som fungerade. Du kan stanna här för idag." : progress.feedback === "not-fit" ? "Då kan vi prova en annan väg. Du behöver inte fortsätta med just det här steget." : progress.feedback === "not-tried" ? "Du kan återvända till steget när det passar, eller välja något annat." : ""}</p>
      <div className="mt-5"><PrimaryButton type="button" showArrow={false} onClick={onExit}>Klart för idag</PrimaryButton></div>
      {progress.feedback === "not-fit" && <TextButton fullWidth onClick={onAnother}>Prova ett annat förslag</TextButton>}
      <TextButton fullWidth onClick={() => onProgress({ ...progress, reflecting: false })}>Tillbaka till mitt steg</TextButton>
    </> : <>
      {progress.smaller && <p className="mt-2 text-body text-muted">Börja med förberedelsen. Du behöver inte göra resten nu.</p>}
      <ol className="mt-5 space-y-4">{(progress.smaller ? [plan.smallerStep] : plan.steps).map((step, index) => <li key={index} className="flex gap-3 text-sm leading-7">
        <span aria-hidden="true" className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs text-accent">{index + 1}</span>
        <span className="min-w-0 [overflow-wrap:anywhere]">{step}</span>
      </li>)}</ol>
      {plan.conversation && <p className="mt-4 text-body text-muted">Ta upp det med: <span className="text-foreground">{plan.conversation.withWhom}</span>.</p>}
      {plan.conversation && <details className="mt-4">
        <summary className="ui-disclosure text-sm text-accent">Ord att använda i samtalet</summary>
        <ConversationSupport guide={plan.conversation} />
      </details>}
      {value && <details className="mt-2">
        <summary className="ui-disclosure text-sm text-muted">Kopplingen till din riktning</summary>
        <p className="text-body">{plan.valuePrompt}</p>
        <p className="mt-2 text-xs text-muted">Din egen formulering</p><p className="mt-1 text-body [overflow-wrap:anywhere]">{value.direction}</p>
        <p className="mt-2 text-caption text-muted">Du avgör om kopplingen passar. Du kan ändra området och dina ord på stödsidan.</p>
      </details>}
      <div className="mt-5"><PrimaryButton type="button" showArrow={false} onClick={() => onProgress({ ...progress, reflecting: true })}>Jag har provat steget</PrimaryButton></div>
      <div className="mt-3"><SecondaryButton onClick={() => onProgress({ ...progress, smaller: !progress.smaller })}>{progress.smaller ? "Visa hela steget" : "Ett mindre steg"}</SecondaryButton></div>
      <TextButton fullWidth onClick={onAnother}>Det passar inte mig · byt förslag</TextButton>
      <TextButton fullWidth onClick={onExit}>Avsluta för idag</TextButton>
    </>}
    <details className="mt-4 border-t border-outline pt-2">
      <summary className="ui-disclosure text-sm text-muted">Jag behöver mer stöd</summary>
      <ConversationSupport guide={plan.support} />
    </details>
    {hasOther && <TextButton fullWidth onClick={onOther}>Utforska ett annat valt område</TextButton>}
    <p className="mt-4 text-caption text-muted">Utkast för psykologgranskning. Återkopplingen på steget gäller bara under det här besöket.</p>
  </div>;
}
