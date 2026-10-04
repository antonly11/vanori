// Explicit editorial guidance for the prototype, awaiting psychologist review.
// Roles vary by organisation. No contacts are looked up and nothing is sent.
// Work organisation: AFS 2023:2, chapter 2 §§ 6–9.
// https://www.av.se/arbetsmiljoarbete-och-inspektioner/publikationer/foreskrifter/afs-20232/
// Care guidance: https://www.1177.se/liv--halsa/stresshantering-och-somn/stress/
export type ConversationGuide = {
  withWhom: string;
  reason: string;
  opening: string;
  alternative?: string;
};

const guide = (withWhom: string, reason: string, opening: string, alternative?: string): ConversationGuide => ({ withWhom, reason, opening, alternative });
const manager = (opening: string, reason = "Be om ett beslut om vad som ska ändras i arbetet."): ConversationGuide => guide(
  "Närmaste chef eller arbetsledaren som fördelar arbetet",
  reason,
  opening,
  "Om det känns svårt att gå till närmaste chef: be skyddsombudet om stöd inför samtalet, om ni har ett, eller vänd dig till chefens chef. Du kan säga: ”Jag behöver stöd för att ta upp min arbetssituation.”",
);
const requester = (opening: string): ConversationGuide => guide("Den som beställt uppgiften eller projektansvarig", "Be om tydliga krav för just den uppgiften.", opening, "Om flera beställare ger olika besked: be närmaste chef eller ansvarig arbetsledare avgöra prioriteringen.");
const scheduler = (opening: string): ConversationGuide => guide("Schemaläggaren eller arbetsledaren som planerar passen", "Ta upp vad som behöver ändras i planeringen.", opening, "Om bemanning eller arbetstid behöver ett chefsbeslut: be närmaste chef ta frågan vidare. Om kontakten känns svår kan ett skyddsombud ge stöd, om ni har ett.");
const mentor = (opening: string): ConversationGuide => guide("Din handledare eller en erfaren kollega som kan uppgiften", "Be om praktisk vägledning i det moment du behöver hjälp med.", opening, "Saknas handledare eller tid för vägledning? Be närmaste chef ordna introduktion och avsatt tid.");
const listener = (opening: string): ConversationGuide => guide("En kollega du känner dig trygg med", "Be om att bli lyssnad på. Kollegan behöver inte lösa situationen.", opening, "Behöver du ändrade arbetsvillkor? Ta det med närmaste chef. Om det känns svårt kan du förbereda samtalet med ett skyddsombud, om ni har ett.");
const representative = (opening: string): ConversationGuide => guide("Skyddsombudet på arbetsplatsen, om ni har ett", "Be om stöd att beskriva arbetsmiljöproblemet och ta det vidare.", opening, "Saknas skyddsombud, eller gäller problemet närmaste chef? Du kan vända dig till chefens chef och be om hjälp med arbetsmiljöfrågan.");

