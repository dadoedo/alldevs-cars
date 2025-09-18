import { NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { SyncLog } from '@/types';

export async function GET() {
  try {
    const logs = await query(`
      SELECT * FROM sync_logs 
      ORDER BY created_at DESC 
      LIMIT 50
    `) as SyncLog[];
    
    return NextResponse.json(logs);
    
  } catch (error) {
    console.error('Error fetching sync logs:', error);
    return NextResponse.json({ error: 'Failed to fetch sync logs' }, { status: 500 });
  }
}
