import './globals.css'
import type { Metadata } from 'next'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'

/* ⬇️ Providers de transición */
import { RouteTransitionProvider } from '@/components/route-transition/TransitionProvider'
import AutoTransition from '@/components/route-transition/AutoTransition'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gesswein Properties - Corretaje Inmobiliario Santiago',
    template: '%s | Gesswein Properties',
  },
  description:
    'Especialistas en propiedades premium en Santiago Oriente. Corretaje inmobiliario, asesoría y programa de referidos.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* Usamos la MISMA fuente del Navbar: Tailwind font-sans (stack de sistema) */}
      <body className="font-sans">
        <RouteTransitionProvider>
          {/* Interceptor global de enlaces internos (excluye navbar) */}
          <AutoTransition />

          <div className="min-h-screen flex flex-col">
            {/* Excluimos el navbar de la transición con data-no-transition */}
            <div data-no-transition>
              <Navbar />
            </div>

            <main className="flex-1">{children}</main>
            <Footer />
          </div>

          <Toaster />
          <Analytics />
        </RouteTransitionProvider>
      </body>
    </html>
  )
}
