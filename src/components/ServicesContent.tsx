'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Shield, 
  FileText, 
  Users, 
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building
} from 'lucide-react';
import settingsData from '@/data/settings.json';

export default function ServicesContent() {
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

  const services = [
    {
      id: 'financing',
      icon: CreditCard,
      title: 'Financovanie vozidla',
      description: 'Pomôžeme vám získať najlepšie financovanie pre vaše vozidlo. Spolupracujeme s viacerými bankami a finančnými inštitúciami.',
      features: [
        'Konkurenčné úrokové sadzby',
        'Rýchle schválenie úveru',
        'Flexibilné splátkové kalendáre',
        'Možnosť predčasného splatenia',
        'Financovanie až do 100% hodnoty vozidla'
      ]
    },
    {
      id: 'insurance',
      icon: Shield,
      title: 'Poistenie vozidla',
      description: 'Zabezpečíme pre vás najvýhodnejšie poistenie vozidla. Ponúkame povinné aj havarijné poistenie.',
      features: [
        'Povinné poistenie (PZP)',
        'Havarijné poistenie',
        'Poistenie proti krádeži',
        'Asistenčné služby',
        'Rýchle vybavenie škod'
      ]
    },
    {
      id: 'documents',
      icon: FileText,
      title: 'Doklady a administratíva',
      description: 'Pomôžeme vám s vybavením všetkých potrebných dokladov a administratívnych úkonov.',
      features: [
        'Prevod vlastníctva vozidla',
        'Registrácia vozidla',
        'Technická kontrola (STK)',
        'Ekológia vozidla',
        'Doklady pre fyzické a právnické osoby'
      ]
    },
    {
      id: 'consulting',
      icon: Users,
      title: 'Poradenstvo',
      description: 'Naši odborníci vám pomôžu s výberom najvhodnejšieho vozidla pre vaše potreby.',
      features: [
        'Odborné poradenstvo pri výbere',
        'Testovacia jazda',
        'Kontrola vozidla pred kúpou',
        'Servisná história vozidla',
        'Záruka a pozáručný servis'
      ]
    }
  ];

  const documentsPhysical = [
    'Občiansky preukaz',
    'Vodičsky preukaz',
    'Doklad o trvalom pobyte',
    'Doklad o príjmoch',
    'Doklad o zamestnaní'
  ];

  const documentsLegal = [
    'Výpis z obchodného registra',
    'Doklad o právnom zastúpení',
    'Doklad o príjmoch spoločnosti',
    'Doklad o daňovom domicíle',
    'Doklad o bankovom účte'
  ];

  return (
    <div className="space-y-16">
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div key={service.id} className="bg-dark-800 rounded-lg shadow-md p-8 border border-dark-700">
            <div className="flex items-center mb-6">
              <div className="bg-primary-500/20 p-3 rounded-lg mr-4">
                <service.icon className="h-8 w-8 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-dark-primary">{service.title}</h2>
            </div>
            
            <p className="text-dark-secondary mb-6">{service.description}</p>
            
            <ul className="space-y-3">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-secondary">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Documents Section */}
      <div className="bg-dark-800 rounded-lg shadow-md p-8 border border-dark-700">
        <h2 className="text-3xl font-bold text-dark-primary mb-8 text-center">
          Potrebné doklady
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-dark-primary mb-4 flex items-center">
              <Users className="h-6 w-6 text-primary-500 mr-2" />
              Pre fyzické osoby
            </h3>
            <ul className="space-y-2">
              {documentsPhysical.map((doc, index) => (
                <li key={index} className="flex items-center">
                  <FileText className="h-4 w-4 text-dark-400 mr-3" />
                  <span className="text-dark-secondary">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-dark-primary mb-4 flex items-center">
              <Building className="h-6 w-6 text-primary-500 mr-2" />
              Pre právnické osoby
            </h3>
            <ul className="space-y-2">
              {documentsLegal.map((doc, index) => (
                <li key={index} className="flex items-center">
                  <FileText className="h-4 w-4 text-dark-400 mr-3" />
                  <span className="text-dark-secondary">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-primary-500 rounded-lg shadow-md p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white">Potrebujete pomoc?</h2>
          <p className="text-xl text-gray-200">
            Naši odborníci sú tu pre vás
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Phone className="h-8 w-8 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Telefón</h3>
            <p className="text-gray-200">{settings?.phone || '+421 XXX XXX XXX'}</p>
          </div>
          
          <div className="text-center">
            <Mail className="h-8 w-8 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Email</h3>
            <p className="text-gray-200">{settings?.email || 'info@autobazar.sk'}</p>
          </div>
          
          <div className="text-center">
            <MapPin className="h-8 w-8 text-white mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Adresa</h3>
            <p className="text-gray-200">{settings?.address || 'Adresa autobazáru'}</p>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-white mr-2" />
            <span className="text-lg font-semibold text-white">Otváracie hodiny</span>
          </div>
          <div className="text-gray-200">
            <div>Pondelok - Piatok: {openingHours.monday}</div>
            <div>Sobota: {openingHours.saturday}</div>
            <div>Nedeľa: {openingHours.sunday}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
