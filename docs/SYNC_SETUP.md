# Synchronizácia s Autobazar.sk

Tento dokument popisuje ako nastaviť a používať synchronizáciu s Autobazar.sk feedom.

## Konfigurácia

### 1. Environment Variables

Vytvorte `.env` súbor v root priečinku projektu s nasledujúcimi nastaveniami:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=autobazar
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# Feed Configuration
FEED_URL=https://www.autobazar.sk/api/export/2030df4193e166e4909f8766304a33a1d8/firmAdvertisements/329181/
FEED_API_KEY=carart_2025_secure_key_xyz789

# Admin Configuration
ADMIN_EMAIL=admin@autobazar.sk

# SMTP Configuration (for email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Sync Configuration
SYNC_SECRET_KEY=carart_sync_2025_abc123def456
```

### 2. Inicializácia databázy

Spustite inicializačný script:

```bash
npm run init-db
```

## Použitie

### Manuálna synchronizácia

Pre manuálnu synchronizáciu použite API endpoint:

```bash
# Štandardná synchronizácia (všetky vozidlá naraz)
curl "http://localhost:3000/api/sync-cars?key=carart_sync_2025_abc123def456&type=manual"

# Batch synchronizácia (pre zdieľaný hosting - odporúčané)
curl "http://localhost:3000/api/sync-cars-batch?key=carart_sync_2025_abc123def456&type=manual&batchSize=3"
```

**Batch synchronizácia** je odporúčaná pre zdieľaný hosting, pretože:
- Spracováva vozidlá po menších dávkach (defaultne 3)
- Vytvára menej databázových pripojení
- Obsahuje pauzy medzi dávkami
- Obmedzuje počet stiahnutých obrázkov na vozidlo (max 5)

### Automatická synchronizácia

Systém podporuje automatickú synchronizáciu cez cron job. Nastavte cron job v administrácii servera:

```bash
# Batch synchronizácia každú hodinu (odporúčané pre zdieľaný hosting)
0 * * * * curl "http://localhost:3000/api/sync-cars-batch?key=carart_sync_2025_abc123def456&type=cron&batchSize=3"

# Štandardná synchronizácia každú hodinu (pre VPS/dedikovaný server)
0 * * * * curl "http://localhost:3000/api/sync-cars?key=carart_sync_2025_abc123def456&type=cron"
```

### Testovanie

Spustite testovací script pre overenie funkčnosti:

```bash
# Test XML parsingu
npx tsx scripts/test-sync.ts

# Test API endpointu (vyžaduje spustený server)
npx tsx scripts/test-sync-api.ts
```

## Štruktúra dát

### XML Feed

Feed obsahuje nasledujúce informácie pre každé vozidlo:

- **Základné informácie**: ID, názov, značka, model, cena
- **Technické údaje**: rok, najazdené km, palivo, prevodovka, karoséria
- **Motor**: výkon, objem, pohon
- **Rozmery**: dĺžka, šírka, výška, počet dverí, miest
- **Výbava**: bezpečnostné systémy, komfort, multimédia, exteriér
- **Fotografie**: až 48 obrázkov na vozidlo

### Databázové tabuľky

- `cars` - hlavné informácie o vozidlách
- `car_images` - obrázky vozidiel
- `car_specifications` - technické špecifikácie
- `car_equipment` - výbava vozidiel
- `sync_logs` - logy synchronizácie

## Monitoring

### Sync Logs

Všetky synchronizácie sú logované v `sync_logs` tabuľke s nasledujúcimi informáciami:

- Typ synchronizácie (manual/cron)
- Status (success/error/partial)
- Počet pridaných/aktualizovaných/zmazaných vozidiel
- Počet chýb
- Čas vykonania

### Email Notifikácie

Pri chybách synchronizácie sa odosielajú email notifikácie na admin email.

## Riešenie problémov

### Časté problémy

1. **Chyba pri stiahnutí feedu**
   - Skontrolujte internetové pripojenie
   - Overte správnosť FEED_URL

2. **Chyba pri pripojení k databáze**
   - Skontrolujte DATABASE_* premenné
   - Overte dostupnosť databázového servera

3. **Chyba pri parsovaní XML**
   - Feed môže byť dočasne nedostupný
   - Skontrolujte logy pre detailné chybové správy

### Debugging

Pre detailné logy skontrolujte:
- Konzolu servera
- `sync_logs` tabuľku v databáze
- Email notifikácie

## Bezpečnosť

- **API kľúče**: Udržujte SYNC_SECRET_KEY v bezpečí
- **Databáza**: Použite silné heslo pre databázové pripojenie
- **HTTPS**: V produkcii používajte HTTPS pre všetky API volania
