# AutoBazar Web

Moderný web pre auto bazar s React frontendom a MariaDB databázou, ktorý nahradí súčasný WordPress systém. Web obsahuje automatické stahovanie áut z XML feedu, správu obsahu a responzívny dizajn.

## Technický stack

- **Frontend:** React 18+ s TypeScript, Next.js 14 (App Router), Tailwind CSS
- **Backend:** Next.js API Routes, mysql2 pre MariaDB
- **Databáza:** MariaDB 10.11.13
- **Ostatné:** Sharp pre optimalizáciu obrázkov, Node-cron pre naplánované úlohy

## Inštalácia

1. **Klonovanie repozitára**
   ```bash
   git clone <repository-url>
   cd alldevs-cars-web
   ```

2. **Inštalácia závislostí**
   ```bash
   npm install
   ```

3. **Konfigurácia environment premenných**
   ```bash
   cp env.example .env.local
   ```
   
   Upravte `.env.local` súbor s vašimi údajmi:
   ```env
   # Database Configuration
   DATABASE_HOST=IP_ADRESA_SERVERA
   DATABASE_PORT=3306
   DATABASE_NAME=autobazar
   DATABASE_USER=meno_uzivatela
   DATABASE_PASSWORD=heslo_uzivatela

   # Feed Configuration
   FEED_URL=https://www.autobazar.sk/api/export/YOUR_FEED_URL
   FEED_API_KEY=your-secret-key-here

   # Admin Configuration
   ADMIN_EMAIL=admin@autobazar.sk

   # SMTP Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=your-email@gmail.com

   # Sync Configuration
   SYNC_SECRET_KEY=your-sync-secret-key-here
   ```

4. **Inicializácia databázy**
   ```bash
   npm run init-db
   ```

5. **Spustenie vývojového servera**
   ```bash
   npm run dev
   ```

## Použitie

### Automatická synchronizácia

Web automaticky synchronizuje autá z XML feedu každý deň o 7:00. Synchronizáciu môžete spustiť manuálne:

```bash
npm run sync-cars
```

Alebo cez API endpoint:
```bash
curl -X GET "http://localhost:3000/api/sync-cars?key=your-sync-secret-key-here"
```

### API Endpoints

#### Verejné API
- `GET /api/cars` - zoznam áut s filtrami
- `GET /api/cars/[id]` - detail áuta
- `GET /api/brands` - zoznam značiek s počtom áut
- `GET /api/settings` - nastavenia webu
- `POST /api/contact` - kontaktný formulár

#### Admin API
- `POST /api/admin/sync-cars` - manuálna synchronizácia
- `GET /api/admin/cars` - zoznam áut pre admin
- `PUT /api/admin/cars/[id]` - úprava áuta
- `DELETE /api/admin/cars/[id]` - mazanie áuta
- `GET /api/admin/settings` - nastavenia
- `PUT /api/admin/settings` - úprava nastavení

### Deployment

1. **Build aplikácie**
   ```bash
   npm run build
   ```

2. **Spustenie produkčného servera**
   ```bash
   npm start
   ```

3. **Nastavenie cron jobu**
   
   V hosting provideri nastavte cron job:
   - **URL:** `https://vasa-domena.sk/api/sync-cars?key=SECRET_KEY`
   - **Čas:** `0 7 * * *` (každý deň o 7:00)
   - **Metóda:** GET

## Štruktúra projektu

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── cars/              # Stránky pre autá
│   ├── services/          # Stránka služieb
│   ├── contact/           # Kontaktná stránka
│   └── page.tsx           # Hlavná stránka
├── components/            # React komponenty
├── lib/                   # Utility funkcie
│   ├── database.ts        # Databázová konfigurácia
│   ├── logger.ts          # Logovanie
│   ├── email.ts           # Email notifikácie
│   ├── xml-parser.ts      # XML feed parser
│   └── cron.ts            # Cron joby
└── types/                 # TypeScript typy
```

## Funkcionality

### 1. Automatická synchronizácia áut
- Stahovanie XML feedu z Autobazar.sk
- Parsovanie XML dát do databázy
- Stahovanie a optimalizácia obrázkov
- Aktualizácia existujúcich áut
- Odstránenie predaných áut
- Logovanie do súborov
- Email notifikácie pri chybách

### 2. Hlavná stránka
- Hero sekcia s obrázkom a hlavným textom
- Vybrané ponuky (najnovšie alebo featured autá)
- Text o bazári (z nastavení)
- Prehľad značiek s počtom áut
- Kontaktný panel s adresou, telefónom, emailom
- Google Maps embed
- Footer s odkazmi na služby, kontakt, GDPR

### 3. Ponuka áut
- Filtrovanie: značka, cena, rok, palivo, prevodovka, karoséria
- Triedenie: cena, rok, najazdené km, dátum pridania
- Zobrazenie: grid/list view
- Paginácia
- Detail áuta s galériou, špecifikáciami, vybavením
- Kontaktný formulár pre záujem o auto

### 4. Služby
- Financovanie vozidla
- Poistenie vozidla
- Doklady pre fyzické osoby
- Doklady pre právnické osoby
- Poradenstvo s výberom

### 5. Kontakt
- Kontaktné údaje z nastavení
- Google Maps s polohou
- Kontaktný formulár
- Otváracie hodiny

## Databázová štruktúra

Projekt používa MariaDB s týmito tabuľkami:
- `settings` - nastavenia webu
- `cars` - základné informácie o autách
- `car_images` - obrázky áut
- `car_specifications` - špecifikácie áut
- `car_equipment` - vybavenie áut
- `sync_logs` - logy synchronizácie

## Bezpečnosť

- API kľúče pre admin endpointy
- Input validation s Zod
- SQL injection ochrana s prepared statements
- XSS ochrana
- HTTPS povinné v produkcii

## Podpora

Pre otázky a podporu kontaktujte vývojový tím.

## Licencia

Tento projekt je privátny a vlastníctvom spoločnosti.