'use client';
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import LeadForm from '@/components/LeadForm'
import { 
  ArrowLeft, 
  Bed, 
  Bath, 
  Car, 
  Home, 
  MapPin, 
  Maximize, 
  Shield, 
  Trees,
  Waves,
  Square,
  MessageCircle 
} from 'lucide-react'
import type { Property } from '@/lib/types'
import { formatPrice, formatArea } from '@/lib/utils/currency'
import { trackPropertyView, trackWhatsAppClick } from '@/lib/analytics'

interface PropertyPageProps {
  params: { id: string }
}

async function getProperty(id: string): Promise<Property | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/propiedades/${id}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return null
    }
    
    const property = await response.json()
    
    // Track property view
    if (typeof window !== 'undefined') {
      trackPropertyView(property.id, property.titulo)
    }
    
    return property
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await getProperty(params.id)
  
  if (!property) {
    return {
      title: 'Propiedad no encontrada',
    }
  }

  const price = formatPrice(property.precio_uf, property.precio_clp)
  
  return {
    title: `${property.titulo} - ${price}`,
    description: property.descripcion || `${property.tipo} en ${property.comuna}`,
    openGraph: {
      title: property.titulo,
      description: property.descripcion || `${property.tipo} en ${property.comuna}`,
      images: property.imagenes?.slice(0, 1) || [],
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const property = await getProperty(params.id)

  if (!property) {
    notFound()
  }

  const features = [
    { condition: property.bodega, label: 'Bodega', icon: Square },
    { condition: property.terraza, label: 'Terraza', icon: Square },
    { condition: property.jardin, label: 'Jardín', icon: Trees },
    { condition: property.piscina, label: 'Piscina', icon: Waves },
    { condition: property.seguridad, label: 'Seguridad 24/7', icon: Shield },
  ].filter(feature => feature.condition)

  return (
    <div>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": property.titulo,
            "description": property.descripcion,
            "image": property.imagenes || [],
            "offers": {
              "@type": "Offer",
              "priceCurrency": property.precio_uf ? "UF" : "CLP",
              "price": property.precio_uf || property.precio_clp,
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "RealEstateAgent",
                "name": "Gesswein Properties"
              }
            },
            "additionalProperty": [
              {
                "@type": "PropertyValue",
                "name": "propertyType",
                "value": property.tipo
              },
              {
                "@type": "PropertyValue", 
                "name": "operationType",
                "value": property.operacion
              },
              {
                "@type": "PropertyValue",
                "name": "location",
                "value": property.comuna
              }
            ]
          })
        }}
      />

      {/* Back button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" asChild>
            <Link href="/propiedades">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a propiedades
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image gallery */}
            <div className="space-y-4">
              {property.imagenes && property.imagenes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative aspect-video md:col-span-2">
                    <Image
                      src={property.imagenes[0]}
                      alt={property.titulo}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  {property.imagenes.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative aspect-video">
                      <Image
                        src={image}
                        alt={`${property.titulo} - Imagen ${index + 2}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Property info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge 
                    variant={property.operacion === 'venta' ? 'default' : 'secondary'}
                    className={property.operacion === 'venta' 
                      ? 'bg-blue-600' 
                      : 'bg-green-600 text-white'
                    }
                  >
                    {property.operacion === 'venta' ? 'Venta' : 'Arriendo'}
                  </Badge>
                  {property.destacada && (
                    <Badge variant="outline" className="border-yellow-600 text-yellow-600">
                      Destacada
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {property.titulo}
                </h1>

                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {property.direccion ? `${property.direccion}, ` : ''}{property.comuna}
                  </span>
                </div>

                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.precio_uf, property.precio_clp)}
                </div>
              </div>

              {/* Property details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la Propiedad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Home className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-semibold capitalize">{property.tipo}</div>
                    </div>
                    
                    {property.superficie_total && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Maximize className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <div className="font-semibold">{formatArea(property.superficie_total)}</div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                    )}
                    
                    {property.dormitorios && property.dormitorios > 0 && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Bed className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <div className="font-semibold">{property.dormitorios}</div>
                        <div className="text-xs text-gray-600">Dormitorios</div>
                      </div>
                    )}
                    
                    {property.banos && property.banos > 0 && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Bath className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <div className="font-semibold">{property.banos}</div>
                        <div className="text-xs text-gray-600">Baños</div>
                      </div>
                    )}
                  </div>

                  {(property.superficie_util || property.estacionamientos) && (
                    <Separator />
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {property.superficie_util && (
                      <div>
                        <span className="text-gray-600">Superficie útil:</span>
                        <span className="ml-2 font-medium">{formatArea(property.superficie_util)}</span>
                      </div>
                    )}
                    
                    {property.estacionamientos && property.estacionamientos > 0 && (
                      <div>
                        <span className="text-gray-600">Estacionamientos:</span>
                        <span className="ml-2 font-medium">{property.estacionamientos}</span>
                      </div>
                    )}
                  </div>

                  {features.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Características adicionales:</h4>
                        <div className="flex flex-wrap gap-2">
                          {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                <Icon className="w-3 h-3" />
                                {feature.label}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              {property.descripcion && (
                <Card>
                  <CardHeader>
                    <CardTitle>Descripción</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.descripcion}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Map placeholder */}
              {property.latitude && property.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ubicación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-500">Mapa de ubicación</p>
                        <p className="text-sm text-gray-400">
                          {property.direccion}, {property.comuna}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact CTA */}
            <Card className="sticky top-4">
              <CardContent className="pt-6 space-y-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => trackWhatsAppClick('property-detail')}
                >
                  <a
                    href={`https://wa.me/56912345678?text=Hola%2C%20me%20interesa%20la%20propiedad%3A%20${encodeURIComponent(property.titulo)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Consultar por WhatsApp
                  </a>
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  <p>¿Tienes preguntas?</p>
                  <p className="font-medium">+56 9 1234 5678</p>
                </div>
              </CardContent>
            </Card>

            {/* Visit form */}
            <LeadForm
              propertyId={property.id}
              propertyTitle={property.titulo}
              type="visit"
              title="Quiero visitar esta propiedad"
              description="Agenda una visita y conoce todos los detalles"
            />
          </div>
        </div>
      </div>
    </div>
  )
}