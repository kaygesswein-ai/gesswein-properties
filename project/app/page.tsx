'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Property = {
  id: string
  titulo?: string
  comuna?: string
  precio_uf?: number | null
  precio_clp?: number | null
  imagenes?: string[]
  images?: string[]
  destacada?: boolean
}

export default function HomePage() {
  const [destacadas, setDestacadas] = useState<Property[] | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/propiedades?destacada=true&limit=6', { cache: 'no-store' })
        const json = await res.json()
        if (mounted) setDestacadas(Array.isArray(json?.data) ? json.data : [])
      } catch {
        if (mounted) setDestacadas([])
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative isolate">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
          aria-hidden
        />
        {/* Velo para legibilidad */}
        <div className="absolute inset-0 -z-0 bg-black/40" aria-hidden />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-xl md:text-2xl leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Especialistas en corretaje con asesoría arquitectónica para maximizar el valor de tu inmueble.
            </p>

            {/* BOTÓN BLANCO, TEXTO AZUL, SIN REDONDEO, SOBRE CUALQUIER OVERLAY */}
            <div className="mt-8 relative z-10">
              <Link
                href="/propiedades"
                prefetch
                className="inline-flex items-center justify-center px-6 py-3 font-medium border border-white hover:opacity-95 transition rounded-none"
                style={{ backgroundColor: '#FFFFFF', color: '#0A2E57' }}
                aria-label="Ver propiedades"
              >
                Ver propiedades →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold">Propiedades destacadas</h2>
          <Link href="/propiedades" className="text-sm text-slate-600 hover:text-slate-900">
            Ver todas →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(destacadas ?? Array.from({ length: 6 })).map((p: any, i: number) => {
            if (!destacadas) {
              return (
                <div key={i} className="animate-pulse border border-slate-200">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-4">
                    <div className="h-4 w-2/3 bg-slate-200" />
                    <div className="mt-2 h-4 w-1/2 bg-slate-200" />
                    <div className="mt-6 h-8 w-24 bg-slate-200" />
                  </div>
                </div>
              )
            }

            const imgs = Array.isArray(p?.imagenes) ? p.imagenes : Array.isArray(p?.images) ? p.images : []
            const img =
              imgs?.[0] ??
              'https://images.pexels.com/photos/259597/pexels-photo-259597.jpeg?auto=compress&cs=tinysrgb&w=1600'
            const precio =
              typeof p?.precio_uf === 'number'
                ? `${Number(p.precio_uf).toLocaleString('en-US')} UF`
                : typeof p?.precio_clp === 'number'
                ? `$ ${Number(p.precio_clp).toLocaleString('en-US')}`
                : 'Precio a consultar'

            return (
              <Link
                key={p.id}
                href={`/propiedades/${p.id}`}
                className="group border border-slate-200 hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={p?.titulo ?? 'Propiedad'} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-1">{p?.titulo ?? 'Propiedad'}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-1">{p?.comuna ?? 'Santiago Oriente'}</p>
                  <p className="mt-2 font-semibold">{precio}</p>
                  <span className="mt-4 inline-flex items-center text-sm text-[#0A2E57] group-hover:underline">
                    Ver detalle →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
