import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/database';
import { logSync, logError, logSuccess } from '@/lib/logger';
import { sendSyncNotification } from '@/lib/email';
import { xmlToCarData, createCarSpecifications, createCarEquipment, downloadAndOptimizeImage, parseXMLFeed, checkAndDownloadMissingImages } from '@/lib/xml-parser';
import { XMLAdvertisement, SyncResult } from '@/types';
import { Connection } from 'mysql2/promise';

const FEED_URL = process.env.FEED_URL;
const SYNC_SECRET_KEY = process.env.SYNC_SECRET_KEY;

async function fetchXMLFeed(): Promise<XMLAdvertisement[]> {
  if (!FEED_URL) {
    throw new Error('Feed URL not configured');
  }

  const response = await fetch(FEED_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.statusText}`);
  }

  const xmlText = await response.text();
  return parseXMLFeed(xmlText);
}


async function createCar(advertisement: XMLAdvertisement, connection: Connection): Promise<boolean> {
  try {
    // Convert XML to car data
    const carData = xmlToCarData(advertisement);
    
    // Insert car
    const [result] = await connection.execute(
      `INSERT INTO cars (autobazar_id, title, brand, model, price, year, mileage, fuel_type, transmission, body_type, engine_power, engine_volume, doors, seats, color, car_condition, vin, description, status, featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        carData.autobazar_id, carData.title, carData.brand, carData.model, carData.price,
        carData.year, carData.mileage, carData.fuel_type, carData.transmission, carData.body_type,
        carData.engine_power, carData.engine_volume, carData.doors, carData.seats,
        carData.color, carData.condition, carData.vin, carData.description, carData.status, carData.featured
      ]
    ) as [{ insertId: number }, unknown];
    
    const carId = result.insertId;
    
    // Check and download missing images
    const imageUrls = await checkAndDownloadMissingImages(carData.autobazar_id, advertisement.photos.photo);
    
    // Insert images
    for (let i = 0; i < imageUrls.length; i++) {
      await connection.execute(
        'INSERT INTO car_images (car_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
        [carId, imageUrls[i], i === 0, i]
      );
    }
    
    // Insert specifications
    const specifications = createCarSpecifications(carId, advertisement);
    for (const spec of specifications) {
      await connection.execute(
        'INSERT INTO car_specifications (car_id, specification_key, specification_value) VALUES (?, ?, ?)',
        [spec.car_id, spec.specification_key, spec.specification_value]
      );
    }
    
    // Insert equipment
    const equipment = createCarEquipment(carId, advertisement);
    for (const equip of equipment) {
      await connection.execute(
        'INSERT INTO car_equipment (car_id, category, equipment_item) VALUES (?, ?, ?)',
        [equip.car_id, equip.category, equip.equipment_item]
      );
    }
    
    return true;
  } catch (error) {
    logError(`Error creating car ${advertisement.idAdvertisement}:`, error);
    return false;
  }
}

