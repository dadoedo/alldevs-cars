import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { CarWithDetails, Car, CarImage, CarSpecification, CarEquipment } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carId = parseInt(id);
    
    if (isNaN(carId)) {
      return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 });
    }
    
    // Get car details
    const cars = await query(
      'SELECT * FROM cars WHERE id = ? AND status = "active"',
      [carId]
    ) as Array<Record<string, unknown>>;
    
    if (cars.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    
    const car = cars[0] as unknown as Car;
    
    // Get images
    const images = await query(
      'SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order',
      [carId]
    ) as CarImage[];
    
    // Get specifications
    const specifications = await query(
      'SELECT * FROM car_specifications WHERE car_id = ? ORDER BY specification_key',
      [carId]
    ) as CarSpecification[];
    
    // Get equipment
    const equipment = await query(
      'SELECT * FROM car_equipment WHERE car_id = ? ORDER BY category, equipment_item',
      [carId]
    ) as CarEquipment[];
    
    const carWithDetails: CarWithDetails = {
      ...car,
      images,
      specifications,
      equipment
    };
    
    return NextResponse.json(carWithDetails);
    
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}
