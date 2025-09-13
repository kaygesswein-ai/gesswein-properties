import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cookie, Settings, Eye, BarChart, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Cookies - Gesswein Properties',
  description: 'Información sobre el uso de cookies en el sitio web de Gesswein Properties y cómo gestionarlas.',
}

const cookieTypes = [
  {
    icon: Settings,
    name: 'Cookies Esenciales',
    description: 'Necesarias para el funcionamiento básico del sitio web',
    purpose: 'Autenticación, seguridad, recordar preferencias básicas',
    duration: 'Sesión o hasta 1 año',
    canDisable: false,
    badge: 'Obligatorias'
  },
  {
    icon: BarChart,
    name: 'Cookies de Análisis',
    description: 'Nos ayudan a entender cómo los usuarios interactúan con el sitio',
    purpose: 'Google Analytics, métricas de rendimiento, patrones de uso',
    duration: 'Hasta 24 meses',
    canDisable: true,
    badge: 'Opcionales'
  },
  {
    icon: Target,
    name: 'Cookies de Marketing',
    description: 'Para mostrar publicidad personalizada y relevante',
    purpose: 'Meta Pixel, publicidad dirigida, seguimiento de conversiones',
    duration: 'Hasta 13 meses',
    canDisable: true,
    badge: 'Opcionales'
  }
]

const browserInstructions = [
  {
    browser: 'Google Chrome',
    steps: [
      'Haz clic en el menú ⋮ en la esquina superior derecha',
      'Selecciona "Configuración"',
      'Ve a "Privacidad y seguridad" > "Cookies y otros datos de sitios"',
      'Configura tus preferencias de cookies'
    ]
  },
  {
    browser: 'Mozilla Firefox',
    steps: [
      'Haz clic en el menú ☰ en la esquina superior derecha',
      'Selecciona "Configuración"',
      'Ve a "Privacidad y seguridad"',
      'En "Cookies y datos del sitio", ajusta tu configuración'
    ]
  },
  {
    browser: 'Safari',
    steps: [
      'Ve al menú Safari > "Preferencias"',
      'Haz clic en la pestaña "Privacidad"',
      'Configura "Cookies y datos de sitios web"',
      'Elige tu nivel de privacidad preferido'
    ]
  },
  {
    browser: 'Microsoft Edge',
    steps: [
      'Haz clic en el menú ⋯ en la esquina superior derecha',
      'Selecciona "Configuración"',
      'Ve a "Cookies y permisos del sitio"',
      'Administra tus preferencias de cookies'
    ]
  }
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Política de Cookies
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Información sobre cómo utilizamos cookies y tecnologías similares 
              en nuestro sitio web para mejorar tu experiencia.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Última actualización: Enero 2024
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What are cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              ¿Qué son las cookies?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo 
              cuando visitas un sitio web. Nos permiten reconocer tu navegador y capturar 
              cierta información para mejorar tu experiencia de navegación.
            </p>
            <p className="text-gray-700 leading-relaxed">
              En Gesswein Properties utilizamos cookies para personalizar contenido, 
              analizar el tráfico del sitio y recordar tus preferencias.
            </p>
          </CardContent>
        </Card>

        {/* Types of cookies */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tipos de Cookies que Utilizamos
          </h2>
          
          {cookieTypes.map((cookie, index) => {
            const Icon = cookie.icon
            return (
              <Card key={index} className="relative">
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={cookie.canDisable ? "secondary" : "default"}
                    className={cookie.canDisable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {cookie.badge}
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    {cookie.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-gray-700">{cookie.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Propósito:</span>
                      <p className="text-gray-600">{cookie.purpose}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Duración:</span>
                      <p className="text-gray-600">{cookie.duration}</p>
                    </div>
                  </div>
                  
                  {!cookie.canDisable && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      Estas cookies son esenciales para el funcionamiento del sitio y no se pueden desactivar.
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Third-party services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Servicios de Terceros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Utilizamos los siguientes servicios de terceros que pueden establecer cookies:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Google Analytics</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Para analizar el uso del sitio web y mejorar nuestros servicios.
                </p>
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Política de privacidad de Google
                </a>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Meta Pixel</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Para personalización de anuncios y seguimiento de conversiones.
                </p>
                <a 
                  href="https://www.facebook.com/privacy/policy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Política de datos de Meta
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gestionar tus Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700">
              Puedes controlar y gestionar las cookies de varias formas:
            </p>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Configuración del Navegador</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {browserInstructions.map((browser, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium mb-3">{browser.browser}</h5>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {browser.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Nota Importante</h4>
              <p className="text-sm text-blue-800">
                Si desactivas las cookies, algunas funcionalidades del sitio web pueden 
                no funcionar correctamente. Las cookies esenciales siempre permanecerán 
                activas para garantizar el funcionamiento básico del sitio.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Consent management */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">Gestión del Consentimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-orange-800">
              Tu consentimiento es importante para nosotros. Puedes:
            </p>
            
            <ul className="space-y-2 text-sm text-orange-800">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                Aceptar o rechazar cookies no esenciales en tu primera visita
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                Cambiar tus preferencias en cualquier momento
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                Retirar tu consentimiento cuando lo desees
              </li>
            </ul>
            
            <div className="pt-4">
              <Button variant="outline" className="border-orange-600 text-orange-700 hover:bg-orange-100">
                Revisar Preferencias de Cookies
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>¿Tienes Preguntas?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Si tienes preguntas sobre nuestra política de cookies o necesitas ayuda 
              para gestionar tus preferencias, no dudes en contactarnos:
            </p>
            
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> privacidad@gessweinproperties.cl</p>
              <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
              <p><strong>Dirección:</strong> Av. Providencia 1234, Of. 502, Providencia, Santiago</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}