async function updateCar(advertisement: XMLAdvertisement, connection: Connection): Promise<boolean> {
  try {
    // Convert XML to car data
    const carData = xmlToCarData(advertisement);
    
    // Update car
    await connection.execute(
      `UPDATE cars SET title = ?, brand = ?, model = ?, price = ?, year = ?, mileage = ?, fuel_type = ?, transmission = ?, body_type = ?, engine_power = ?, engine_volume = ?, doors = ?, seats = ?, color = ?, car_condition = ?, vin = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE autobazar_id = ?`,
      [
        carData.title, carData.brand, carData.model, carData.price,
        carData.year, carData.mileage, carData.fuel_type, carData.transmission, carData.body_type,
        carData.engine_power, carData.engine_volume, carData.doors, carData.seats,
        carData.color, carData.condition, carData.vin, carData.description, carData.autobazar_id
      ]
    );
    
    // Get car ID
    const [cars] = await connection.execute('SELECT id FROM cars WHERE autobazar_id = ?', [carData.autobazar_id]) as [Array<{ id: number }>, unknown];
    if (cars.length === 0) {
      return false;
    }
    
    const carId = cars[0].id;
    
    // Update specifications
    await connection.execute('DELETE FROM car_specifications WHERE car_id = ?', [carId]);
    const specifications = createCarSpecifications(carId, advertisement);
    for (const spec of specifications) {
      await connection.execute(
        'INSERT INTO car_specifications (car_id, specification_key, specification_value) VALUES (?, ?, ?)',
        [spec.car_id, spec.specification_key, spec.specification_value]
      );
    }
    
    // Update equipment
    await connection.execute('DELETE FROM car_equipment WHERE car_id = ?', [carId]);
    const equipment = createCarEquipment(carId, advertisement);
    for (const equip of equipment) {
      await connection.execute(
        'INSERT INTO car_equipment (car_id, category, equipment_item) VALUES (?, ?, ?)',
        [equip.car_id, equip.category, equip.equipment_item]
      );
    }
    
    // Check and download missing images
    const imageUrls = await checkAndDownloadMissingImages(carData.autobazar_id, advertisement.photos.photo);
    
    // Update images - delete existing and insert new ones
    await connection.execute('DELETE FROM car_images WHERE car_id = ?', [carId]);
    for (let i = 0; i < imageUrls.length; i++) {
      await connection.execute(
        'INSERT INTO car_images (car_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
        [carId, imageUrls[i], i === 0, i]
      );
    }
    
    return true;
  } catch (error) {
    logError(`Error updating car ${advertisement.idAdvertisement}:`, error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key');
  const syncType = searchParams.get('type') || 'manual';
 
  console.log(key, SYNC_SECRET_KEY);
  
  // Verify secret key
  if (key !== SYNC_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  logSync(`Starting ${syncType} sync...`);
  
  const result: SyncResult = {
    added: 0,
    updated: 0,
    deleted: 0,
    skipped: 0,
    errors: 0,
    executionTime: 0
  };
  
  let connection: Connection | null = null;
  
  try {
    // Create single database connection for entire sync
    connection = await getConnection();
    logSync('Database connection established');
    
    // Fetch XML feed
    const advertisements = await fetchXMLFeed();
    logSync(`Fetched ${advertisements.length} advertisements from feed`);
    
    // Get existing car IDs using the shared connection
    const [existingCars] = await connection.execute('SELECT autobazar_id FROM cars WHERE status != "deleted"') as [Array<{ autobazar_id: string }>, unknown];
    const existingCarIds = existingCars.map(car => car.autobazar_id);
    const feedCarIds: string[] = [];
    
    // Process each advertisement
    for (const advertisement of advertisements) {
      const autobazarId = advertisement.idAdvertisement;
      feedCarIds.push(autobazarId);
      
      try {
        if (existingCarIds.includes(autobazarId)) {
          // Update existing car
          if (await updateCar(advertisement, connection)) {
            result.updated++;
            logSync(`Updated car: ${autobazarId}`);
          } else {
            result.errors++;
          }
        } else {
          // Create new car
          if (await createCar(advertisement, connection)) {
            result.added++;
            logSync(`Created car: ${autobazarId}`);
          } else {
            result.errors++;
          }
        }
      } catch (error) {
        result.errors++;
        logError(`Error processing car ${autobazarId}:`, error);
      }
    }
    
    // Delete cars that are no longer in feed
    const carsToDelete = existingCarIds.filter(id => !feedCarIds.includes(id));
    for (const carId of carsToDelete) {
      try {
        // Get car ID
        const [cars] = await connection.execute('SELECT id FROM cars WHERE autobazar_id = ?', [carId]) as [Array<{ id: number }>, unknown];
        if (cars.length === 0) continue;
        
        const carDbId = cars[0].id;
        
        // Delete related data
        await connection.execute('DELETE FROM car_images WHERE car_id = ?', [carDbId]);
        await connection.execute('DELETE FROM car_specifications WHERE car_id = ?', [carDbId]);
        await connection.execute('DELETE FROM car_equipment WHERE car_id = ?', [carDbId]);
        await connection.execute('DELETE FROM cars WHERE id = ?', [carDbId]);
        
        result.deleted++;
        logSync(`Deleted car: ${carId}`);
      } catch (error) {
        result.errors++;
        logError(`Error deleting car ${carId}:`, error);
      }
    }
    
    result.executionTime = Date.now() - startTime;
    
    // Log sync result using the shared connection
    await connection.execute(
      'INSERT INTO sync_logs (sync_type, status, message, cars_added, cars_updated, cars_deleted, cars_skipped, errors_count, execution_time_seconds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        syncType,
        result.errors > 0 ? 'partial' : 'success',
        `Sync completed: ${result.added} added, ${result.updated} updated, ${result.deleted} deleted, ${result.errors} errors`,
        result.added,
        result.updated,
        result.deleted,
        result.skipped,
        result.errors,
        result.executionTime / 1000
      ]
    );
    
    logSuccess(`Sync completed: ${result.added} added, ${result.updated} updated, ${result.deleted} deleted, ${result.errors} errors`);
    
    // Send email notification if there were errors
    if (result.errors > 0) {
      await sendSyncNotification(
        'Sync completed with errors',
        `Sync completed with ${result.errors} errors. Added: ${result.added}, Updated: ${result.updated}, Deleted: ${result.deleted}`
      );
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    result.executionTime = Date.now() - startTime;
    result.errors++;
    
    logError('Sync failed:', error);
    
    // Log error using the shared connection if available
    if (connection) {
      try {
        await connection.execute(
          'INSERT INTO sync_logs (sync_type, status, message, cars_added, cars_updated, cars_deleted, cars_skipped, errors_count, execution_time_seconds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [syncType, 'error', `Sync failed: ${error}`, 0, 0, 0, 0, 1, result.executionTime / 1000]
        );
      } catch (logErr) {
        logError('Failed to log sync error:', logErr);
      }
    }
    
    // Send error notification
    await sendSyncNotification('Sync failed', `Sync failed with error: ${error}`);
    
    return NextResponse.json({ error: 'Sync failed', details: error }, { status: 500 });
  } finally {
    // Always close the connection
    if (connection) {
      try {
        await connection.end();
        logSync('Database connection closed');
      } catch (error) {
        logError('Error closing database connection:', error);
      }
    }
  }
}
