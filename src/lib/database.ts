import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  charset: 'utf8mb4'
};

export async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

export async function query(sql: string, params: unknown[] = []) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    await connection.end();
  }
}

// Database initialization script
export async function initializeDatabase() {
  const connection = await getConnection();
  
  try {
    // Create database if not exists
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.execute(`USE ${process.env.DATABASE_NAME}`);
    
    // Create tables
    const tables = [
      // Settings table
      `CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        \`key\` VARCHAR(100) UNIQUE NOT NULL,
        value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,
      
      // Cars table
      `CREATE TABLE IF NOT EXISTS cars (
        id INT PRIMARY KEY AUTO_INCREMENT,
        autobazar_id VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100),
        price INT NOT NULL,
        year INT,
        mileage INT,
        fuel_type VARCHAR(50),
        transmission VARCHAR(50),
        body_type VARCHAR(50),
        engine_power VARCHAR(50),
        engine_volume VARCHAR(50),
        doors INT,
        seats INT,
        color VARCHAR(100),
        car_condition VARCHAR(100),
        vin VARCHAR(50),
        description TEXT,
        status ENUM('active', 'sold', 'reserved') DEFAULT 'active',
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_brand (brand),
        INDEX idx_price (price),
        INDEX idx_year (year),
        INDEX idx_status (status),
        INDEX idx_featured (featured)
      )`,
      
      // Car images table
      `CREATE TABLE IF NOT EXISTS car_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        car_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        is_primary BOOLEAN DEFAULT FALSE,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
        INDEX idx_car_id (car_id),
        INDEX idx_primary (is_primary)
      )`,
      
      // Car specifications table
      `CREATE TABLE IF NOT EXISTS car_specifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        car_id INT NOT NULL,
        specification_key VARCHAR(100) NOT NULL,
        specification_value TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
        INDEX idx_car_id (car_id),
        INDEX idx_key (specification_key)
      )`,
      
      // Car equipment table
      `CREATE TABLE IF NOT EXISTS car_equipment (
        id INT PRIMARY KEY AUTO_INCREMENT,
        car_id INT NOT NULL,
        category VARCHAR(50) NOT NULL,
        equipment_item VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
        INDEX idx_car_id (car_id),
        INDEX idx_category (category)
      )`,
      
      // Sync logs table
      `CREATE TABLE IF NOT EXISTS sync_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sync_type ENUM('manual', 'cron') NOT NULL,
        status ENUM('success', 'error', 'partial') NOT NULL,
        message TEXT,
        cars_added INT DEFAULT 0,
        cars_updated INT DEFAULT 0,
        cars_deleted INT DEFAULT 0,
        cars_skipped INT DEFAULT 0,
        errors_count INT DEFAULT 0,
        execution_time_seconds DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at),
        INDEX idx_status (status)
      )`
    ];
    
    for (const tableSQL of tables) {
      await connection.execute(tableSQL);
    }
    
    // Insert default settings
    const defaultSettings = [
      ['site_name', 'AutoBazar'],
      ['site_description', 'Váš spoľahlivý partner pre kúpu vozidla'],
      ['address', 'Adresa autobazáru'],
      ['phone', '+421 XXX XXX XXX'],
      ['email', 'info@autobazar.sk'],
      ['opening_hours', '{"monday": "8:00-17:00", "tuesday": "8:00-17:00", "wednesday": "8:00-17:00", "thursday": "8:00-17:00", "friday": "8:00-17:00", "saturday": "8:00-12:00", "sunday": "Zatvorené"}'],
      ['feed_url', process.env.FEED_URL || ''],
      ['feed_api_key', process.env.FEED_API_KEY || ''],
      ['hero_image', '/images/hero.jpg'],
      ['google_maps_embed', ''],
      ['facebook_url', ''],
      ['instagram_url', '']
    ];
    
    for (const [key, value] of defaultSettings) {
      await connection.execute(
        'INSERT IGNORE INTO settings (`key`, value) VALUES (?, ?)',
        [key, value]
      );
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}
