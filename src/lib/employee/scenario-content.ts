import type { StressCategoryId } from "./stress-categories";
import type { ValueDomainId } from "./values";
import type { SmallAction } from "./support-plan";
import { listener, manager, representative, requester, type ConversationGuide } from "./workload-conversations";

export type ScenarioArea = Exclude<StressCategoryId, "workload">;
export type ScenarioDetail = { id: string; label: string; domain: ValueDomainId | null; actions: readonly SmallAction[]; support?: ConversationGuide };
export type ScenarioIssue = { id: string; label: string; question: string; domain: ValueDomainId | null; message: string; support?: ConversationGuide; details: readonly ScenarioDetail[] };
export type ScenarioDefinition = { issues: readonly ScenarioIssue[] };

// Editorial mock content, NOT validated questions or treatment. Psychologist review required.
// Work design and organisational support, alongside voluntary individual steps:
// https://www.hse.gov.uk/stress/standards/overview.htm
// https://www.who.int/publications-detail-redirect/9789240053052
// https://www.1177.se/liv--halsa/stresshantering-och-somn/stress/
const action = (id: string, title: string, instruction: string, steps: readonly [string, string], conversation?: ConversationGuide): SmallAction => ({ id, title, instruction, steps, conversation, source: "example" });
const detail = (id: string, label: string, domain: ValueDomainId | null, actions: readonly SmallAction[], support?: ConversationGuide): ScenarioDetail => ({ id, label, domain, actions, support });
const colleague = (opening: string): ConversationGuide => ({ withWhom: "Kollegan du samarbetar med, om kontakten känns trygg", reason: "Be om en konkret förändring i samarbetet.", opening, alternative: "Om kontakten känns otrygg: ta hjälp av skyddsombudet, om ni har ett, eller närmaste chef. Gäller problemet chefen, vänd dig till chefens chef." });
const safeSupport = representative("Jag behöver stöd kring [bemötande eller situation] och vill inte ta upp det ensam med den berörda personen. Vem kan hjälpa mig och hur går vi vidare?");
const care: ConversationGuide = { withWhom: "Företagshälsovården, om du har tillgång till den, eller vårdcentralen", reason: "Be om en bedömning om stress eller sömnproblem håller i sig eller påverkar vardagen.", opening: "Jag märker [besvär] och det påverkar [vardag eller arbete]. Jag skulle vilja få hjälp att bedöma vilket stöd jag behöver.", alternative: "Ring 1177 om du behöver råd om var du kan söka vård." };

