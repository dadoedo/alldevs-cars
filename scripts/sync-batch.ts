#!/usr/bin/env tsx

import { parseXMLFeed } from '../src/lib/xml-parser';
import { xmlToCarData, createCarSpecifications, createCarEquipment } from '../src/lib/xml-parser';
import { XMLAdvertisement } from '../src/types';

async function syncInBatches() {
  console.log('🔄 Starting batch sync process...');
  
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
    
    // Process in batches of 5 to avoid connection limits
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < advertisements.length; i += batchSize) {
      batches.push(advertisements.slice(i, i + batchSize));
    }
    
    console.log(`📦 Processing ${batches.length} batches of ${batchSize} cars each`);
    
    let totalProcessed = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} cars)...`);
      
      try {
        // Process each car in the batch
        for (const advertisement of batch) {
          try {
            const carData = xmlToCarData(advertisement);
            console.log(`  ✅ Processed: ${carData.brand} ${carData.model} (${carData.year}) - ${carData.price} EUR`);
            totalProcessed++;
          } catch (error) {
            console.error(`  ❌ Error processing car ${advertisement.idAdvertisement}:`, error);
            totalErrors++;
          }
        }
        
        // Add delay between batches to avoid overwhelming the server
        if (i < batches.length - 1) {
          console.log('⏳ Waiting 2 seconds before next batch...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`❌ Error processing batch ${i + 1}:`, error);
        totalErrors += batch.length;
      }
    }
    
    console.log(`\n✅ Batch sync completed!`);
    console.log(`  Total processed: ${totalProcessed} cars`);
    console.log(`  Total errors: ${totalErrors} cars`);
    
  } catch (error) {
    console.error('❌ Batch sync failed:', error);
    process.exit(1);
  }
}

// Run the batch sync
syncInBatches();
