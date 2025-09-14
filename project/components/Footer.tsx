import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0A2E57] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h4 className="text-lg font-semibold">Gesswein Properties</h4>
            <p className="mt-2 text-white/80 text-sm">
              Corretaje inmobiliario con asesoría arquitectónica y foco en Santiago Oriente.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Links</h4>
            <ul className="mt-2 space-y-2 text-white/90">
              <li><Link href="/" className="hover:text-white">Inicio</Link></li>
              <li><Link href="/propiedades" className="hover:text-white">Propiedades</Link></li>
              <li><Link href="/servicios" className="hover:text-white">Servicios</Link></li>
              <li><Link href="/equipo" className="hover:text-white">Equipo</Link></li>
              <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Contacto</h4>
            <ul className="mt-2 space-y-2 text-white/90 text-sm">
              <li>Zona Oriente, Santiago</li>
              <li><a className="hover:text-white" href="mailto:hola@gessweinproperties.cl">hola@gessweinproperties.cl</a></li>
              <li><a className="hover:text-white" href="https://wa.me/56900000000" target="_blank">+56 9 0000 0000 (WhatsApp)</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/70">
          © {new Date().getFullYear()} Gesswein Properties. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
