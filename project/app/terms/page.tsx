import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone } from 'lucide-react'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contacto - Gesswein Properties',
  description: 'Contáctanos para vender, comprar o arrendar con exclusividad en Gesswein Properties.',
}

/* =========================================================
   EDITA SOLO ESTO (datos reales de contacto)
   ========================================================= */
const CONTACT = {
  email: 'contacto@gessweinproperties.cl',
  phoneDisplay: '+56 9 XXXX XXXX',
  whatsappDisplay: '+56 9 XXXX XXXX',
}

export default function ContactPage() {
  return (
    <main className="bg-white">
      {/* Header */}
      <section className="relative w-full border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl text-slate-900 tracking-tight">
              Contacto
            </h1>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Escríbenos y cuéntanos qué necesitas. Respondemos con foco, claridad y discreción.
            </p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Contact info */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-900">Canales de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-[#0A2E57]" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Email</div>
                    <div className="text-slate-900">{CONTACT.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-[#0A2E57]" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Teléfono</div>
                    <div className="text-slate-900">{CONTACT.phoneDisplay}</div>
                  </div>
                </div>

                <div className="pt-2 text-sm text-slate-600 leading-relaxed">
                  WhatsApp: <span className="text-slate-900">{CONTACT.whatsappDisplay}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-900">Qué información ayuda</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 leading-relaxed space-y-2">
                <p>
                  Incluye comuna/sector, presupuesto (UF o CLP), tipo de propiedad, plazos y si tienes exclusividad.
                </p>
                <p className="text-slate-500">
                  *Tu información se usa solo para gestionar tu solicitud.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <Card className="border border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-900">Deja tu mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
