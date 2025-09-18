#!/usr/bin/env tsx

import { parseXMLFeed } from '../src/lib/xml-parser';
import { xmlToCarData, createCarSpecifications, createCarEquipment } from '../src/lib/xml-parser';
import { XMLAdvertisement } from '../src/types';

async function testSyncAPI() {
  console.log('🔍 Testing sync API with real data...');
  
  try {
    // Fetch the XML feed
    const response = await fetch('https://www.autobazar.sk/api/export/2030df4193e166e4909f8766304a33a1d8/firmAdvertisements/329181/');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log(`✅ Successfully fetched XML feed (${xmlText.length} characters)`);
    
    // Parse the XML
    const advertisements = parseXMLFeed(xmlText);
    console.log(`✅ Successfully parsed ${advertisements.length} advertisements`);
    
    // Test sync API endpoint
    const syncUrl = 'http://localhost:3000/api/sync-cars?key=carart_sync_2025_abc123def456&type=manual';
    console.log(`\n🔄 Testing sync API endpoint: ${syncUrl}`);
    
    try {
      const syncResponse = await fetch(syncUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (syncResponse.ok) {
        const syncResult = await syncResponse.json();
        console.log('✅ Sync API response:');
        console.log(`  Added: ${syncResult.added} cars`);
        console.log(`  Updated: ${syncResult.updated} cars`);
        console.log(`  Deleted: ${syncResult.deleted} cars`);
        console.log(`  Errors: ${syncResult.errors} cars`);
        console.log(`  Execution time: ${syncResult.executionTime}ms`);
      } else {
        const errorText = await syncResponse.text();
        console.log(`❌ Sync API failed with status ${syncResponse.status}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Sync API request failed: ${error}`);
      console.log('💡 Make sure the Next.js development server is running (npm run dev)');
    }
    
    // Show sample data for first few cars
    console.log('\n📋 Sample data from first 3 cars:');
    advertisements.slice(0, 3).forEach((ad, index) => {
      const carData = xmlToCarData(ad);
      console.log(`\n${index + 1}. ${carData.brand} ${carData.model} (${carData.year})`);
      console.log(`   Price: ${carData.price} EUR`);
      console.log(`   Mileage: ${carData.mileage} km`);
      console.log(`   Fuel: ${carData.fuel_type}`);
      console.log(`   Transmission: ${carData.transmission}`);
      console.log(`   Body: ${carData.body_type}`);
      console.log(`   Photos: ${ad.photos.photo.length} images`);
    });
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testSyncAPI();
