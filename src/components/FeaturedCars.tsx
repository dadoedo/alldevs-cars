'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Calendar, Gauge, Fuel, Settings } from 'lucide-react';
import { CarWithDetails } from '@/types';
import { useScrollAnimation } from '@/lib/useScrollAnimation';

export default function FeaturedCars() {
  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: sectionRef } = useScrollAnimation();

  useEffect(() => {
    fetch('/api/cars?limit=6&sortField=created_at&sortDirection=desc')
      .then(res => res.json())
      .then(data => {
        setCars(data.cars || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching featured cars:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-dark-primary mb-4">Vybrané ponuky</h2>
            <p className="text-lg text-dark-300 mb-12">Načítavam najlepšie ponuky...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-dark-700 rounded-lg shadow-md overflow-hidden animate-pulse border border-dark-600">
                  <div className="h-48 bg-dark-600"></div>
                  <div className="p-6">
                    <div className="h-4 bg-dark-600 rounded mb-2"></div>
                    <div className="h-4 bg-dark-600 rounded w-2/3 mb-4"></div>
                    <div className="h-6 bg-dark-600 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 bg-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark-primary mb-4">Najnovšie ponuky</h2>
          <p className="text-lg text-dark-300">Najnovšie vozidlá v našej ponuke</p>
        </div>

        {cars.length === 0 ? (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-dark-400 mb-4" />
            <h3 className="text-lg font-medium text-dark-primary mb-2">Žiadne vozidlá</h3>
            <p className="text-dark-300">Momentálne nemáme žiadne vozidlá v ponuke.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div 
                key={car.id} 
                className="bg-dark-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 border border-dark-600 hover:border-primary-500/50 hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  {car.images && car.images.length > 0 ? (
                    <Image
                      src={car.images[0].image_url}
                      alt={car.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-dark-600 flex items-center justify-center">
                      <Car className="h-12 w-12 text-dark-400" />
                    </div>
                  )}
                  {car.featured && (
                    <div className="absolute top-4 left-4 bg-primary-500 text-white px-2 py-1 rounded text-sm font-semibold animate-glow">
                      Odporúčané
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-dark-primary mb-2 line-clamp-2">
                    {car.title}
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-dark-300 mb-4">
                    {car.year && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {car.year}
                      </div>
                    )}
                    {car.mileage && (
                      <div className="flex items-center">
                        <Gauge className="h-4 w-4 mr-1" />
                        {car.mileage.toLocaleString()} km
                      </div>
                    )}
                    {car.fuel_type && (
                      <div className="flex items-center">
                        <Fuel className="h-4 w-4 mr-1" />
                        {car.fuel_type}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary-500">
                      {car.price.toLocaleString()} €
                    </div>
                    <Link
                      href={`/auta/${car.id}`}
                      className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/auta"
            className="inline-flex items-center px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25"
          >
            Pozrieť všetky vozidlá
            <Settings className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
          </Link>
        </div>
      </div>
    </section>
  );
}
