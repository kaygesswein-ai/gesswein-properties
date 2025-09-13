import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Bed, Bath, Car, Home, MapPin } from 'lucide-react'
import type { Property } from '@/lib/types'
import { formatPrice, formatArea } from '@/lib/utils/currency'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.imagenes && property.imagenes.length > 0 
    ? property.imagenes[0] 
    : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/propiedades/${property.id}`}>
        <div className="relative aspect-video">
          <Image
            src={mainImage}
            alt={property.titulo}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge 
              variant={property.operacion === 'venta' ? 'default' : 'secondary'}
              className={property.operacion === 'venta' 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
            >
              {property.operacion === 'venta' ? 'Venta' : 'Arriendo'}
            </Badge>
            {property.destacada && (
              <Badge variant="outline" className="bg-white text-yellow-600 border-yellow-600">
                Destacada
              </Badge>
            )}
          </div>
        </div>
      </Link>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-blue-600 transition-colors">
            <Link href={`/propiedades/${property.id}`}>
              {property.titulo}
            </Link>
          </h3>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.comuna}</span>
          </div>

          <div className="text-xl font-bold text-blue-600">
            {formatPrice(property.precio_uf, property.precio_clp)}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {property.tipo && (
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-1" />
              <span className="capitalize">{property.tipo}</span>
            </div>
          )}
          
          {property.superficie_total && (
            <div className="flex items-center">
              <span className="mr-1">📐</span>
              <span>{formatArea(property.superficie_total)}</span>
            </div>
          )}
          
          {property.dormitorios && property.dormitorios > 0 && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.dormitorios}</span>
            </div>
          )}
          
          {property.banos && property.banos > 0 && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.banos}</span>
            </div>
          )}
          
          {property.estacionamientos && property.estacionamientos > 0 && (
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-1" />
              <span>{property.estacionamientos}</span>
            </div>
          )}
        </div>

        {property.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {property.descripcion}
          </p>
        )}
      </CardContent>
    </Card>
  )
}