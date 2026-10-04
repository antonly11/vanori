import { PrimaryButton } from "@/components/ui/primary-button";
import { BullseyeBoard } from "./bullseye-board";
import { ValuesHeading } from "./values-heading";

export function ValuesIntroduction({ onStart, onLater }: { onStart: () => void; onLater: () => void }) {
  return (
    <>
      <ValuesHeading eyebrow="DIN PERSONLIGA RIKTNING" description="Utforska vad som betyder något för dig, och små steg som kan ge det plats i vardagen.">Vad är viktigt för dig?</ValuesHeading>
      <div className="rounded-3xl border border-outline bg-surface p-5 sm:p-7">
        <div className="grid items-center gap-2 sm:grid-cols-2 sm:gap-6">
          <div className="mx-auto w-full max-w-48 sm:max-w-none"><BullseyeBoard /></div>
          <div className="space-y-4 text-sm leading-6">
            <h2 className="text-xl font-medium tracking-tight">En kompass för din vardag</h2>
            <p>Bullseye är en övning inom ACT. Du formulerar vad som är viktigt inom fyra livsområden.</p>
            <p className="text-muted">Nära mitten betyder att dina handlingar följer din riktning. Det är inget betyg på dig.</p>
          </div>
        </div>
        <div className="mt-5 border-t border-outline pt-5 text-sm leading-6">
          <p>”Vara en lyhörd kollega” är en värdering. ”Lyssna färdigt på nästa möte” är ett litet steg i den riktningen.</p>
          <p className="mt-3 text-muted">Du kan hoppa över områden och ändra dina svar i Mina värderingar.</p>
        </div>
        <div className="mt-6"><PrimaryButton type="button" onClick={onStart}>Utforska mina värderingar</PrimaryButton></div>
        <button type="button" onClick={onLater} className="mt-2 min-h-11 w-full rounded-xl text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent">Gör det senare</button>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted">ACT-inspirerad prototyp för reflektion. Frågorna behöver granskas av psykolog och utgör inte en färdig behandling.</p>
    </>
  );
}
