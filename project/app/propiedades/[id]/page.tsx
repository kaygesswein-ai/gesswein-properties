// app/propiedades/[id]/page.tsx
import { notFound, } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type Row = Record<string, any> | null;

async function fetchFromApi(idOrSlug: string): Promise<Row> {
  const h = headers();
  const host = h.get("host") || process.env.VERCEL_URL || "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  const base = `${proto}://${host}`;

  const res = await fetch(
    `${base}/api/propiedades/${encodeURIComponent(idOrSlug)}`,
    { cache: "no-store" }
  ).catch(() => null as any);

  if (!res || !res.ok) return null;
  const json = await res.json().catch(() => null);
  return (json?.data as Row) ?? null;
}

async function fetchFromPostgrest(idOrSlug: string): Promise<Row> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const head = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  };

  // 1) por slug
  let qs = new URLSearchParams();
  qs.set("select", "*");
  qs.set("slug", `eq.${idOrSlug}`);
  qs.set("limit", "1");

  let r = await fetch(`${url}/rest/v1/propiedades?${qs.toString()}`, {
    headers: head,
    cache: "no-store",
  }).catch(() => null as any);

  if (r && r.ok) {
    const a = await r.json().catch(() => null);
    if (Array.isArray(a) && a.length) return a[0] as Row;
  }

  // 2) por id
  qs = new URLSearchParams();
  qs.set("select", "*");
  qs.set("id", `eq.${idOrSlug}`);
  qs.set("limit", "1");

  r = await fetch(`${url}/rest/v1/propiedades?${qs.toString()}`, {
    headers: head,
    cache: "no-store",
  }).catch(() => null as any);

  if (r && r.ok) {
    const a = await r.json().catch(() => null);
    if (Array.isArray(a) && a.length) return a[0] as Row;
  }

  return null;
}

export default async function Page({ params }: { params: { id: string } }) {
  const raw = decodeURIComponent(params.id || "");

  // 1) API interna
  let row = await fetchFromApi(raw);

  // 2) Fallback a PostgREST
  if (!row) row = await fetchFromPostgrest(raw);

  if (!row) return notFound();

  const imgs: string[] = Array.isArray(row.imagenes) ? row.imagenes : [];
  const cover = imgs[0] ?? null;

  const nf = new Intl.NumberFormat("es-CL");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      {cover ? (
        <div className="aspect-[16/9] w-full overflow-hidden rounded-md bg-slate-100">
          <img src={cover} alt={row.titulo ?? ""} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-64 rounded-md bg-slate-100" />
      )}

      {/* Título / ubicación */}
      <h1 className="mt-6 text-2xl md:text-3xl font-semibold">
        {row.titulo ?? "Propiedad"}
      </h1>
      <p className="mt-1 text-slate-600">
        {[row.comuna, row.region].filter(Boolean).join(", ")}
      </p>

      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {row.operacion && <span className="px-3 py-1 border">{row.operacion}</span>}
        {row.tipo && <span className="px-3 py-1 border">{row.tipo}</span>}
        {Number(row.dormitorios) > 0 && <span className="px-3 py-1 border">{row.dormitorios} dorm.</span>}
        {Number(row.banos) > 0 && <span className="px-3 py-1 border">{row.banos} baños</span>}
        {Number(row.estacionamientos) > 0 && <span className="px-3 py-1 border">{row.estacionamientos} estac.</span>}
        {Number(row.superficie_util_m2) > 0 && <span className="px-3 py-1 border">{nf.format(Number(row.superficie_util_m2))} m² const.</span>}
        {Number(row.superficie_terreno_m2) > 0 && <span className="px-3 py-1 border">{nf.format(Number(row.superficie_terreno_m2))} m² terreno</span>}
      </div>

      {/* Galería */}
      {imgs.length > 1 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          {imgs.slice(0, 12).map((src, i) => (
            <div key={i} className="aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-100">
              <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Descripción */}
      {row.descripcion && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Descripción</h2>
          <p className="mt-3 text-slate-700 whitespace-pre-line">{row.descripcion}</p>
        </section>
      )}
    </main>
  );
}

