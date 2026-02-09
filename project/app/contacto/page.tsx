'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, Send, MessageCircle } from 'lucide-react'

type Status = 'idle' | 'loading' | 'ok' | 'error'

export default function ContactoPage() {
  const contact = useMemo(
    () => ({
      phoneDisplay: '+56 9 9331 8039',
      phoneE164: '+56993318039',
      email: 'contacto@gessweinproperties.cl',
      whatsappLink: 'https://wa.me/56993318039',
    }),
    []
  )

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }))
    }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          source: 'contacto_page',
        }),
      })

      const data = (await res.json().catch(() => ({}))) as any

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data?.error ?? 'No se pudo enviar el mensaje. Intenta nuevamente.')
        return
      }

      setStatus('ok')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
      setErrorMsg('No se pudo enviar el mensaje. Revisa tu conexión e intenta nuevamente.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HERO (portada tipo “Servicios/Equipo”) */}
      <section className="relative h-[420px] md:h-[520px] w-full overflow-hidden">
        {/* Placeholder: cámbiala luego por una foto de Contacto */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=2400&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 h-full">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full flex items-end">
            <div className="pb-12 md:pb-16">
              <p className="text-white/80 tracking-[0.32em] text-xs md:text-sm uppercase">
                CONTACTO
              </p>
              <h1 className="mt-3 text-white text-4xl md:text-6xl font-semibold leading-tight">
                Contáctanos
              </h1>
              <p className="mt-4 text-white/85 max-w-2xl text-base md:text-lg leading-relaxed">
                Escríbenos y cuéntanos qué necesitas. Te responderemos a la brevedad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* INFO CONTACTO */}
          <div>
            <div className="mb-6">
              <p className="text-[#0B1F3B]/70 tracking-[0.32em] text-xs uppercase">
                INFORMACIÓN DE CONTACTO
              </p>
              <p className="mt-3 text-[#0B1F3B]/80 leading-relaxed max-w-xl">
                Puedes contactarnos por teléfono o email. Si prefieres, deja tu mensaje y te
                responderemos por la vía que indiques.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-[#0B1F3B]/10 shadow-sm rounded-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-[#0B1F3B]">
                    <span className="inline-flex h-10 w-10 items-center justify-center border border-[#0B1F3B]/15">
                      <Phone className="h-5 w-5 text-[#0B1F3B]" />
                    </span>
                    Teléfono
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <a
                    href={`tel:${contact.phoneE164}`}
                    className="text-[#0B1F3B] font-medium hover:underline"
                  >
                    {contact.phoneDisplay}
                  </a>
                  <p className="mt-2 text-sm text-[#0B1F3B]/70">
                    Atención por coordinación (respuestas en horario hábil).
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#0B1F3B]/10 shadow-sm rounded-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-[#0B1F3B]">
                    <span className="inline-flex h-10 w-10 items-center justify-center border border-[#0B1F3B]/15">
                      <Mail className="h-5 w-5 text-[#0B1F3B]" />
                    </span>
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[#0B1F3B] font-medium hover:underline break-all"
                  >
                    {contact.email}
                  </a>
                  <p className="mt-2 text-sm text-[#0B1F3B]/70">
                    Respuesta dentro de 24 horas hábiles.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#0B1F3B]/10 shadow-sm rounded-none">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-[#0B1F3B]">
                    <span className="inline-flex h-10 w-10 items-center justify-center border border-[#0B1F3B]/15">
                      <MessageCircle className="h-5 w-5 text-[#0B1F3B]" />
                    </span>
                    WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <a
                    href={contact.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0B1F3B] font-medium hover:underline"
                  >
                    Abrir conversación
                  </a>
                  <p className="mt-2 text-sm text-[#0B1F3B]/70">
                    Escríbenos y te guiamos con tu solicitud.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FORM (mismo formato visual que info contacto) */}
          <div>
            <Card className="border-[#0B1F3B]/10 shadow-sm rounded-none">
              <CardHeader>
                <CardTitle className="text-[#0B1F3B]">Déjanos tu mensaje</CardTitle>
                <p className="text-sm text-[#0B1F3B]/70">
                  Completa el formulario y nos pondremos en contacto contigo.
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-[#0B1F3B]/80">Nombre completo *</label>
                      <Input
                        value={form.name}
                        onChange={onChange('name')}
                        placeholder="Tu nombre"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-[#0B1F3B]/80">Email *</label>
                      <Input
                        value={form.email}
                        onChange={onChange('email')}
                        placeholder="tu@email.com"
                        type="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[#0B1F3B]/80">Teléfono</label>
                    <Input
                      value={form.phone}
                      onChange={onChange('phone')}
                      placeholder="+56 9 xxxx xxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-[#0B1F3B]/80">Mensaje *</label>
                    <Textarea
                      value={form.message}
                      onChange={onChange('message')}
                      placeholder="Cuéntanos qué necesitas…"
                      required
                      className="min-h-[180px]"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                      {errorMsg || 'Ocurrió un error al enviar el mensaje.'}
                    </div>
                  )}

                  {status === 'ok' && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                      Mensaje enviado correctamente. Te contactaremos a la brevedad.
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-[#0B1F3B]/60">
                      Al enviar, aceptas nuestra política de privacidad.
                    </p>

                    <Button
                      type="submit"
                      disabled={status === 'loading'}
                      className="rounded-none bg-[#0B1F3B] hover:bg-[#0B1F3B]/90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {status === 'loading' ? 'Enviando…' : 'Enviar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
