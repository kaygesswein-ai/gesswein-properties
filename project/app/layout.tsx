import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })
const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    template: '%s | Gesswein Properties',
  },
  description:
    'Especialistas en propiedades premium en Santiago Oriente. Corretaje inmobiliario con asesoría arquitectónica.',
  openGraph: {
    title: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    description: 'Especialistas en propiedades premium en Santiago Oriente.',
    url: siteUrl,
    siteName: 'Gesswein Properties',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
