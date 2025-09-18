'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Calendar, Gauge, Fuel, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { CarsResponse } from '@/types';

export default function CarsList() {
  const searchParams = useSearchParams();
  const [carsData, setCarsData] = useState<CarsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        params.set('sortField', sortField);
        params.set('sortDirection', sortDirection);
        
        const response = await fetch(`/api/cars?${params.toString()}`);
        const data = await response.json();
        setCarsData(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchParams, sortField, sortDirection]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    window.history.pushState(null, '', `/auta?${params.toString()}`);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-dark-700 rounded w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 bg-dark-700 rounded w-20 animate-pulse"></div>
            <div className="h-10 bg-dark-700 rounded w-20 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-dark-800 rounded-lg shadow-md overflow-hidden animate-pulse border border-dark-700">
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
    );
  }

  if (!carsData || carsData.cars.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="mx-auto h-12 w-12 text-dark-400 mb-4" />
        <h3 className="text-lg font-medium text-dark-primary mb-2">Žiadne vozidlá</h3>
        <p className="text-dark-secondary">Nenašli sa žiadne vozidlá podľa zadaných filtrov.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-dark-primary">
            {carsData.total} vozidiel
          </h2>
          <p className="text-sm text-dark-secondary">
            Stránka {carsData.page} z {carsData.totalPages}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sort */}
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field);
              setSortDirection(direction as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-primary-500/50"
          >
            <option value="created_at-desc">Najnovšie</option>
            <option value="price-asc">Cena: od najnižšej</option>
            <option value="price-desc">Cena: od najvyššej</option>
            <option value="year-desc">Rok: od najnovšieho</option>
            <option value="year-asc">Rok: od najstaršieho</option>
            <option value="mileage-asc">Kilometre: od najnižších</option>
            <option value="mileage-desc">Kilometre: od najvyšších</option>
          </select>
          
          {/* View Mode */}
          <div className="flex border border-dark-600 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-all duration-300 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-dark-secondary hover:bg-dark-700 hover:text-primary-500'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-all duration-300 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-dark-secondary hover:bg-dark-700 hover:text-primary-500'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Cars Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {carsData.cars.map((car) => (
          <div
            key={car.id}
            className={`bg-dark-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 border border-dark-700 hover:border-primary-500/50 hover:scale-105 ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            <Link href={`/auta/${car.id}`} className="block">
              <div className={`${viewMode === 'list' ? 'w-64 h-48' : 'h-48'} relative overflow-hidden cursor-pointer`}>
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
            </Link>
            
            <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <Link href={`/auta/${car.id}`} className="block">
                <h3 className="text-xl font-semibold text-dark-primary mb-2 line-clamp-2 hover:text-primary-400 transition-colors cursor-pointer">
                  {car.title}
                </h3>
              </Link>
              
              <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dark-secondary mb-4`}>
                {car.year && (
                  <div className="flex items-center whitespace-nowrap">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    {car.year}
                  </div>
                )}
                {car.mileage && (
                  <div className="flex items-center whitespace-nowrap">
                    <Gauge className="h-4 w-4 mr-1 flex-shrink-0" />
                    {car.mileage.toLocaleString()} km
                  </div>
                )}
                {car.fuel_type && (
                  <div className="flex items-center whitespace-nowrap">
                    <Fuel className="h-4 w-4 mr-1 flex-shrink-0" />
                    {car.fuel_type}
                  </div>
                )}
              </div>

              <div className={`flex items-center justify-between ${
                viewMode === 'list' ? 'mt-auto' : ''
              }`}>
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

      {/* Pagination */}
      {carsData.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => goToPage(carsData.page - 1)}
            disabled={carsData.page === 1}
            className="p-2 border border-dark-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-700 text-dark-secondary transition-all duration-300 hover:border-primary-500/50 hover:text-primary-500"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {Array.from({ length: Math.min(5, carsData.totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-2 border rounded-md transition-all duration-300 ${
                  page === carsData.page
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'border-dark-600 hover:bg-dark-700 text-dark-secondary hover:border-primary-500/50 hover:text-primary-500'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => goToPage(carsData.page + 1)}
            disabled={carsData.page === carsData.totalPages}
            className="p-2 border border-dark-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-700 text-dark-secondary transition-all duration-300 hover:border-primary-500/50 hover:text-primary-500"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
