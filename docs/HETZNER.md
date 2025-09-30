CarArt Web – Docker setup na Hetzner
1️⃣ Server

OS: Ubuntu 24.04 LTS

Public IPv4: pridelená (pre DB allowlist, test prístup)

Docker: 28.4.0

Docker Compose: v2.39.4 (plugin)

2️⃣ Storage

Hetzner Cloud Volume: 10 GB

Filesystem: ext4

Mount point: /mnt/HC_Volume_103599864

Použitie:

/mnt/HC_Volume_103599864/projects/carart → dáta projektu (uploady, logs…)

/mnt/HC_Volume_103599864/caddy → Caddy certifikáty a config

3️⃣ Docker setup
a) Dockerfile (Next.js app)

Multi-stage build:

Stage 1: build Next.js (npm run build)

Stage 2: runtime (Node 20-alpine)

Expose port 3000

b) docker-compose.yml

App service: carart-app

Mount volume /mnt/HC_Volume_103599864/projects/carart:/app/data

Env súbor .env (DB URL, secrets)

Port mapping 3000:3000

Caddy service: caddy

Ports 80, 443

Mount volume pre certifikáty a config

Reverse proxy na carart-app:3000

c) Docker sieť

Sieť web (externá)

Kontajnery sa navzájom vidia cez túto sieť

4️⃣ Stav

Caddy: beží a počúva porty 80/443

Next.js app (carart-app): beží, port 3000 otvorený na hostovi

Volume: perzistentné úložisko pre dáta a certifikáty

Prístup:

IP test: http://<server-public-ip>:3000

DNS ešte netestované, ale Caddy už ready pre doménu