import './globals.css'
import type { Metadata } from 'next'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    template: '%s | Gesswein Properties',
  },
  description:
    'Especialistas en propiedades premium en Santiago Oriente. Corretaje inmobiliario, asesoría y programa de referidos.',
  openGraph: {
    title: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    description: 'Especialistas en propiedades premium en Santiago Oriente',
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
      <body>
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


