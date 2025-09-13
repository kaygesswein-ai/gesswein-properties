// app/layout.tsx (Lato)
import './globals.css'
import type { Metadata } from 'next'
import { Lato } from 'next/font/google'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'

// Lato: pesos recomendados
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://gessweinproperties.cl'),
  title: {
    default: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    template: '%s | Gesswein Properties',
  },
  description:
    'Especialistas en propiedades premium en Santiago Oriente. Corretaje inmobiliario, asesoría arquitectónica y programa de referidos exclusivo.',
  keywords:
    'inmobiliaria, propiedades, Santiago, Las Condes, Providencia, Vitacura, corretaje, departamentos, casas',
  authors: [{ name: 'Gesswein Properties' }],
  openGraph: {
    title: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    description: 'Especialistas en propiedades premium en Santiago Oriente',
    url: 'https://gessweinproperties.cl',
    siteName: 'Gesswein Properties',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    description: 'Especialistas en propiedades premium en Santiago Oriente',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={lato.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}




