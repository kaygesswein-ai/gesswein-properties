// project/app/propiedades/[id]/page.tsx
import type { Metadata } from 'next'
import { headers } from 'next/headers'

type Property = {
  id: string
  titulo?: string
  title?: string
  descripcion?: string
  description?: string
}

/** Base URL segura para SSR (funciona en Vercel y local) */
function getBaseUrl() {
  const h = headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  return process.env.NEXT_PUBLIC_APP_URL || (host ? `${proto}://${host}` : 'http://localhost:3000')
}

async function fetchProperty(id: string): Promise<Property | null> {
  try {
    const base = getBaseUrl()
    const res = await fetch(`${base}/api/propiedades/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    // tu API suele venir como { data: {...} }
    return (json?.data ?? json) as Property
  } catch {
    return null
  }
}

/** ✅ generateMetadata solo en server components */
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const property = await fetchProperty(params.id)
  const titleCore = property?.titulo || property?.title || 'Propiedad'
  const description = property?.descripcion || property?.description || 'Detalle de propiedad en Gesswein Properties'
  return {
    title: `${titleCore} | Gesswein Properties`,
    description,
    openGraph: { title: `${titleCore} | Gesswein Properties`, description }
  }
}

/** Página de detalle (server component por defecto, sin "use client") */
export default async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await fetchProperty(params.id)

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Propiedad no encontrada</h1>
        <p className="text-gray-600">Vuelve al listado para seguir explorando.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {property.titulo || property.title}
      </h1>
      {property.descripcion || property.description ? (
        <p className="text-gray-700">{property.descripcion || property.description}</p>
      ) : null}
    </div>
  )
}
