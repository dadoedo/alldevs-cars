#!/usr/bin/env tsx

import { parseXMLFeed } from '../src/lib/xml-parser';
import { xmlToCarData, createCarSpecifications, createCarEquipment } from '../src/lib/xml-parser';
import { XMLAdvertisement } from '../src/types';

async function testXMLFeed() {
  console.log('🔍 Testing XML feed parsing...');
  
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
    
    // Test first advertisement
    if (advertisements.length > 0) {
      const firstAd = advertisements[0];
      console.log('\n📋 First advertisement details:');
      console.log(`  ID: ${firstAd.idAdvertisement}`);
      console.log(`  Title: ${firstAd.title}`);
      console.log(`  Brand: ${firstAd.brand}`);
      console.log(`  Model: ${firstAd.model}`);
      console.log(`  Price: ${firstAd.params.cena} EUR`);
      console.log(`  Year: ${firstAd.params.rok}`);
      console.log(`  Mileage: ${firstAd.params['najazdene-km']} km`);
      console.log(`  Fuel: ${firstAd.params.palivo_value}`);
      console.log(`  Body: ${firstAd.params.karoseria_value}`);
      console.log(`  Transmission: ${firstAd.params.prevodovka_value}`);
      console.log(`  Photos: ${firstAd.photos.photo.length} images`);
      
      // Test conversion to car data
      console.log('\n🔄 Testing conversion to car data...');
      const carData = xmlToCarData(firstAd);
      console.log('✅ Car data conversion successful:');
      console.log(`  Autobazar ID: ${carData.autobazar_id}`);
      console.log(`  Title: ${carData.title}`);
      console.log(`  Brand: ${carData.brand}`);
      console.log(`  Model: ${carData.model}`);
      console.log(`  Price: ${carData.price} EUR`);
      console.log(`  Year: ${carData.year}`);
      console.log(`  Mileage: ${carData.mileage} km`);
      console.log(`  Fuel Type: ${carData.fuel_type}`);
      console.log(`  Transmission: ${carData.transmission}`);
      console.log(`  Body Type: ${carData.body_type}`);
      console.log(`  Engine Power: ${carData.engine_power}`);
      console.log(`  Engine Volume: ${carData.engine_volume}`);
      console.log(`  Doors: ${carData.doors}`);
      console.log(`  Seats: ${carData.seats}`);
      console.log(`  Color: ${carData.color}`);
      console.log(`  Condition: ${carData.condition}`);
      console.log(`  VIN: ${carData.vin}`);
      console.log(`  Description: ${carData.description?.substring(0, 100)}...`);
      
      // Test specifications creation
      console.log('\n📊 Testing specifications creation...');
      const specifications = createCarSpecifications(1, firstAd);
      console.log(`✅ Created ${specifications.length} specifications:`);
      specifications.slice(0, 10).forEach(spec => {
        console.log(`  ${spec.specification_key}: ${spec.specification_value}`);
      });
      
      // Test equipment creation
      console.log('\n🔧 Testing equipment creation...');
      const equipment = createCarEquipment(1, firstAd);
      console.log(`✅ Created ${equipment.length} equipment items:`);
      const equipmentByCategory = equipment.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item.equipment_item);
        return acc;
      }, {} as Record<string, string[]>);
      
      Object.entries(equipmentByCategory).forEach(([category, items]) => {
        console.log(`  ${category}: ${items.length} items`);
        items.slice(0, 3).forEach(item => console.log(`    - ${item}`));
        if (items.length > 3) console.log(`    ... and ${items.length - 3} more`);
      });
    }
    
    console.log('\n✅ All tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testXMLFeed();
