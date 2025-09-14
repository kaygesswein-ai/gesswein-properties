import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="relative isolate">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Propiedades premium en <span className="text-blue-600">Santiago Oriente</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Asesoría boutique y un portafolio curado de departamentos y casas en las mejores
              comunas. Transparencia, velocidad y servicio personalizado.
            </p>
            <div className="mt-10 flex gap-4">
              <Link
                href="/propiedades"
                className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-white font-medium hover:bg-blue-700"
              >
                Ver propiedades
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-3 text-gray-700 font-medium hover:bg-gray-50"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
