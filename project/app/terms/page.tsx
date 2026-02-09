import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, Send } from 'lucide-react'

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

/* =========================================================
   UI
   ========================================================= */
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
                  Si prefieres, también puedes escribirnos por WhatsApp: <span className="text-slate-900">{CONTACT.whatsappDisplay}</span>.
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm rounded-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-slate-900">Qué información ayuda</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 leading-relaxed space-y-2">
                <p>
                  Para ayudarte más rápido, incluye: comuna/sector, presupuesto (UF o CLP),
                  tipo de propiedad, plazos y si tienes exclusividad.
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

/* =========================================================
   Form (client) -> POST /api/contact
   ========================================================= */
function ContactForm() {
  // componente client-only embebido para que no tengas que crear otro archivo
  // (mantiene el proyecto simple y alineado a tu instrucción de “no mover más”)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const React = require('react')
  const { useState } = React

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const onChange = (k: keyof typeof form) => (e: any) =>
    setForm((p: any) => ({ ...p, [k]: e.target.value }))

  const canSend =
    form.nombre.trim().length >= 2 &&
    form.email.trim().length >= 5 &&
    form.mensaje.trim().length >= 10

  const onSubmit = async (e: any) => {
    e.preventDefault()
    if (!canSend || status === 'loading') return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const j = await res.json().catch(() => null)
        throw new Error(j?.error || 'No se pudo enviar el mensaje.')
      }

      setStatus('ok')
      setForm({ nombre: '', email: '', telefono: '', mensaje: '' })
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err?.message || 'Error inesperado.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombre" required>
          <input
            value={form.nombre}
            onChange={onChange('nombre')}
            className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2E57]/30"
            placeholder="Tu nombre"
          />
        </Field>

        <Field label="Email" required>
          <input
            value={form.email}
            onChange={onChange('email')}
            type="email"
            className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2E57]/30"
            placeholder="tu@email.com"
          />
        </Field>
      </div>

      <Field label="Teléfono (opcional)">
        <input
          value={form.telefono}
          onChange={onChange('telefono')}
          className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2E57]/30"
          placeholder="+56 9 1234 5678"
        />
      </Field>

      <Field label="Mensaje" required>
        <textarea
          value={form.mensaje}
          onChange={onChange('mensaje')}
          rows={6}
          className="w-full rounded-md border border-slate-300 bg-gray-50 px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2E57]/30"
          placeholder="Cuéntanos qué necesitas (compra, venta, arriendo, comuna/sector, presupuesto, plazos, etc.)."
        />
      </Field>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!canSend || status === 'loading'}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm tracking-wide text-white bg-[#0A2E57] rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.25)',
          }}
        >
          <Send className="h-4 w-4" />
          {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
        </button>

        {status === 'ok' && (
          <span className="text-sm text-emerald-700">
            Listo. Recibimos tu mensaje.
          </span>
        )}
        {status === 'error' && (
          <span className="text-sm text-red-600">
            {errorMsg || 'No se pudo enviar.'}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Al enviar, aceptas que te contactemos para gestionar tu solicitud.
      </p>
    </form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1">
        {label} {required ? <span className="text-slate-400">*</span> : null}
      </label>
      {children}
    </div>
  )
}
