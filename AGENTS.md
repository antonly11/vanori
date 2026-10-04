# Projektinstruktioner för Vanori

## Syfte och omfattning

Vanori är en B2B-webbapplikation för medarbetares välmående, avsedd för produktion. Utveckla med integritet, tillgänglighet och tydlighet som grundkrav.

- Implementera bara funktioner som ingår i den aktuella uppgiften. Dessa instruktioner är inte en beställning på nya funktioner.
- Läs befintlig kod och relevanta instruktioner innan du gör ändringar. Följ etablerade mönster när de uppfyller kraven nedan.
- Föredra enkla, tydliga lösningar framför för tidiga abstraktioner. Gör inte större omstruktureringar utan behov.

## Samarbete och viktiga kontrollpunkter

- Arbeta ett steg i taget och förklara beslut och förändringar på enkel svenska.
- Användaren har uttryckligen bett om proaktiva påminnelser om viktiga krav. Lyft relevanta luckor när arbetet närmar sig dem, även om användaren inte själv frågar. Implementera inte andra funktioner bara för att de nämns i en påminnelse.
- Före lagring av riktiga svar: lyft identitetskoppling, dataminimering, lagringstid, radering och information till medarbetaren.
- Före chefsstatistik: lyft minsta gruppstorlek, undertryckande av resultat, risker med filter och jämförelser samt behörigheter och organisationsisolering på servern och i databasen.
- Före produktionssättning: lyft kvarstående säkerhets- och integritetskrav, tillgänglighet och nödvändiga verifieringar. Beskriv konkret vad som återstår.
- Skilj tydligt mellan mockdata, planerade skydd och skydd som faktiskt är implementerade och verifierade. Ge inte garantier om anonymitet utifrån att namn saknas.

## Teknik och arkitektur

- Använd Next.js med App Router, TypeScript och Tailwind CSS.
- Behåll strikt TypeScript. Undvik `any`, onödiga typkonverteringar och avstängda kontroller. Validera externa data vid systemets gränser; TypeScript ersätter inte validering vid körning.
- Använd Server Components som utgångspunkt. Lägg till `"use client"` bara där interaktion eller webbläsarens API:er kräver det.
- Håll affärslogik, behörighetsregler, datavalidering och dataåtkomst separerade från UI-komponenter. UI ska presentera data och hantera interaktion.
- Skapa återanvändbara komponenter när de har ett tydligt användningsområde. Bygg inte generella ramverk för hypotetiska framtida behov.
- Använd befintliga verktyg och plattformens funktioner först. Lägg bara till beroenden när de löser ett konkret problem och nyttan motiverar underhåll och komplexitet.

## Design och tillgänglighet

- Utgå från mobilskärmar och anpassa sedan layouten till större skärmar. Undvik horisontell rullning vid normala skärmstorlekar.
- Håll upplevelsen enkel, lugn och minimal, med tydlig hierarki, läsbar text och konsekventa avstånd.
- Gör formulär och navigering begripliga. Visa tydliga tillstånd för laddning, tomt innehåll, fel och lyckade åtgärder när de behövs.
- Bygg in tillgänglighet från början: semantisk HTML, korrekta rubriknivåer, etiketter för formulärfält och begripliga felmeddelanden.
- Alla interaktiva element ska fungera med tangentbord och ha synlig fokusmarkering. Använd tillräcklig kontrast, använd inte färg som enda informationsbärare och respektera inställningar för minskad rörelse.
- Föredra inbyggda HTML-element framför egna varianter. Komplettera med ARIA när det behövs.

## Medarbetarnas integritet

Integritet är ett arkitekturkrav och ska upprätthållas i dataåtkomst och serverlogik, inte enbart genom att dölja information i gränssnittet.

- Chefers funktioner får aldrig exponera enskilda medarbetares välmåendesvar. Det gäller även API-svar, exporter, rapporter, notifieringar och andra åtkomstvägar.
- Skicka inte individuella svar till en chefs klient för att sedan dölja eller summera dem där. Begränsa och sammanställ data på servern före leverans.
- Chefsrapporter får endast använda sammanställda uppgifter som inte avslöjar individers svar. Motverka återidentifiering genom små grupper, fritext, filterkombinationer eller jämförelser mellan rapporter.
- Fastställ och tillämpa minsta gruppstorlek och regler för undertryckande av resultat innan chefsrapportering implementeras. Hitta inte på en säker gräns; om regler saknas ska rapporteringen inte exponera resultaten.
- Kontrollera behörighet och organisationstillhörighet på servern vid varje skyddad läsning och skrivning. Lita inte på roller eller organisations-ID:n som klienten skickar.
- Samla in och lagra bara uppgifter som behövs för ett definierat ändamål. Bestäm lagringstid och radering när personuppgifter införs.
- Lägg inte välmåendesvar eller andra känsliga personuppgifter i loggar, analysverktyg, URL:er eller felmeddelanden. Använd syntetiska data i tester och exempel.
- Säkerställ att cachning inte delar känsliga uppgifter mellan användare eller organisationer.

## Hemligheter och säkerhet

- Exponera aldrig hemligheter i klientkod. Håll API-nycklar, databasuppgifter och andra hemligheter på servern.
- Använd inte `NEXT_PUBLIC_` för hemligheter; sådana variabler kan bli tillgängliga i webbläsaren.
- Lägg inte hemligheter i källkod, versionshistorik, loggar eller dokumentation. Exempelfiler får bara innehålla platshållare.
- Håll känsliga moduler på servern och använd `server-only` där det behövs för att förhindra klientimporter.
- Validera indata och gör behörighetskontroller även om gränssnittet redan begränsar vad användaren kan göra.

## Verifiering och överlämning

- Anpassa verifieringen till ändringen. För kodändringar, kör relevanta kontroller för lint, TypeScript och byggbarhet när det är möjligt.
- Prioritera meningsfulla tester för affärslogik, behörigheter, organisationsisolering och skyddet mot att individuella svar exponeras.
- Kontrollera responsivitet, tangentbordsanvändning och tillgänglighet vid ändringar i gränssnittet.
- Dokumentationsändringar kräver normalt inte ett nytt produktionsbygge.
- Beskriv vad som ändrats, vad som verifierats och eventuella kvarstående begränsningar. Påstå inte att en kontroll passerat om den inte har körts.

## Versionsspecifika Next.js-instruktioner

Behåll det automatiskt hanterade blocket nedan. Läs dokumentationen för den installerade versionen innan du skriver Next.js-kod.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
