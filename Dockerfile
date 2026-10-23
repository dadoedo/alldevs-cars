# --- build stage ---
    FROM node:22.23.4-alpine AS builder
    WORKDIR /app
    
    # inštalácia dependencií
    COPY package*.json ./
    RUN npm install --frozen-lockfile
    
    # skopíruj celý projekt a postav Next.js
    COPY . .
    RUN npm run build
    
    # --- runtime stage ---
    FROM node:22.23.4-alpine
    WORKDIR /app
    
    # skopíruj vybuildovaný projekt
    COPY --from=builder /app ./
    
    # vytvor uploads priečinok
    RUN mkdir -p /app/data/uploads/cars
    
    EXPOSE 3000
    CMD ["npm", "start"]
    
    