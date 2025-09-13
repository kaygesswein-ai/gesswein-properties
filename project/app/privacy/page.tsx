import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, Lock, Users, FileText, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Privacidad - Gesswein Properties',
  description: 'Política de privacidad y protección de datos personales de Gesswein Properties, conforme a la Ley 19.628 de Chile.',
}

const sections = [
  {
    icon: Shield,
    title: 'Información que Recopilamos',
    content: [
      'Datos personales como nombre, email, teléfono y dirección cuando nos contactas',
      'Información sobre tus preferencias inmobiliarias y presupuesto',
      'Datos de navegación y uso de nuestro sitio web',
      'Información proporcionada voluntariamente en formularios y consultas'
    ]
  },
  {
    icon: Eye,
    title: 'Cómo Utilizamos tu Información',
    content: [
      'Para responder a tus consultas y brindarte nuestros servicios',
      'Envío de información sobre propiedades que puedan interesarte',
      'Mejorar nuestros servicios y experiencia del usuario',
      'Cumplir con obligaciones legales y regulatorias'
    ]
  },
  {
    icon: Lock,
    title: 'Protección de Datos',
    content: [
      'Utilizamos medidas de seguridad técnicas y organizacionales',
      'Acceso restringido a personal autorizado únicamente',
      'Encriptación de datos sensibles durante transmisión',
      'Respaldos seguros y actualizaciones regulares de seguridad'
    ]
  },
  {
    icon: Users,
    title: 'Compartir Información',
    content: [
      'No vendemos ni rentamos tu información personal a terceros',
      'Podemos compartir datos con proveedores de servicios autorizados',
      'Cumplimiento con órdenes judiciales o requisitos legales',
      'Con tu consentimiento explícito para servicios específicos'
    ]
  }
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En Gesswein Properties valoramos y protegemos tu privacidad. 
              Esta política explica cómo recopilamos, usamos y protegemos tu información personal.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Última actualización: Enero 2024 | Conforme a la Ley 19.628 de Chile
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Gesswein Properties SpA, RUT XX.XXX.XXX-X, con domicilio en Av. Providencia 1234, Of. 502, 
              Providencia, Santiago, Chile, es responsable del tratamiento de tus datos personales 
              conforme a la Ley N° 19.628 sobre Protección de la Vida Privada.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Al utilizar nuestros servicios o proporcionar información personal, aceptas las 
              condiciones de esta política de privacidad.
            </p>
          </CardContent>
        </Card>

        {/* Main sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                Tus Derechos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Acceso:</strong> Solicitar copia de tus datos personales</p>
              <p><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</p>
              <p><strong>Cancelación:</strong> Eliminar tus datos personales</p>
              <p><strong>Oposición:</strong> Objetar el procesamiento de tus datos</p>
              <p><strong>Portabilidad:</strong> Transferir datos a otro proveedor</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                Contacto para Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Email:</strong> privacidad@gessweinproperties.cl</p>
              <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
              <p><strong>Dirección:</strong> Av. Providencia 1234, Of. 502</p>
              <p><strong>Horario:</strong> Lunes a viernes, 9:00 - 18:00</p>
              <p><strong>Tiempo de respuesta:</strong> Máximo 30 días</p>
            </CardContent>
          </Card>
        </div>

        {/* Cookies section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Uso de Cookies y Tecnologías Similares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-1">Cookies Esenciales</h4>
                <p className="text-gray-600">Necesarias para el funcionamiento básico del sitio</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-1">Cookies Analytics</h4>
                <p className="text-gray-600">Para entender cómo usas nuestro sitio</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-1">Cookies Marketing</h4>
                <p className="text-gray-600">Para mostrarte contenido relevante</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal compliance */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-blue-900 mb-3">
              Cumplimiento Legal
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Esta política cumple con la Ley N° 19.628 sobre Protección de la Vida Privada</p>
              <p>• Nos adherimos a las mejores prácticas internacionales de privacidad</p>
              <p>• Revisamos y actualizamos regularmente nuestras políticas</p>
              <p>• Mantenemos registros de todas las actividades de procesamiento</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600 text-sm">
            Esta política puede ser actualizada periódicamente. Te notificaremos sobre cambios 
            significativos por email o a través de nuestro sitio web.
          </p>
        </div>
      </div>
    </div>
  )
}