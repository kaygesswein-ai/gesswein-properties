// Analytics utilities for GA4 and Meta Pixel

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || ''
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ''

// GA4 Events
export const trackEvent = (action: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters)
  }
}

// Meta Pixel Events
export const trackPixelEvent = (event: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, parameters)
  }
}

// Specific tracking functions
export const trackPropertyView = (propertyId: string, propertyTitle: string) => {
  trackEvent('view_item', {
    item_id: propertyId,
    item_name: propertyTitle,
    item_category: 'property',
  })
  
  trackPixelEvent('ViewContent', {
    content_ids: [propertyId],
    content_type: 'property',
  })
}

export const trackLeadSubmission = (type: 'contact' | 'visit' | 'referral') => {
  trackEvent('generate_lead', {
    lead_type: type,
  })
  
  trackPixelEvent('Lead', {
    content_category: type,
  })
}

export const trackWhatsAppClick = (context: string) => {
  trackEvent('whatsapp_click', {
    context: context,
  })
  
  trackPixelEvent('Contact', {
    method: 'whatsapp',
  })
}