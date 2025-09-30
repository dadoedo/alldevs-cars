# Lokálne testovanie Docker setupu

Tento dokument popisuje ako otestovať úpravy pre ukladanie obrázkov lokálne s Dockerom.

## 🚀 Rýchly start

### 1. Príprava lokálneho prostredia

```bash
# Spusti test script na prípravu lokálnych priečinkov
tsx scripts/test-local-setup.ts
```

### 2. Build a spustenie kontajnera

```bash
# Build kontajnera
docker-compose -f docker-compose.local.yml build

# Spusti kontajner
docker-compose -f docker-compose.local.yml up -d

# Sleduj logy
docker-compose -f docker-compose.local.yml logs -f
```

### 3. Testovanie

```bash
# Otvor aplikáciu
open http://localhost:3000

# Testuj sync API (ak máš nastavené .env)
curl http://localhost:3000/api/sync-cars
```

## 📁 Štruktúra lokálnych súborov

```
alldevs-cars-web/
├── data/                    # Lokálny data priečinok
│   └── uploads/            # Obrázky áut
│       └── cars/           # Obrázky podľa autobazar_id
├── docker-compose.local.yml # Lokálna Docker konfigurácia
└── scripts/
    └── test-local-setup.ts # Test script
```

## 🔍 Kontrola funkčnosti

### 1. Kontrola volume mountov

```bash
# Skontroluj či sa priečinky správne mountujú
docker exec carart-app-local ls -la /app/data/
docker exec carart-app-local ls -la /app/data/uploads/
```

### 2. Test vytvorenia súboru

```bash
# Vytvor test súbor v kontajneri
docker exec carart-app-local touch /app/data/uploads/cars/test.txt

# Skontroluj či sa súbor objavil lokálne
ls -la data/uploads/cars/
```

### 3. Test API endpointu

```bash
# Test servovania obrázkov
curl http://localhost:3000/data/uploads/cars/test.txt
```

## 🐛 Riešenie problémov

### Kontajner sa nespustí
```bash
# Skontroluj logy
docker-compose -f docker-compose.local.yml logs

# Rebuild kontajnera
docker-compose -f docker-compose.local.yml build --no-cache
```

### Obrázky sa nezobrazujú
```bash
# Skontroluj či existujú súbory
ls -la data/uploads/cars/

# Skontroluj API endpoint
curl -I http://localhost:3000/data/uploads/cars/[filename]
```

### Permission denied
```bash
# Oprav permissions
chmod -R 755 data/
```

## 🧹 Cleanup

```bash
# Zastav a odstráň kontajnery
docker-compose -f docker-compose.local.yml down

# Odstráň lokálne dáta
rm -rf data/

# Odstráň Docker images
docker rmi alldevs-cars-web-app
```

## 📝 Poznámky

- Lokálne testovanie používa `NODE_ENV=development`
- Volume mounty sú relatívne k projektu (`./data`)
- Všetky obrázky sa ukladajú do `data/uploads/cars/`
- API endpoint `/data/uploads/*` funguje cez rewrite pravidlo
