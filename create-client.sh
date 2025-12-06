#!/bin/bash

# Farby pre výstup
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcie
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  🚗 AutoBazar Client Creator  ${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Kontrola argumentov
if [ $# -lt 3 ]; then
    echo "Použitie: $0 <client-name> <client-color> <feed-url> [github-org]"
    echo "Príklad: $0 'AutoMax' '#ff6b35' 'https://autobazar.sk/api/export/abc123' 'my-org'"
    exit 1
fi

CLIENT_NAME="$1"
CLIENT_COLOR="$2"
FEED_URL="$3"
GITHUB_ORG="${4:-alldevs}" # Default organizácia
CLIENT_SLUG=$(echo "$CLIENT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
REPO_NAME="${CLIENT_SLUG}-cars-web"
CURRENT_DIR=$(pwd)

print_header

# 1. Vytvorenie nového priečinka
echo "📁 Vytváram nový priečinok..."
mkdir -p "../$REPO_NAME"
cd "../$REPO_NAME"

# 2. Kopírovanie súborov z pôvodného projektu
echo "📋 Kopírujem súbory..."
cp -r "$CURRENT_DIR"/* .
cp -r "$CURRENT_DIR"/.* . 2>/dev/null || true

# 3. Vyčistenie git histórie
echo "🧹 Čistím git históriu..."
rm -rf .git
git init
git add .
git commit -m "Initial commit for $CLIENT_NAME"

print_success "Projekt vytvorený v priečinku: $REPO_NAME"

# 4. Aktualizácia package.json
echo "📦 Aktualizujem package.json..."
sed -i "s/alldevs-cars-web/$REPO_NAME/g" package.json
sed -i "s/\"version\": \"0.1.0\"/\"version\": \"1.0.0\"/g" package.json

# 5. Aktualizácia README
echo "📝 Aktualizujem README..."
cat > README.md << EOF
# $CLIENT_NAME - AutoBazar Web

Moderný web pre $CLIENT_NAME s automatickou synchronizáciou z Autobazar.sk feedu.

## Rýchly start

1. \`npm install\`
2. \`cp env.example .env.local\`
3. Upravte \`.env.local\` s vašimi údajmi
4. \`npm run init-db\`
5. \`npm run dev\`

## Konfigurácia

- **Feed URL:** $FEED_URL
- **Hlavná farba:** $CLIENT_COLOR
- **Názov:** $CLIENT_NAME

## Licencia

Tento projekt je privátny a vlastníctvom $CLIENT_NAME.
EOF

# 6. Aktualizácia environment súboru
echo "⚙️  Aktualizujem .env.example..."
cat > env.example << EOF
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=${CLIENT_SLUG}_autobazar
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password

# Feed Configuration
FEED_URL=$FEED_URL
FEED_API_KEY=your-secret-key-here

# Site Configuration
SITE_NAME=$CLIENT_NAME
SITE_DESCRIPTION="Moderný web pre $CLIENT_NAME s automatickou synchronizáciou áut"
PHONE=+421 XXX XXX XXX
EMAIL=info@${CLIENT_SLUG}.sk
ADDRESS=Vaša adresa

# Admin Configuration
ADMIN_EMAIL=admin@${CLIENT_SLUG}.sk

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Sync Configuration
SYNC_SECRET_KEY=${CLIENT_SLUG}_sync_$(date +%s)
EOF

# 7. Aktualizácia Tailwind konfigurácie
echo "🎨 Aktualizujem Tailwind konfiguráciu..."
cat > tailwind.config.ts << EOF
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '$CLIENT_COLOR', // Hlavná farba klienta
          600: '#9a7500',
          700: '#7c5e00',
          800: '#5c4600',
          900: '#3d2f00',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      // ... zvyšok konfigurácie zostáva rovnaký
    },
  },
  plugins: [],
}
export default config
EOF

# 8. Aktualizácia layout.tsx metadata
echo "📄 Aktualizujem metadata..."
cat > src/app/layout.tsx << EOF
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieYesBanner from '@/components/CookieYesBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '$CLIENT_NAME - Predaj áut | Automatická synchronizácia',
  description: '$CLIENT_NAME - Váš spoľahlivý predajca áut s automatickou synchronizáciou z Autobazar.sk. Široký výber kvalitných vozidiel.',
  keywords: 'predaj áut, autá, $CLIENT_NAME, vozidlá, ojazdené autá, autobazar',
  authors: [{ name: '$CLIENT_NAME' }],
  creator: '$CLIENT_NAME',
  publisher: '$CLIENT_NAME',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: 'https://${CLIENT_SLUG}.sk',
    title: '$CLIENT_NAME - Predaj áut',
    description: 'Predaj kvalitných vozidiel s automatickou synchronizáciou z Autobazar.sk.',
    siteName: '$CLIENT_NAME',
    images: [
      {
        url: '/hero.webp',
        width: 1200,
        height: 630,
        alt: '$CLIENT_NAME - Predaj áut',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '$CLIENT_NAME - Predaj áut',
    description: 'Predaj kvalitných vozidiel s automatickou synchronizáciou z Autobazar.sk.',
    images: ['/hero.webp'],
  },
  alternates: {
    canonical: 'https://${CLIENT_SLUG}.sk',
  },
  other: {
    'geo.region': 'SK',
    'language': 'sk',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sk">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <CookieYesBanner />
        </Providers>
      </body>
    </html>
  )
}
EOF

# 9. Vytvorenie GitHub repozitára (ak je nainštalovaný gh CLI)
if command -v gh &> /dev/null; then
    echo "🐙 Vytváram GitHub repozitár..."
    gh repo create "$GITHUB_ORG/$REPO_NAME" --private --description "AutoBazar web pre $CLIENT_NAME" --source=. --remote=origin --push
    print_success "GitHub repozitár vytvorený: https://github.com/$GITHUB_ORG/$REPO_NAME"
else
    print_warning "GitHub CLI nie je nainštalovaný. Repozitár nebol vytvorený automaticky."
fi

# 10. Finálne commit
git add .
git commit -m "Configure for $CLIENT_NAME client"

print_success "✅ Klient '$CLIENT_NAME' úspešne vytvorený!"
echo ""
echo "📋 Ďalšie kroky:"
echo "1. cd $REPO_NAME"
echo "2. npm install"
echo "3. cp env.example .env.local"
echo "4. Upravte .env.local s reálnymi údajmi"
echo "5. Nahraďte logo v /public/logo.png"
echo "6. Nahraďte hero obrázok v /public/hero.webp"
echo "7. npm run init-db"
echo "8. npm run dev"
echo ""
echo "🎨 Hlavná farba: $CLIENT_COLOR"
echo "🔗 Feed URL: $FEED_URL"
echo "📁 Priečinok: $(pwd)"