// Stable authored IDs keep conversation support intact when a title changes.
export const workloadConversations: Partial<Record<string, ConversationGuide>> = {
  "valj-en-sak-att-fa-avlastning-med": manager("Jag hinner inte med den här delen av arbetet. Kan vi bestämma vad som kan fördelas om och vem som tar det?"),
  "visa-vad-som-inte-ryms": manager("De här tre uppgifterna ryms inte i tiden jag har. Vilken ska flyttas eller tas bort, och när stämmer vi av igen?"),
  "be-om-konkret-avlastning": manager("Jag behöver avlastning med [uppgift] före [tid]. Kan vi bestämma vem som kan ta den delen eller vad som annars ska vänta?"),
  "forhandla-om-en-tidsram": requester("Till den här tidsgränsen kan jag få [del] klar. Ska vi flytta leveransen eller minska omfattningen?"),
  "skilj-bradskande-fran-tidskritiskt": requester("Vilken följd får det om [leverans] flyttas? Vilket datum måste hållas, och vilket arbete ska gå före?"),
  "skydda-en-kort-arbetsstund": manager("Jag behöver en sammanhängande stund för [uppgift]. När fungerar det, vem täcker övriga behov och vilka brådskande avbrott måste nå mig?", "Stäm av arbetsro och täckning med arbetsledaren och berörda kollegor."),
  "synliggor-en-krock-i-schemat": scheduler("Under [pass] krockar [uppgift] med [annan uppgift]. Kan vi ändra tiden eller fördela om en uppgift?"),
  "forbered-ett-hallbart-arbetspass": scheduler("Inför nästa pass saknas [bemanning, överlämning eller tid]. Hur planerar vi passet så att uppgifterna går att genomföra?"),
  "hitta-ratt-person-for-tydlighet": manager("Jag behöver ett besked om [fråga] för att kunna gå vidare. Kan du avgöra det, eller hjälpa mig till den som ansvarar?", "Börja hos arbetsledaren som kan reda ut ansvar och beslutsväg."),
  "be-om-en-tydlig-forstaplats": manager("[Uppgift A] och [uppgift B] konkurrerar om samma tid. Vilken ska jag börja med och vilken får vänta?"),
  "gor-en-gemensam-vantelista": manager("Här är mitt förslag på nu, sedan och kan vänta. Kan du bekräfta eller ändra ordningen så att vi har samma prioritering?"),
  "fraga-hur-klart-ser-ut": requester("Vilka delar måste finnas med för att uppgiften ska vara klar? Kan du visa ett exempel på rätt nivå?"),
  "bestam-var-uppgiften-slutar": requester("Jag har uppfattat att [del] ingår och att [annan del] ligger utanför. Stämmer det, och när räknar vi uppgiften som klar?"),
  "lagg-de-krockande-kraven-bredvid-varandra": manager("Jag har fått de här två kraven från olika håll och kan inte uppfylla båda i tiden som finns. Kan du samla de berörda och besluta vilket som ska gå före?"),
  "be-om-en-samlad-bestallning": manager("Instruktionerna om [uppgift] motsäger varandra. Vem kan ge ett samlat besked till mig och alla berörda?"),
  "rita-kanten-runt-ditt-ansvar": manager("Jag uppfattar att jag ansvarar för [del], men är osäker på [annan del]. Vad ingår i min roll och vem ansvarar för resten?", "Be chefen klargöra ansvar och vem som äger beslutet."),
  "fortydliga-en-overlamning": guide("Kollegan som ska ta över uppgiften", "Stäm av vad som lämnas över och när ansvaret byter händer.", "När kan du ta över [uppgift], och vilken information behöver du? Kan vi bekräfta när överlämningen är klar?", "Om ingen kan ta över: be arbetsledaren fördela ansvaret innan du lämnar uppgiften."),
  "be-om-skillnaden-mellan-fore-och-nu": manager("När förväntningen ändrades, vad tillkom och vad ska utgå? Kan vi skriva ned det nya beskedet så att jag kan återvända till det?"),
  "skapa-en-plats-for-andrade-besked": manager("Beskedet om [ändring] nådde mig för sent. Kan vi bestämma en gemensam kanal eller avstämning där ändringar samlas?"),
  "gor-ett-yttre-krav-forhandlingsbart": requester("Vad måste faktiskt levereras och när? Med tiden och stödet som finns behöver vi ändra [omfattning eller tidsram]. Vad kan vi justera?"),
  "be-om-ett-besked-om-ambitionsnivan": requester("Du har sagt [uttalat krav]. Jag har själv tolkat in [extra del]. Behövs den delen, eller räcker den uttalade nivån?"),
  "separera-bestallningen-fran-dina-extra-krav": requester("Det här är beställt, och det här har jag själv lagt till. Vilken extra del kan jag avstå från utan att missa det viktiga?"),
  "bestam-en-rimlig-gemensam-niva": requester("Det här förväntas, och jag lägger dessutom mycket tid på [egen ambition]. Vilken avgränsning är rimlig med tiden och resurserna vi har?"),
  "forbered-stod-infor-aterkoppling": listener("Jag ska ha ett återkopplingssamtal och känner mig orolig. Kan du hjälpa mig förbereda vad jag vill förstå och lyssna efteråt?"),
  "be-om-en-genomgang-av-forsta-momentet": mentor("Jag känner mig osäker på första momentet i [uppgift]. Kan du visa det och låta mig prova med dig bredvid?"),
  "gor-en-liten-ovningsversion": mentor("Finns ett säkert och godkänt sätt att öva [moment] innan skarpt arbete? Kan du ge återkoppling på en liten övningsversion?"),
  "valj-en-grans-med-stod": representative("Jag behöver sätta en gräns kring [arbetssituation] men har svårt att ta upp det. Kan vi förbereda ett konkret önskemål tillsammans?"),
  "ova-ett-respektfullt-nej": listener("Kan jag öva en mening med dig? Jag vill säga att jag inte kan ta en ny uppgift utan att något annat flyttas."),
  "planera-for-en-svar-reaktion": representative("Jag är orolig för reaktionen när jag tar upp [arbetsproblem]. Kan du hjälpa mig förbereda samtalet och planera vilket stöd jag kan få efteråt?"),
  "fortydliga-nar-du-kan-nas": manager("Vilka tider behöver jag vara tillgänglig och vad räknas som brådskande? När kan övriga meddelanden vänta?"),
  "koppla-en-ny-uppgift-till-ett-byte": manager("Jag arbetar redan med [uppgifter]. Vad ska jag lämna åt sidan om jag tar den nya uppgiften?"),
  "lagg-marke-till-ett-tidigt-tecken": manager("Jag märker [tidigt tecken] när arbetsdagen blir för mycket. Hur vill du att jag säger till, och vad gör vi då?", "Bestäm en tidig signal och vad arbetsledaren ska göra när den kommer."),
  "beskriv-gransen-som-behover-forutsattningar": manager("[Uppgift eller arbetstid] fungerar inte med förutsättningarna jag har. Kan vi bestämma vilken del som ska ändras?"),
  "sok-ett-gemensamt-stod-for-gransen": representative("Jag behöver hjälp att säga ifrån om [arbetsproblem]. Kan du hjälpa mig beskriva vad som behöver ändras och följa med i nästa samtal om det är möjligt?"),
  "skilj-omtanke-fran-att-bara-allt": manager("Jag vill att [behov] tas om hand, men kan inte bära hela uppgiften själv. Hur kan vi fördela ansvaret på fler?"),
  "forbered-en-omsorgsfull-overlamning": guide("Kollegan som ska ta över, tillsammans med arbetsledaren vid behov", "Bekräfta mottagare och ansvar så att uppgiften inte lämnas utan täckning.", "Här är vad som återstår och vad du behöver veta. Kan vi bekräfta vem som tar över och från vilken tid?", "Om mottagare saknas: be arbetsledaren ordna överlämningen."),
  "beskriv-ett-behov-av-aterhamtning": manager("Jag behöver mer utrymme för återhämtning under [del av arbetsdagen]. Vad kan ändras i planeringen för att göra det möjligt?", "Om hindret ligger i arbetets upplägg, be om hjälp att ändra det."),
  "be-om-plats-for-pausen-i-arbetsplanen": manager("[Arbete] tar pausens plats. Vad ska vänta eller fördelas om så att en paus faktiskt ryms i passet?"),
  "synliggor-arbetet-som-fyller-mellanrummen": manager("Mellan de planerade uppgifterna tillkommer [extra arbete], och då uteblir pausen. Hur räknar vi in det och ändrar arbetsmängden?"),
  "be-om-ett-tydligt-pausupplagg": scheduler("Jag kan inte lämna [moment] utan avlösning. Vem täcker upp, när kan jag ta paus och hur signalerar jag behovet?"),
  "lyft-paushindret-till-ratt-stod": representative("Jag kan inte ta paus eftersom [hinder eller saknad avlösning]. Kan du hjälpa mig ta upp hur arbetet behöver organiseras med arbetsledaren?"),
  "stam-av-kontakt-pa-ledig-tid": manager("Vilka behov ska faktiskt hanteras utanför min arbetstid? Hur avgränsar och fördelar vi dem så att min lediga tid kan vara ledig?"),
  "satt-ord-pa-vila-som-inte-racker": guide("Företagshälsovården, om ni har tillgång till den, eller din vårdcentral", "Om besvären håller i sig, eller stressen ger sömnproblem, ångest eller hjärtklappning: be om en bedömning.", "Jag får inte tillräcklig återhämtning trots att jag försökt [det jag provat]. Jag märker [besvär]. Jag vill få hjälp att bedöma vilket stöd jag behöver.", "Ring 1177 om du är osäker på var du ska söka vård."),
  "gor-en-sak-som-saknas-synlig": manager("Arbetet stannar upp när jag saknar [förutsättning]. Vem kan ordna det, och vad gör vi med uppgiften under tiden?"),
  "beskriv-vad-du-kan-gora-med-ratt-stod": manager("Med [stöd eller resurs] skulle jag kunna slutföra [uppgift]. Kan vi bestämma hur det ordnas och vad som ska vänta tills dess?"),
  "visa-ett-bemanningsglapp": manager("Under [pass eller moment] får [uppgift] ingen täckning. Behöver vi omfördela, öka bemanningen eller minska omfattningen?"),
  "gor-en-reservplan-for-lag-bemanning": manager("När vi är för få under [återkommande läge], vilka uppgifter ska utgå eller skjutas upp och vem fattar det beslutet?"),
  "formulera-beslutet-du-vantar-pa": manager("Jag väntar på besked om [alternativ A eller B]. [Uppgift] kan inte gå vidare innan dess. Vem avgör frågan och när kan jag få svar?", "Arbetsledaren kan ge besked eller klargöra vem som har beslutet."),
  "bestam-en-vag-nar-besked-uteblir": manager("Om besked om [fråga] dröjer, vem kan jag gå till och vad får jag göra under väntetiden?"),
  "be-om-tid-for-ett-konkret-larmoment": manager("Jag behöver lära mig [moment] innan jag arbetar självständigt. Kan du avsätta tid och utse någon som går igenom det med mig?", "Chefen behöver ordna tid och handledning i arbetsplanen."),
  "samla-din-forsta-kunskapslucka": mentor("Jag behöver förstå [moment eller rutin]. Kan du visa ett exempel eller gå igenom instruktionen med mig innan jag fortsätter?"),
  "gor-verktygshindret-mojligt-att-atgarda": guide("IT-support för systemfel; arbetsledaren för utrustning eller arbetsmiljö", "Beskriv hindret för den funktion som kan åtgärda just det.", "När jag gör [moment] händer [fel] och arbetet stannar. Kan ni hjälpa mig åtgärda det och säga hur jag ska arbeta under tiden?", "Saknas kontaktväg? Be arbetsledaren hjälpa dig hitta den. Skicka bara uppgifter som behövs för felet, utan privata eller känsliga uppgifter."),
  "stam-av-en-tillaten-tillfallig-losning": manager("[Verktyg eller system] fungerar inte, men [uppgift] behöver hanteras. Vilken godkänd lösning får jag använda, eller vad ska omprioriteras?"),
  "be-nagon-lyssna-innan-ni-loser": listener("Kan du lyssna en stund? Jag behöver sortera det här och vill börja utan att vi genast försöker lösa det."),
  "gor-stodet-regelbundet": guide("Din handledare eller närmaste chef", "Be om en återkommande avstämning om arbetet och det stöd du behöver.", "Jag skulle ha hjälp av en kort, återkommande avstämning om [behov]. Kan vi hitta en tid och bestämma vad vi ska följa upp?", "Om det främst handlar om att bli lyssnad på kan du i stället fråga en kollega du litar på."),
  "kartlagg-vagen-till-inflytande": manager("Jag vill påverka [beslut]. Vem fattar det, och i vilket möte eller på vilket sätt kan mitt perspektiv tas upp?"),
  "beskriv-tempots-konsekvens": manager("I [moment] gör det bestämda tempot att [konsekvens]. Vilken justering av tempo eller arbetsmängd kan vi pröva?"),
  "be-om-en-rutin-for-overbelastning": manager("När tempot blir ohållbart, hur ska jag signalera det? Vem agerar på signalen och vad ska ändras då?"),
  "foresla-ett-litet-forsok-med-arbetsordningen": manager("Om vi gör [moment] i en annan ordning skulle [fördel] bli möjligt. Kan vi prova under en begränsad tid och följa upp tillsammans?"),
  "fraga-vad-du-far-valja-sjalv": manager("Vilka delar av [uppgift] är fasta, och vad får jag själv välja när det gäller metod, ordning eller tid?"),
  "lamna-ett-konkret-onskemal-om-arbetstid": scheduler("En ändring av [tid eller pausplacering] skulle underlätta eftersom [behov]. Vilka alternativ finns?"),
  "undersok-hur-schemaonskemal-tas-om-hand": scheduler("När behöver jag lämna önskemål inför nästa schema, vem tar hand om dem och när kan jag få återkoppling?"),
  "forbered-ditt-perspektiv-infor-ett-forandringsbeslut": manager("Förändringen innebär [konkret följd] i mitt arbete. Var kan vi diskutera det, och hur lämnar jag mitt perspektiv innan nästa beslut?"),
  "be-om-insyn-i-nasta-beslutspunkt": manager("Vad är redan beslutat och vad är fortfarande öppet i [förändring]? Hur och när kan jag lämna synpunkter?"),
  "hitta-den-forsta-lattnaden": manager("Det skulle underlätta om [förändring]. Är det något vi kan ordna i arbetet, och vilket första beslut behövs?", "Om förändringen kräver andra arbetsvillkor, ta hjälp av den som kan besluta."),
  "utga-fran-vad-du-saknar-just-nu": listener("Just nu skulle jag behöva [behov]. Kan du hjälpa mig sortera om jag kan börja själv eller behöver ta det med arbetsledaren?"),
  "valj-vad-som-behover-minska": manager("[Uppgift, omfattning eller tidsram] behöver ändras för att arbetet ska rymmas. Kan vi besluta vilken del som ska minska?"),
  "beskriv-belastningen-utan-att-forsvara-den": manager("Det här förväntas av mig, och den här tiden och resursen finns. Hur anpassar vi kraven så att arbetet går att genomföra?"),
  "gor-en-karta-over-det-som-konkurrerar": manager("Här är uppgifter, tidsramar och besked jag väntar på. [Prioriteringsfråga] hindrar mig mest. Kan vi börja med ett beslut där?"),
  "skilj-dagens-arbete-fran-senare-arbete": manager("Jag har delat arbetet i idag, senare och behöver beslut. Kan du hjälpa mig bekräfta vad som faktiskt hör till idag?"),
  "gor-nasta-steg-synligt-och-litet": manager("Jag vill komma vidare med [uppgift] och behöver klarhet i [en sak]. Kan du ge ett första besked eller visa vem jag ska fråga?", "Om nästa steg behöver ett arbetsbeslut, börja med arbetsledaren."),
  "ta-bort-ett-hinder-framfor-starten": manager("För att börja med [uppgift] behöver jag [information, tid, material eller hjälp]. Hur kan det ordnas?"),
  "borja-samtalet-med-det-som-kanns-mest-rorigt": listener("Flera saker krockar och jag behöver hjälp att sortera. Kan du lyssna en stund så att jag kan hitta vad jag vill ta vidare?"),
  "bestam-vad-du-vill-fa-ut-av-samtalet": guide("En trygg kollega om du vill bli lyssnad på; arbetsledaren om du behöver ett beslut", "Välj mottagare efter vad du behöver få ut av samtalet.", "Jag skulle vilja börja med att [bli lyssnad på, sortera eller få ett beslut om en uppgift]. Kan vi avsätta en stund för det?", "Om ett chefsbeslut behövs men kontakten känns svår: be skyddsombudet om stöd, om ni har ett, eller kontakta chefens chef."),
  "be-om-ett-samtal-utan-en-fardig-forklaring": listener("Något känns svårt på jobbet och jag skulle vilja prata om det. Jag har ingen färdig förklaring, men kan vi börja med att du lyssnar?"),
  "skriv-en-forsta-mening-till-ett-stodsamtal": listener("Det jag helst vill att du förstår är [det viktiga för mig]. Kan du lyssna en stund och hjälpa mig sortera?"),
  "valj-den-paus-som-saknas-mest": scheduler("Under [del av passet] saknas en paus eller avlösning. Vem kan hjälpa till och hur kan vi skapa utrymmet i planeringen?"),
  "be-om-utrymme-innan-nasta-uppgift": scheduler("Jag behöver en stund innan nästa uppgift. Kan vi ordna avlösning eller flytta starten så att det blir möjligt?"),
  "valj-vad-du-behover-idag": listener("Jag skulle behöva [stöd eller förändring] för att dagen ska bli mer hanterbar. Kan du hjälpa mig tänka på ett första steg och vem som kan hjälpa?"),
};

export { manager, requester, listener, representative };
