import CarDetail from '@/components/CarDetail';

export default function CarDetailPage({ params }: { params: { id: string } }) {
  return <CarDetail carId={parseInt(params.id)} />;
}
