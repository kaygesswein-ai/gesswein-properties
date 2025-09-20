@@ -1,22 +1,16 @@
import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Cinzel } from 'next/font/google'
import { Inter } from 'next/font/google'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'

const montserrat = Montserrat({
const inter = Inter({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-sans',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400','600','700'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400','500','600','700'], // ajusta si necesitas más grosores
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
@@ -28,10 +22,10 @@ export const metadata: Metadata = {
    template: '%s | Gesswein Properties',
  },
  description:
    'Especialistas en propiedades premium en Santiago Oriente. Corretaje inmobiliario con asesoría arquitectónica.',
    'Especialistas en propiedades premium en Santiago Oriente. Corretaje inmobiliario, asesoría arquitectónica y programa de referidos exclusivo.',
  openGraph: {
    title: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    description: 'Especialistas en propiedades premium en Santiago Oriente.',
    description: 'Especialistas en propiedades premium en Santiago Oriente',
    url: siteUrl,
    siteName: 'Gesswein Properties',
    locale: 'es_CL',
@@ -44,14 +38,17 @@ export const metadata: Metadata = {
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${cinzel.variable} font-sans`}>
      <body className={inter.className}>
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


