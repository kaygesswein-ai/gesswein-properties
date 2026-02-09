/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Send } from 'lucide-react';

type Status = 'idle' | 'loading' | 'ok' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const onChange =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
    };

  const canSend =
    form.name.trim().length >= 2 &&
    form.email.trim().length >= 5 &&
    form.message.trim().length >= 10;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || status === 'loading') return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          source: 'website',
        }),
      });

      const j = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(j?.error || 'No se pudo enviar el mensaje. Intenta nuevamente.');
        return;
      }

      setStatus('ok');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('No se pudo enviar el mensaje. Revisa tu conexión e intenta nuevamente.');
    }
  };

  return (
    <main className="bg-white">
      {/* HERO alineado al estilo del sitio (limpio, azul, minimal) */}
      <section className="border-b">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 pt-16 pb-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-[#0A2E57]/70">
            Contacto
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold text-[#0A2E57]">
            Contáctanos
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl leading-relaxed">
            Escríbenos y cuéntanos qué necesitas. Te responderemos a la brevedad.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 xl:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* INFO */}
          <div className="lg:col-span-5">
            <h2 className="text-sm md:text-base uppercase tracking-[0.25em] text-slate-900">
              Información de contacto
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Puedes contactarnos por teléfono o email. Si prefieres, deja tu mensaje y te
              responderemos por la vía que indiques.
            </p>

            <div className="mt-6 space-y-4">
              <Card className="rounded-none border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <span className="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white">
                      <Phone className="h-4 w-4 text-[#0A2E57]" />
                    </span>
                    Teléfono
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <a
                    href="tel:+56993318039"
                    className="text-[#0A2E57] hover:underline font-medium"
                  >
                    +56 9 9331 8039
                  </a>
                  <p className="mt-1 text-sm text-slate-600">
                    Atención por coordinación (respuestas en horario hábil).
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-none border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <span className="inline-flex h-9 w-9 items-center justify-center border border-slate-200 bg-white">
                      <Mail className="h-4 w-4 text-[#0A2E57]" />
                    </span>
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <a
                    href="mailto:contacto@gessweinproperties.cl"
                    className="text-[#0A2E57] hover:underline font-medium break-all"
                  >
                    contacto@gessweinproperties.cl
                  </a>
                  <p className="mt-1 text-sm text-slate-600">
                    Respuesta dentro de 24 horas hábiles.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-7">
            <Card className="rounded-none border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Déjanos tu mensaje</CardTitle>
                <p className="text-sm text-slate-600">
                  Completa el formulario y nos pondremos en contacto contigo.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        Nombre completo <span className="text-red-600">*</span>
                      </label>
                      <input
                        value={form.name}
                        onChange={onChange('name')}
                        className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-800 placeholder-slate-400"
                        placeholder="Tu nombre completo"
                        autoComplete="name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-slate-700 mb-1">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        value={form.email}
                        onChange={onChange('email')}
                        className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-800 placeholder-slate-400"
                        placeholder="tu@email.com"
                        autoComplete="email"
                        inputMode="email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
                    <input
                      value={form.phone}
                      onChange={onChange('phone')}
                      className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-800 placeholder-slate-400"
                      placeholder="+56 9 ..."
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-700 mb-1">
                      Mensaje <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      value={form.message}
                      onChange={onChange('message')}
                      rows={6}
                      className="w-full rounded-none border border-slate-300 bg-gray-50 px-3 py-2 text-slate-800 placeholder-slate-400"
                      placeholder="Cuéntanos qué necesitas (mínimo 10 caracteres)…"
                    />
                  </div>

                  {/* feedback */}
                  {status === 'ok' && (
                    <div className="text-sm text-emerald-700 border border-emerald-200 bg-emerald-50 px-3 py-2">
                      Mensaje enviado. Te contactaremos a la brevedad.
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="text-sm text-red-700 border border-red-200 bg-red-50 px-3 py-2">
                      {errorMsg || 'Ocurrió un error al enviar.'}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                      Al enviar, aceptas nuestra política de privacidad.
                    </p>

                    <button
                      type="submit"
                      disabled={!canSend || status === 'loading'}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm tracking-wide text-white rounded-none
                        ${!canSend || status === 'loading' ? 'bg-[#0A2E57]/60' : 'bg-[#0A2E57] hover:bg-[#082646]'}
                      `}
                      style={{
                        boxShadow:
                          'inset 0 0 0 1px rgba(255,255,255,0.95), inset 0 0 0 3px rgba(255,255,255,0.25)',
                      }}
                    >
                      <Send className="h-4 w-4" />
                      {status === 'loading' ? 'Enviando…' : 'Enviar'}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
