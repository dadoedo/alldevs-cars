import ServicesContent from '@/components/ServicesContent';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark-primary mb-4">Naše služby</h1>
          <p className="text-xl text-dark-secondary">Kompletný servis pre vaše vozidlo</p>
        </div>
        <ServicesContent />
      </div>
    </div>
  );
}
