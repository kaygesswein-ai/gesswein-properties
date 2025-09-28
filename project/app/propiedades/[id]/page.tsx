// app/propiedades/[id]/page.tsx
export default function TestPage({ params }: { params: { id: string } }) {
  return (
    <main style={{ padding: 32 }}>
      <h1 style={{ marginBottom: 8 }}>Detalle de propiedad</h1>
      <p>Ruta OK. ID recibido: <b>{params.id}</b></p>
    </main>
  );
}
