import { XMLAdvertisement, Car, CarImage, CarSpecification, CarEquipment } from '@/types';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { DOMParser } from 'xmldom';

export function convertToFloat(string: string): number {
  // Remove HTML non-breaking spaces
  string = string.replace(/\xc2\xa0/g, ' ');
  string = string.replace(/\u00a0/g, ' ');

  // Remove units
  string = string.replace(/cm3/g, '');
  string = string.replace(/cm2/g, '');

  // Remove any non-numeric characters except comma and dot
  string = string.replace(/[^\d,\.]/g, '');
  // Replace comma with dot
  string = string.replace(',', '.');
  // Convert to float
  return parseFloat(string) || 0;
}

export function xmlToCarData(advertisement: XMLAdvertisement): Omit<Car, 'id' | 'created_at' | 'updated_at'> {
  const car: Omit<Car, 'id' | 'created_at' | 'updated_at'> = {
    autobazar_id: advertisement.idAdvertisement,
    title: advertisement.title,
    brand: advertisement.brand.trim(),
    model: advertisement.model?.trim() || null,
    price: parseInt(advertisement.params.cena) || 0,
    year: parseInt(advertisement.params.rok) || null,
    mileage: parseInt(advertisement.params['najazdene-km']) || null,
    fuel_type: advertisement.params.palivo_value || null,
    transmission: advertisement.params.prevodovka_value || null,
    body_type: advertisement.params.karoseria_value || null,
    engine_power: advertisement.params['vykon-motora'] ? `${advertisement.params['vykon-motora']} kW` : null,
    engine_volume: advertisement.params['objem-motora'] ? `${advertisement.params['objem-motora']} cm³` : null,
    doors: parseInt(advertisement.params['pocet-dveri_value']) || null,
    seats: parseInt(advertisement.params['miest-na-sedenie_value']) || null,
    color: advertisement.params.farba_value || null,
    condition: advertisement.params.stav_value || null,
    vin: advertisement.params.vin || null,
    description: advertisement.contentOptions?.trim() || null,
    status: 'active',
    featured: false
  };

  return car;
}

export function createCarSpecifications(carId: number, advertisement: XMLAdvertisement): Omit<CarSpecification, 'id' | 'created_at'>[] {
  const specifications: Omit<CarSpecification, 'id' | 'created_at'>[] = [];
  const params = advertisement.params;

  const specMappings = [
    { key: 'Rok výroby', value: params.rok },
    { key: 'Palivo', value: params.palivo_value },
    { key: 'Karoséria', value: params.karoseria_value },
    { key: 'Prevodovka', value: params.prevodovka_value },
    { key: 'Pohon', value: params.pohon_value },
    { key: 'Výkon motora', value: params['vykon-motora'] ? `${params['vykon-motora']} kW` : undefined },
    { key: 'Objem motora', value: params['objem-motora'] ? `${params['objem-motora']} cm³` : undefined },
    { key: 'Počet miest na sedenie', value: params['miest-na-sedenie_value'] },
    { key: 'Počet dverí', value: params['pocet-dveri_value'] },
    { key: 'Kilometre', value: params['najazdene-km'] },
    { key: 'Stav vozidla', value: params.stav_value },
    { key: 'Norma emisií', value: params['norma-emisii_value'] },
    { key: 'Farba', value: params.farba_value },
    { key: 'Metalíza', value: params.metaliza_value },
    { key: 'Klimatizácia', value: params.klimatizacia_value },
    { key: 'Elektrické okná', value: params['elektricke-okna_value'] },
    { key: 'Parkovacie senzory', value: params['parkovacie-senzory_value'] },
    { key: 'Vyhrievané sedačky', value: params['vyhrievane-sedacky_value'] },
    { key: 'Airbagy - počet', value: params['airbagy---pocet_value'] },
    { key: 'Rozmer pneumatík', value: params['rozmer-pneu'] },
    { key: 'Šírka bez spätných zrkadiel', value: params['sirka-bez-spatnych'] ? `${params['sirka-bez-spatnych']} mm` : undefined },
    { key: 'Výška', value: params.vyska ? `${params.vyska} mm` : undefined },
    { key: 'Dĺžka', value: params.dlzka ? `${params.dlzka} mm` : undefined },
    { key: 'Max. rýchlosť', value: params['max.-rychlost'] ? `${params['max.-rychlost']} km/h` : undefined },
    { key: 'Typ rezervného kolesa', value: params['typ-rezervneho-kolesa_value'] },
    { key: 'Zrýchlenie', value: params.zrychlenie ? `${params.zrychlenie} s` : undefined },
    { key: 'Kapacita nádrže', value: params['kapacita-nadrze'] ? `${params['kapacita-nadrze']} l` : undefined },
    { key: 'Min. objem kufra', value: params['min.-objem-kufra'] ? `${params['min.-objem-kufra']} l` : undefined },
    { key: 'Nosnosť brzdeného prívesu', value: params['nosnost-brzdeneho-privesu'] ? `${params['nosnost-brzdeneho-privesu']} kg` : undefined },
    { key: 'Nosnosť nebrzdeného prívesu', value: params['nosnost-nebrzdeneho-privesu'] ? `${params['nosnost-nebrzdeneho-privesu']} kg` : undefined },
    { key: 'Emisie CO2', value: params['emisie-co2'] ? `${params['emisie-co2']} g/km` : undefined }
  ];

  for (const spec of specMappings) {
    if (spec.value && spec.value.trim()) {
      specifications.push({
        car_id: carId,
        specification_key: spec.key,
        specification_value: spec.value.trim()
      });
    }
  }

  return specifications;
}

