// app/propiedades/[id]/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";   // <-- solo notFound aquí
import { headers } from "next/headers";       // <-- headers viene de next/headers

export const dynamic = "force-dynamic";

type Row = Record<string, any> | null;

async function fetchProperty(idOrSlug: string): Promise<Row> {
  // Construir URL ABSOLUTA para que el fetch funcione en el server
  const h = headers();
  const host = h.get("host") || process.env.VERCEL_URL || "localhost:3000";
  const isProd = !!process.env.VERCEL_URL || host.includes("vercel.app");
  const base = `${isProd ? "https" : "http"}://${host}`;

  const url = `${base}/api/propiedades/${encodeURIComponent(idOrSlug)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const json = await res.json().catch(() => null);
  return (json?.data as Row) ?? null;
}

export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const row = await fetchProperty(params.id);
  if (!row) return notFound();

  const imagenes: string[] = (row.imagenes ?? row.images ?? []) as string[];
  const cover = row.coverImage ?? imagenes[0] ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Portada */}
      {cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
          <Image src={cover} alt={row.titulo ?? ""} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-64 w-full rounded-xl bg-gray-100" />
      )}

      {/* Título y ubicación */}
      <h1 className="mt-6 text-2xl font-semibold">{row.titulo ?? "Propiedad"}</h1>
      <p className="text-sm text-gray-500">
        {row.comuna}
        {row.region ? `, ${row.region}` : ""}
      </p>

      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {row.operacion && <span className="rounded bg-gray-100 px-2 py-1">{row.operacion}</span>}
        {row.tipo && <span className="rounded bg-gray-100 px-2 py-1">{row.tipo}</span>}
        {Number(row.superficie_util_m2) > 0 && (
          <span className="rounded bg-gray-100 px-2 py-1">
            {Number(row.superficie_util_m2).toLocaleString()} m² const.
          </span>
        )}
        {Number(row.superficie_terreno_m2) > 0 && (
          <span className="rounded bg-gray-100 px-2 py-1">
            {Number(row.superficie_terreno_m2).toLocaleString()} m² terreno
          </span>
        )}
        {Number(row.dormitorios) > 0 && (
          <span className="rounded bg-gray-100 px-2 py-1">{row.dormitorios} dorm.</span>
        )}
        {Number(row.banos) > 0 && (
          <span className="rounded bg-gray-100 px-2 py-1">{row.banos} baños</span>
        )}
        {Number(row.estacionamientos) > 0 && (
          <span className="rounded bg-gray-100 px-2 py-1">{row.estacionamientos} estac.</span>
        )}
      </div>

      {/* Galería */}
      {imagenes.length > 1 && (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {imagenes.slice(0, 12).map((src, i) => (
            <div key={i} className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Descripción */}
      {row.descripcion && (
        <section className="prose mt-8 max-w-none">
          <h2>Descripción</h2>
          <p>{row.descripcion}</p>
        </section>
      )}
    </main>
  );
}


