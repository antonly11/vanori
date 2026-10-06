import { TextButton } from "@/components/ui/secondary-button";
import { PrimaryButton } from "@/components/ui/primary-button";
import { VanoriLogo } from "@/components/ui/vanori-logo";

export function ValuesIntroduction({ onStart, onLater }: { onStart: () => void; onLater: () => void }) {
  return (
    <>
      <section aria-labelledby="welcome-heading" className="rounded-card border border-outline bg-surface/60 px-5 py-6 text-center sm:px-12 sm:py-10">
        <VanoriLogo className="mx-auto size-14 text-accent sm:size-20" />
        <h1 id="welcome-heading" tabIndex={-1} className="mt-3 text-5xl font-medium tracking-[-0.05em] outline-none sm:text-6xl">vanori</h1>
        <p lang="en" className="mt-3 text-xl font-light tracking-wide text-accent sm:text-2xl">a moment for you</p>

        <div aria-hidden="true" className="mx-auto my-5 h-px w-12 bg-outline sm:my-8" />
        <div className="mx-auto max-w-md">
          <h2 className="text-title font-medium tracking-tight sm:text-2xl">Din personliga kompass.</h2>
          <p className="mt-4 text-body text-muted sm:text-base sm:leading-7">
            Med Bullseye utforskar du vad som är viktigt inom arbete, relationer, fritid och hälsa &amp; utveckling.
          </p>
          <p className="mt-3 text-body text-muted sm:text-base sm:leading-7">
            Sedan kan du stämma av din dag på jobbet och få förslag på små steg mot det som betyder något för dig.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-sm sm:mt-8">
          <PrimaryButton type="button" onClick={onStart}>Skapa min Bullseye</PrimaryButton>
          <p className="mt-3 text-caption text-muted">I din takt. Alla områden är frivilliga. Du kan ändra dina svar senare.</p>
          <TextButton fullWidth onClick={onLater}>Gör det senare</TextButton>
        </div>
      </section>

      <details className="mt-4 text-caption text-muted">
        <summary className="ui-disclosure ">Om den här prototypen · använd påhittade svar</summary>
        <p className="mt-1">Bullseye sparas i den här webbläsaren tills du raderar den i Mina värderingar. Andra som använder samma webbläsare kan se den.</p>
        <p className="mt-2">Bullseye är en övning inspirerad av ACT. Tavlans mitt visar hur nära du lever dina värderingar – det är inget betyg på dig. Frågorna och stödet behöver granskas av psykolog och utgör inte en färdig behandling.</p>
      </details>
    </>
  );
}
