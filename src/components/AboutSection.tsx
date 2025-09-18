'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Shield, Clock, Users } from 'lucide-react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';
import settingsData from '@/data/settings.json';

export default function AboutSection() {
  const [settings, setSettings] = useState<Record<string, string> | null>(null);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();

  useEffect(() => {
    setSettings(settingsData);
  }, []);

  const features = [
    {
      icon: CheckCircle,
      title: 'Kvalitné vozidlá',
      description: 'Všetky naše vozidlá sú dôkladne preverené a kontrolované technikom.'
    },
    {
      icon: Shield,
      title: 'Záruka',
      description: 'Poskytujeme 12-mesačnú záruku na skryté vady a doživotnú garanciu na najazdené kilometre.'
    },
    {
      icon: Clock,
      title: 'Rýchly servis',
      description: 'Všetky vozidlá majú kompletnú servisnú históriu a sú pravidelne udržiavané.'
    },
    {
      icon: Users,
      title: 'Poradenstvo',
      description: 'Pomôžeme vám s výberom vozidla, financovaním a poistením.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <h2 className="text-3xl font-bold text-dark-primary mb-6 animate-fade-in-up">
              Prečo si vybrať {settings?.site_name || 'AutoBazar'}?
            </h2>
            <p className="text-lg text-dark-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {settings?.site_description || 'Váš spoľahlivý partner pre kúpu vozidla. Ponúkame kvalitné vozidlá za výhodné ceny s kompletným servisom a poradenstvom.'}
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`flex items-start space-x-4 transition-all duration-1000 ${
                    sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary-500 transition-transform duration-300 hover:scale-110" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-dark-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-dark-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`relative transition-all duration-1000 ${
            sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`} style={{ animationDelay: '0.3s' }}>
            <div className="bg-dark-700 rounded-lg shadow-xl p-8 border border-dark-600 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:scale-105">
              <h3 className="text-2xl font-bold text-dark-primary mb-6 animate-fade-in-up">Naše služby</h3>
              <ul className="space-y-4">
                {[
                  'Financovanie vozidla',
                  'Poistenie vozidla', 
                  'Doklady pre fyzické osoby',
                  'Doklady pre právnické osoby',
                  'Poradenstvo s výberom'
                ].map((service, index) => (
                  <li 
                    key={index}
                    className={`flex items-center space-x-3 transition-all duration-1000 ${
                      sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <CheckCircle className="h-5 w-5 text-primary-500 transition-transform duration-300 hover:scale-110" />
                    <span className="text-dark-200">{service}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-dark-600">
                <h4 className="text-lg font-semibold text-dark-primary mb-4 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>Kontaktné údaje</h4>
                <div className="space-y-2 text-dark-300 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                  <p><strong>Adresa:</strong> {settings?.address || 'Adresa autobazáru'}</p>
                  <p><strong>Telefón:</strong> {settings?.phone || '+421 XXX XXX XXX'}</p>
                  <p><strong>Email:</strong> {settings?.email || 'info@autobazar.sk'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
