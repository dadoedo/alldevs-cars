'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';
import { useSettings } from '@/lib/useSettings';

export default function Footer() {
  const { ref: footerRef, isVisible: footerVisible } = useScrollAnimation();
  const { settings, getOpeningHours } = useSettings();

  return (
    <footer ref={footerRef} className="bg-dark-900 text-white border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className={`transition-all duration-1000 ${
            footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center space-x-2 mb-4 group">
              <Image 
                src="/logo.png" 
                alt={settings?.site_name || "Logo"} 
                width={72} 
                height={24}
                className="h-6 w-18 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold transition-colors duration-300 group-hover:text-primary-500">
                {settings?.site_name || "AutoBazar"}
              </span>
            </div>
            <p className="text-dark-300 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {settings?.site_description || "Váš spoľahlivý partner pre kúpu vozidla. Ponúkame kvalitné vozidlá za výhodné ceny."}
            </p>
            <div className="flex space-x-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <a href="#" className="text-dark-400 hover:text-primary-500 transition-all duration-300 hover:scale-110">
                Facebook
              </a>
              <a href="#" className="text-dark-400 hover:text-primary-500 transition-all duration-300 hover:scale-110">
                Instagram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={`transition-all duration-1000 ${
            footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4 text-dark-primary animate-fade-in-up">Rýchle odkazy</h3>
            <ul className="space-y-2">
              {[
                { href: '/', text: 'Domov' },
                { href: '/auta', text: 'Ponuka áut' },
                { href: '/sluzby', text: 'Služby' },
                { href: '/kontakt', text: 'Kontakt' }
              ].map((link, index) => (
                <li key={index} className={`transition-all duration-1000 ${
                  footerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`} style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <Link href={link.href} className="text-dark-300 hover:text-primary-500 transition-all duration-300 hover:translate-x-1 block">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={`transition-all duration-1000 ${
            footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4 text-dark-primary animate-fade-in-up">Služby</h3>
            <ul className="space-y-2">
              {[
                { href: '/sluzby#financing', text: 'Financovanie vozidla' },
                { href: '/sluzby#insurance', text: 'Poistenie vozidla' },
                { href: '/sluzby#documents', text: 'Doklady' },
                { href: '/sluzby#consulting', text: 'Poradenstvo' }
              ].map((link, index) => (
                <li key={index} className={`transition-all duration-1000 ${
                  footerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                }`} style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                  <Link href={link.href} className="text-dark-300 hover:text-primary-500 transition-all duration-300 hover:translate-x-1 block">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`transition-all duration-1000 ${
            footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold mb-4 text-dark-primary animate-fade-in-up">Kontakt</h3>
            <div className="space-y-3">
              {[
                { icon: MapPin, text: settings?.address || 'Adresa autobazáru' },
                { icon: Phone, text: settings?.phone || '+421 XXX XXX XXX' },
                { icon: Mail, text: settings?.email || 'info@autobazar.sk' },
                { icon: Clock, text: (() => {
                  const hours = getOpeningHours();
                  if (hours) {
                    return (
                      <div>
                        <div>Po-Pia: {hours.monday}</div>
                        <div>So: {hours.saturday}</div>
                        <div>Ne: {hours.sunday}</div>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <div>Po-Pia: 8:00-17:00</div>
                      <div>So: Zatvorené</div>
                      <div>Ne: Zatvorené</div>
                    </div>
                  );
                })()}
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 transition-all duration-1000 ${
                    footerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <item.icon className="h-5 w-5 text-primary-500 transition-transform duration-300 hover:scale-110" />
                  <span className="text-dark-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`border-t border-dark-700 mt-8 pt-8 transition-all duration-1000 ${
          footerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-dark-400 text-sm animate-fade-in-up">
              © 2024 {settings?.site_name || "AutoBazar"}. Všetky práva vyhradené.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {[
                { href: '/ochrana-udajov', text: 'Ochrana údajov' },
                { href: '/cookies', text: 'Cookies' }
              ].map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="text-dark-400 hover:text-primary-500 text-sm transition-all duration-300 hover:scale-105"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
