# Vanoris lilla designsystem

Utgår från befintlig mörkgrön design. Ingen ny UI-lib eller nya beroenden.

## Gemensamma regler

| Del | Regel |
| --- | --- |
| Färger | Befintliga variabler i globals.css: background, surface, foreground, muted, accent. field-outline för inmatning och sekundära knappar. |
| Typografi | Geist Sans. Sidrubrik 32 px / 1,15 på mobil, 44 px på större skärm. Mellanrubrik 20/28 px, brödtext 14/24 px, hjälptext 12/20 px. Textfält 16 px för läsbarhet och för att undvika automatisk zoom på mobil. Logga och slogan har egen varumärkestypografi. |
| Avstånd | 4 px grundsteg. 8–12 px mellan val, 16–24 px inom kort, 24–32 px mellan sidans delar. |
| Radie | control 12 px, inset 16 px, card 24 px. Runda indikatorer och Bullseye-markörer behåller cirkelform. |
| Bredd | content 672 px, shell 1152 px. Huvudinnehållet förblir centrerat även med vänstermenyn. |
| Knappar | Primär: minst 56 px hög, en tydlig huvudhandling. Sekundär: minst 48 px. Textknapp: minst 44 px. Samma fokusmarkering, avaktivering och hover. |
| Kort | Card: surface för huvudkort, inset för underordnat innehåll, quiet för diskret information. |
| Tillstånd | Valda alternativ visar både markering och färg. Avaktiverade knappar använder native disabled. Laddning har aria-busy/role=status. Fel har text och role=alert, fältfel även aria-invalid. Tomma listor har en begriplig förklaring och möjlig nästa handling. |
| Tillgänglighet | Native radio, checkbox, button, textarea, details. Etiketter och hjälptext kopplas till fälten. Fokus flyttas till sidrubriken vid stegbyte. Synlig tangentbordsfokus på kontroller. Ingen obligatorisk animation; övergångar respekterar minskad rörelse. |

## Komponenter

- Button: enda stället för knappstilar. PrimaryButton, SecondaryButton och TextButton behåller befintliga API:er.
- Card: yta och inre avstånd; kan renderas som div, section eller aside.
- PageHeading: sidrubrik, ögonbryn, beskrivning och valfri navigationsrad. ValuesHeading använder samma komponent.
- TextAreaField: etikett, hjälptext, teckengräns, räknare och valfritt fel.
- ChoiceCard: samma valkort för radio och kryssrutor. SingleChoiceSelector och StressorSelector äger gruppens semantik och urvalsregler.
- VanoriLogo: samma logga på välkomstsidan och i sidhuvudet.
- ui-disclosure: en gemensam stil för native details/summary.

Måendets fem ansikten och Bullseyes sjugradiga skala har specialiserade layouter; deras betydelse, ordning och tangentbordsbeteende har behållits.

## Grenar och innehåll

De sex nya grenarna styrs av scenario-content.ts. Varje kategori har tre situationer, två konkreta fördjupningar per situation, två unika råd per fördjupning och öppna svarsalternativ. Det är 36 konkreta vägar och 72 råd, inte ett uttömmande eller validerat frågeinstrument.

scenario-flow.ts äger tillåtna val, exklusiva osäkra svar, fokus, värderingsförslag och stödplaner. check-in-state.ts håller svar separata per kategori. ScenarioQuestions används även av arbetsbelastningen via en liten adapter. ActionPractice renderar handling, mindre början, samtalsstöd och återkoppling för alla sju kategorier.

Arbetsbelastningens befintliga frågor, råd och kontaktguider finns kvar. Dess genomarbetade datamodell behöver inte skrivas om för att lägga till de sex nya grenarna.

De nya sidorna använder enbart lokala mockregler. Fritext analyseras inte. Värderingsområdet är ett förslag utifrån uttryckliga val och kan ändras eller avstås. Ingen diagnos, ingen garanterad behandlingsverkan och ingen automatisk ändring av Bullseye-skattningen.

Vid uttryckligt val om otryggt bemötande föreslås en trygg stödväg; följdfrågor får hoppas över utan att stödet byts till konfrontation. Vid kvarstående trötthet finns kontakt med företagshälsovård/vårdcentral. Dessa redaktionella vägval behöver psykologens granskning före verklig användning.

Källor för riktning, inte validering av våra formuleringar:
- HSE: https://www.hse.gov.uk/stress/standards/overview.htm
- WHO: https://www.who.int/publications-detail-redirect/9789240053052
- 1177: https://www.1177.se/liv--halsa/stresshantering-och-somn/stress/

## Fortsatt arbete

Ändra gemensamma token/komponenter före lokala specialstilar. Lägg innehåll i data, inte i nya sidor per underkategori. Kontrollera mobil, tangentbord, fokus och kontrast när komponenter ändras. De nya stödtexterna och frågorna ska granskas av psykolog innan de används med riktiga medarbetare.
