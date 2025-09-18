'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brand } from '@/types';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

export default function BrandsOverview() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: sectionRef } = useScrollAnimation();

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => {
        setBrands(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching brands:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-primary mb-4">Značky vozidiel</h2>
            <p className="text-lg text-dark-300">Načítavam značky...</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-dark-700 rounded-lg h-24 animate-pulse border border-dark-600"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Značky vozidiel</h2>
          <p className="text-lg text-dark-300">Vyberte si z našich značiek</p>
        </div>

        {brands.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-dark-primary mb-2">Žiadne značky</h3>
            <p className="text-dark-300">Momentálne nemáme žiadne vozidlá v ponuke.</p>
          </div>
        ) : (
          <>
            {/* Mobile view - show only first 5 brands + "X more" */}
            <div className="grid grid-cols-2 md:hidden gap-6">
              {brands.slice(0, 5).map((brand) => (
                <Link
                  key={brand.name}
                  href={`/auta?znacka=${encodeURIComponent(brand.name)}`}
                  className="group bg-dark-800 hover:bg-dark-700 rounded-lg p-6 text-center transition-all duration-300 border border-dark-600 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20 hover:scale-105"
                >
                  <div className="text-2xl font-bold text-dark-primary group-hover:text-primary-500 mb-2 transition-colors duration-300">
                    {brand.name}
                  </div>
                  <div className="text-sm text-dark-300 group-hover:text-primary-400 transition-colors duration-300">
                    {brand.count} vozidiel
                  </div>
                </Link>
              ))}
              {brands.length > 5 && (
                <div className="bg-dark-800 rounded-lg p-6 text-center border border-dark-600 flex items-center justify-center">
                  <div className="text-lg font-semibold text-primary-500">
                    +{brands.length - 5} ďalších
                  </div>
                </div>
              )}
            </div>

            {/* Desktop view - show first 11 brands + "X more" */}
            <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-6">
              {brands.slice(0, 11).map((brand) => (
                <Link
                  key={brand.name}
                  href={`/auta?znacka=${encodeURIComponent(brand.name)}`}
                  className="group bg-dark-800 hover:bg-dark-700 rounded-lg p-6 text-center transition-all duration-300 border border-dark-600 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20 hover:scale-105"
                >
                  <div className="text-2xl font-bold text-dark-primary group-hover:text-primary-500 mb-2 transition-colors duration-300">
                    {brand.name}
                  </div>
                  <div className="text-sm text-dark-300 group-hover:text-primary-400 transition-colors duration-300">
                    {brand.count} vozidiel
                  </div>
                </Link>
              ))}
              {brands.length > 11 && (
                <div className="bg-dark-800 rounded-lg p-6 text-center border border-dark-600 flex items-center justify-center">
                  <div className="text-lg font-semibold text-primary-500">
                    +{brands.length - 11} ďalších
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="text-center mt-12">
          <Link
            href="/auta"
            className="inline-flex items-center px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
          >
            Pozrieť všetky vozidlá
          </Link>
        </div>
      </div>
    </section>
  );
}
