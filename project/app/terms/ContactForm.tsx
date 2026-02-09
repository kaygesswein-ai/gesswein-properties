'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

type Status = 'idle' | 'loading' | 'ok' | 'error'

export default function ContactForm() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })

  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }))
    }

  const canSend =
    form.nombre.trim().length >= 2 &&
    form.email.trim().length >= 5 &&
    form.mensaje.trim().length >= 10

  const onSubmit = async (e: React.FormEvent) => {
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
          <span className="text-sm text-emerald-700">Listo. Recibimos tu mensaje.</span>
        )}
        {status === 'error' && (
          <span className="text-sm text-red-600">{errorMsg || 'No se pudo enviar.'}</span>
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
