import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zásady používania cookies | Car & Art',
  description: 'Zásady používania cookies spoločnosti Ascari Group s.r.o.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Zásady používania cookies
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Dátum účinnosti: 27.2.2025 | Posledná aktualizácia: 27.2.2025
            </p>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Čo sú cookies?
              </h2>
              <p className="text-gray-700 mb-6">
                Tieto Zásady používania cookies vysvetľujú, čo sú cookies a ako ich používame, aké typy 
                cookies používame, t.j. aké informácie zbierame pomocou cookies a ako tieto informácie 
                používame, a ako spravovať nastavenia cookies.
              </p>
              <p className="text-gray-700 mb-6">
                Cookies sú malé textové súbory, ktoré sa používajú na ukladanie malých častí informácií. 
                Ukladajú sa na vaše zariadenie, keď sa webová stránka načíta vo vašom prehliadači. Tieto 
                cookies nám pomáhajú zabezpečiť správne fungovanie webovej stránky, zvýšiť jej bezpečnosť, 
                poskytnúť lepšiu používateľskú skúsenosť a pochopiť, ako stránka funguje, a analyzovať, 
                čo funguje a kde je potrebné zlepšenie.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Ako používame cookies?
              </h2>
              <p className="text-gray-700 mb-6">
                Podobne ako väčšina online služieb, naša webová stránka používa cookies prvej a tretej 
                strany na rôzne účely. Cookies prvej strany sú väčšinou potrebné na správne fungovanie 
                webovej stránky a nezbierajú žiadne vaše osobne identifikovateľné údaje.
              </p>
              <p className="text-gray-700 mb-6">
                Cookies tretích strán používané na našej webovej stránke slúžia hlavne na pochopenie toho, 
                ako webová stránka funguje, ako s ňou komunikujete, na zabezpečenie našich služieb, 
                poskytovanie relevantných reklám a celkovo na poskytnutie lepšej a vylepšenej používateľskej 
                skúsenosti a pomoc pri urýchlení vašich budúcich interakcií s našou webovou stránkou.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Zásady používania Cookies (EÚ)
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Nevyhnutné
              </h3>
              <p className="text-gray-700 mb-4">
                Potrebné súbory cookie sú pre základné funkcie webových stránok zásadné a webové stránky 
                bez nich nebudú fungovať zamýšľaným spôsobom. Tieto súbory cookie neukladajú žiadne 
                osobné identifikačné údaje.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                        Súbory Cookies
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                        Trvanie
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-300">
                        Popis
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        wpEmojiSettingsSupports
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        relácia
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        WordPress nastavuje tento súbor cookie, keď používateľ komunikuje s emoji na 
                        WordPress stránke. Pomáha určiť, či prehliadač používateľa dokáže správne 
                        zobrazovať emoji.
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        cookieyes-consent
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        1 rok
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        CookieYes nastavuje tento súbor cookie tak, aby si pamätal preferencie súhlasu 
                        používateľov, aby sa ich preferencie rešpektovali pri ďalších návštevách tejto 
                        stránky. Nezhromažďuje ani neukladá žiadne osobné informácie o návštevníkoch stránky.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Správa preferencií cookies
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                Nastavenia cookies
              </h3>
              <p className="text-gray-700 mb-6">
                Svoje preferencie cookies môžete kedykoľvek zmeniť kliknutím na vyššie uvedené tlačidlo. 
                To vám umožní znovu navštíviť banner súhlasu s cookies a zmeniť vaše preferencie alebo 
                okamžite odvolať váš súhlas.
              </p>
              <p className="text-gray-700 mb-6">
                Okrem toho rôzne prehliadače poskytujú rôzne metódy na blokovanie a odstraňovanie cookies 
                používaných webovými stránkami. Môžete zmeniť nastavenia vášho prehliadača na blokovanie/
                odstránenie cookies. Nižšie sú uvedené odkazy na podporné dokumenty o tom, ako spravovať 
                a odstraňovať cookies z hlavných webových prehliadačov.
              </p>

              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <strong>Chrome:</strong>{' '}
                  <a 
                    href="https://support.google.com/accounts/answer/32050" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    https://support.google.com/accounts/answer/32050
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Safari:</strong>{' '}
                  <a 
                    href="https://support.apple.com/en-in/guide/safari/sfri11471/mac" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    https://support.apple.com/en-in/guide/safari/sfri11471/mac
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Firefox:</strong>{' '}
                  <a 
                    href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&redirectlocale=en-US" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox
                  </a>
                </p>
                <p className="text-gray-700">
                  <strong>Internet Explorer:</strong>{' '}
                  <a 
                    href="https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer-bca9446f-d873-78de-77ba-d42645fa52fc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    https://support.microsoft.com/en-us/topic/how-to-delete-cookie-files-in-internet-explorer
                  </a>
                </p>
              </div>

              <p className="text-gray-700 mb-6">
                Ak používate akýkoľvek iný webový prehliadač, navštívte oficiálne podporné dokumenty 
                vášho prehliadača.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
