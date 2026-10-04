import { useId } from "react";
import { getValuePosition, hasValue, valueDomains, type ValueDomainId, type ValuesProfile } from "@/lib/employee/values";

export function BullseyeBoard({ profile, highlightedDomain }: { profile?: ValuesProfile; highlightedDomain?: ValueDomainId | null }) {
  const titleId = useId();
  const descriptionId = useId();
  const markedDomains = profile ? valueDomains.filter((domain) => hasValue(profile[domain.id]) && profile[domain.id].alignment !== null) : [];
  const highlighted = valueDomains.find((domain) => domain.id === highlightedDomain);
  const sectors: Record<ValueDomainId, string> = {
    work: "M180 180V68A112 112 0 0 1 292 180Z",
    relationships: "M180 180H292A112 112 0 0 1 180 292Z",
    leisure: "M180 180V292A112 112 0 0 1 68 180Z",
    health: "M180 180H68A112 112 0 0 1 180 68Z",
  };

  return <div className="mx-auto w-full max-w-80">
    <svg viewBox="40 40 280 280" role="img" aria-labelledby={`${titleId} ${descriptionId}`} className="w-full">
      <title id={titleId}>{profile ? "Din Bullseye-tavla" : "Bullseye: fyra områden i livet"}</title>
      <desc id={descriptionId}>
        {profile ? markedDomains.length > 0 ? markedDomains.map((domain) => `${domain.label}: ${profile[domain.id].alignment} av 7, där 7 är närmast mitten.`).join(" ") : "Inga skattningar har gjorts ännu." : "Fyra områden: arbete, relationer, fritid samt personlig utveckling och hälsa. Nära mitten betyder att handlingarna följer den egna värderingen."}
        {highlighted ? ` Lyft område: ${highlighted.label}. Tidigare skattningar är oförändrade.` : ""}
      </desc>
      {highlighted && <path d={sectors[highlighted.id]} fill={`${highlighted.color}25`} stroke={highlighted.color} strokeWidth="1.5" />}
      {[112, 96, 80, 64, 48, 32, 16].map((radius) => <circle key={radius} cx="180" cy="180" r={radius} fill={radius === 112 ? "#c3d2b708" : "none"} stroke="var(--field-outline)" />)}
      <path d="M68 180h224M180 68v224" stroke="var(--field-outline)" />
      <circle cx="180" cy="180" r="3" fill="var(--accent)" />
      {valueDomains.map((domain, index) => {
        const answer = profile?.[domain.id];
        if (!answer || !hasValue(answer) || answer.alignment === null) return null;
        const point = getValuePosition(index, answer.alignment);
        return <g key={domain.id}><circle cx={point.x} cy={point.y} r="9" fill={domain.color} stroke="var(--background)" strokeWidth="2" /><text x={point.x} y={point.y + 3.5} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--accent-ink)">{index + 1}</text></g>;
      })}
    </svg>
    <ol className="mb-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm leading-5 text-muted">
      {valueDomains.map((domain, index) => {
        const answer = profile?.[domain.id];
        return <li key={domain.id} className="flex min-w-0 gap-2">
          <span aria-hidden="true" className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-accent-ink" style={{ backgroundColor: domain.color }}>{index + 1}</span>
          <span>{domain.shortLabel}{answer && hasValue(answer) && answer.alignment !== null && <span className="block text-xs">{answer.alignment} av 7</span>}</span>
        </li>;
      })}
    </ol>
  </div>;
}
