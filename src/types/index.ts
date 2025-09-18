export interface Car {
  id: number;
  autobazar_id: string;
  title: string;
  brand: string;
  model?: string | null;
  price: number;
  year?: number | null;
  mileage?: number | null;
  fuel_type?: string | null;
  transmission?: string | null;
  body_type?: string | null;
  engine_power?: string | null;
  engine_volume?: string | null;
  doors?: number | null;
  seats?: number | null;
  color?: string | null;
  condition?: string | null;
  vin?: string | null;
  description?: string | null;
  status: 'active' | 'sold' | 'reserved';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarImage {
  id: number;
  car_id: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface CarSpecification {
  id: number;
  car_id: number;
  specification_key: string;
  specification_value: string;
  created_at: string;
}

export interface CarEquipment {
  id: number;
  car_id: number;
  category: string;
  equipment_item: string;
  created_at: string;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: number;
  sync_type: 'manual' | 'cron';
  status: 'success' | 'error' | 'partial';
  message?: string;
  cars_added: number;
  cars_updated: number;
  cars_deleted: number;
  cars_skipped: number;
  errors_count: number;
  execution_time_seconds?: number;
  created_at: string;
}

export interface CarWithDetails extends Car {
  images: CarImage[];
  specifications: CarSpecification[];
  equipment: CarEquipment[];
}

export interface CarFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  minMileage?: number;
  maxMileage?: number;
  status?: string;
  featured?: boolean;
  search?: string;
}

export interface CarSortOptions {
  field: 'price' | 'year' | 'mileage' | 'created_at';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface CarsResponse {
  cars: CarWithDetails[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Brand {
  name: string;
  count: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  carId?: number;
}

export interface XMLAdvertisement {
  idAdvertisement: string;
  title: string;
  brand: string;
  model?: string;
  contentOptions: string;
  params: {
    cena: string;
    rok: string;
    palivo_value: string;
    karoseria_value: string;
    prevodovka_value: string;
    pohon_value: string;
    'vykon-motora': string;
    'objem-motora': string;
    'miest-na-sedenie_value': string;
    'pocet-dveri_value': string;
    'najazdene-km': string;
    stav_value: string;
    'norma-emisii_value': string;
    farba_value: string;
    metaliza_value: string;
    klimatizacia_value: string;
    'elektricke-okna_value': string;
    'parkovacie-senzory_value': string;
    'vyhrievane-sedacky_value': string;
    'airbagy---pocet_value': string;
    'rozmer-pneu': string;
    'sirka-bez-spatnych': string;
    vyska: string;
    dlzka: string;
    'max.-rychlost': string;
    'typ-rezervneho-kolesa_value': string;
    zrychlenie: string;
    'kapacita-nadrze': string;
    'min.-objem-kufra': string;
    'nosnost-brzdeneho-privesu': string;
    'nosnost-nebrzdeneho-privesu': string;
    'emisie-co2': string;
    'v-meste': string;
    'mimo-mesta': string;
    kombinovana: string;
    vybava_value: string;
    vin?: string;
  };
  photos: {
    photo: string[];
  };
}

export interface SyncResult {
  added: number;
  updated: number;
  deleted: number;
  skipped: number;
  errors: number;
  executionTime: number;
}
