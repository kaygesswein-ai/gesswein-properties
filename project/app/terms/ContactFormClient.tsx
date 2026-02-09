'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'ok' | 'error'

export default function ContactFormClient() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  })

  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onChange = (k: keyof typeof form) => (e: any) => {
    setForm((p) => ({ ...p, [k]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const j = await r.json().catch(() => ({}))

      if (!r.ok) {
        setStatus('error')
        setErrorMsg(j?.error || 'No pudimos enviar tu mensaje. Intenta nuevamente.')
        return
      }

      setStatus('ok')
      setForm({ nombre: '', email: '', telefono: '', mensaje: '' })
    } catch {
      setStatus('error')
      setErrorMsg('No pudimos enviar tu mensaje. Revisa tu conexión e intenta nuevamente.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-slate-700 mb-1">Nombre *</label>
          <input
            value={form.nombre}
            onChange={onChange('nombre')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2E57]/20"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">Email *</label>
          <input
            value={form.email}
            onChange={onChange('email')}
            type="email"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2E57]/20"
            placeholder="tu@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
        <input
          value={form.telefono}
          onChange={onChange('telefono')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2E57]/20"
          placeholder="+56 9 1234 5678"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-700 mb-1">Mensaje *</label>
        <textarea
          value={form.mensaje}
          onChange={onChange('mensaje')}
          rows={5}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2E57]/20"
          placeholder="Ej: quiero vender mi casa / busco comprar en Las Condes / necesito tasación…"
          required
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center rounded-none bg-[#0A2E57] px-4 py-2 text-sm tracking-wide text-white disabled:opacity-60"
        style={{
          boxShadow:
            'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.25)',
        }}
      >
        {status === 'loading' ? 'Enviando…' : 'Enviar mensaje'}
      </button>

      {status === 'ok' && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Mensaje enviado. Te contactaremos pronto.
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {errorMsg}
        </div>
      )}
    </form>
  )
}
