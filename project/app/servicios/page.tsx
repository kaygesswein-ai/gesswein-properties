import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import LeadForm from '@/components/LeadForm'
import { 
  Building2, 
  FileText, 
  Users, 
  Calculator, 
  MapPin, 
  Clock,
  CheckCircle,
  Star
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Servicios - Gesswein Properties',
  description: 'Corretaje inmobiliario, asesoría arquitectónica y consultoría normativa. Servicios integrales para tu próxima inversión inmobiliaria.',
}

const services = [
  {
    icon: Building2,
    title: 'Corretaje Inmobiliario',
    description: 'Servicio completo de compra, venta y arriendo de propiedades premium',
    features: [
      'Valuación profesional de propiedades',
      'Marketing digital especializado',
      'Acompañamiento en todo el proceso',
      'Red de contactos exclusiva',
      'Gestión de documentación legal'
    ],
    highlight: 'Más vendido'
  },
  {
    icon: FileText,
    title: 'Asesoría Arquitectónica',
    description: 'Consultoría especializada en proyectos arquitectónicos y remodelaciones',
    features: [
      'Diseño y planificación de proyectos',
      'Permisos de edificación',
      'Supervisión de obras',
      'Optimización de espacios',
      'Sustentabilidad y eficiencia energética'
    ],
    highlight: null
  },
  {
    icon: Users,
    title: 'Consultoría Normativa',
    description: 'Asesoría especializada en normativas municipales y regulaciones',
    features: [
      'Análisis de factibilidad',
      'Tramitación de permisos',
      'Cumplimiento normativo',
      'Gestión municipal',
      'Resolución de conflictos normativos'
    ],
    highlight: null
  }
]

const processSteps = [
  {
    step: 1,
    title: 'Consulta Inicial',
    description: 'Reunión para entender tus necesidades y objetivos'
  },
  {
    step: 2,
    title: 'Propuesta Personalizada',
    description: 'Plan de trabajo adaptado a tu proyecto específico'
  },
  {
    step: 3,
    title: 'Ejecución',
    description: 'Desarrollo del proyecto con seguimiento constante'
  },
  {
    step: 4,
    title: 'Entrega',
    description: 'Finalización exitosa y entrega de resultados'
  }
]

export default function ServiciosPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Ofrecemos servicios integrales para cubrir todas tus necesidades inmobiliarias 
              y arquitectónicas con la máxima profesionalidad
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="relative hover:shadow-lg transition-shadow">
                  {service.highlight && (
                    <Badge className="absolute -top-2 left-4 bg-yellow-500 text-yellow-900">
                      {service.highlight}
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-center">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Proceso de Trabajo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un proceso estructurado y transparente para garantizar los mejores resultados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <Card key={index} className="text-center relative">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </CardContent>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <div className="w-6 h-0.5 bg-blue-200"></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Carolina San Martín highlight */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Arquitecta Líder
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Carolina San Martín
                  </h3>
                  
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Arquitecta con más de 15 años de experiencia especializada en proyectos 
                    residenciales de alto estándar. Lidera nuestro equipo de asesoría 
                    arquitectónica y consultoría normativa.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Arquitectura Residencial</Badge>
                    <Badge variant="outline">Normativa Municipal</Badge>
                    <Badge variant="outline">Sustentabilidad</Badge>
                  </div>
                  
                  <Button variant="outline" className="mt-4">
                    Conocer más del equipo
                  </Button>
                </div>
                
                <div className="text-center lg:text-right">
                  <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto lg:mx-0 mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    "La excelencia en cada proyecto es nuestro compromiso"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">+10 años</h3>
              <p className="text-gray-600 text-sm">de experiencia en el mercado</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">500+</h3>
              <p className="text-gray-600 text-sm">proyectos exitosos</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Equipo</h3>
              <p className="text-gray-600 text-sm">multidisciplinario experto</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold mb-2">98%</h3>
              <p className="text-gray-600 text-sm">satisfacción de clientes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Necesitas nuestros servicios?
            </h2>
            <p className="text-xl text-gray-600">
              Cuéntanos sobre tu proyecto y te ayudaremos a hacerlo realidad
            </p>
          </div>
          
          <LeadForm
            type="general"
            title="Solicita una consulta"
            description="Completa el formulario y nos pondremos en contacto para discutir tu proyecto"
          />
        </div>
      </section>
    </div>
  )
}