export function createCarEquipment(carId: number, advertisement: XMLAdvertisement): Omit<CarEquipment, 'id' | 'created_at'>[] {
  const equipment: Omit<CarEquipment, 'id' | 'created_at'>[] = [];
  const vybava_value = advertisement.params.vybava_value;

  if (!vybava_value) return equipment;

  const equipment_items = vybava_value.split('|');
  
  const equipmentCategories = {
    'Bezpečnosť': equipment_items.filter(item => 
      item.toLowerCase().includes('airbag') || 
      item.toLowerCase().includes('abs') || 
      item.toLowerCase().includes('esp') || 
      item.toLowerCase().includes('asr') ||
      item.toLowerCase().includes('ebd') ||
      item.toLowerCase().includes('ebv') ||
      item.toLowerCase().includes('dsc') ||
      item.toLowerCase().includes('alarm') ||
      item.toLowerCase().includes('imobilizér') ||
      item.toLowerCase().includes('isofix')
    ),
    'Komfort': equipment_items.filter(item => 
      item.toLowerCase().includes('klimatizácia') || 
      item.toLowerCase().includes('elektrické') || 
      item.toLowerCase().includes('vyhrievané') || 
      item.toLowerCase().includes('kožený') ||
      item.toLowerCase().includes('lakťová') ||
      item.toLowerCase().includes('tempomat') ||
      item.toLowerCase().includes('parkovací')
    ),
    'Multimédia': equipment_items.filter(item => 
      item.toLowerCase().includes('rádio') || 
      item.toLowerCase().includes('navigačný') || 
      item.toLowerCase().includes('bluetooth') || 
      item.toLowerCase().includes('carplay') ||
      item.toLowerCase().includes('android') ||
      item.toLowerCase().includes('wifi') ||
      item.toLowerCase().includes('wlan')
    ),
    'Exteriér': equipment_items.filter(item => 
      item.toLowerCase().includes('led') || 
      item.toLowerCase().includes('natáčacie') || 
      item.toLowerCase().includes('hmlovky') || 
      item.toLowerCase().includes('hliníkové') ||
      item.toLowerCase().includes('strešný')
    )
  };

  for (const [category, items] of Object.entries(equipmentCategories)) {
    for (const item of items) {
      if (item.trim()) {
        equipment.push({
          car_id: carId,
          category,
          equipment_item: item.trim()
        });
      }
    }
  }

  return equipment;
}

export async function downloadAndOptimizeImage(imageUrl: string, autobazarId: string, index: number): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cars', autobazarId);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${autobazarId}_${index}.webp`;
    const filePath = path.join(uploadDir, filename);

    // Optimize and convert to WebP
    await sharp(Buffer.from(imageBuffer))
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(filePath);

    return `/uploads/cars/${autobazarId}/${filename}`;
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error);
    return null;
  }
}

export function createCarImages(carId: number, imageUrls: string[]): Omit<CarImage, 'id' | 'created_at'>[] {
  return imageUrls.map((url, index) => ({
    car_id: carId,
    image_url: url,
    is_primary: index === 0,
    sort_order: index
  }));
}

