import 'dotenv/config';
import { getConnection } from '../src/lib/database';
import { logSync, logError } from '../src/lib/logger';
import fs from 'fs';
import path from 'path';

async function clearAllData() {
  const connection = await getConnection();
  
  try {
    logSync('Starting data cleanup...');
    
    // Delete all car-related data (CASCADE will handle related tables)
    await connection.execute('DELETE FROM cars');
    
    // Clear uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cars');
    if (fs.existsSync(uploadsDir)) {
      const carDirs = fs.readdirSync(uploadsDir);
      for (const carDir of carDirs) {
        const carPath = path.join(uploadsDir, carDir);
        if (fs.statSync(carPath).isDirectory()) {
          fs.rmSync(carPath, { recursive: true, force: true });
          logSync(`Deleted car images directory: ${carDir}`);
        }
      }
    }
    
    logSync('Data cleanup completed successfully');
    
  } catch (error) {
    logError('Error during data cleanup:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function runSync() {
  try {
    logSync('Starting full synchronization...');
    
    // Call the sync API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const syncUrl = `${baseUrl}/api/sync-cars-batch?key=${process.env.SYNC_SECRET_KEY}`;
    
    const response = await fetch(syncUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    logSync('Synchronization completed:', result);
    
  } catch (error) {
    logError('Error during synchronization:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚗 Starting complete data refresh...');
    
    // Step 1: Clear all existing data
    await clearAllData();
    
    // Step 2: Run full synchronization
    await runSync();
    
    console.log('✅ Complete data refresh finished successfully!');
    
  } catch (error) {
    console.error('❌ Error during complete data refresh:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { clearAllData, runSync };
