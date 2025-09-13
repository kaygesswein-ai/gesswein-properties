import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Gift, Users, Clock, DollarSign, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Términos del Programa de Referidos - Gesswein Properties',
  description: 'Términos y condiciones del programa de referidos exclusivo de Gesswein Properties.',
}

const terms = [
  {
    icon: Users,
    title: 'Elegibilidad',
    content: [
      'Cualquier persona mayor de 18 años puede participar',
      'El referente debe ser cliente actual o potencial de Gesswein Properties',
      'El referido debe ser una persona nueva que no haya tenido contacto previo con nosotros',
      'No pueden participar empleados de la empresa ni sus familiares directos'
    ]
  },
  {
    icon: Gift,
    title: 'Beneficios y Recompensas',
    content: [
      'Comisión del 0.5% sobre el valor de la transacción inmobiliaria',
      'Descuento del 10% en servicios de asesoría arquitectónica',
      'Acceso prioritario a propiedades exclusivas',
      'Invitaciones a eventos especiales y lanzamientos'
    ]
  },
  {
    icon: Clock,
    title: 'Proceso y Tiempos',
    content: [
      'El referido debe realizar una transacción dentro de 12 meses desde la referencia',
      'El pago de beneficios se realiza 30 días después del cierre de la operación',
      'La referencia debe registrarse antes del primer contacto del referido',
      'Seguimiento mensual del estado de la referencia'
    ]
  },
  {
    icon: DollarSign,
    title: 'Condiciones de Pago',
    content: [
      'Los beneficios se pagan únicamente tras la finalización exitosa de la transacción',
      'Se requiere factura o boleta de honorarios para el pago',
      'Los impuestos aplicables son responsabilidad del beneficiario',
      'Pagos se realizan por transferencia bancaria'
    ]
  }
]

const restrictions = [
  'Una sola referencia por persona referida',
  'No se permite la auto-referencia',
  'Los beneficios no son acumulables con otras promociones',
  'Gesswein Properties se reserva el derecho de verificar la validez de las referencias',
  'El programa puede ser modificado o cancelado con 30 días de aviso',
  'Beneficios no son transferibles a terceros'
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Términos del Programa de Referidos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conoce los términos y condiciones de nuestro programa de referidos 
              con exclusividad y los beneficios disponibles.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Última actualización: Enero 2024 | Válido hasta nuevo aviso
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              El Programa de Referidos con Exclusividad de Gesswein Properties está diseñado 
              para recompensar a nuestros clientes y contactos que nos refieren nuevos clientes 
              potenciales para nuestros servicios inmobiliarios.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Al participar en este programa, aceptas cumplir con estos términos y condiciones 
              que rigen el funcionamiento del programa de referidos.
            </p>
          </CardContent>
        </Card>

        {/* Main terms */}
        <div className="space-y-6 mb-8">
          {terms.map((term, index) => {
            const Icon = term.icon
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-yellow-600" />
                    </div>
                    {term.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {term.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Program flow */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Flujo del Programa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-medium">Registro de Referencia</h4>
                  <p className="text-sm text-gray-600">Completas el formulario de referidos con toda la información</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-medium">Contacto Inicial</h4>
                  <p className="text-sm text-gray-600">Nos ponemos en contacto con el referido en 48 horas</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-medium">Proceso Comercial</h4>
                  <p className="text-sm text-gray-600">Trabajamos con el referido para encontrar la propiedad ideal</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h4 className="font-medium">Cierre y Pago</h4>
                  <p className="text-sm text-gray-600">Completada la transacción, procesamos tu recompensa</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Restrictions */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Restricciones y Limitaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {restrictions.map((restriction, index) => (
                <li key={index} className="flex items-start gap-3 text-red-800">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{restriction}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Ejemplos de Recompensas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2">Venta de Departamento</h4>
                <p className="text-sm text-gray-600 mb-2">Precio: $200.000.000 CLP</p>
                <p className="text-sm font-medium text-green-700">Tu recompensa: $1.000.000 CLP</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2">Arriendo de Casa</h4>
                <p className="text-sm text-gray-600 mb-2">Valor: $1.500.000 CLP/mes</p>
                <p className="text-sm font-medium text-green-700">Tu recompensa: Servicios con 10% descuento</p>
              </div>
            </div>
            
            <p className="text-xs text-green-700">
              *Los ejemplos son ilustrativos. Los beneficios reales pueden variar según el tipo y valor de la transacción.
            </p>
          </CardContent>
        </Card>

        {/* Legal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Aspectos Legales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Jurisdicción:</strong> Estos términos se rigen por las leyes de Chile y 
                cualquier disputa será resuelta en los tribunales de Santiago.
              </p>
              <p>
                <strong>Modificaciones:</strong> Gesswein Properties se reserva el derecho de 
                modificar estos términos con un aviso de 30 días.
              </p>
              <p>
                <strong>Vigencia:</strong> El programa estará vigente hasta nuevo aviso y puede 
                ser suspendido temporalmente por mantenimiento o actualizaciones.
              </p>
              <p>
                <strong>Privacidad:</strong> La información proporcionada está sujeta a nuestra 
                política de privacidad y será utilizada únicamente para los fines del programa.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto y Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Para consultas sobre el programa de referidos o estos términos:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Información General</h4>
                <p><strong>Email:</strong> referidos@gessweinproperties.cl</p>
                <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                <p><strong>Horario:</strong> Lunes a viernes, 9:00 - 18:00</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Seguimiento de Referencias</h4>
                <p><strong>Estado:</strong> Consulta por email o teléfono</p>
                <p><strong>Pagos:</strong> Área de administración</p>
                <p><strong>Reclamos:</strong> gerencia@gessweinproperties.cl</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}