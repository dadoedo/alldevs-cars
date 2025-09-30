'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';
import settingsData from '@/data/settings.json';

export default function ContactSection() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();

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
    <section ref={sectionRef} className="relative bg-gradient-to-r from-dark-900 to-dark-800 text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/kontakt.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 to-dark-800/75"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center mb-12 transition-all duration-1000 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl font-bold mb-4 text-dark-primary animate-fade-in-up">Kontakt</h2>
          <p className="text-lg text-primary-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Navštívte nás alebo nás kontaktujte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className={`transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`} style={{ animationDelay: '0.3s' }}>
            <h3 className="text-2xl font-bold text-dark-primary mb-6 animate-fade-in-up">Kontaktné údaje</h3>
            
            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Adresa', content: settings?.address || 'Adresa autobazáru' },
                { icon: Phone, title: 'Telefón', content: settings?.phone || '+421 XXX XXX XXX' },
                { icon: Mail, title: 'Email', content: settings?.email || 'info@autobazar.sk' },
                { icon: Clock, title: 'Otváracie hodiny', content: (
                  <div className="space-y-1">
                    <div>Pondelok - Piatok: {openingHours.monday}</div>
                    <div>Sobota: {openingHours.saturday}</div>
                    <div>Nedeľa: {openingHours.sunday}</div>
                  </div>
                )}
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-4 transition-all duration-1000 ${
                    sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <item.icon className="h-6 w-6 text-primary-500 mt-1 transition-transform duration-300 hover:scale-110" />
                  <div>
                    <h4 className="text-lg font-semibold text-dark-primary">{item.title}</h4>
                    <div className="text-dark-200">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps */}
            {settings?.google_maps_embed && (
              <div className={`mt-8 transition-all duration-1000 ${
                sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.9s' }}>
                <h4 className="text-lg font-semibold text-dark-primary mb-4 animate-fade-in-up">Poloha</h4>
                <div 
                  className="w-full h-64 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
                  dangerouslySetInnerHTML={{ __html: settings.google_maps_embed }}
                />
              </div>
            )}
          </div>

          {/* Contact Actions */}
          <div className={`transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`} style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-bold text-dark-primary mb-6 animate-fade-in-up">Kontaktujte nás</h3>
            
            <div className="space-y-6">
              {/* Email Contact */}
              <div className={`transition-all duration-1000 ${
                sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.6s' }}>
                <div className="bg-dark-700/50 backdrop-blur-sm rounded-lg p-6 border border-dark-600 hover:border-primary-500/50 transition-all duration-300">
                  <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center">
                    <Mail className="h-5 w-5 text-primary-500 mr-2" />
                    Napíšte nám email
                  </h4>
                  <p className="text-dark-200 mb-4">
                    Máte otázky alebo záujem o konkrétne auto? Napíšte nám priamo na email.
                  </p>
                  <a
                    href={`mailto:${settings?.email || 'info@autobazar.sk'}?subject=Dotaz z webu&body=Dobrý deň,%0D%0A%0D%0A`}
                    className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Napísať email
                  </a>
                </div>
              </div>

              {/* Phone Contact */}
              <div className={`transition-all duration-1000 ${
                sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.7s' }}>
                <div className="bg-dark-700/50 backdrop-blur-sm rounded-lg p-6 border border-dark-600 hover:border-primary-500/50 transition-all duration-300">
                  <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center">
                    <Phone className="h-5 w-5 text-primary-500 mr-2" />
                    Zavolajte nám
                  </h4>
                  <p className="text-dark-200 mb-4">
                    Pre rýchle informácie nás môžete zavolať priamo.
                  </p>
                  <a
                    href={`tel:${settings?.phone || '+421 XXX XXX XXX'}`}
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Zavolať teraz
                  </a>
                </div>
              </div>

              {/* Visit Us */}
              <div className={`transition-all duration-1000 ${
                sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} style={{ animationDelay: '0.8s' }}>
                <div className="bg-dark-700/50 backdrop-blur-sm rounded-lg p-6 border border-dark-600 hover:border-primary-500/50 transition-all duration-300">
                  <h4 className="text-lg font-semibold text-dark-primary mb-3 flex items-center">
                    <MapPin className="h-5 w-5 text-primary-500 mr-2" />
                    Navštívte nás
                  </h4>
                  <p className="text-dark-200 mb-4">
                    Príďte sa pozrieť na naše autá osobne. Radi vás privítame.
                  </p>
                  <div className="text-dark-200">
                    <p className="font-medium">{settings?.address || 'Adresa autobazáru'}</p>
                    <p className="text-sm mt-1">
                      Pondelok - Piatok: {openingHours.monday}<br/>
                      Sobota: {openingHours.saturday}<br/>
                      Nedeľa: {openingHours.sunday}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
