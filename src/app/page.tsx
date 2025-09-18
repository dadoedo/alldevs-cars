import Hero from '@/components/Hero';
import FeaturedCars from '@/components/FeaturedCars';
import BrandsOverview from '@/components/BrandsOverview';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedCars />
      <BrandsOverview />
      <AboutSection />
      <ContactSection />
    </div>
  );
}