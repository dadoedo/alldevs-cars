'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

export default function Hero() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();

  return (
    <section className="relative bg-gradient-to-r from-dark-900 to-dark-800 text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero.webp')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 to-dark-800/60"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div ref={heroRef as React.RefObject<HTMLDivElement>} className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-dark-primary animate-fade-in-down">
            Car & Art
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Váš exkluzívny predajca v Banskej Bystrici
          </p>
          <p className="text-lg mb-8 text-dark-200 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Ponúkame kvalitné vozidlá za výhodné ceny. Financovanie, poistenie a poradenstvo.
          </p>
          
          {/* Divider */}
          <div className="w-24 h-0.5 bg-primary-500 mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}></div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link
              href="/auta"
              className="inline-flex items-center px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
            >
              Pozrieť ponuku áut
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
            >
              Kontaktujte nás
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
