"use client";

import { valueDomains, type ValueAnswer, type ValuesProfile } from "@/lib/employee/values";
import { ValuesDomainForm } from "./values-domain-form";
import { ValuesHeading } from "./values-heading";

type Props = {
  profile: ValuesProfile;
  screen: number;
  editing: boolean;
  onChange: (profile: ValuesProfile) => void;
  onFinish: () => void;
  onScreen: (screen: number) => void;
  onBack: () => void;
};

export function ValuesOnboarding({ profile, screen, editing, onChange, onFinish, onScreen, onBack }: Props) {
  const domainIndex = Math.floor(screen / 2);
  const domain = valueDomains[domainIndex];
  const stage = screen % 2 === 0 ? 0 : 1;
  const answer = profile[domain.id];

  function updateAnswer(patch: Partial<ValueAnswer>) {
    onChange({ ...profile, [domain.id]: { ...answer, ...patch } });
  }

  function nextDomain() {
    if (editing || domainIndex === valueDomains.length - 1) onFinish();
    else onScreen((domainIndex + 1) * 2);
  }

  return (
    <>
      <ValuesHeading key={`heading-${screen}`} eyebrow={`OMRÅDE ${domainIndex + 1} AV 4 · ${stage === 0 ? "UTFORSKA" : "DIN RIKTNING"}`} description="Svaren uppdateras direkt för det här besöket. Du kan lämna området och återvända.">{domain.label}</ValuesHeading>
      <div className="mb-5 flex gap-2" aria-hidden="true">
        {valueDomains.map((item, index) => <span key={item.id} className={`h-1 flex-1 rounded-full ${index <= domainIndex ? "bg-accent" : "bg-outline"}`} />)}
      </div>
      <div className="mb-3 flex items-center justify-between gap-3 text-sm">
        <button type="button" onClick={onBack} className="min-h-11 rounded-lg px-2 text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent">← Tillbaka</button>
        <span className="text-muted">Del {stage + 1} av 2</span>
      </div>
      <ValuesDomainForm
        key={`form-${screen}`}
        domain={domain}
        answer={answer}
        stage={stage}
        last={domainIndex === valueDomains.length - 1}
        editing={editing}
        onText={(field, value) => updateAnswer({ [field]: value })}
        onAlignment={(alignment) => updateAnswer({ alignment })}
        onContinue={() => {
          if (stage === 0) onScreen(screen + 1);
          else nextDomain();
        }}
        onSkip={editing ? onFinish : nextDomain}
      />
      {!editing && <button type="button" onClick={onFinish} className="mt-3 min-h-11 self-center rounded-xl px-4 text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent">Fortsätt en annan gång</button>}
    </>
  );
}
