"use client";

import { TextButton } from "@/components/ui/secondary-button";
import { valueDomains, type ValueAnswer, type ValuesProfile } from "@/lib/employee/values";
import { ValuesDomainForm } from "./values-domain-form";
import { ValuesHeading } from "./values-heading";

type Props = {
  profile: ValuesProfile;
  screen: number;
  editing: boolean;
  onChange: (profile: ValuesProfile) => void;
  onFinish: () => void;
  onLater: () => void;
  onScreen: (screen: number) => void;
  onBack?: () => void;
};

export function ValuesOnboarding({ profile, screen, editing, onChange, onFinish, onLater, onScreen, onBack }: Props) {
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
      <ValuesHeading key={`heading-${screen}`} eyebrow={`BULLSEYE · OMRÅDE ${domainIndex + 1} AV 4 · ${stage === 0 ? "UTFORSKA" : "DIN RIKTNING"}`} description={!editing && screen === 0 ? "Vad är viktigt för dig? Din Bullseye hjälper oss att knyta stödet till din riktning. Du kan hoppa över områden och ändra dina svar senare." : "Du kan lämna området och återvända via Mina värderingar."}>{domain.label}</ValuesHeading>
      {!editing && screen === 0 && <p className="mb-5 text-caption text-muted">Lokal prototyp: använd påhittade svar. Bullseye sparas i denna webbläsare och kan ses av andra som använder den. Du kan radera den i Mina värderingar.</p>}
      <div className="mb-5 flex gap-2" aria-hidden="true">
        {valueDomains.map((item, index) => <span key={item.id} className={`h-1 flex-1 rounded-full ${index <= domainIndex ? "bg-accent" : "bg-outline"}`} />)}
      </div>
      <div className="mb-3 flex min-h-11 items-center justify-between gap-3 text-sm">
        {onBack && <TextButton onClick={onBack}>← Tillbaka</TextButton>}
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
      {!editing && <div className="mt-3"><TextButton onClick={onLater}>Fortsätt en annan gång</TextButton></div>}
    </>
  );
}