export async function checkAndDownloadMissingImages(autobazarId: string, photoUrls: string[]): Promise<string[]> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cars', autobazarId);
  const downloadedImages: string[] = [];
  
  // Check if directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // Get existing files in directory
  const existingFiles = fs.readdirSync(uploadDir);
  
  for (let i = 0; i < photoUrls.length; i++) {
    const photoUrl = photoUrls[i];
    if (!photoUrl) continue;
    
    const expectedFilename = `${autobazarId}_${i}.webp`;
    const filePath = path.join(uploadDir, expectedFilename);
    
    // Check if image already exists
    if (existingFiles.includes(expectedFilename) && fs.existsSync(filePath)) {
      // Image exists, add to result
      downloadedImages.push(`/uploads/cars/${autobazarId}/${expectedFilename}`);
      console.log(`✅ Image already exists: ${expectedFilename}`);
    } else {
      // Image doesn't exist, download it
      console.log(`📥 Downloading missing image: ${expectedFilename}`);
      const optimizedUrl = await downloadAndOptimizeImage(photoUrl, autobazarId, i);
      if (optimizedUrl) {
        downloadedImages.push(optimizedUrl);
        console.log(`✅ Downloaded: ${expectedFilename}`);
      } else {
        console.log(`❌ Failed to download: ${expectedFilename}`);
      }
    }
  }
  
  return downloadedImages;
}

export function parseXMLFeed(xmlText: string): XMLAdvertisement[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  
  const advertisements: XMLAdvertisement[] = [];
  const adElements = xmlDoc.getElementsByTagName('advertisement');
  
  for (let i = 0; i < adElements.length; i++) {
    const adElement = adElements[i];
    
    const getTextContent = (tagName: string): string => {
      const element = adElement.getElementsByTagName(tagName)[0];
      return element ? element.textContent || '' : '';
    };
    
    const getParamValue = (paramName: string): string => {
      const paramsElement = adElement.getElementsByTagName('params')[0];
      if (!paramsElement) return '';
      const paramElement = paramsElement.getElementsByTagName(paramName)[0];
      return paramElement ? paramElement.textContent || '' : '';
    };
    
    const getPhotos = (): string[] => {
      const photosElement = adElement.getElementsByTagName('photos')[0];
      if (!photosElement) return [];
      const photoElements = photosElement.getElementsByTagName('photo');
      return Array.from(photoElements).map(photo => photo.textContent || '');
    };
    
    const advertisement: XMLAdvertisement = {
      idAdvertisement: getTextContent('idAdvertisement'),
      title: getTextContent('title'),
      brand: getTextContent('brand'),
      model: getTextContent('model'),
      contentOptions: getTextContent('contentOptions'),
      params: {
        cena: getParamValue('cena') || '0',
        rok: getParamValue('rok'),
        palivo_value: getParamValue('palivo_value'),
        karoseria_value: getParamValue('karoseria_value'),
        prevodovka_value: getParamValue('prevodovka_value'),
        pohon_value: getParamValue('pohon_value'),
        'vykon-motora': getParamValue('vykon-motora'),
        'objem-motora': getParamValue('objem-motora'),
        'miest-na-sedenie_value': getParamValue('miest-na-sedenie_value'),
        'pocet-dveri_value': getParamValue('pocet-dveri_value'),
        'najazdene-km': getParamValue('najazdene-km'),
        stav_value: getParamValue('stav_value'),
        'norma-emisii_value': getParamValue('norma-emisii_value'),
        farba_value: getParamValue('farba_value'),
        metaliza_value: getParamValue('metaliza_value'),
        klimatizacia_value: getParamValue('klimatizacia_value'),
        'elektricke-okna_value': getParamValue('elektricke-okna_value'),
        'parkovacie-senzory_value': getParamValue('parkovacie-senzory_value'),
        'vyhrievane-sedacky_value': getParamValue('vyhrievane-sedacky_value'),
        'airbagy---pocet_value': getParamValue('airbagy---pocet_value'),
        'rozmer-pneu': getParamValue('rozmer-pneu'),
        'sirka-bez-spatnych': getParamValue('sirka-bez-spatnych'),
        vyska: getParamValue('vyska'),
        dlzka: getParamValue('dlzka'),
        'max.-rychlost': getParamValue('max.-rychlost'),
        'typ-rezervneho-kolesa_value': getParamValue('typ-rezervneho-kolesa_value'),
        zrychlenie: getParamValue('zrychlenie'),
        'kapacita-nadrze': getParamValue('kapacita-nadrze'),
        'min.-objem-kufra': getParamValue('min.-objem-kufra'),
        'nosnost-brzdeneho-privesu': getParamValue('nosnost-brzdeneho-privesu'),
        'nosnost-nebrzdeneho-privesu': getParamValue('nosnost-nebrzdeneho-privesu'),
        'emisie-co2': getParamValue('emisie-co2'),
        'v-meste': getParamValue('v-meste'),
        'mimo-mesta': getParamValue('mimo-mesta'),
        kombinovana: getParamValue('kombinovana'),
        vybava_value: getParamValue('vybava_value'),
        vin: getParamValue('vin')
      },
      photos: {
        photo: getPhotos()
      }
    };
    
    advertisements.push(advertisement);
  }
  
  return advertisements;
}
