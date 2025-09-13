// project/components/PropertyCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Property } from '@/lib/types'

type PropertyCardProps = { property: Property }

/** Devuelve el arreglo de imágenes, soportando ES/EN y portada */
function getImages(property: Property): string[] {
  const asAny = property as Property & { imagenes?: string[] }
  const es = Array.isArray(asAny.imagenes) ? asAny.imagenes : undefined
  const en = Array.isArray(property.images) ? property.images : undefined
  const cover = property.portadaUrl || property.coverImage

  if (es?.length) return es
  if (en?.length) return en
  if (cover) return [cover]
  return []
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const images = getImages(property)
  const mainImage =
    images[0] ||
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'

  return (
    <Link href={`/propiedades/${property.id}`} className="block group">
      <Card className="overflow-hidden rounded-2xl shadow-card hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={mainImage}
            alt={property.titulo || property.title || 'Propiedad'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-white text-gray-800">
              {property.operacion === 'venta' ? 'Venta' : 'Arriendo'}
            </Badge>
            {property.destacada && (
              <Badge variant="outline" className="bg-white text-yellow-700 border-yellow-700">
                Destacada
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-5">
          <h3 className="text-lg font-semibold mb-1 text-[var(--gp-primary, #022555)]">
            {property.titulo || property.title || 'Propiedad'}
          </h3>

          {(property.descripcion || property.description) && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {property.descripcion || property.description}
            </p>
          )}

          {/* Info básica (ajústalo según tus campos reales) */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-700">
            {typeof property.dormitorios === 'number' && (
              <span>{property.dormitorios} dorm.</span>
            )}
            {typeof property.banos === 'number' && <span>{property.banos} baños</span>}
            {typeof property.m2 === 'number' && <span>{property.m2} m²</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
