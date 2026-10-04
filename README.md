# Vanori

En lokal prototyp för medarbetares välmående. Byggd med Next.js App Router, strikt TypeScript och Tailwind CSS.

## Starta lokalt

Öppna terminalen i projektmappen, där `package.json` finns:

```sh
npm ci
npm run dev
```

Öppna sedan http://localhost:3000. Alla svar är tillfälliga och försvinner när sidan laddas om. Ingen inloggning, databas, AI eller chefsstatistik finns i prototypen.

## Flödet

- Introduktion och fyra frivilliga livsområden i en personlig Bullseye.
- Värderingar uppdateras direkt under besöket och går att ändra i menyn.
- Fem måendenivåer med olika positiva, neutrala och stödjande vägar.
- Konkreta små steg för neutrala behov och fördjupning av arbetsbelastning.
- Flera val kan utforskas ett i taget. Alternativa och egna råd följer med när man går tillbaka.
- Appens och webbläsarens tillbakaknapp följer den faktiska vägen. Endast en slumpmässig sessionsmarkör och ett löpnummer läggs i webbläsarhistoriken. Svar och privata handlingar ligger i tillfälligt minne och hamnar inte i URL:en.
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
- `src/components/ui`: gemensamma knappar.
- `src/lib/employee`: svarstillstånd, navigationsregler och skrivna stödtexter.
- `tests`: regressionstester för reglerna bakom flödet.

Läs `AGENTS.md` före fortsatt utveckling. Innan riktiga svar lagras krävs beslut om privat åtkomst, dataminimering, lagringstid och radering. Chefsrapportering kräver dessutom skydd för små grupper och kontroller av organisation och behörighet på servern.
