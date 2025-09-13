import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Linkedin, Mail, Phone, Users, Award, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nuestro Equipo - Gesswein Properties',
  description: 'Conoce a nuestro equipo de profesionales especializados en el mercado inmobiliario chileno, liderados por Carolina San Martín.',
}

const teamMembers = [
  {
    name: 'Carolina San Martín',
    role: 'Arquitecta Líder & Fundadora',
    description: 'Arquitecta con más de 15 años de experiencia en proyectos residenciales de alto estándar. Especialista en normativas municipales y sustentabilidad.',
    specialties: ['Arquitectura Residencial', 'Normativa Municipal', 'Sustentabilidad', 'Gestión de Proyectos'],
    education: 'Arquitecta Universidad de Chile, Magíster en Desarrollo Urbano Sostenible',
    experience: '15+ años',
    email: 'carolina@gessweinproperties.cl',
    phone: '+56 9 1234 5678',
    linkedin: '#',
    featured: true
  },
  {
    name: 'Roberto Gesswein',
    role: 'Director Comercial',
    description: 'Experto en corretaje inmobiliario con amplio conocimiento del mercado de Santiago Oriente. Especializado en propiedades premium.',
    specialties: ['Corretaje Inmobiliario', 'Valuación', 'Negociación', 'Marketing'],
    education: 'Ingeniero Comercial UC, Diplomado en Real Estate',
    experience: '12+ años',
    email: 'roberto@gessweinproperties.cl',
    phone: '+56 9 8765 4321',
    linkedin: '#',
    featured: false
  },
  {
    name: 'María José González',
    role: 'Consultora Legal',
    description: 'Abogada especializada en derecho inmobiliario y regulaciones urbanas. Encargada de todos los aspectos legales de nuestras operaciones.',
    specialties: ['Derecho Inmobiliario', 'Contratos', 'Due Diligence', 'Regulación Urbana'],
    education: 'Abogada Universidad de los Andes, LLM Real Estate Law',
    experience: '10+ años',
    email: 'legal@gessweinproperties.cl',
    phone: '+56 9 5555 1234',
    linkedin: '#',
    featured: false
  },
  {
    name: 'Felipe Rodríguez',
    role: 'Especialista en Marketing Digital',
    description: 'Experto en marketing inmobiliario digital y fotografía de propiedades. Responsable de la presencia online y estrategias de marketing.',
    specialties: ['Marketing Digital', 'Fotografía', 'Redes Sociales', 'Analytics'],
    education: 'Publicista UDP, Especialización en Marketing Digital',
    experience: '8+ años',
    email: 'marketing@gessweinproperties.cl',
    phone: '+56 9 6666 7890',
    linkedin: '#',
    featured: false
  }
]

export default function EquipoPage() {
  const featuredMember = teamMembers.find(member => member.featured)
  const otherMembers = teamMembers.filter(member => !member.featured)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestro Equipo
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Profesionales expertos unidos por la pasión de ayudarte a encontrar 
              la propiedad perfecta
            </p>
          </div>
        </div>
      </section>

      {/* Featured member - Carolina San Martín */}
      {featuredMember && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-lg">
              <CardContent className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-yellow-500" />
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          Arquitecta Líder
                        </Badge>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {featuredMember.name}
                      </h2>
                      
                      <p className="text-lg text-blue-600 font-medium">
                        {featuredMember.role}
                      </p>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {featuredMember.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Experiencia:</span>
                        <span className="font-medium">{featuredMember.experience}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Educación:</span>
                        <span className="font-medium">{featuredMember.education}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 font-medium">Especialidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {featuredMember.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {featuredMember.email}
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {featuredMember.phone}
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Users className="w-24 h-24 text-blue-600 opacity-80" />
                    </div>
                    <blockquote className="text-lg italic text-gray-700">
                      "La arquitectura no es solo construir espacios, es crear hogares donde las familias escriben sus historias"
                    </blockquote>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Other team members */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              El Resto del Equipo
            </h2>
            <p className="text-xl text-gray-600">
              Profesionales especializados que complementan nuestra propuesta de valor
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    
                    <p className="text-blue-600 font-medium mb-3">
                      {member.role}
                    </p>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{member.experience}</span> • {member.education}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs text-gray-600 font-medium">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.specialties.slice(0, 3).map((specialty, specIndex) => (
                          <Badge key={specIndex} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {member.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.specialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="ghost" size="sm" className="flex-1 text-xs">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-1 text-xs">
                        <Phone className="w-3 h-3 mr-1" />
                        Llamar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company culture */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestra Cultura
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Los valores que nos definen y guían cada decisión en nuestro trabajo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Excelencia</h3>
                <p className="text-gray-600 text-sm">
                  Buscamos la perfección en cada detalle, desde el primer contacto hasta la entrega de llaves.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Transparencia</h3>
                <p className="text-gray-600 text-sm">
                  Comunicación clara y honesta en todos nuestros procesos y relaciones comerciales.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Innovación</h3>
                <p className="text-gray-600 text-sm">
                  Adoptamos las mejores tecnologías y metodologías para ofrecer un servicio superior.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Quieres trabajar con nosotros?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nuestro equipo está listo para ayudarte a alcanzar tus objetivos inmobiliarios
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              Contáctanos
            </Button>
            
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
              <a
                href="https://wa.me/56912345678?text=Hola%2C%20quiero%20trabajar%20con%20el%20equipo%20de%20Gesswein%20Properties"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}