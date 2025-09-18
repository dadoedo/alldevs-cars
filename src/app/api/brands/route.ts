import { NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { Brand } from '@/types';

export async function GET() {
  try {
    const brands = await query(`
      SELECT 
        brand as name,
        COUNT(*) as count
      FROM cars 
      WHERE status = 'active'
      GROUP BY brand 
      ORDER BY brand
    `) as Brand[];
    
    return NextResponse.json(brands);
    
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}
