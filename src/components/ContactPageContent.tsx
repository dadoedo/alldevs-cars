'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import settingsData from '@/data/settings.json';

export default function ContactPageContent() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setSettings(settingsData);
  }, []);

  const openingHours = settings?.opening_hours ? JSON.parse(settings.opening_hours) : {
    monday: "8:00-17:00",
    tuesday: "8:00-17:00", 
    wednesday: "8:00-17:00",
    thursday: "8:00-17:00",
    friday: "8:00-17:00",
    saturday: "8:00-12:00",
    sunday: "Zatvorené"
  };


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark-900 to-dark-800 text-white">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/kontakt.webp')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 to-dark-800/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-dark-primary">Kontakt</h1>
            <p className="text-xl md:text-2xl text-primary-300">Navštívte nás alebo nás kontaktujte</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-dark-primary mb-6">Kontaktné údaje</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-dark-primary">Adresa</h3>
                    <p className="text-dark-secondary">{settings?.address || 'Adresa autobazáru'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-dark-primary">Telefón</h3>
                    <p className="text-dark-secondary">{settings?.phone || '+421 XXX XXX XXX'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-dark-primary">Email</h3>
                    <p className="text-dark-secondary">{settings?.email || 'info@autobazar.sk'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary-500 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-dark-primary">Otváracie hodiny</h3>
                    <div className="text-dark-secondary space-y-1">
                      <div>Pondelok - Piatok: {openingHours.monday}</div>
                      <div>Sobota: {openingHours.saturday}</div>
                      <div>Nedeľa: {openingHours.sunday}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            {settings?.google_maps_embed && (
              <div>
                <h3 className="text-lg font-semibold text-dark-primary mb-4">Poloha</h3>
                <div 
                  className="w-full h-64 rounded-lg overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }}
                />
              </div>
            )}
          </div>

          {/* Contact Actions */}
          <div>
            <h2 className="text-2xl font-bold text-dark-primary mb-6">Kontaktujte nás</h2>
            
            <div className="space-y-8">
              {/* Email Contact */}
              <div className="bg-dark-700/50 backdrop-blur-sm rounded-lg p-8 border border-dark-600 hover:border-primary-500/50 transition-all duration-300">
                <div className="text-center">
                  <Mail className="h-16 w-16 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-dark-primary mb-4">Napíšte nám email</h3>
                  <p className="text-dark-200 mb-6 text-lg">
                    Máte otázky alebo záujem o konkrétne auto? Napíšte nám priamo na email a čoskoro vás budeme kontaktovať.
                  </p>
                  <a
                    href={`mailto:${settings?.email || 'info@autobazar.sk'}?subject=Dotaz z webu&body=Dobrý deň,%0D%0A%0D%0A`}
                    className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25 text-lg"
                  >
                    <Mail className="h-6 w-6 mr-3" />
                    Napísať email
                  </a>
                </div>
              </div>

              {/* Phone Contact */}
              <div className="bg-dark-700/50 backdrop-blur-sm rounded-lg p-8 border border-dark-600 hover:border-green-500/50 transition-all duration-300">
                <div className="text-center">
                  <Phone className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-dark-primary mb-4">Zavolajte nám</h3>
                  <p className="text-dark-200 mb-6 text-lg">
                    Pre rýchle informácie alebo ak máte naliehavé otázky, nás môžete zavolať priamo.
                  </p>
                  <a
                    href={`tel:${settings?.phone || '+421 XXX XXX XXX'}`}
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 text-lg"
                  >
                    <Phone className="h-6 w-6 mr-3" />
                    Zavolať teraz
                  </a>
                </div>
              </div>

              {/* Visit Us */}
              <div className="bg-dark-700/50 backdrop-blur-sm rounded-lg p-8 border border-dark-600 hover:border-blue-500/50 transition-all duration-300">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-dark-primary mb-4">Navštívte nás</h3>
                  <p className="text-dark-200 mb-6 text-lg">
                    Príďte sa pozrieť na naše autá osobne. Radi vás privítame a ukážeme vám naše vozidlá.
                  </p>
                  <div className="text-dark-200 text-left max-w-md mx-auto">
                    <div className="bg-dark-800/50 rounded-lg p-4">
                      <p className="font-semibold text-lg mb-2">{settings?.address || 'Adresa autobazáru'}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Pondelok - Piatok:</span>
                          <span className="font-medium">{openingHours.monday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sobota:</span>
                          <span className="font-medium">{openingHours.saturday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nedeľa:</span>
                          <span className="font-medium">{openingHours.sunday}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
