'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brand } from '@/types';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

export default function CarsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [filters, setFilters] = useState({
    brand: searchParams.get('znacka') || '',
    minPrice: searchParams.get('cena-od') || '',
    maxPrice: searchParams.get('cena-do') || '',
    minYear: searchParams.get('rok-od') || '',
    maxYear: searchParams.get('rok-do') || '',
    fuelType: searchParams.get('palivo') || '',
    transmission: searchParams.get('prevodovka') || '',
    minMileage: searchParams.get('km-od') || '',
    maxMileage: searchParams.get('km-do') || '',
    search: searchParams.get('vyhladavanie') || ''
  });

  useEffect(() => {
    fetch('/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data || []))
      .catch(err => console.error('Error fetching brands:', err));
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL with Slovak SEO-friendly parameters
    const params = new URLSearchParams();
    if (newFilters.brand) params.set('znacka', newFilters.brand);
    if (newFilters.minPrice) params.set('cena-od', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('cena-do', newFilters.maxPrice);
    if (newFilters.minYear) params.set('rok-od', newFilters.minYear);
    if (newFilters.maxYear) params.set('rok-do', newFilters.maxYear);
    if (newFilters.fuelType) params.set('palivo', newFilters.fuelType);
    if (newFilters.transmission) params.set('prevodovka', newFilters.transmission);
    if (newFilters.minMileage) params.set('km-od', newFilters.minMileage);
    if (newFilters.maxMileage) params.set('km-do', newFilters.maxMileage);
    if (newFilters.search) params.set('vyhladavanie', newFilters.search);
    
    router.push(`/auta?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      fuelType: '',
      transmission: '',
      minMileage: '',
      maxMileage: '',
      search: ''
    });
    router.push('/auta');
  };

  const fuelTypes = ['Benzín', 'Diesel', 'Hybrid', 'Elektrický', 'LPG', 'CNG'];
  const transmissions = ['Manuálna', 'Automatická', 'Poloautomatická'];

  return (
    <div className="bg-dark-800 rounded-lg shadow-md border border-dark-700">
      {/* Header with toggle button for mobile */}
      <div className="flex items-center justify-between p-6 pb-0">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="md:hidden flex items-center space-x-2 text-dark-primary hover:text-primary-500 transition-colors duration-200"
        >
          <Filter className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold">Filtre</h3>
        </button>
        <div className="hidden md:flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-dark-primary">Filtre</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearFilters}
            className="text-sm text-primary-500 hover:text-primary-400 hidden md:block"
          >
            Vymazať všetky
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="md:hidden text-primary-500 hover:text-primary-400 transition-colors duration-200"
          >
            {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile clear button */}
      <div className={`px-6 py-2 md:hidden transition-all duration-300 ${
        isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-screen'
      }`}>
        <button
          onClick={clearFilters}
          className="text-sm text-primary-500 hover:text-primary-400"
        >
          Vymazať všetky
        </button>
      </div>

      {/* Filters content */}
      <div className={`px-6 pb-6 transition-all duration-300 ${
        isCollapsed ? 'max-h-0 overflow-hidden md:max-h-none' : 'max-h-screen'
      }`}>
        <div className="space-y-6 pt-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-dark-secondary mb-2">
            Vyhľadávanie
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Značka, model..."
            className="w-full px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-dark-secondary mb-2">
            Značka
          </label>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Všetky značky</option>
            {brands.map((brand) => (
              <option key={brand.name} value={brand.name}>
                {brand.name} ({brand.count})
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-dark-secondary mb-2">
            Cena (€)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="Od"
              className="px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="Do"
              className="px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            />
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-dark-secondary mb-2">
            Rok výroby
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.minYear}
              onChange={(e) => handleFilterChange('minYear', e.target.value)}
              placeholder="Od"
              className="px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            />
            <input
              type="number"
              value={filters.maxYear}
              onChange={(e) => handleFilterChange('maxYear', e.target.value)}
              placeholder="Do"
              className="px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            />
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-dark-secondary mb-2">
            Palivo
          </label>
          <select
            value={filters.fuelType}
            onChange={(e) => handleFilterChange('fuelType', e.target.value)}
            className="w-full px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Všetky typy</option>
            {fuelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-sm font-medium text-dark-secondary mb-2">
            Prevodovka
          </label>
          <select
            value={filters.transmission}
            onChange={(e) => handleFilterChange('transmission', e.target.value)}
            className="w-full px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Všetky typy</option>
            {transmissions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>


        {/* Mileage Range */}
        <div>
          <label className="block text-sm font-medium text-dark-secondary mb-2">
            Najazdené km
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.minMileage}
              onChange={(e) => handleFilterChange('minMileage', e.target.value)}
              placeholder="Od"
              className="px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            />
            <input
              type="number"
              value={filters.maxMileage}
              onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
              placeholder="Do"
              className="px-3 py-2 border border-dark-600 bg-dark-700 text-dark-100 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-dark-400"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
