import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MessageCircle } from 'lucide-react'
import ContactFormClient from './ContactFormClient'

export const metadata: Metadata = {
  title: 'Contacto - Gesswein Properties',
  description:
    'Escríbenos para vender, comprar, arrendar o recibir asesoría inmobiliaria con el estándar Gesswein Properties.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header / Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              Contacto
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Si quieres vender, comprar, arrendar o evaluar una oportunidad, escríbenos.
              Respondemos con criterio, datos y ejecución.
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
              <span className="inline-block h-1 w-1 rounded-full bg-slate-400" />
              <span>Gesswein Properties</span>
              <span className="inline-block h-1 w-1 rounded-full bg-slate-400" />
              <Link href="/propiedades" className="underline underline-offset-4 hover:text-slate-700">
                Ver propiedades
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contacto directo (sin dirección física, sin horarios, sin quick actions) */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-900">Contacto directo</CardTitle>
              <p className="text-sm text-slate-600">
                Escríbenos por correo o WhatsApp. También puedes llamarnos.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-slate-50 p-2">
                    <Mail className="h-5 w-5 text-[#0A2E57]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">Email</div>
                    <a
                      className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-4"
                      href="mailto:contacto@gessweinproperties.cl"
                    >
                      contacto@gessweinproperties.cl
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-slate-50 p-2">
                    <MessageCircle className="h-5 w-5 text-[#0A2E57]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">WhatsApp</div>
                    <a
                      className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-4"
                      href="https://wa.me/56912345678"
                      target="_blank"
                      rel="noreferrer"
                    >
                      +56 9 1234 5678
                    </a>
                    <p className="mt-1 text-xs text-slate-500">
                      (Cambia este número por el real si corresponde)
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-md bg-slate-50 p-2">
                    <Phone className="h-5 w-5 text-[#0A2E57]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">Teléfono</div>
                    <a
                      className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-4"
                      href="tel:+56912345678"
                    >
                      +56 9 1234 5678
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 leading-relaxed">
                Al enviar un mensaje, aceptas que utilicemos tus datos únicamente para responder tu solicitud
                y dar seguimiento comercial cuando corresponda.
              </div>
            </CardContent>
          </Card>

          {/* Form conectado a /api/contact */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-900">Dejar tu mensaje</CardTitle>
              <p className="text-sm text-slate-600">
                Cuéntanos qué necesitas y te respondemos con un plan claro.
              </p>
            </CardHeader>
            <CardContent>
              <ContactFormClient />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
