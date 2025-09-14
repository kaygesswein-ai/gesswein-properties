'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO con imagen de fondo */}
      <section className="relative isolate">
        {/* Imagen de fondo: reemplaza esta URL por tu foto real (Supabase Storage o /public) */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg')",
          }}
          aria-hidden
        />
        {/* Velo para legibilidad sobre la foto */}
        <div className="absolute inset-0 -z-0 bg-black/40" aria-hidden />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            {/* SOLO el texto pequeño que indicaste (sin el H1 grande) */}
            <p className="text-xl md:text-2xl leading-relaxed text-white">
              Especialistas en corretaje con asesoría arquitectónica para maximizar el valor de tu inmueble.
            </p>

            {/* Único botón → Propiedades */}
            <div className="mt-8">
              <Link
                href="/propiedades"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition"
              >
                Ver propiedades →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* (Opcional) Sección de valor diferenciador o bloques siguientes */}
      {/* Aquí puedes mantener tus bloques inferiores / “¿Por qué elegir…?” */}
    </main>
  )
}
