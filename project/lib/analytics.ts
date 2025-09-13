// project/lib/analytics.ts

/** Tipos de eventos de leads admitidos (incluye "general" para formularios genéricos) */
type LeadType = 'contact' | 'visit' | 'referral' | 'general';

/** Pequeño helper para pushear al dataLayer si existe (sin romper SSR) */
function pushToDataLayer(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({ event: eventName, ...payload });
  }
  if (process.env.NODE_ENV !== 'production') {
    // Log en dev para depurar sin herramientas externas
    // eslint-disable-next-line no-console
    console.log(`[analytics] ${eventName}`, payload);
  }
}

/** Click a WhatsApp desde distintos lugares (hero, cta, etc.) */
export function trackWhatsAppClick(source: string = 'unknown') {
  pushToDataLayer('whatsapp_click', { source });
}

/**
 * Envío de lead desde formularios.
 * Acepta "general" y lo normaliza a "contact" para mantener consistencia.
 */
export function trackLeadSubmission(type: LeadType, payload: Record<string, unknown> = {}) {
  const normalized: Exclude<LeadType, 'general'> =
    type === 'general' ? 'contact' : (type as Exclude<LeadType, 'general'>);

  pushToDataLayer('lead_submission', { lead_type: normalized, ...payload });
}

/** (Opcional) Vistas de propiedad — por si lo usas en detalle */
export function trackPropertyView(id: string) {
  pushToDataLayer('property_view', { id });
}

/** (Opcional) Filtros en el listado — por si lo usan tus filtros */
export function trackFilterApplied(filters: Record<string, unknown>) {
  pushToDataLayer('filters_applied', filters);
}
