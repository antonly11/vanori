# Vanori

En lokal prototyp för medarbetares välmående. Byggd med Next.js App Router, strikt TypeScript och Tailwind CSS.

## Starta lokalt

Öppna terminalen i projektmappen, där `package.json` finns:

```sh
npm ci
npm run dev
```

Öppna sedan http://localhost:3000. Bullseye sparas lokalt i samma webbläsare; dagens måendesvar försvinner vid omladdning. Ingen inloggning, databas, AI eller chefsstatistik finns i prototypen. Använd påhittade testuppgifter: lokal lagring saknar åtkomstskydd och är inte en lösning för riktiga medarbetaruppgifter.

## Flödet

- Första besöket öppnar en välkomstsida med Vanoris logga, ”a moment for you” och en kort förklaring av Bullseye. ”Skapa min Bullseye” leder vidare till formuläret. Bara ett avslutat formulär gör att nya besök går till dagens måendefråga. ”Fortsätt en annan gång” lämnar formuläret för stunden; nästa besök öppnar välkomstsidan igen med utkasten kvar i formuläret. Detta gäller webbläsaren, inte en inloggad person. Introduktionen finns via Mina värderingar → Vad är Bullseye?
- Vänstermenyn på dator, eller den öppningsbara mobilmenyn, leder till Min dag, Mina värderingar och Mina handlingar. En påbörjad incheckning kan återupptas från menyn.
- Fyra frivilliga livsområden och egna handlingar går att ändra i menyn. Ändringarna sparas direkt lokalt och läses in vid nästa besök så att befintligt stöd kan återkoppla till dem.
- Endast Bullseye-fälten och formulärets status sparas under `vanori.prototype.bullseye.v1` i localStorage, tills användaren raderar dem. Radering finns i Mina värderingar → Lagring i den här prototypen och börjar om med välkomstsidan. Vid blockerad lagring fungerar sidan med tillfälliga svar och visar det tydligt. Riktiga inloggningar behöver senare en separat, privat profil per användarkonto.
- Fem måendenivåer med olika positiva, neutrala och stödjande vägar.
- Konkreta små steg för neutrala behov och fördjupning av samtliga sju stödkategorier. De sex nytillkomna grenarna använder en gemensam datastyrd frågemotor med situation, fördjupning och val av fokus vid flera svar.
- Flera val kan utforskas ett i taget. Alternativa och egna råd följer med när man går tillbaka.
- Alla stödkategoriers ”Prova detta” leder till ett konkret handlingssteg utifrån den valda orsaken eller en egen idé. Arbetsbelastningens befintliga råd finns kvar; de sex andra grenarna har 36 konkreta vägar och 72 unika råd som behöver psykologgranskas. Det går att välja en mindre början, byta råd, se samtalsstöd och frivilligt återkoppla hur steget fungerade. Dessa val behålls under besöket och försvinner vid omladdning.
- Appens och webbläsarens tillbakaknapp följer den faktiska vägen. Endast en slumpmässig sessionsmarkör och ett löpnummer läggs i webbläsarhistoriken. Svar och privata handlingar hamnar inte i URL:en eller webbläsarhistoriken.
- Egna idéer kan väljas direkt. Tydligt angivna promenader, fika och rörelse har valfria, skrivna variationer. Appen tolkar inte värderingstext eller fritext om måendet.

Alla råd och anpassningar är utkast för psykologgranskning. Prototypen är inte en färdig behandling.

## Kontroller

```sh
npm test
npm run lint
npx tsc --noEmit
npm run build -- --webpack
```

Testerna använder Nodes inbyggda testverktyg och den befintliga TypeScript-kompilatorn, utan extra beroenden. De kontrollerar navigation, bevarade val, återställning, osäkra svar, stödinnehåll, samtalsguider och Bullseye-positioner. Mobilvy och tangentbord behöver även kontrolleras i webbläsaren.

## Var koden finns

- `src/app`: startsida, layout, färger och ikoner.
- `src/components/employee`: formulär, val och presentation av stöd.
- `src/components/ui`: designsystemets knappar, kort, rubriker, textfält, valkort och logga.
- `src/lib/employee`: svarstillstånd, navigationsregler och skrivna stödtexter.
- `tests`: regressionstester för reglerna bakom flödet.

Designsystemet och reglerna för nya grenar dokumenteras i [design-system.md](design-system.md). Läs [AGENTS.md](../AGENTS.md) före fortsatt utveckling. Innan riktiga svar lagras krävs beslut om privat åtkomst, dataminimering, lagringstid och radering. Chefsrapportering kräver dessutom skydd för små grupper och kontroller av organisation och behörighet på servern.
