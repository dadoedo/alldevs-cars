'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { 
  ArrowLeft, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings, 
  Users, 
  Car, 
  Shield,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react';
import { CarWithDetails } from '@/types';
import { useSettings } from '@/lib/useSettings';

interface CarDetailProps {
  carId: number;
}

export default function CarDetail({ carId }: CarDetailProps) {
  const router = useRouter();
  const [car, setCar] = useState<CarWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    fetch(`/api/cars/${carId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          router.push('/auta');
          return;
        }
        setCar(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching car:', err);
        router.push('/auta');
      });
  }, [carId, router]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen || !car?.images) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case 'Escape':
          setLightboxOpen(false);
          break;
      }
    };

    if (lightboxOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxOpen, car?.images]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-dark-700 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-dark-700 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-dark-700 rounded w-3/4"></div>
                <div className="h-6 bg-dark-700 rounded w-1/2"></div>
                <div className="h-12 bg-dark-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Car className="mx-auto h-12 w-12 text-dark-400 mb-4" />
          <h3 className="text-lg font-medium text-dark-primary mb-2">Vozidlo nebolo nájdené</h3>
          <Link
            href="/auta"
            className="text-primary-500 hover:text-primary-400"
          >
            Späť na ponuku áut
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (car.images && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car.images && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  const specifications = car.specifications || [];
  const equipment = car.equipment || [];

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-primary-500 hover:text-primary-400 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Späť na ponuku
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div 
              className="relative h-96 bg-dark-800 rounded-lg overflow-hidden border border-dark-700 group cursor-pointer"
              onClick={() => setLightboxOpen(true)}
            >
              {car.images && car.images.length > 0 ? (
                <>
                  <Image
                    src={car.images[currentImageIndex].image_url}
                    alt={car.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Overlay with zoom icon */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Navigation arrows */}
                  {car.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {car.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {car.images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-dark-600 flex items-center justify-center">
                  <Car className="h-12 w-12 text-dark-400" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {car.images && car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images.slice(0, 8).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setLightboxOpen(true);
                    }}
                    className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-primary-500 scale-105' 
                        : 'hover:scale-105'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={`${car.title} - obrázok ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {index === 7 && car.images.length > 8 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          +{car.images.length - 8}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Lightbox */}
            {car.images && car.images.length > 0 && (
              <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={car.images.map(image => ({
                  src: image.image_url,
                  alt: car.title,
                  width: 1920,
                  height: 1080
                }))}
                index={currentImageIndex}
                on={{
                  view: ({ index }) => setCurrentImageIndex(index)
                }}
                plugins={[Thumbnails]}
                thumbnails={{
                  position: 'bottom',
                  width: 120,
                  height: 80,
                  border: 0,
                  borderRadius: 8,
                  padding: 4,
                  gap: 12,
                  showToggle: true,
                  vignette: false
                }}
                carousel={{
                  finite: false,
                  preload: 2
                }}
                render={{
                  buttonPrev: car.images.length <= 1 ? () => null : undefined,
                  buttonNext: car.images.length <= 1 ? () => null : undefined,
                }}
                styles={{
                  container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
                  slide: { backgroundColor: 'transparent' }
                }}
                animation={{
                  fade: 300,
                  swipe: 500
                }}
              />
            )}
          </div>

          {/* Car Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-dark-primary mb-2">{car.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-dark-secondary mb-4">
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
              <div className="text-4xl font-bold text-primary-500 mb-6">
                {car.price.toLocaleString()} €
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              {car.transmission && (
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                  <div className="flex items-center mb-2">
                    <Settings className="h-5 w-5 text-primary-500 mr-2" />
                    <span className="font-semibold text-dark-primary">Prevodovka</span>
                  </div>
                  <p className="text-dark-secondary">{car.transmission}</p>
                </div>
              )}
              {car.body_type && (
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                  <div className="flex items-center mb-2">
                    <Car className="h-5 w-5 text-primary-500 mr-2" />
                    <span className="font-semibold text-dark-primary">Karoséria</span>
                  </div>
                  <p className="text-dark-secondary">{car.body_type}</p>
                </div>
              )}
              {car.seats && (
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-primary-500 mr-2" />
                    <span className="font-semibold text-dark-primary">Počet miest</span>
                  </div>
                  <p className="text-dark-secondary">{car.seats}</p>
                </div>
              )}
              {car.condition && (
                <div className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-primary-500 mr-2" />
                    <span className="font-semibold text-dark-primary">Stav</span>
                  </div>
                  <p className="text-dark-secondary">{car.condition}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <h3 className="text-lg font-semibold text-dark-primary mb-3">Popis</h3>
                <p className="text-dark-secondary whitespace-pre-line">{car.description}</p>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="flex space-x-4">
              <a
                href={`tel:${settings?.phone || '0910 662 069'}`}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
              >
                <Phone className="h-5 w-5 inline mr-2" />
                Kontaktovať predajcu
              </a>
              <a
                href={`mailto:${settings?.email || 'predaj.carart@gmail.com'}?subject=Záujem o vozidlo: ${car.title}&body=Dobrý deň,%0D%0A%0D%0AMám záujem o vozidlo: ${car.title}%0D%0ACena: ${car.price.toLocaleString()} €%0D%0A%0D%0AProsím o kontakt.%0D%0A%0D%0AĎakujem`}
                className="flex-1 bg-dark-600 hover:bg-dark-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center"
              >
                <Mail className="h-5 w-5 inline mr-2" />
                Poslať email
              </a>
            </div>
          </div>
        </div>

        {/* Specifications and Equipment */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Specifications */}
          {specifications.length > 0 && (
            <div className="bg-dark-800 rounded-lg shadow-md p-6 border border-dark-700">
              <h3 className="text-xl font-semibold text-dark-primary mb-4">Špecifikácie</h3>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-dark-600 last:border-b-0">
                    <span className="font-medium text-dark-secondary">{spec.specification_key}</span>
                    <span className="text-dark-muted">{spec.specification_value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          {equipment.length > 0 && (
            <div className="bg-dark-800 rounded-lg shadow-md p-6 border border-dark-700">
              <h3 className="text-xl font-semibold text-dark-primary mb-4">Vybavenie</h3>
              <div className="space-y-4">
                {Object.entries(
                  equipment.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item.equipment_item);
                    return acc;
                  }, {} as Record<string, string[]>)
                ).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-dark-secondary mb-2">{category}</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-dark-muted">
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
