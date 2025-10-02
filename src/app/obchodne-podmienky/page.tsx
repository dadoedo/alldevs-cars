import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Obchodné podmienky | Car & Art',
  description: 'Obchodné podmienky spoločnosti Ascari Group s.r.o.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Obchodné podmienky
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Dátum účinnosti: 28.2.2025 | Posledná aktualizácia: 28.2.2025
            </p>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                1. Úvodné ustanovenia
              </h2>
              <p className="text-gray-700 mb-6">
                Tieto obchodné podmienky upravujú vzájomné práva a povinnosti medzi spoločnosťou{' '}
                <strong>Ascari Group s.r.o.</strong>, IČO: [IČO], so sídlom Kalinčiakova 1, 97405 Banská Bystrica, 
                Slovensko, zapísanou v Obchodnom registri Okresného súdu Banská Bystrica, oddiel Sro, vložka č. [číslo] 
                (ďalej len „Predávajúci") a fyzickou alebo právnickou osobou, ktorá nakupuje vozidlá alebo služby 
                (ďalej len „Kupujúci").
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                2. Predmet činnosti
              </h2>
              <p className="text-gray-700 mb-6">
                Predávajúci sa zaoberá predajom motorových vozidiel, poskytovaním súvisiacich služieb a 
                poradenstvom v oblasti motorových vozidiel. Kupujúci si môže vybrať z ponuky vozidiel 
                dostupných na webovej stránke <a href="https://carart.sk" className="text-blue-600 hover:text-blue-800">carart.sk</a> 
                alebo v predajni Predávajúceho.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                3. Ceny a platby
              </h2>
              <p className="text-gray-700 mb-4">
                3.1. Ceny vozidiel sú uvedené v eurách vrátane DPH, ak nie je uvedené inak.
              </p>
              <p className="text-gray-700 mb-4">
                3.2. Ceny sú platné v čase zverejnenia a môžu sa zmeniť bez predchádzajúceho upozornenia.
              </p>
              <p className="text-gray-700 mb-6">
                3.3. Platba môže byť uskutočnená v hotovosti, bankovým prevodom alebo iným spôsobom 
                dohodnutým medzi zmluvnými stranami.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                4. Dodacie podmienky
              </h2>
              <p className="text-gray-700 mb-4">
                4.1. Dodacie podmienky sú dohodnuté individuálne s každým Kupujúcim.
              </p>
              <p className="text-gray-700 mb-4">
                4.2. Predávajúci sa zaväzuje odovzdať vozidlo v stave zodpovedajúcom technickému 
                stavu uvedenému v zmluve o kúpe vozidla.
              </p>
              <p className="text-gray-700 mb-6">
                4.3. Kupujúci je povinný prevziať vozidlo v dohodnutom termíne a mieste.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                5. Záruka a reklamácie
              </h2>
              <p className="text-gray-700 mb-4">
                5.1. Záručná doba na vozidlá je 24 mesiacov od prevzatia vozidla Kupujúcim.
              </p>
              <p className="text-gray-700 mb-4">
                5.2. Záruka sa nevzťahuje na opotrebovanie súčastí vozidla, ktoré je dôsledkom 
                normálneho používania.
              </p>
              <p className="text-gray-700 mb-6">
                5.3. Reklamácie je možné podávať písomne na adrese Predávajúceho alebo e-mailom 
                na <a href="mailto:info@carart.sk" className="text-blue-600 hover:text-blue-800">info@carart.sk</a>.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                6. Ochrana osobných údajov
              </h2>
              <p className="text-gray-700 mb-6">
                Spracovanie osobných údajov Kupujúceho sa riadi{' '}
                <a href="/ochrana-udajov" className="text-blue-600 hover:text-blue-800">
                  Zásadami ochrany osobných údajov
                </a>{' '}
                a platnými právnymi predpismi o ochrane osobných údajov.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                7. Zmluvné pokuty
              </h2>
              <p className="text-gray-700 mb-4">
                7.1. V prípade porušenia zmluvy je každá zo zmluvných strán oprávnená požadovať 
                náhradu škody.
              </p>
              <p className="text-gray-700 mb-6">
                7.2. Výška zmluvnej pokuty môže byť dohodnutá v zmluve o kúpe vozidla.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                8. Rozhodné právo a právomoc súdov
              </h2>
              <p className="text-gray-700 mb-4">
                8.1. Tieto obchodné podmienky sa riadia právom Slovenskej republiky.
              </p>
              <p className="text-gray-700 mb-6">
                8.2. Právomocné súdy Slovenskej republiky sú príslušné na riešenie sporov 
                vyplývajúcich z týchto obchodných podmienok.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                9. Zmeny obchodných podmienok
              </h2>
              <p className="text-gray-700 mb-6">
                Predávajúci si vyhradzuje právo zmeniť tieto obchodné podmienky. O zmene bude 
                Kupujúci informovaný prostredníctvom webovej stránky alebo písomne. Zmeny nadobúdajú 
                účinnosť dňom ich zverejnenia.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                10. Kontaktné údaje
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Ascari Group s.r.o.</strong>
                </p>
                <p className="text-gray-700 mb-2">
                  Kalinčiakova 1, 97405 Banská Bystrica, Slovensko
                </p>
                <p className="text-gray-700 mb-2">
                  E-mail: <a href="mailto:info@carart.sk" className="text-blue-600 hover:text-blue-800">info@carart.sk</a>
                </p>
                <p className="text-gray-700">
                  Web: <a href="https://carart.sk" className="text-blue-600 hover:text-blue-800">https://carart.sk</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
