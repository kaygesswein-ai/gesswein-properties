/* eslint-disable @next/next/no-img-element */
export default function OportunidadesExclusivasPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        {/* Imagen de fondo — luego puedes mover esto a Supabase */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1920)",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-12 xl:px-16 flex min-h-[100svh] items-end pb-20">
          <div className="max-w-xl bg-white/80 backdrop-blur-sm p-6 md:p-7">
            <h1 className="uppercase tracking-[0.30em] text-[#0A2E57] text-sm md:text-base">
              OPORTUNIDADES EXCLUSIVAS
            </h1>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Propiedades seleccionadas que no siempre llegan al mercado abierto.
              Activos singulares, oportunidades off-market y casos especiales
              gestionados de forma confidencial.
            </p>

            <p className="mt-3 text-gray-700 leading-relaxed">
              El acceso a esta sección es limitado y su contenido cambia
              constantemente según disponibilidad real.
            </p>

            <div className="mt-6">
              <a
                href="/contacto"
                className="inline-flex items-center justify-center border border-[#0A2E57] px-5 py-2 text-sm tracking-wide text-[#0A2E57] bg-white"
              >
                Solicitar acceso
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUE INFORMATIVO */}
      <section className="mx-auto max-w-5xl px-6 md:px-8 py-16">
        <h2 className="uppercase tracking-[0.25em] text-[#0A2E57] text-sm">
          ¿QUÉ ENCUENTRAS AQUÍ?
        </h2>

        <div className="mt-6 grid gap-6 md:grid-cols-3 text-gray-700">
          <p>
            Propiedades <strong>off-market</strong> que se comparten solo con
            clientes calificados.
          </p>
          <p>
            Oportunidades con <strong>condiciones especiales</strong> por plazo,
            estructura o contexto.
          </p>
          <p>
            Activos únicos que requieren <strong>gestión discreta</strong> y
            asesoría experta.
          </p>
        </div>
      </section>
    </main>
  );
}
