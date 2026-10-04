import { workloadFollowUps, type WorkloadAnswer, type WorkloadIssueId } from "./workload-flow";
import { workloadConversations, type ConversationGuide } from "./workload-conversations";

// Original mock content for psychologist review. Work design and personal coping
// remain distinct; uncertain answers never imply an established underlying cause.
// https://www.hse.gov.uk/stress/standards/overview.htm
export type WorkloadSupport = { id: string; title: string; instruction: string; steps: readonly string[]; conversation?: ConversationGuide };
type Options = readonly [WorkloadSupport, WorkloadSupport, ...WorkloadSupport[]];
const s = (id: string, title: string, instruction: string, ...steps: string[]): WorkloadSupport => ({ id, title, instruction, steps, conversation: workloadConversations[id] });
type Bank = { [I in WorkloadIssueId]: { general: Options; details: Record<Exclude<(typeof workloadFollowUps)[I]["choices"][number]["id"], "other" | "unsure">, Options> } };

export const workloadSupport = {
  amount: {
    general: [
      s("se-var-tiden-tar-slut", "Se var tiden tar slut", "Utgå från en arbetsdag och synliggör vad som inte ryms.", "Skriv vilka uppgifter du förväntas hinna med.", "Markera en uppgift som behöver mer tid eller hjälp."),
      s("valj-en-sak-att-fa-avlastning-med", "Välj en sak att få avlastning med", "Gör behovet av hjälp konkret innan du tar upp det.", "Välj en uppgift du inte hinner med.", "Formulera vad någon annan skulle kunna hjälpa till med."),
    ],
    details: {
      volume: [
        s("visa-vad-som-inte-ryms", "Visa vad som inte ryms", "Gör arbetsmängden synlig för den som kan omprioritera.", "Skriv tre uppgifter och ungefär hur mycket tid de kräver.", "Fråga: ”Vilken uppgift ska flyttas eller tas bort?”"),
        s("be-om-konkret-avlastning", "Be om konkret avlastning", "Välj en del av arbetet som kan fördelas om.", "Beskriv uppgiften och när den behöver bli klar.", "Be om avlastning med just den delen, om det är möjligt."),
      ],
      deadlines: [
        s("forhandla-om-en-tidsram", "Förhandla om en tidsram", "Förbered ett alternativ till en deadline som inte håller.", "Välj en deadline och vad som realistiskt kan vara klart då.", "Föreslå antingen senare leverans eller mindre omfattning."),
        s("skilj-bradskande-fran-tidskritiskt", "Skilj brådskande från tidskritiskt", "Undersök vilket datum som faktiskt behöver hållas.", "Välj en leverans vars tidsgräns du behöver förstå.", "Be den ansvariga bekräfta vilket arbete som ska gå före."),
      ],
      interruptions: [
        s("parkera-nasta-avbrott", "Parkera nästa avbrott", "Om arbetet tillåter det: fånga en ny uppgift utan att genast byta fokus.", "Skriv den nya uppgiften på en separat lista.", "Återvänd till det du höll på med och bestäm när listan ska ses över."),
        s("skydda-en-kort-arbetsstund", "Skydda en kort arbetsstund", "Välj en uppgift som behöver sammanhängande uppmärksamhet.", "Bestäm en möjlig stund och vilka avbrott som måste kunna nå dig.", "Stäm av med berörda innan du begränsar övriga avbrott."),
      ],
      schedule: [
        s("synliggor-en-krock-i-schemat", "Synliggör en krock i schemat", "Ta ett konkret exempel på när arbetstiden och uppgifterna inte går ihop.", "Notera tidpunkten, uppgiften och vad som krockar.", "Be om en justering av schemat eller uppgiften."),
        s("forbered-ett-hallbart-arbetspass", "Förbered ett hållbart arbetspass", "Identifiera vad nästa pass behöver för att bli genomförbart.", "Välj en överlämning, bemanning eller tidslucka som saknas.", "Lyft behovet inför passet med den som planerar arbetet."),
      ],
    },
  },
  priorities: {
    general: [
      s("samla-det-som-behover-ett-beslut", "Samla det som behöver ett beslut", "Skapa en kort lista över frågetecknen i arbetet.", "Skriv högst tre saker som är oklara.", "Välj den fråga som hindrar dig mest just nu."),
      s("hitta-ratt-person-for-tydlighet", "Hitta rätt person för tydlighet", "Undersök vem som kan förklara vad som förväntas.", "Notera vilket beslut du behöver.", "Välj en person eller mötespunkt där frågan kan tas upp."),
    ],
    details: {
      order: [
        s("be-om-en-tydlig-forstaplats", "Be om en tydlig förstaplats", "Låt den som ansvarar välja vad som ska gå först.", "Lägg fram två uppgifter som konkurrerar om samma tid.", "Fråga: ”Vilken ska jag börja med och vilken får vänta?”"),
        s("gor-en-gemensam-vantelista", "Gör en gemensam väntelista", "Förbered en prioritering som kan bekräftas, inte gissas.", "Skriv ett förslag på ”nu”, ”sedan” och ”kan vänta”.", "Be den ansvariga korrigera eller bekräfta ordningen."),
      ],
      standard: [
        s("fraga-hur-klart-ser-ut", "Fråga hur klart ser ut", "Be om en konkret bild av ett godkänt resultat.", "Välj en uppgift där du är osäker på vad som räcker.", "Be om ett exempel på en leverans som håller rätt nivå."),
        s("bestam-var-uppgiften-slutar", "Bestäm var uppgiften slutar", "Avgränsa arbetet innan du lägger mer tid på det.", "Skriv vad du tror ska ingå och vad som ligger utanför.", "Stäm av avgränsningen med den som beställt uppgiften."),
      ],
      conflict: [
        s("lagg-de-krockande-kraven-bredvid-varandra", "Lägg de krockande kraven bredvid varandra", "Gör konflikten synlig för dem som behöver fatta beslut.", "Skriv vem som behöver vad och när.", "Be om ett gemensamt beslut om vilket krav som ska gå före."),
        s("be-om-en-samlad-bestallning", "Be om en samlad beställning", "Minska risken att få olika besked från olika håll.", "Beskriv kort hur instruktionerna motsäger varandra.", "Fråga vem som kan ge ett samlat besked till alla berörda."),
      ],
      role: [
        s("rita-kanten-runt-ditt-ansvar", "Rita kanten runt ditt ansvar", "Använd en oklar uppgift för att klargöra din roll.", "Skriv vad du tror att du ansvarar för och vad du är osäker på.", "Fråga vem som äger beslutet eller arbetet utanför din roll."),
        s("fortydliga-en-overlamning", "Förtydliga en överlämning", "Välj ett ställe där ansvar brukar falla mellan personer.", "Beskriv vad som ska lämnas över och till vem.", "Be att ni bestämmer när mottagaren tar över ansvaret."),
      ],
      change: [
        s("be-om-skillnaden-mellan-fore-och-nu", "Be om skillnaden mellan före och nu", "Fånga vad en ändrad förväntan innebär i praktiken.", "Notera den ändring som påverkar ditt arbete.", "Be om det nya beskedet på ett sätt du kan återvända till."),
        s("skapa-en-plats-for-andrade-besked", "Skapa en plats för ändrade besked", "Undersök hur förändringar kan nå dig i tid.", "Notera ett besked som kom för sent eller på fel kanal.", "Föreslå en gemensam kanal eller avstämning för ändringar."),
      ],
    },
  },
  pressure: {
    general: [
      s("hitta-ett-tillfalle-da-pressen-okade", "Hitta ett tillfälle då pressen ökade", "Börja med en situation, utan att behöva förklara hela mönstret.", "Notera vad som hände precis innan pressen steg.", "Skriv om det kom ett krav, en tanke eller något annat."),
      s("avgransa-det-som-kanns-kravande", "Avgränsa det som känns krävande", "Ge pressen en tydligare form att arbeta vidare med.", "Avsluta meningen: ”Det svåraste i den här uppgiften är …”", "Välj en del som du vill få hjälp att förstå."),
    ],
    details: {
      external: [
        s("gor-ett-yttre-krav-forhandlingsbart", "Gör ett yttre krav förhandlingsbart", "Välj en förväntan från andra som behöver konkretiseras.", "Skriv vilket yttre krav som är svårt att uppfylla.", "Beskriv vad som behöver ändras för att det ska vara möjligt."),
        s("be-om-ett-besked-om-ambitionsnivan", "Be om ett besked om ambitionsnivån", "Skilj uttalade förväntningar från sådant som lämnats öppet.", "Skriv vad du har fått höra och vad du själv tolkat in.", "Be om ett tydligt besked för den oklara delen."),
      ],
      self: [
        s("prova-ett-tillrackligt-bra-forsta-utkast", "Pröva ett tillräckligt bra första utkast", "Välj en liten uppgift där du säkert kan pröva en rimligare ambitionsnivå.", "Bestäm vad det första utkastet behöver innehålla.", "Gör utkastet innan du börjar finslipa detaljer."),
        s("ge-din-inre-regel-lite-avstand", "Ge din inre regel lite avstånd", "Lägg märke till ett eget krav utan att behöva lyda det direkt.", "Skriv: ”Jag märker tanken att jag måste …”", "Välj sedan ett litet steg utifrån vad uppgiften faktiskt behöver."),
      ],
      consequences: [
        s("skilj-det-du-vet-fran-det-du-befarar", "Skilj det du vet från det du befarar", "Ge oron för kritik en tydligare kontur.", "Skriv ett konkret besked du fått och vad du oroar dig för.", "Markera en fråga du behöver få svar på, utan att avfärda oron."),
        s("forbered-stod-infor-aterkoppling", "Förbered stöd inför återkoppling", "Planera hur du kan få hjälp i ett svårt återkopplingssamtal.", "Skriv vad du vill förstå eller få förtydligat.", "Välj någon du känner dig trygg med att prata med före eller efter."),
      ],
      confidence: [
        s("be-om-en-genomgang-av-forsta-momentet", "Be om en genomgång av första momentet", "Gör en ny uppgift mindre ensam och mer konkret.", "Välj det första moment du är osäker på.", "Be någon visa det eller göra det tillsammans med dig."),
        s("gor-en-liten-ovningsversion", "Gör en liten övningsversion", "Om det är säkert och tillåtet: öva en avgränsad del innan skarpt arbete.", "Välj vad du behöver öva och vem som kan ge återkoppling.", "Be om en övningsmiljö eller ett exempel där misstag kan hanteras."),
      ],
    },
  },
  boundaries: {
    general: [
      s("hitta-gransen-du-vill-uttrycka", "Hitta gränsen du vill uttrycka", "Börja med en situation där arbetet tar mer utrymme än du vill.", "Skriv vad du vill ha mer eller mindre av.", "Formulera ett önskemål som går att säga högt."),
      s("valj-en-grans-med-stod", "Välj en gräns med stöd", "Undersök vem som kan hjälpa dig att göra en gräns möjlig.", "Notera vilken gräns som känns svår.", "Välj en trygg person att förbereda den med."),
    ],
    details: {
      reaction: [
        s("ova-ett-respektfullt-nej", "Öva ett respektfullt nej", "Förbered orden innan du behöver använda dem.", "Prova: ”Jag kan inte ta detta nu utan att något annat flyttas.”", "Läs meningen för dig själv eller en trygg person och anpassa den."),
        s("planera-for-en-svar-reaktion", "Planera för en svår reaktion", "Ta din oro på allvar och förbered vilket stöd du kan behöva.", "Skriv vilken reaktion du är rädd för.", "Välj vem du kan kontakta om samtalet blir svårt."),
      ],
      availability: [
        s("fortydliga-nar-du-kan-nas", "Förtydliga när du kan nås", "Gör tillgänglighet till en gemensam förväntan.", "Notera när tillgängligheten börjar ta för mycket plats.", "Stäm av en tid då övriga meddelanden kan vänta."),
        s("koppla-en-ny-uppgift-till-ett-byte", "Koppla en ny uppgift till ett byte", "Visa att ett nytt åtagande behöver få plats i arbetstiden.", "Beskriv vad du redan arbetar med.", "Fråga: ”Vad ska jag lämna åt sidan om jag tar detta?”"),
      ],
      capacity: [
        s("lagg-marke-till-ett-tidigt-tecken", "Lägg märke till ett tidigt tecken", "Undersök hur du märker att arbetsdagen börjar bli för mycket.", "Notera ett tecken i fokus, kroppen eller arbetssättet.", "Välj vad du kan göra eller vem du kan säga till när det dyker upp."),
        s("stam-av-innan-nasta-ja", "Stäm av innan nästa ja", "Skapa utrymme att bedöma en ny uppgift innan du lovar något.", "Prova: ”Jag behöver se vad som ryms innan jag svarar.”", "Jämför uppgiften med den tid och hjälp som finns."),
      ],
      influence: [
        s("beskriv-gransen-som-behover-forutsattningar", "Beskriv gränsen som behöver förutsättningar", "Förbered en konkret begäran när du inte själv kan ändra arbetet.", "Skriv vilken uppgift eller arbetstid som blir ohållbar.", "Ta exemplet till chef, skyddsombud eller annat stöd som känns lämpligt."),
        s("sok-ett-gemensamt-stod-for-gransen", "Sök ett gemensamt stöd för gränsen", "Undersök om du behöver hjälp för att kunna säga ifrån.", "Välj en person eller funktion som kan stå bredvid dig.", "Be om hjälp att beskriva vad som behöver ändras."),
      ],
      responsibility: [
        s("skilj-omtanke-fran-att-bara-allt", "Skilj omtanke från att bära allt", "Undersök vilket ansvar som är ditt och vilket som kan delas.", "Skriv vad du vill värna om för andra.", "Välj en uppgift där ansvaret behöver fördelas på fler."),
        s("forbered-en-omsorgsfull-overlamning", "Förbered en omsorgsfull överlämning", "Gör plats för en gräns samtidigt som viktig information följer med.", "Samla det nästa person behöver veta.", "Stäm av vem som tar över, så ansvaret inte bara släpps."),
      ],
    },
  },
  recovery: {
    general: [
      s("se-vilken-aterhamtning-som-saknas", "Se vilken återhämtning som saknas", "Undersök en del av dagen där du inte får möjlighet att komma ned i varv.", "Välj arbetspasset, övergången hem eller ledigheten.", "Notera vad som hindrar vila just där."),
      s("beskriv-ett-behov-av-aterhamtning", "Beskriv ett behov av återhämtning", "Formulera vad som skulle ge dig mer utrymme att återhämta dig.", "Avsluta: ”Jag skulle behöva mer utrymme för …”", "Välj om behovet kan ordnas av dig eller behöver stöd från andra."),
    ],
    details: {
      "no-time": [
        s("be-om-plats-for-pausen-i-arbetsplanen", "Be om plats för pausen i arbetsplanen", "Om pauserna inte ryms behöver arbetsplanen ses över.", "Notera vad som tar pausens plats under ett arbetspass.", "Be den ansvariga planera vad som ska vänta eller fördelas om."),
        s("synliggor-arbetet-som-fyller-mellanrummen", "Synliggör arbetet som fyller mellanrummen", "Fånga de extra uppgifter som gör att pausen uteblir.", "Skriv ett exempel på arbete som läggs in mellan planerade uppgifter.", "Ta upp hur detta ska räknas in i arbetsmängden."),
      ],
      "no-control": [
        s("be-om-ett-tydligt-pausupplagg", "Be om ett tydligt pausupplägg", "Undersök hur en paus kan bli möjlig när du inte styr tidpunkten.", "Välj ett moment där du behöver avlösning för att kunna pausa.", "Be att ni bestämmer hur du signalerar att du behöver paus."),
        s("lyft-paushindret-till-ratt-stod", "Lyft paushindret till rätt stöd", "Beskriv vad i arbetets upplägg som hindrar dig från att ta paus.", "Skriv ett konkret exempel och vilken avlösning som saknas.", "Välj chef, skyddsombud eller annan lämplig kontakt för frågan."),
      ],
      "off-hours": [
        s("gor-ett-avslut-for-arbetsdagen", "Gör ett avslut för arbetsdagen", "Om arbetet tillåter: lämna en tydlig startpunkt till nästa arbetsdag.", "Skriv vad som återstår och vad nästa steg är.", "Stäng arbetet vid överenskommen sluttid."),
        s("stam-av-kontakt-pa-ledig-tid", "Stäm av kontakt på ledig tid", "Undersök vilka förväntningar som håller arbetet öppet efter dagen.", "Notera en situation där arbetet fortsätter efter din sluttid.", "Kom överens om hur sådana behov ska avgränsas och fördelas."),
      ],
      thoughts: [
        s("lamna-en-jobbtanke-pa-papper", "Lämna en jobbtanke på papper", "Fånga det som dyker upp utan att behöva lösa det nu.", "Skriv tanken och när du kan återkomma till den.", "Återvänd till en vald aktivitet på din lediga tid."),
        s("skapa-en-liten-overgang-hem", "Skapa en liten övergång hem", "Välj en handling som markerar att arbetsdagen är över.", "Pröva att byta miljö, kläder eller ta en kort promenad om det passar.", "Låt jobbtankar få finnas medan du ger nästa del av dagen plats."),
      ],
      rest: [
        s("skydda-en-befintlig-stund-av-vila", "Skydda en befintlig stund av vila", "Välj en stund som redan finns, utan att göra återhämtning till ännu en prestation.", "Bestäm en aktivitet som får vänta under den stunden.", "Välj något stillsamt som du själv upplever som återhämtande."),
        s("satt-ord-pa-vila-som-inte-racker", "Sätt ord på vila som inte räcker", "Beskriv ditt återhämtningsbehov för någon som kan ge stöd.", "Notera vad du försökt och vad som fortfarande känns svårt.", "Överväg kontakt med företagshälsovård eller vården om besvären håller i sig."),
      ],
    },
  },
  resources: {
    general: [
      s("gor-en-sak-som-saknas-synlig", "Gör en sak som saknas synlig", "Avgränsa behovet så att någon kan förstå vilken hjälp du söker.", "Avsluta: ”Arbetet stannar upp när jag saknar …”", "Välj vem som kan bidra till att ordna det."),
      s("beskriv-vad-du-kan-gora-med-ratt-stod", "Beskriv vad du kan göra med rätt stöd", "Knyt resursbehovet till en konkret arbetsuppgift.", "Skriv vad du skulle kunna slutföra om stödet fanns.", "Använd exemplet när du ber om hjälp."),
    ],
    details: {
      staff: [
        s("visa-ett-bemanningsglapp", "Visa ett bemanningsglapp", "Utgå från ett pass eller moment där bemanningen inte räcker.", "Beskriv vilken uppgift som inte får täckning.", "Be om omfördelning, extra bemanning eller minskad omfattning."),
        s("gor-en-reservplan-for-lag-bemanning", "Gör en reservplan för låg bemanning", "Be om ett gemensamt beslut om vad som ska utgå när ni är för få.", "Välj ett återkommande läge med låg bemanning.", "Fråga vilka uppgifter som får skjutas upp i just det läget."),
      ],
      guidance: [
        s("formulera-beslutet-du-vantar-pa", "Formulera beslutet du väntar på", "Gör det enkelt för den ansvariga att se vad som behövs.", "Skriv beslutet som en tydlig fråga med möjliga alternativ.", "Beskriv vad som inte kan gå vidare innan beskedet kommer."),
        s("bestam-en-vag-nar-besked-uteblir", "Bestäm en väg när besked uteblir", "Undersök hur du ska agera om vägledningen dröjer.", "Välj ett besked som arbetet ofta behöver vänta på.", "Stäm av vad du får göra under väntetiden."),
      ],
      training: [
        s("be-om-tid-for-ett-konkret-larmoment", "Be om tid för ett konkret lärmoment", "Gör behovet av introduktion till en del av arbetsplanen.", "Välj ett moment du behöver lära dig.", "Be om avsatt tid och någon som kan gå igenom det."),
        s("samla-din-forsta-kunskapslucka", "Samla din första kunskapslucka", "Avgränsa vad du behöver förstå innan du arbetar vidare.", "Skriv en fråga om ett moment eller en rutin.", "Be om ett exempel, en instruktion eller en kort handledning."),
      ],
      tools: [
        s("gor-verktygshindret-mojligt-att-atgarda", "Gör verktygshindret möjligt att åtgärda", "Beskriv problemet utan att behöva felsöka allt själv.", "Notera vilket moment som hindras och vad som händer.", "Lämna ett tydligt ärende till rätt stöd utan känsliga uppgifter."),
        s("stam-av-en-tillaten-tillfallig-losning", "Stäm av en tillåten tillfällig lösning", "Undersök hur arbetet kan hanteras medan verktyget inte fungerar.", "Beskriv vad som behöver kunna göras under väntan.", "Be om en godkänd lösning eller omprioritering; kringgå inte skydd."),
      ],
      support: [
        s("be-nagon-lyssna-innan-ni-loser", "Be någon lyssna innan ni löser", "Gör det tydligt vilken sorts stöd du behöver i samtalet.", "Välj en situation som du skulle vilja sortera med någon.", "Prova: ”Kan du lyssna en stund? Jag behöver sortera det här.”"),
        s("gor-stodet-regelbundet", "Gör stödet regelbundet", "Undersök om en återkommande avstämning skulle minska ensamheten i arbetet.", "Välj vad du skulle vilja ta upp vid en kort avstämning.", "Fråga någon om ni kan hitta ett återkommande tillfälle."),
      ],
    },
  },
  control: {
    general: [
      s("hitta-ett-beslut-du-vill-bli-delaktig-i", "Hitta ett beslut du vill bli delaktig i", "Välj en del av arbetet där ditt perspektiv behöver höras.", "Skriv vilket beslut som påverkar din arbetsdag.", "Formulera vad du vill kunna påverka i det beslutet."),
      s("kartlagg-vagen-till-inflytande", "Kartlägg vägen till inflytande", "Undersök var din fråga kan tas upp.", "Notera vem som fattar beslut och vilken dialog som finns.", "Välj chef, möte eller representant som kan föra fram ditt perspektiv."),
    ],
    details: {
      pace: [
        s("beskriv-tempots-konsekvens", "Beskriv tempots konsekvens", "Visa hur det bestämda tempot påverkar möjligheten att göra arbetet.", "Välj ett moment där tiden inte räcker.", "Be om en justering av tempo eller arbetsmängd utifrån exemplet."),
        s("be-om-en-rutin-for-overbelastning", "Be om en rutin för överbelastning", "Undersök hur du kan signalera när arbetets takt blir ohållbar.", "Notera ett läge där tempot gör arbetet ohållbart.", "Be att ni bestämmer vem som agerar när signalen kommer."),
      ],
      order: [
        s("foresla-ett-litet-forsok-med-arbetsordningen", "Föreslå ett litet försök med arbetsordningen", "Välj en avgränsad förändring som du vill få pröva.", "Beskriv hur en annan ordning skulle underlätta ett moment.", "Be om ett tidsbegränsat försök och en gemensam uppföljning."),
        s("fraga-vad-du-far-valja-sjalv", "Fråga vad du får välja själv", "Förtydliga ditt handlingsutrymme inom det givna arbetet.", "Välj en uppgift där du vill ha mer handlingsutrymme.", "Be om tydlighet kring metod, ordning eller tid som du får påverka."),
      ],
      schedule: [
        s("lamna-ett-konkret-onskemal-om-arbetstid", "Lämna ett konkret önskemål om arbetstid", "Gör ett schemabehov tydligt för den som planerar.", "Välj en tidsändring eller pausplacering som skulle underlätta.", "Beskriv behovet och fråga vilka alternativ som finns."),
        s("undersok-hur-schemaonskemal-tas-om-hand", "Undersök hur schemaönskemål tas om hand", "Ta reda på var och när du kan påverka planeringen.", "Välj ett önskemål inför nästa schemaperiod.", "Be om en återkoppling på ditt önskemål."),
      ],
      change: [
        s("forbered-ditt-perspektiv-infor-ett-forandringsbeslut", "Förbered ditt perspektiv inför ett förändringsbeslut", "Beskriv hur en planerad eller genomförd förändring påverkar arbetet.", "Skriv en konkret följd och en fråga du vill få besvarad.", "Lämna perspektivet i en lämplig dialog eller via en representant."),
        s("be-om-insyn-i-nasta-beslutspunkt", "Be om insyn i nästa beslutspunkt", "Undersök när det fortfarande finns möjlighet att påverka.", "Notera en förändring där du vill lämna synpunkter.", "Be om hur och när du kan lämna synpunkter."),
      ],
    },
  },
  other: {
    general: [
      s("lagg-ut-det-som-trasslar", "Lägg ut det som trasslar", "Ge flera samtidiga svårigheter varsin rad.", "Skriv högst tre saker som känns svåra.", "Markera vilken du vill få hjälp med först."),
      s("hitta-den-forsta-lattnaden", "Hitta den första lättnaden", "Undersök vilken liten förändring som skulle göra dagen mer hanterbar.", "Avsluta: ”Det skulle underlätta om …”", "Välj om förändringen behöver ditt eget steg eller stöd från någon annan."),
      s("beskriv-en-liten-bit-av-det-svara", "Beskriv en liten bit av det svåra", "Börja där du märker problemet, utan att behöva sätta rätt namn på det.", "Skriv ett tillfälle då något kändes svårt på jobbet.", "Notera vad som hände och vad du hade behövt då."),
      s("utga-fran-vad-du-saknar-just-nu", "Utgå från vad du saknar just nu", "Ett behov kan vara lättare att formulera än en förklaring.", "Avsluta: ”Just nu skulle jag behöva …”", "Välj om du vill ge behovet plats själv eller be någon om hjälp."),
    ],
    details: {
      pressure: [
        s("se-vad-som-hander-nar-pressen-okar", "Se vad som händer när pressen ökar", "Använd ett konkret tillfälle för att förstå pressen eller en svår gräns.", "Notera kravet, vad du tänkte och hur du agerade.", "Markera var du hade behövt mer utrymme eller stöd."),
        s("undersok-ditt-ja-i-en-pressad-situation", "Undersök ditt ja i en pressad situation", "Se vad ett extra åtagande försökte hjälpa dig med.", "Tänk på ett tillfälle när du sa ja fast det blev för mycket.", "Skriv vad du ville värna om och vilket annat steg som hade kunnat uttrycka det."),
      ],
      reduce: [
        s("valj-vad-som-behover-minska", "Välj vad som behöver minska", "Förbered ett konkret förslag till mindre arbetsbelastning.", "Välj en uppgift, omfattning eller tidsram som behöver ändras.", "Beskriv vilken lättnad förändringen skulle ge och be om ett beslut."),
        s("beskriv-belastningen-utan-att-forsvara-den", "Beskriv belastningen utan att försvara den", "Samla ett kort underlag inför ett samtal om arbetets omfattning.", "Skriv vad du förväntas göra och vilken tid eller resurs som finns.", "Be om hjälp att få kraven och förutsättningarna att gå ihop."),
      ],
      overview: [
        s("gor-en-karta-over-det-som-konkurrerar", "Gör en karta över det som konkurrerar", "Samla kraven innan du försöker prioritera dem.", "Skriv uppgifter, tidsramar och sådant du väntar på.", "Markera en prioriteringsfråga att ta till den ansvariga."),
        s("skilj-dagens-arbete-fran-senare-arbete", "Skilj dagens arbete från senare arbete", "Gör ett förslag till avgränsning som går att stämma av.", "Dela listan i ”idag”, ”senare” och ”behöver beslut”.", "Be om hjälp att bekräfta vad som faktiskt hör till idag."),
      ],
      understand: [
        s("ta-en-handelse-i-taget", "Ta en händelse i taget", "Undersök en konkret situation innan du drar slutsatser om hela arbetet.", "Skriv vad som hände, vad du märkte och vad du gjorde.", "Markera den del du vill förstå bättre."),
        s("leta-efter-ett-aterkommande-sammanhang", "Leta efter ett återkommande sammanhang", "Se om svårigheten dyker upp kring en viss del av arbetsdagen.", "Jämför två tillfällen då det kändes svårt.", "Notera vad som var gemensamt och vad som skilde sig."),
      ],
      practical: [
        s("gor-nasta-steg-synligt-och-litet", "Gör nästa steg synligt och litet", "Välj en handling som går att börja med utan att lösa allt.", "Skriv en konkret sak du vill få gjord eller klarhet i.", "Gör början mindre: en fråga, en rad eller en kontakt."),
        s("ta-bort-ett-hinder-framfor-starten", "Ta bort ett hinder framför starten", "Undersök vad som saknas för att nästa steg ska vara möjligt.", "Välj information, tid, material eller hjälp som du behöver.", "Börja med att ordna eller be om just det."),
      ],
      talk: [
        s("borja-samtalet-med-det-som-kanns-mest-rorigt", "Börja samtalet med det som känns mest rörigt", "Du behöver inte ha en färdig förklaring för att be om stöd.", "Ta en händelse som visar hur flera saker krockar.", "Välj en person du vill säga det till."),
        s("bestam-vad-du-vill-fa-ut-av-samtalet", "Bestäm vad du vill få ut av samtalet", "Ge ett kommande stödsamtal en möjlig början.", "Välj om du främst vill bli lyssnad på, sortera eller få ett beslut.", "Berätta det när samtalet börjar."),
        s("be-om-ett-samtal-utan-en-fardig-forklaring", "Be om ett samtal utan en färdig förklaring", "Du kan söka stöd även när du ännu inte vet vad problemet heter.", "Du kan börja utan att ha satt ord på hela problemet.", "Välj en trygg kontakt eller lämplig stödverksamhet."),
        s("skriv-en-forsta-mening-till-ett-stodsamtal", "Skriv en första mening till ett stödsamtal", "Förbered början när det känns svårt att få fram orden.", "Avsluta: ”Det jag helst vill att du förstår är …”", "Ta med meningen till en person du vill prata med."),
      ],
      pause: [
        s("valj-den-paus-som-saknas-mest", "Välj den paus som saknas mest", "Börja med en konkret lucka i återhämtningen.", "Välj en stund där vila eller avlösning skulle göra skillnad.", "Undersök vem som behöver hjälpa till för att skapa den."),
        s("ta-bort-ett-krav-kring-vilan", "Ta bort ett krav kring vilan", "Gör en befintlig stund av ledighet mindre full av måsten.", "Välj en frivillig uppgift som kan vänta.", "Ge utrymmet åt något som känns återhämtande för dig."),
        s("valj-ett-lugnare-ogonblick", "Välj ett lugnare ögonblick", "Om arbetet tillåter: gör en kort paus utan att behöva lösa problemet.", "Välj en plats eller aktivitet som brukar ge dig lite andrum.", "Bestäm när du vill återvända till det som väntar."),
        s("be-om-utrymme-innan-nasta-uppgift", "Be om utrymme innan nästa uppgift", "Gör behovet av en stunds återhämtning tydligt.", "Välj när du behöver en stund eller avlösning inför nästa uppgift.", "Om du behöver avlösning, fråga vem som kan hjälpa till."),
      ],
    },
  },
} satisfies Bank;

