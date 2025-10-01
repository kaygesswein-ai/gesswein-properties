// app/propiedades/[id]/page.tsx
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

/** ===== helpers de data (robustos) ===== */
type Row = Record<string, any> | null;

async function fetchFromApi(idOrSlug: string): Promise<Row> {
  const h = headers();
  const host = h.get("host") || process.env.VERCEL_URL || "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  const base = `${proto}://${host}`;
  const res = await fetch(`${base}/api/propiedades/${encodeURIComponent(idOrSlug)}`, { cache: "no-store" }).catch(() => null as any);
  if (!res || !res.ok) return null;
  const json = await res.json().catch(() => null);
  return (json?.data as Row) ?? null;
}

async function fetchFromPostgrest(idOrSlug: string): Promise<Row> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const head = { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" };

  // 1) por slug
  let qs = new URLSearchParams();
  qs.set("select", "*"); qs.set("slug", `eq.${idOrSlug}`); qs.set("limit", "1");
  let r = await fetch(`${url}/rest/v1/propiedades?${qs.toString()}`, { headers: head, cache: "no-store" }).catch(() => null as any);
  if (r && r.ok) { const a = await r.json().catch(() => null); if (Array.isArray(a) && a.length) return a[0] as Row; }

  // 2) por id
  qs = new URLSearchParams();
  qs.set("select", "*"); qs.set("id", `eq.${idOrSlug}`); qs.set("limit", "1");
  r = await fetch(`${url}/rest/v1/propiedades?${qs.toString()}`, { headers: head, cache: "no-store" }).catch(() => null as any);
  if (r && r.ok) { const a = await r.json().catch(() => null); if (Array.isArray(a) && a.length) return a[0] as Row; }

  return null;
}

/** ===== colores corporativos ===== */
const BRAND_BLUE = "#0A2E57";
const BRAND_DARK = "#0f172a";

/** ===== página ===== */
export default async function Page({ params }: { params: { id: string } }) {
  const raw = decodeURIComponent(params.id || "");
  let row = await fetchFromApi(raw);
  if (!row) row = await fetchFromPostgrest(raw);
  if (!row) return notFound();

  const nfUF = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });
  const nfINT = new Intl.NumberFormat("es-CL");

  const imgs: string[] = Array.isArray(row.imagenes) ? row.imagenes.filter(Boolean) : [];
  const hero = imgs[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop";

  // datos rápidos
  const chips: Array<{label: string}> = [];
  if (row.operacion) chips.push({ label: cap(row.operacion) });
  if (row.tipo) chips.push({ label: String(row.tipo) });
  if (row.dormitorios != null) chips.push({ label: `${row.dormitorios || "—"} Dorm.` });
  if (row.banos != null) chips.push({ label: `${row.banos || "—"} Baños` });
  if (row.estacionamientos != null) chips.push({ label: `${row.estacionamientos || "—"} Estac.` });
  if (row.superficie_util_m2 != null) chips.push({ label: `${nfINT.format(Number(row.superficie_util_m2))} m² const.` });
  if (row.superficie_terreno_m2 != null) chips.push({ label: `${nfINT.format(Number(row.superficie_terreno_m2))} m² terreno` });

  const showUF = Number(row.precio_uf) > 0;

  return (
    <main className="bg-white text-slate-900">
      {/* ===== HERO FULL BLEED (hasta arriba) ===== */}
      <section className="relative w-full">
        <div
          className="w-full h-[64vh] md:h-[72vh] lg:h-[78vh] bg-center bg-cover"
          style={{ backgroundImage: `url(${hero})` }}
        />
        {/* overlay con título y ubicación */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
            <div className="rounded-sm bg-white/90 backdrop-blur px-4 py-3 shadow-sm">
              <h1 className="text-xl md:text-2xl font-semibold">{row.titulo ?? "Propiedad"}</h1>
              <p className="mt-1 text-sm text-slate-600">
                {[row.comuna, row.region].filter(Boolean).join(", ")}
              </p>
              {/* chips */}
              <div className="mt-3 flex flex-wrap gap-2">
                {chips.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 border text-sm rounded-none"
                    style={{ borderColor: BRAND_BLUE, color: BRAND_DARK }}
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== cuerpo principal estilo “JE”, sin like/views/ask ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda (contenido) */}
          <div className="lg:col-span-2">
            {/* mini galería en mosaico (primeras 12) */}
            {imgs.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {imgs.slice(0, 12).map((src, i) => (
                  <div key={i} className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Descripción */}
            {row.descripcion && (
              <section className="mt-10">
                <h2 className="text-xl font-semibold">Descripción</h2>
                <p className="mt-3 text-slate-700 leading-relaxed whitespace-pre-line">
                  {row.descripcion}
                </p>
              </section>
            )}

            {/* Características (ejemplo – puedes ligar a BD si luego agregamos campos) */}
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Características destacadas</h2>
              <ul className="mt-3 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-slate-700">
                <li>• Orientación predominante: Norte</li>
                <li>• Terminaciones de alto estándar</li>
                <li>• Conectividad y servicios cercanos</li>
                <li>• Excelente potencial de renta/plusvalía</li>
              </ul>
            </section>

            {/* Explora el sector (cierre de la página) */}
            <section className="mt-12">
              <h2 className="text-xl font-semibold">Explora el sector</h2>
              <div className="mt-3 h-72 w-full bg-slate-100 flex items-center justify-center text-slate-500">
                <span className="text-sm">Mapa próximamente</span>
              </div>
            </section>
          </div>

          {/* Columna derecha (CTA/Precio) */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 border border-slate-200 p-5">
              <div className="text-sm text-slate-500">Precio</div>
              <div className="mt-1 text-3xl font-semibold" style={{ color: BRAND_BLUE }}>
                {showUF ? `UF ${nfUF.format(Number(row.precio_uf))}` : "Consultar"}
              </div>
              {/* CLP oculto por ahora (no lo estás calculando) */}
              <div className="h-px bg-slate-200 my-4" />
              <a
                href="/contacto"
                className="block text-center px-4 py-3 text-white rounded-none"
                style={{ background: BRAND_BLUE }}
              >
                Solicitar información
              </a>

              {/* Ficha rápida al estilo “JE” */}
              <div className="mt-6 space-y-2 text-sm">
                <Row label="ID" value={String(row.id || "—")} />
                <Row label="Tipo" value={row.tipo ?? "—"} />
                <Row label="Operación" value={row.operacion ? cap(row.operacion) : "—"} />
                <Row label="Comuna" value={row.comuna ?? "—"} />
                <Row label="Región" value={row.region ?? "—"} />
                <Row label="Construidos" value={row.superficie_util_m2 != null ? `${nfINT.format(Number(row.superficie_util_m2))} m²` : "—"} />
                <Row label="Terreno" value={row.superficie_terreno_m2 != null ? `${nfINT.format(Number(row.superficie_terreno_m2))} m²` : "—"} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/** ===== UI helpers ===== */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-800">{value}</dd>
    </div>
  );
}
function cap(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
