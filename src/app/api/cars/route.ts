import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { CarFilters, CarsResponse, CarWithDetails, Car, CarSpecification, CarEquipment } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filters with Slovak SEO-friendly parameters
    const filters: CarFilters = {
      brand: searchParams.get('znacka') || undefined,
      minPrice: searchParams.get('cena-od') ? parseInt(searchParams.get('cena-od')!) : undefined,
      maxPrice: searchParams.get('cena-do') ? parseInt(searchParams.get('cena-do')!) : undefined,
      minYear: searchParams.get('rok-od') ? parseInt(searchParams.get('rok-od')!) : undefined,
      maxYear: searchParams.get('rok-do') ? parseInt(searchParams.get('rok-do')!) : undefined,
      fuelType: searchParams.get('palivo') || undefined,
      transmission: searchParams.get('prevodovka') || undefined,
      minMileage: searchParams.get('km-od') ? parseInt(searchParams.get('km-od')!) : undefined,
      maxMileage: searchParams.get('km-do') ? parseInt(searchParams.get('km-do')!) : undefined,
      status: searchParams.get('status') || 'active',
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      search: searchParams.get('vyhladavanie') || undefined
    };
    
    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    
    // Parse sorting
    const sortField = searchParams.get('sortField') || 'created_at';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    
    // Build WHERE clause
    const whereConditions: string[] = [];
    const queryParams: unknown[] = [];
    
    if (filters.brand) {
      whereConditions.push('c.brand = ?');
      queryParams.push(filters.brand);
    }
    
    if (filters.minPrice !== undefined) {
      whereConditions.push('c.price >= ?');
      queryParams.push(filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      whereConditions.push('c.price <= ?');
      queryParams.push(filters.maxPrice);
    }
    
    if (filters.minYear !== undefined) {
      whereConditions.push('c.year >= ?');
      queryParams.push(filters.minYear);
    }
    
    if (filters.maxYear !== undefined) {
      whereConditions.push('c.year <= ?');
      queryParams.push(filters.maxYear);
    }
    
    if (filters.fuelType) {
      whereConditions.push('c.fuel_type = ?');
      queryParams.push(filters.fuelType);
    }
    
    if (filters.transmission) {
      whereConditions.push('c.transmission = ?');
      queryParams.push(filters.transmission);
    }
    
    if (filters.minMileage !== undefined) {
      whereConditions.push('c.mileage >= ?');
      queryParams.push(filters.minMileage);
    }
    
    if (filters.maxMileage !== undefined) {
      whereConditions.push('c.mileage <= ?');
      queryParams.push(filters.maxMileage);
    }
    
    if (filters.status) {
      whereConditions.push('c.status = ?');
      queryParams.push(filters.status);
    }
    
    if (filters.featured !== undefined) {
      whereConditions.push('c.featured = ?');
      queryParams.push(filters.featured);
    }
    
    if (filters.search) {
      whereConditions.push('(c.title LIKE ? OR c.brand LIKE ? OR c.model LIKE ?)');
      const searchTerm = `%${filters.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM cars c ${whereClause}`;
    const countResult = await query(countQuery, queryParams) as Array<{ total: number }>;
    const total = countResult[0].total;
    
    // Get cars with images
    const carsQuery = `
      SELECT 
        c.*,
        GROUP_CONCAT(
          CONCAT(ci.id, ':', ci.image_url, ':', ci.is_primary, ':', ci.sort_order)
          ORDER BY ci.sort_order
          SEPARATOR '|'
        ) as images
      FROM cars c
      LEFT JOIN car_images ci ON c.id = ci.car_id
      ${whereClause}
      GROUP BY c.id
      ORDER BY c.${sortField} ${sortDirection}
      LIMIT ? OFFSET ?
    `;
    
    const cars = await query(carsQuery, [...queryParams, limit, offset]) as Array<Record<string, unknown>>;
    
    // Process cars to include images
    const processedCars: CarWithDetails[] = cars.map(car => {
      const carWithDetails: CarWithDetails = {
        ...(car as unknown as Car),
        images: (car as { images?: string }).images ? (car as { images: string }).images.split('|').map((img: string) => {
          const [id, image_url, is_primary, sort_order] = img.split(':');
          return {
            id: parseInt(id),
            car_id: (car as { id: number }).id,
            image_url,
            is_primary: is_primary === '1',
            sort_order: parseInt(sort_order),
            created_at: (car as { created_at: string }).created_at
          };
        }) : [],
        specifications: [],
        equipment: []
      };
      
      return carWithDetails;
    });
    
    // Get specifications and equipment for each car
    for (const car of processedCars) {
      const specifications = await query(
        'SELECT * FROM car_specifications WHERE car_id = ? ORDER BY specification_key',
        [car.id]
      ) as CarSpecification[];
      
      const equipment = await query(
        'SELECT * FROM car_equipment WHERE car_id = ? ORDER BY category, equipment_item',
        [car.id]
      ) as CarEquipment[];
      
      car.specifications = specifications;
      car.equipment = equipment;
    }
    
    const response: CarsResponse = {
      cars: processedCars,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}
