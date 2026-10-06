import { Card } from "@/components/ui/card";
import type { ConversationGuide } from "@/lib/employee/workload-conversations";

export function ConversationSupport({ guide }: { guide: ConversationGuide }) {
  return <Card as="section" variant="inset" aria-label="Samtalsstöd" className="mt-4">
    <h3 className="text-xs font-medium tracking-wide text-accent">VÄND DIG TILL</h3>
    <p className="mt-2 text-sm font-medium leading-6">{guide.withWhom}</p>
    <p className="mt-1 text-body text-muted">{guide.reason}</p>
    <p className="mt-4 text-xs font-medium text-accent">DU KAN SÄGA</p>
    <blockquote className="mt-2 border-l-2 border-accent/50 pl-3 text-sm leading-7 break-words">”{guide.opening}”</blockquote>
    {guide.alternative && <details className="mt-3">
      <summary className="ui-disclosure text-sm text-muted">En annan väg till stöd</summary>
      <p className="mt-1 text-body text-muted">{guide.alternative}</p>
    </details>}
    <p className="mt-3 text-caption text-muted">Anpassa orden. Du väljer vad du delar.</p>
  </Card>;
}