const combinedPressureSupport: Options = [
  s("separera-bestallningen-fran-dina-extra-krav", "Separera beställningen från dina extra krav", "Undersök vad som efterfrågas och vad du själv lägger till.", "Gör två rubriker: ”Beställt” och ”Mitt extra krav”.", "Välj en extra del att avstå från eller stämma av."),
  s("bestam-en-rimlig-gemensam-niva", "Bestäm en rimlig gemensam nivå", "Förbered ett samtal om vad som är hållbart att leverera.", "Beskriv både förväntningen och din egen ambitionsnivå.", "Be om en avgränsning som fungerar med tid och resurser."),
];

const unselected: Options = [
  s("borja-med-ett-arbetstillfalle", "Börja med ett arbetstillfälle", "Ta ett exempel som gör arbetsbelastningen lättare att beskriva.", "Välj en stund när arbetet kändes för mycket.", "Notera vilket stöd eller vilken förändring du hade behövt."),
  s("valj-vad-du-behover-idag", "Välj vad du behöver idag", "Du behöver inte känna till orsaken för att uttrycka ett behov.", "Skriv vad som skulle göra arbetsdagen lite mer hanterbar.", "Välj en person som kan hjälpa dig utforska det."),
];

export function getWorkloadSupport(answer: WorkloadAnswer): readonly WorkloadSupport[] {
  if (answer.issue === null) return unselected;
  const entry: { general: Options; details: Partial<Record<string, Options>> } = workloadSupport[answer.issue];
  const detail = answer.detail;
  // Other/unsure/skipped answers stay exploratory; no fabricated specific cause.
  if (detail === null || !answer.details.includes(detail) || !workloadFollowUps[answer.issue].choices.some((choice) => choice.id === detail)) return entry.general;
  const selected = entry.details[detail] ?? entry.general;
  // Both sources of pressure remain available without a redundant checkbox.
  if (answer.issue === "pressure" && (detail === "external" || detail === "self") && answer.details.includes("external") && answer.details.includes("self")) return [...selected, ...combinedPressureSupport];
  return selected;
}
