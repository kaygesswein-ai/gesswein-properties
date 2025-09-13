'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LeadForm from '@/components/LeadForm';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Calendar,
  Building2,
} from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/analytics';

const contactInfo = [
  {
    icon: Phone,
    title: 'Teléfono',
    content: '+56 9 9331 8039',
    description: 'Lunes a viernes de 9:00 a 18:00',
    href: 'tel:+56912345678',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'contacto@gessweinproperties.cl',
    description: 'Respuesta en menos de 24 horas',
    href: 'mailto:contacto@gessweinproperties.cl',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    content: '+56 9 1234 5678',
    description: 'Disponible 24/7 para consultas',
    href: 'https://wa.me/56912345678',
  },
  {
    icon: MapPin,
    title: 'Oficina',
    content: 'Av. Providencia 1234, Of. 502',
    description: 'Providencia, Santiago, Chile',
    href: '#',
  },
];

const officeHours = [
  { day: 'Lunes - Viernes', hours: '9:00 - 18:00' },
  { day: 'Sábados', hours: '10:00 - 14:00' },
  { day: 'Domingos', hours: 'Solo citas agendadas' },
];

export default function ContactoPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contáctanos</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Estamos aquí para ayudarte. Ponte en contacto y comencemos a
              trabajar juntos en tu próximo proyecto inmobiliario
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Información de Contacto
              </h2>
              <p className="text-lg text-gray-600">
                Múltiples formas de contactarnos para tu comodidad
              </p>
            </div>

            {/* Contact methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900">
                            {info.title}
                          </h3>
                          <p className="font-medium text-blue-600">
                            {info.content}
                          </p>
                          <p className="text-sm text-gray-600">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Office hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horarios de Atención
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <span className="font-medium text-gray-900">
                      {schedule.day}
                    </span>
                    <span className="text-gray-600">{schedule.hours}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick actions */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Acciones Rápidas
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => trackWhatsAppClick('contact-page')}
                  asChild
                >
                  <a
                    href="https://wa.me/56912345678?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp Directo
                  </a>
                </Button>

                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href="https://calendly.com/gessweinproperties"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Cita
                  </a>
                </Button>
              </div>
            </div>

            {/* Map placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Ubicación de la Oficina
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Building2 className="w-12 h-12 mx-auto text-gray-400" />
                    <p className="text-gray-500 font-medium">
                      Av. Providencia 1234, Of. 502
                    </p>
                    <p className="text-sm text-gray-400">
                      Providencia, Santiago, Chile
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://maps.google.com/?q=Av.+Providencia+1234,+Providencia,+Santiago,+Chile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Ver en Google Maps
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="space-y-8">
            <LeadForm
              type="general"
              title="Envíanos un mensaje"
              description="Completa el formulario y nos pondremos en contacto contigo a la brevedad"
            />

            {/* Additional info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-blue-900 mb-3">
                  ¿Qué puedes esperar de nosotros?
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Respuesta en menos de 24 horas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Asesoría personalizada sin compromiso
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Propuesta de valor adaptada a tus necesidades
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    Seguimiento profesional durante todo el proceso
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Emergency contact */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-yellow-900 mb-2">
                  ¿Necesitas atención inmediata?
                </h3>
                <p className="text-sm text-yellow-800 mb-3">
                  Para emergencias o consultas urgentes fuera del horario de
                  oficina:
                </p>
                <Button
                  variant="outline"
                  className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                  onClick={() => trackWhatsAppClick('emergency-contact')}
                  asChild
                >
                  <a
                    href="https://wa.me/56912345678?text=URGENTE%3A%20"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp de Emergencia
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
