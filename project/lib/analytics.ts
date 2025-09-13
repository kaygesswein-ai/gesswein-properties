// project/lib/analytics.ts

/** IDs de tracking (opcionales). Si no existen, quedan en string vacío y no se inyectan scripts. */
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL || '';

/** Tipos de eventos de leads admitidos (incluye "general" para formularios genéricos) */
type LeadType = 'contact' | 'visit' | 'referral' | 'general';

/** Helper para pushear al dataLayer (sin romper SSR) */
function pushToDataLayer(eventName: string, payload: Record<string, unknown> = {}) {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({ event: eventName, ...payload });
  }
  if (process.env.NODE_ENV !== 'production') {
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

/** (Opcional) Vista de propiedad */
export function trackPropertyView(id: string) {
  pushToDataLayer('property_view', { id });
}

/** (Opcional) Filtros aplicados en listado */
export function trackFilterApplied(filters: Record<string, unknown>) {
  pushToDataLayer('filters_applied', filters);
}

