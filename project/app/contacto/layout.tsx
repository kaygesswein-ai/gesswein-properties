// app/contacto/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto - Gesswein Properties',
  description:
    'Ponte en contacto con Gesswein Properties. Oficinas en Providencia, Santiago. Atención personalizada para tus necesidades inmobiliarias.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout de segmento: no lleva <html> ni <body>
  return <>{children}</>;
}