export const scenarioDefinitions: Record<ScenarioArea, ScenarioDefinition> = {
  relationships: { issues: [
    { id: "cooperation", label: "Samarbetet skaver.", question: "Vad i samarbetet är svårt?", domain: "relationships", message: "Du kan vara tydlig med vad du behöver och samtidigt välja ett respektfullt sätt att möta andra.", details: [
      detail("misunderstanding", "Vi missförstår varandra.", "relationships", [
        action("rel-check", "Stäm av hur du uppfattade beskedet", "Börja med en konkret sak som blev oklar.", ["Välj ett besked där ni verkar ha olika bilder.", "Återge hur du uppfattade det och be om den andras bild."], colleague("Jag uppfattade [besked] som [min bild]. Hur menade du? Kan vi bekräfta vad vi kommit överens om?")),
        action("rel-agreement", "Samla det ni faktiskt är överens om", "Skapa en gemensam utgångspunkt före nästa uppgift.", ["Skriv en sak ni båda försöker åstadkomma.", "Be kollegan bekräfta nästa steg och vem som gör vad."], colleague("Vi vill båda få [uppgift] att fungera. Ska vi börja med [liten del] och bekräfta vem som gör vad?")),
      ]),
      detail("tension", "Det finns irritation eller återkommande konflikter.", "relationships", [
        action("rel-neutral", "Förbered en neutral beskrivning", "Beskriv händelsen utan att försöka avgöra den andras avsikt.", ["Skriv vad som hände och hur det påverkade arbetet.", "Formulera en förändring du vill be om, om kontakten känns trygg."], colleague("När [händelse] inträffar blir [arbete] svårt. Kan vi prova [förändring] i nästa samarbete?")),
        action("rel-facilitator", "Be om hjälp att hålla i ett samtal", "Återkommande konflikter behöver inte lösas av dig ensam.", ["Välj en återkommande situation som hindrar samarbetet.", "Be arbetsledaren ordna en gemensam avstämning och följa upp överenskommelsen."], manager("Vi fastnar återkommande i [situation]. Kan du hjälpa oss hålla i en avstämning om hur samarbetet ska fungera?")),
      ]),
    ] },
    { id: "support", label: "Jag saknar stöd eller gemenskap.", question: "Vilket stöd saknar du?", domain: "relationships", message: "Att be om stöd kan vara ett sätt att ge plats åt det du vill värna om, utan att behöva förklara allt.", details: [
      detail("alone", "Jag känner mig ensam eller utanför gemenskapen.", "relationships", [
        action("rel-invite", "Bjud in till en liten kontakt", "Välj en person vars sällskap känns tryggt.", ["Tänk på en kollega du skulle vilja ha mer kontakt med.", "Fråga om en kort gemensam paus när arbetet tillåter."], listener("Vill du ta en kort paus tillsammans när det passar? Jag skulle uppskatta lite sällskap.")),
        action("rel-routine", "Be om en återkommande kontaktpunkt", "Gemenskap kan behöva ett utrymme i arbetets upplägg.", ["Beskriv när du blir ensam i arbetet.", "Be arbetsledaren om en kort avstämning, gemensam start eller annan kontaktpunkt."], manager("Jag arbetar ofta ensam i [situation]. Kan vi skapa en återkommande kontakt eller avstämning i arbetsdagen?")),
      ]),
      detail("unavailable", "Jag får inte stöd när jag ber om det.", "work", [
        action("rel-specific-help", "Gör din förfrågan konkret", "Ett avgränsat behov kan vara lättare att ta ställning till.", ["Välj det moment där stöd skulle göra störst skillnad.", "Be arbetsledaren ange vem som kan hjälpa och när."], manager("Jag behöver hjälp med [moment] före [tid]. Vem kan stötta mig, och vad ska jag göra tills dess?")),
        action("rel-follow-up", "Bestäm hur en obesvarad fråga följs upp", "Du ska inte behöva vänta utan att veta nästa kontaktväg.", ["Samla den förfrågan som ännu saknar svar.", "Be om en tid för återkoppling och en reservkontakt."], manager("Min fråga om [stöd] saknar ännu svar. När kan vi följa upp, och vem kontaktar jag om hjälpen dröjer?")),
      ]),
    ] },
    { id: "treatment", label: "Jag blir illa bemött eller känner mig otrygg.", question: "Vad behöver du stöd kring?", domain: "health", support: safeSupport, message: "Din trygghet kommer först. Du behöver inte lösa ett otryggt bemötande genom att själv möta personen.", details: [
      detail("demeaning", "Jag upplever kränkningar eller återkommande utestängning.", "health", [
        action("rel-protected-support", "Välj en trygg väg till stöd", "Börja hos någon som kan hjälpa dig ta situationen vidare.", ["Välj skyddsombudet eller en ansvarig chef som inte är den berörda personen.", "Be om ett enskilt samtal och hjälp med hur frågan kan hanteras."], safeSupport),
        action("rel-private-note", "Förbered ett konkret exempel för stödsamtalet", "Du behöver inte samla allt eller skriva det i appen.", ["Notera för dig själv en händelse, när den inträffade och hur arbetet påverkades.", "Ta med exemplet till en trygg stödperson och fråga om nästa steg."], safeSupport),
      ], safeSupport),
      detail("unsafe", "Jag känner mig rädd eller hotad i en kontakt.", "health", [
        action("rel-safety", "Ta hjälp innan nästa kontakt", "Prioritera trygghet framför att reda ut konflikten själv.", ["Om du kan, lämna den otrygga kontakten och sök en trygg person. Vid omedelbar fara, ring 112.", "Be en ansvarig chef som inte är den berörda personen om stöd och en plan för fortsatt kontakt."], safeSupport),
        action("rel-accompanied", "Be att få stöd vid nödvändig kontakt", "Du behöver inte gå in i en otrygg situation ensam.", ["Beskriv vilken kontakt som gör dig rädd för en trygg ansvarig eller stödperson.", "Be om sällskap eller en annan kontaktväg innan nästa möte."], safeSupport),
      ], safeSupport),
    ] },
  ] },
  "clarity-control": { issues: [
    { id: "expectations", label: "Jag saknar tydliga förväntningar.", question: "Vad behöver bli tydligare?", domain: "work", message: "När ramarna blir tydligare kan du ge mer plats åt hur du vill arbeta.", details: [
      detail("result", "Jag vet inte vilket resultat som räcker.", "work", [
        action("clarity-example", "Be att få se ett tillräckligt resultat", "Ett exempel kan göra en oklar förväntning konkret.", ["Välj uppgiften där nivån är oklar.", "Be beställaren visa ett exempel på vad som måste vara med och vad som kan utgå."], requester("Kan du visa ett exempel på en tillräcklig leverans för [uppgift]? Vilka delar är viktigast?")),
        action("clarity-checkpoint", "Föreslå en tidig avstämning", "Pröva riktningen innan du lägger mer tid på uppgiften.", ["Ta fram en liten första skiss eller beskrivning.", "Be beställaren bekräfta riktningen innan du fortsätter."], requester("Jag tänker börja så här med [uppgift]. Kan vi stämma av en första skiss innan jag arbetar vidare?")),
      ]),
      detail("responsibility", "Ansvar eller besked från olika personer krockar.", "work", [
        action("clarity-owner", "Be om en tydlig beslutsägare", "Frågan behöver någon som kan samla beskeden.", ["Beskriv vilka två besked eller ansvarsområden som krockar.", "Be arbetsledaren utse vem som avgör och informerar de berörda."], manager("Jag får olika besked om [uppgift]. Vem avgör vad som gäller och ser till att alla får samma information?")),
        action("clarity-responsibility", "Rita en enkel ansvarslinje", "Skilj ditt moment från det som behöver någon annans beslut.", ["Skriv: min del, någon annans del och behöver beslut.", "Be chefen bekräfta gränsen och ansvarig för den öppna delen."], manager("Jag uppfattar att [del] är min och att [del] behöver ett annat beslut. Kan vi bekräfta ansvarsfördelningen?")),
      ]),
    ] },
    { id: "influence", label: "Jag har för lite möjlighet att påverka.", question: "Var saknar du handlingsutrymme?", domain: "work", message: "Ett steg kan handla om att få mer inflytande, inte om att anpassa dig till allt som redan bestämts.", details: [
      detail("method", "Jag kan inte påverka hur arbetet görs.", "work", [
        action("control-trial", "Föreslå ett avgränsat försök", "Visa vad en liten ändring av arbetssättet skulle möjliggöra.", ["Välj ett moment och beskriv en möjlig förbättring.", "Be ansvarig om ett begränsat försök och bestäm hur det följs upp."], manager("Kan vi prova [arbetssätt] i [moment] under en begränsad tid och stämma av vad som fungerar?")),
        action("control-mandate", "Fråga vilket mandat du redan har", "Det kan finnas en mindre del där du får välja själv.", ["Välj en uppgift där du vill ha större handlingsutrymme.", "Be arbetsledaren skilja på fasta ramar och de delar du kan besluta om."], manager("Vilka delar av [uppgift] är fasta, och vilka får jag själv välja?")),
      ]),
      detail("decisions", "Beslut som berör mig fattas utan mitt perspektiv.", "work", [
        action("control-voice", "Lämna ett konkret perspektiv före beslutet", "Beskriv en följd i ditt arbete som behöver vägas in.", ["Välj en konkret följd av det kommande beslutet.", "Fråga beslutsansvarig hur synpunkter lämnas och när beslutet tas."], manager("Beslutet påverkar [del av mitt arbete]. Hur kan jag lämna mitt perspektiv innan det fattas?")),
        action("control-representative", "Ta hjälp för att lyfta ett gemensamt hinder", "En arbetsmiljöfråga kan behöva föras vidare med stöd.", ["Beskriv vilket hinder beslutet skapar i arbetet.", "Be skyddsombudet om stöd att ta upp frågan med ansvarig."], representative("Jag behöver hjälp att lyfta [hinder] i ett beslut som berör arbetet. Hur kan vi ta det vidare?")),
      ]),
    ] },
    { id: "change", label: "En förändring gör mig osäker.", question: "Vad saknar du i förändringen?", domain: "work", message: "Du kan söka ett konkret besked och samtidigt värna om din riktning medan resten ännu är öppet.", details: [
      detail("information", "Jag vet inte vad som är beslutat eller vad som händer sedan.", "work", [
        action("change-facts", "Skilj ett besked från en öppen fråga", "Börja med den information du behöver för nästa arbetssteg.", ["Skriv en sak du vet och en sak som fortfarande saknar besked.", "Be ansvarig ange vad som är beslutat och när nästa uppdatering kommer."], manager("Vad är beslutat i [förändring], vad är öppet och när får vi nästa besked?")),
        action("change-channel", "Be om en gemensam plats för uppdateringar", "Samlad information kan minska behovet att jaga besked.", ["Välj den förändring där information sprids åt olika håll.", "Be ansvarig ange en kanal och en återkommande tid för information."], manager("Var samlas uppdateringarna om [förändring], och när kan jag förvänta mig nästa information?")),
      ]),
      detail("new-role", "Jag behöver förberedas för en ny roll eller uppgift.", "work", [
        action("change-introduction", "Be om introduktion till ett nytt moment", "Välj det första du behöver kunna innan du arbetar självständigt.", ["Identifiera ett nytt moment där vägledning saknas.", "Be chefen ordna handledare och tid att gå igenom det."], manager("Jag behöver introduktion till [moment]. Vem kan visa det och när finns tid i arbetsplanen?")),
        action("change-transition", "Stäm av vad som ska sluta och börja", "En ny roll behöver en tydlig övergång från den gamla.", ["Skriv en gammal uppgift som ännu ligger kvar och en ny som tillkommit.", "Be chefen bestämma överlämning och vad som ska utgå."], manager("När [ny uppgift] tillkommer, vad ska jag lämna över och till vem?")),
      ]),
    ] },
  ] },
  focus: { issues: [
    { id: "interruptions", label: "Jag blir avbruten ofta.", question: "Vilka avbrott påverkar dig mest?", domain: "work", message: "Arbetsro kan ge plats åt omsorg i arbetet. Du kan behöva både en egen avgränsning och stöd i planeringen.", details: [
      detail("digital", "Notiser eller många digitala kanaler.", "work", [
        action("focus-notifications", "Pausa en onödig notifiering", "Välj bara en kanal du får pausa i din roll.", ["Välj en uppgift och kontrollera vilka brådskande kanaler som måste vara öppna.", "Pausa en annan notifiering under en kort arbetsstund och återställ sedan." ]),
        action("focus-inbox", "Samla en del av meddelandena till en avstämning", "Du behöver inte ändra tillgänglighet som andra är beroende av.", ["Välj en kanal som inte kräver omedelbara svar.", "Stäm av med arbetsledaren när den kan hanteras samlat."], manager("Vilka meddelanden behöver direkt svar, och vilka kan jag samla till en bestämd avstämning?")),
      ]),
      detail("people", "Frågor eller nya uppgifter från andra.", "work", [
        action("focus-handover", "Ordna täckning för en arbetsstund", "Arbetsro ska inte lämna viktiga behov utan mottagare.", ["Välj en uppgift där du behöver sammanhängande tid.", "Be arbetsledaren ange vem som täcker frågor och vilka avbrott som ska nå dig."], manager("När kan jag arbeta ostört med [uppgift], vem tar andra frågor och vad måste fortfarande nå mig?")),
        action("focus-return", "Lämna en startpunkt innan du byter uppgift", "Gör det lättare att återvända efter ett nödvändigt avbrott.", ["Skriv en kort notering om var du är i uppgiften.", "Lägg till nästa konkreta moment innan du tar avbrottet." ]),
      ]),
    ] },
    { id: "environment", label: "Miljön gör det svårt att koncentrera mig.", question: "Vad i miljön stör mest?", domain: "work", message: "En miljö som stödjer arbetet är en förutsättning, inte något du ska behöva kompensera för ensam.", details: [
      detail("noise", "Ljud eller många människor omkring mig.", "work", [
        action("focus-place", "Pröva en tillåten lugnare plats", "Välj en förändring som fungerar med arbetsuppgiften.", ["Kontrollera om en lugnare plats är möjlig utan att påverka ansvar eller säkerhet.", "Pröva en kort stund där, eller be arbetsledaren ordna platsen."], manager("Finns en lugnare plats för [uppgift], och hur kan jag använda den med min roll?")),
        action("focus-noise-pattern", "Beskriv när ljudet hindrar arbetet", "Gör arbetsmiljöbehovet konkret.", ["Välj ett moment som störs av ljud eller rörelse.", "Be arbetsledaren om en förändring av plats eller upplägg för just det momentet."], manager("När [moment] görs i [miljö] blir [svårighet] ett hinder. Vad kan vi ändra?")),
      ]),
      detail("tools", "Verktyg eller arbetsplatsen fungerar dåligt.", "work", [
        action("focus-tool-report", "Beskriv ett verktygshinder för rätt mottagare", "Börja med det fel som stör ditt arbete mest.", ["Notera momentet och vad som händer, utan privata uppgifter.", "Ta systemfel till IT-support och utrustnings- eller platsproblem till arbetsledaren."], { withWhom: "IT-support för systemfel; arbetsledaren för utrustning eller arbetsplats", reason: "Be om hjälp att åtgärda ett konkret hinder.", opening: "Vid [moment] händer [fel] och arbetet hindras. Hur kan det åtgärdas och vad gäller under tiden?" }),
        action("focus-approved-option", "Be om ett godkänt sätt att arbeta under tiden", "Undvik att själv skapa en osäker genväg.", ["Beskriv uppgiften som inte fungerar med nuvarande verktyg.", "Be arbetsledaren om en godkänd reservlösning eller omprioritering."], manager("[Verktyg] fungerar inte för [uppgift]. Vilken godkänd lösning ska jag använda, eller vad ska vänta?")),
      ]),
    ] },
    { id: "starting", label: "Jag har svårt att börja eller hålla kvar fokus.", question: "Vad gör starten svår?", domain: "work", message: "Du kan prova en mindre start utan att först behöva känna dig helt fokuserad.", details: [
      detail("large-task", "Uppgiften känns stor eller svår att komma in i.", "work", [
        action("focus-first-piece", "Välj ett synligt första moment", "Sikta på att börja, inte på att lösa hela uppgiften.", ["Beskriv en handling du kan se dig själv göra, som att öppna underlaget eller läsa instruktionen.", "Gör bara den delen och avgör sedan vad nästa steg ska vara." ]),
        action("focus-start-help", "Be någon hjälpa dig hitta ingången", "En kort vägledning kan räcka för att komma igång.", ["Välj vad du inte vet hur du ska börja med.", "Be en erfaren kollega visa första momentet."], { withWhom: "En erfaren kollega eller handledare som kan uppgiften", reason: "Be om vägledning i starten.", opening: "Jag fastnar i starten av [uppgift]. Kan du visa det första momentet så jag kan prova själv?" }),
      ]),
      detail("thoughts", "Tankar eller oro drar bort uppmärksamheten.", "health", [
        action("focus-return-now", "Återvänd till en sak framför dig", "Tankarna behöver inte försvinna för att du ska kunna börja.", ["Lägg märke till att uppmärksamheten har vandrat, utan att kritisera dig själv.", "Välj ett konkret moment framför dig och pröva en liten del av det." ]),
        action("focus-name-question", "Ge en återkommande fråga en plats", "Skilj ett praktiskt behov från tankar som upprepar sig.", ["Skriv för dig själv den fråga som återkommer.", "Om den behöver besked, välj vem du kan fråga; annars välj en stund att prata med någon trygg."], listener("Jag fastnar i tankar kring [fråga]. Kan du lyssna en stund och hjälpa mig sortera vad jag behöver?")),
      ]),
    ] },
  ] },
  motivation: { issues: [
    { id: "meaning", label: "Arbetet känns mindre meningsfullt.", question: "Vad saknas i meningsfullheten?", domain: "work", message: "Det kan finnas en liten del som fortfarande betyder något. Du behöver inte tvinga fram motivation för att utforska den.", details: [
      detail("contribution", "Jag ser inte vad mitt arbete bidrar till.", "work", [
        action("mot-follow-result", "Följ en uppgift till den som får nytta av den", "Undersök bidraget utan att kräva att allt ska kännas meningsfullt.", ["Välj en uppgift du nyligen gjorde.", "Fråga en kollega eller ansvarig hur resultatet används och vad det underlättar."], requester("Hur används resultatet av [uppgift], och för vem gör det skillnad?")),
        action("mot-one-benefit", "Lägg märke till ett litet bidrag", "Börja med något konkret du redan gör.", ["Välj en del där ditt arbete underlättar ett nästa moment.", "Skriv för dig själv vad du vill fortsätta värna om i just den delen." ]),
      ]),
      detail("values-gap", "Det jag gör stämmer dåligt med det som är viktigt för mig.", "work", [
        action("mot-value-space", "Ge en värdering plats i ett arbetsmoment", "Välj något som går att påverka inom din roll.", ["Välj ett sätt du vill agera på, till exempel med omsorg eller nyfikenhet.", "Hitta ett litet arbetsmoment där det kan få plats utan extra arbetsmängd." ]),
        action("mot-role-discussion", "Ta upp en konkret krock i rollen", "En varaktig krock kan kräva förändring av förutsättningarna.", ["Beskriv en arbetsuppgift som krockar med det du vill värna om.", "Be chefen utforska en möjlig justering av rollen eller uppgiftens upplägg."], manager("I [uppgift] blir det svårt att värna [det viktiga]. Kan vi undersöka en justering av uppgiften eller rollen?")),
      ]),
    ] },
    { id: "recognition", label: "Jag saknar uppskattning eller återkoppling.", question: "Vilken återkoppling saknar du?", domain: "work", message: "Det kan hjälpa att efterfråga vad ditt bidrag betyder och vad du behöver för att utvecklas.", details: [
      detail("feedback", "Jag vet inte vad som fungerar i det jag gör.", "work", [
        action("mot-feedback-example", "Be om återkoppling på en tydlig insats", "Gör frågan lätt att svara på.", ["Välj en avgränsad insats du nyligen gjorde.", "Be ansvarig om ett exempel på vad som fungerade och ett nästa utvecklingssteg."], manager("I [insats], vad fungerade bra och vad kan jag utveckla nästa gång?", "Be om konkret återkoppling.")),
        action("mot-peer-feedback", "Stäm av ett moment med en erfaren kollega", "Du kan få hjälp att förstå arbetet innan en större avstämning.", ["Välj ett moment där du vill veta om du är på rätt spår.", "Be en erfaren kollega titta på just den delen."], colleague("Kan du titta på [moment] med mig och säga vad som fungerar och vad som behöver ändras?")),
      ]),
      detail("unseen", "Mina insatser eller behov uppmärksammas inte.", "work", [
        action("mot-visible-work", "Gör en insats synlig i nästa avstämning", "Beskriv vad du bidragit med utan att behöva försvara ditt värde.", ["Samla en insats och vilken nytta den gav.", "Ta upp den i nästa avstämning och fråga hur ditt bidrag ska följas upp."], manager("Jag har bidragit med [insats]. Jag skulle vilja få återkoppling på den och stämma av vilket stöd jag behöver framåt.")),
        action("mot-regular-review", "Be om en återkommande återkopplingstid", "Uppskattning och stöd behöver inte bero på att du alltid tar initiativ.", ["Bestäm vilken typ av återkoppling du saknar.", "Be chefen föreslå en kort, regelbunden avstämning."], manager("Kan vi ha en kort återkommande avstämning om mitt bidrag, min utveckling och det stöd jag behöver?")),
      ]),
    ] },
    { id: "growth", label: "Jag saknar utveckling eller variation.", question: "Vad skulle göra arbetet mer engagerande?", domain: "work", message: "Utveckling kan vara ett litet lärande i arbetet, utan att lägga ytterligare krav på din lediga tid.", details: [
      detail("learning", "Jag vill lära mig något men får inte utrymme.", "work", [
        action("mot-learning-slot", "Be om plats för ett lärmoment", "Koppla lärandet till en faktisk arbetsuppgift.", ["Välj en färdighet som skulle hjälpa dig i arbetet.", "Be chefen ordna avsatt tid och en person eller ett underlag att lära av."], manager("Jag vill lära mig [moment] för [uppgift]. Hur kan vi ge det plats i arbetstiden och vilket stöd finns?")),
        action("mot-observe", "Fråga om du får följa ett moment", "Börja med att se hur någon annan gör.", ["Välj ett moment du är nyfiken på.", "Stäm av med arbetsledaren och kollegan om du kan följa det under arbetstid."], colleague("Jag vill förstå [moment]. Finns en möjlighet att följa hur du gör, med tid avsatt i arbetet?")),
      ]),
      detail("repetition", "Arbetet känns ensidigt eller rutinmässigt.", "work", [
        action("mot-variety", "Föreslå en liten variation inom rollen", "Välj en förändring som fungerar med uppdraget.", ["Beskriv en återkommande del där variation skulle hjälpa.", "Be arbetsledaren undersöka byte av ordning eller en avgränsad uppgiftsväxling."], manager("Skulle en liten variation i [arbetsmoment] vara möjlig, till exempel [förslag], utan att öka arbetsmängden?")),
        action("mot-curiosity", "Undersök en sak i ett välbekant moment", "Nyfikenhet kan få plats utan att uppgiften måste förändras helt.", ["Välj en rutin och en fråga du är nyfiken på om den.", "Undersök frågan med en kollega eller inom det mandat du redan har." ]),
      ]),
    ] },
  ] },
  recovery: { issues: [
    { id: "breaks", label: "Jag får inte pauser som hjälper.", question: "Vad hindrar pausen?", domain: "health", message: "Återhämtning behöver utrymme i arbetet. Ett eget pausval ersätter inte bemanning eller avlösning.", details: [
      detail("coverage", "Jag kan inte lämna arbetet eller saknar avlösning.", "health", [
        action("rest-coverage", "Be om en bestämd avlösning", "Gör pausen till en del av arbetsplanen.", ["Beskriv vilket moment som gör att du inte kan lämna arbetet.", "Be arbetsledaren ange vem som täcker upp och när pausen kan tas."], manager("Jag kan inte lämna [moment] utan avlösning. Vem täcker, när kan jag ta paus och hur signalerar jag behovet?")),
        action("rest-escalate", "Ta hjälp med ett återkommande paushinder", "Om hindret kvarstår behövs stöd att förändra upplägget.", ["Välj en återkommande situation där pausen uteblir.", "Be skyddsombudet om stöd att ta upp planeringen med arbetsledaren."], representative("Jag saknar återkommande avlösning för paus i [situation]. Kan du hjälpa mig ta upp hur arbetet behöver organiseras?")),
      ]),
      detail("pause-activity", "Pausen fylls av jobb eller fler krav.", "health", [
        action("rest-less-input", "Välj en paus med färre intryck", "En paus behöver inte vara en ny uppgift att lyckas med.", ["Om arbetet tillåter, lämna jobbkanalerna en kort stund.", "Välj något enkelt: sitta still, dricka något eller gå ut en stund." ]),
        action("rest-pause-boundary", "Skydda pausen från arbetsfrågor", "Stäm av tillgängligheten så pausen kan få en tydlig gräns.", ["Välj en arbetskanal eller situation som fyller pausen.", "Be arbetsledaren klargöra vem som tar frågor under den tiden."], manager("Under pausen fortsätter [arbetsfrågor]. Vem kan ta dem så pausen blir möjlig, och vad räknas som brådskande?")),
      ]),
    ] },
    { id: "disconnect", label: "Jag har svårt att släppa jobbet efteråt.", question: "Vad följer med efter arbetsdagen?", domain: "leisure", message: "Ditt liv utanför jobbet kan få en tydligare start, även när allt på arbetet inte är färdigt.", details: [
      detail("contact", "Meddelanden eller förväntad tillgänglighet.", "leisure", [
        action("rest-hours", "Stäm av när du faktiskt behöver vara nåbar", "Tillgänglighet behöver tydliga överenskommelser.", ["Beskriv vilken kontakt som kommer på ledig tid.", "Be chefen klargöra vad som måste besvaras, av vem och inom vilka tider."], manager("Vilken kontakt behöver hanteras utanför min arbetstid, och vad kan vänta? Hur fördelas det ansvaret?")),
        action("rest-end-message", "Förbered en tydlig överlämning vid dagens slut", "Visa var arbetet fortsätter utan att lova ständig tillgänglighet.", ["Skriv vad som är klart, vad som återstår och var underlaget finns.", "Stäm av mottagare och nästa avstämning innan du avslutar."], colleague("Här är vad som återstår i [uppgift]. Kan vi bekräfta vem som tar vid och när vi stämmer av nästa gång?")),
      ]),
      detail("rumination", "Tankar om jobbet fortsätter hemma.", "leisure", [
        action("rest-close-loop", "Lämna nästa arbetssteg på jobbet", "Gör en liten avslutning utan att behöva lösa allt.", ["Notera för dig själv vad nästa arbetssteg är och när det kan tas.", "Välj sedan en liten övergång till ledig tid, till exempel en promenad eller musik." ]),
        action("rest-leisure-start", "Ge en ledig aktivitet en liten början", "Tankarna får finnas samtidigt som du gör något som betyder något.", ["Välj en enkel ledig aktivitet du uppskattar.", "Börja med en liten del och återvänd vänligt till den om jobbtankarna kommer." ]),
      ]),
    ] },
    { id: "fatigue", label: "Jag känner mig trött trots vila.", question: "Vad påverkar återhämtningen mest?", domain: "health", support: care, message: "Trötthet kan ha flera orsaker. Appen bedömer inte dem; du kan få hjälp med både arbetsvillkor och hälsa.", details: [
      detail("sleep", "Sömnen fungerar dåligt eller jag känner mig inte återställd.", "health", [
        action("rest-care", "Be om hjälp att bedöma besvären", "Om problemen håller i sig eller påverkar vardagen kan du söka vård.", ["Sätt ord på vad du märker och hur det påverkar dig, utan att skriva det i appen.", "Kontakta vårdcentralen eller företagshälsovården för råd och bedömning."], care),
        action("rest-share-load", "Ta upp behovet av anpassning medan du söker stöd", "Du behöver inte vänta med arbetsfrågan tills du har alla svar om hälsan.", ["Välj en del av arbetet som just nu blir svår att hantera.", "Be chefen undersöka en tillfällig anpassning och bestäm uppföljning."], manager("Jag behöver stöd att anpassa [del av arbetet] just nu. Vad kan vi ändra tillfälligt och när följer vi upp?")),
      ], care),
      detail("rest-time", "Jag får för lite sammanhängande tid för vila.", "health", [
        action("rest-schedule", "Synliggör en krock mellan arbete och vila", "Utgå från en återkommande del av planeringen.", ["Beskriv när arbetstiderna gör återhämtning svår.", "Be arbetsledaren eller schemaläggaren undersöka en konkret ändring."], manager("I [del av planeringen] blir tiden för återhämtning svår att få ihop. Vilka ändringar av arbetstid eller upplägg kan vi undersöka?")),
        action("rest-protect-time", "Värna en liten stund utan extra krav", "Börja med det utrymme som faktiskt finns, utan att ersätta behovet av mer vila.", ["Välj en möjlig stund där du inte behöver lägga till en uppgift.", "Ge den plats för stillhet eller något varsamt du tycker om." ]),
      ], care),
    ] },
  ] },
  other: { issues: [
    { id: "worry", label: "Oro tar mycket plats.", question: "Vad handlar oron mest om just nu?", domain: "health", message: "Du behöver inte avgöra om en tanke är sann för att välja vad du behöver härnäst.", details: [
      detail("answer", "Jag oroar mig för något jag behöver besked om.", "work", [
        action("other-known-unknown", "Gör en oklarhet till en fråga", "Välj den information som skulle hjälpa ditt nästa steg.", ["Skilj för dig själv på vad du vet och vad du ännu inte fått besked om.", "Formulera en fråga och välj ansvarig som kan svara."], manager("Jag saknar besked om [fråga]. Vad vet vi nu och när kan jag få nästa information?")),
        action("other-wait-plan", "Bestäm vad du kan göra medan beskedet dröjer", "En enkel plan kan ge väntan en tydligare ram.", ["Välj en uppgift som går att göra utan det saknade beskedet.", "Stäm av med arbetsledaren vad som ska vänta och när frågan följs upp."], manager("Medan vi väntar på [besked], vad kan jag göra och vad ska vänta? När följer vi upp?")),
      ]),
      detail("loop", "Oron återkommer utan en tydlig fråga att lösa.", "health", [
        action("other-orient", "Lägg märke till något här och nu", "Prova att ge uppmärksamheten en enkel plats utan att tvinga bort oron.", ["Om det känns okej, notera kontakten med stolen eller golvet och något du ser omkring dig.", "Välj sedan en liten handling som passar stunden. Avstå om övningen inte hjälper." ]),
        action("other-listen-worry", "Berätta hur oron påverkar dig", "Du behöver inte ha en färdig förklaring för att be om stöd.", ["Välj en person du känner dig trygg med.", "Säg om du vill bli lyssnad på eller få hjälp att hitta vidare stöd."], listener("Oron tar mycket plats just nu. Kan du lyssna en stund och hjälpa mig tänka på vilket stöd jag behöver?")),
      ], care),
    ] },
    { id: "outside", label: "Något utanför jobbet påverkar mig.", question: "Vad skulle underlätta idag?", domain: "relationships", message: "Du avgör vad du vill dela. Du kan be om ett arbetsmässigt stöd utan att berätta privata detaljer.", details: [
      detail("adjustment", "Jag behöver mer utrymme eller en tillfällig anpassning.", "health", [
        action("other-private-boundary", "Be om en anpassning utan privata detaljer", "Beskriv behovet i arbetet, inte allt som ligger bakom.", ["Välj en konkret ändring som skulle underlätta idag.", "Be chefen diskutera om den är möjlig och när ni följer upp."], manager("En privat situation påverkar mig. Jag vill inte gå in på detaljer, men skulle behöva [anpassning] i arbetet. Vad är möjligt?")),
        action("other-capacity-today", "Stäm av dagens realistiska utrymme", "Gör arbetsplanen hanterbar för just den här dagen.", ["Välj vad du kan genomföra och vad som behöver vänta.", "Be arbetsledaren bekräfta en tillfällig prioritering utan att kräva en privat förklaring."], manager("Idag behöver jag prioritera [del] och få hjälp med [annan del]. Kan vi göra en tillfällig plan?")),
      ]),
      detail("someone", "Jag behöver någon att prata med eller ha nära.", "relationships", [
        action("other-private-contact", "Ta en liten kontakt med någon trygg", "Välj själv om det är en närstående eller en kollega.", ["Välj en person du vill ha kontakt med.", "Fråga om en kort stund och säg hur mycket du vill dela."], { withWhom: "En närstående eller kollega du känner dig trygg med", reason: "Be om sällskap eller att bli lyssnad på.", opening: "Jag har det lite svårt just nu. Har du möjlighet till en kort stund? Jag vill gärna [prata eller bara ha sällskap]." }),
        action("other-contact-plan", "Bestäm en kontaktpunkt senare idag", "Det går att be om närvaro utan att prata om allt direkt.", ["Välj när en kontakt skulle passa och vem du vill fråga.", "Föreslå en enkel avstämning senare, utan krav på att lösa situationen." ]),
      ]),
    ] },
    { id: "unclear", label: "Jag vet inte riktigt vad som är svårt.", question: "Vad skulle vara mest hjälpsamt att börja med?", domain: null, message: "Det är okej att börja med ett behov utan att först hitta en grundorsak. Du väljer om en värdering känns relevant.", details: [
      detail("sort", "Sätta ord på en situation.", null, [
        action("other-one-event", "Välj en händelse utan att förklara hela dagen", "Börja med ett litet, konkret exempel.", ["Tänk på en stund då dagen blev svårare.", "Beskriv för dig själv vad som hände och vad du hade behövt just då." ]),
        action("other-sort-person", "Sortera ett ögonblick tillsammans med någon", "Du behöver inte veta vilken kategori som passar.", ["Välj en händelse du vill förstå bättre.", "Be en trygg kollega hjälpa dig sätta ord på ett behov utan att direkt lösa allt."], listener("Jag vet inte riktigt varför [situation] blev svår. Kan du hjälpa mig sortera vad som hände och vad jag behövde?")),
      ]),
      detail("space", "Få lite andrum innan jag tänker vidare.", "health", [
        action("other-soft-pause", "Ge dig själv en kravlös mellanlandning", "Du behöver inte analysera allt just nu.", ["Om arbetet tillåter, välj en kort stund utan nästa uppgift.", "Gör något enkelt som passar dig, som att dricka vatten eller gå ut en stund." ]),
        action("other-pause-support", "Be om en liten lucka med täckning", "Andrum kan behöva planeras med andra.", ["Välj vad du behöver täckning eller hjälp med för att få en stund.", "Be arbetsledaren ordna en kort avlösning eller flytta nästa start."], manager("Jag behöver lite utrymme innan jag fortsätter. Kan vi ordna täckning för [moment] eller flytta nästa start?")),
      ]),
    ] },
  ] },
};
