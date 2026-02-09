import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto - Gesswein Properties',
  description: 'Contáctanos para asesoría inmobiliaria premium en Santiago de Chile.',
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children
}
