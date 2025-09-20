import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

/**
 * Bloqueamos una sola tipografía en todo el sitio: INTER.
 * (Es la que se ve en el navbar: sans, mayúsculas y tracking alto.)
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'], // puedes quitar pesos si lo prefieres
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gesswein Properties - Corretaje Inmobiliario',
    template: '%s | Gesswein Properties',
  },
  description:
    'Propiedades y asesoría inmobiliaria de alto estándar en Santiago.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* Inter aplicado a TODO el sitio */}
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Si tu Navbar/Footer están en otras rutas, mantén tus imports actuales */}
          {children}
        </div>
      </body>
    </html>
  )
}



