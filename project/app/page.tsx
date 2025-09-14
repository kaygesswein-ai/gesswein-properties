'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="min-h-[70vh] grid place-items-center px-6 py-16">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Bienvenido a Gesswein Properties
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Especialistas en propiedades premium en Santiago Oriente.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button asChild>
            <Link href="/propiedades">Ver Propiedades</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contacto">Contáctanos</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
