import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieYesBanner from '@/components/CookieYesBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Car & Art - Exkluzívny predajca áut | Banská Bystrica',
  description: 'Car & Art - Váš exkluzívny predajca áut v Banskej Bystrici. Široký výber kvalitných vozidiel vrátane značiek Volkswagen, Toyota, Maserati a ďalších.',
  keywords: 'predaj áut, autá, Car & Art, Banská Bystrica, Volkswagen, Toyota, Maserati, luxusné autá, ojazdené vozidlá',
  authors: [{ name: 'Car & Art' }],
  creator: 'Car & Art',
  publisher: 'Car & Art',
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
    url: 'https://carart.sk',
    title: 'Car & Art - Exkluzívny predajca áut | Banská Bystrica',
    description: 'Predaj kvalitných vozidiel v Banskej Bystrici. Volkswagen, Toyota, Maserati a ďalšie značky. Profesionálne služby a široký výber áut.',
    siteName: 'Car & Art',
    images: [
      {
        url: '/hero.webp',
        width: 1200,
        height: 630,
        alt: 'Car & Art - Exkluzívny predajca áut v Banskej Bystrici',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car & Art - Exkluzívny predajca áut | Banská Bystrica',
    description: 'Predaj kvalitných vozidiel v Banskej Bystrici. Volkswagen, Toyota, Maserati a ďalšie značky. Profesionálne služby a široký výber áut.',
    images: ['/hero.webp'],
  },
  alternates: {
    canonical: 'https://carart.sk',
  },
  other: {
    'geo.region': 'SK',
    'geo.placename': 'Banská Bystrica',
    'geo.position': '48.733333;19.15',
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