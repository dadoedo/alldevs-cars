import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ochrana osobných údajov | Car & Art',
  description: 'Zásady ochrany osobných údajov spoločnosti Ascari Group s.r.o.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Zásady ochrany osobných údajov
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Posledná aktualizácia: 28.2.2025 | Dátum účinnosti: 28.2.2025
            </p>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 mb-6">
                Tieto Zásady ochrany osobných údajov popisujú postupy spoločnosti{' '}
                <strong>Ascari Group s.r.o.</strong>, Kalinčiakova 1, Banská Bystrica 97405, Slovensko, 
                email: info@carart.sk, telefón: — týkajúce sa zhromažďovania, používania a zverejňovania 
                vašich informácií, ktoré zbierame pri používaní našej webovej stránky (
                <a href="https://carart.sk" className="text-blue-600 hover:text-blue-800">https://carart.sk</a>
                ). (ďalej len „Služba"). Prístupom alebo používaním Služby súhlasíte so zhromažďovaním, 
                používaním a zverejňovaním vašich informácií v súlade s týmito Zásadami ochrany osobných údajov. 
                Ak s tým nesúhlasíte, prosím, nepoužívajte Službu.
              </p>

              <p className="text-gray-700 mb-6">
                Tieto Zásady ochrany osobných údajov môžeme kedykoľvek upraviť bez predchádzajúceho upozornenia 
                a revidované Zásady ochrany osobných údajov zverejníme na Službe. Revidované Zásady budú účinné 
                180 dní od zverejnenia revidovaných Zásad v Službe a váš ďalší prístup alebo používanie Služby 
                po tomto čase bude predstavovať váš súhlas s revidovanými Zásadami ochrany osobných údajov. 
                Preto vám odporúčame, aby ste si túto stránku pravidelne kontrolovali.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Ako používame vaše informácie:
              </h2>
              <p className="text-gray-700 mb-6">
                Informácie, ktoré o vás zhromažďujeme, budeme používať na nasledujúce účely:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Ochrana stránky</li>
              </ul>
              <p className="text-gray-700 mb-6">
                Ak chceme použiť vaše informácie na akýkoľvek iný účel, požiadame vás o súhlas a vaše 
                informácie použijeme iba po získaní vášho súhlasu, a potom iba na účel(y), na ktorý bol 
                súhlas udelený, pokiaľ nie sme zo zákona povinní urobiť inak.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Vaše práva:
              </h2>
              <p className="text-gray-700 mb-6">
                V závislosti od platných zákonov môžete mať právo na prístup a opravu alebo vymazanie 
                svojich osobných údajov, alebo získanie kópie svojich osobných údajov, obmedzenie alebo 
                námietku voči aktívnemu spracúvaniu vašich údajov, požiadať nás o zdieľanie (prenos) 
                vašich osobných údajov inému subjektu, odvolať akýkoľvek súhlas, ktorý ste nám poskytli 
                na spracovanie vašich údajov, právo podať sťažnosť na príslušnom úrade a ďalšie práva, 
                ktoré môžu byť relevantné podľa platných zákonov. Na uplatnenie týchto práv nám môžete 
                napísať na{' '}
                <a href="mailto:info@carart.sk" className="text-blue-600 hover:text-blue-800">
                  info@carart.sk
                </a>
                . Na vašu žiadosť odpovieme v súlade s platnými právnymi predpismi.
              </p>

              <p className="text-gray-700 mb-6">
                Vezmite na vedomie, že ak nám nepovolíte zhromažďovať alebo spracúvať požadované osobné 
                údaje alebo odvoláte súhlas s ich spracovaním na požadované účely, nemusíte mať možnosť 
                pristupovať alebo používať služby, pre ktoré boli vaše informácie vyžiadané.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Cookies a pod.
              </h2>
              <p className="text-gray-700 mb-6">
                Ak sa chcete dozvedieť viac o tom, ako používame tieto a o vašich možnostiach vo vzťahu 
                k týmto sledovacím technológiám, pozrite si naše{' '}
                <a href="/cookies" className="text-blue-600 hover:text-blue-800">
                  Zásady používania cookies
                </a>
                .
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Bezpečnosť:
              </h2>
              <p className="text-gray-700 mb-6">
                Bezpečnosť vašich informácií je pre nás dôležitá a použijeme primerané bezpečnostné 
                opatrenia, aby sme zabránili strate, zneužitiu alebo neoprávnenej zmene vašich informácií 
                pod našou kontrolou. Vzhľadom na inherentné riziká však nemôžeme zaručiť absolútnu 
                bezpečnosť, a preto nemôžeme zabezpečiť ani zaručiť bezpečnosť akýchkoľvek informácií, 
                ktoré nám odovzdáte, a robíte tak na vlastné riziko.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Sťažnosti / Zodpovedná osoba pre ochranu údajov:
              </h2>
              <p className="text-gray-700 mb-6">
                Ak máte akékoľvek otázky alebo obavy týkajúce sa spracovania vašich informácií, ktoré sú 
                k dispozícii u nás, môžete poslať e-mail nášmu Pracovníkovi pre sťažnosti na{' '}
                <strong>Ascari Group s.r.o.</strong>, Kalinčiakova 1, email:{' '}
                <a href="mailto:info@carart.sk" className="text-blue-600 hover:text-blue-800">
                  info@carart.sk
                </a>
                . Vašimi obavami sa budeme zaoberať v súlade s platnými právnymi predpismi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
