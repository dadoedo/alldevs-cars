import { Suspense } from 'react';
import CarsList from '@/components/CarsList';
import CarsFilters from '@/components/CarsFilters';

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-primary mb-4">Ponuka áut</h1>
          <p className="text-lg text-dark-secondary">Vyberte si z našej širokej ponuky kvalitných vozidiel</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="animate-pulse bg-dark-700 h-96 rounded-lg"></div>}>
              <CarsFilters />
            </Suspense>
          </div>
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="animate-pulse bg-dark-700 h-96 rounded-lg"></div>}>
              <CarsList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
