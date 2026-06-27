// utils/tiktok.js - Helper cliente para enviar eventos a TikTok (Pixel + API de Servidor)

/**
 * Registra un evento tanto en el Pixel del navegador como en la API del Servidor de TikTok de forma híbrida
 * @param {string} eventName - Nombre del evento (ej. 'Search', 'ViewContent', 'AddToCart', 'Purchase', 'CompleteRegistration')
 * @param {Object} properties - Datos del evento (ej. value, currency, query, contents)
 * @param {Object} user - Datos del cliente (ej. email, phone, external_id)
 */
export function trackTikTokEvent(eventName, properties = {}, user = {}) {
  if (typeof window === 'undefined') return;

  // 1. Enviar evento al Píxel del Navegador (si está cargado)
  if (window.ttq) {
    try {
      window.ttq.track(eventName, {
        contents: properties.contents || [],
        value: properties.value,
        currency: properties.currency || 'USD',
        query: properties.query
      });
      console.log(`[TikTok Pixel Client] Evento "${eventName}" registrado.`);
    } catch (e) {
      console.error('[TikTok Pixel Client Error]', e);
    }
  }

  // 2. Extraer cookies de TikTok para mejorar la coincidencia de atribución en el servidor
  const ttpCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('_ttp='))
    ?.split('=')[1];

  const payload = {
    event: eventName,
    event_id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    pageUrl: window.location.href,
    referrer: document.referrer,
    user: {
      ttp: ttpCookie,
      email: user.email || undefined,
      phone: user.phone || undefined,
      external_id: user.external_id || undefined,
      user_agent: navigator.userAgent
    },
    properties: properties
  };

  // 3. Enviar evento al Servidor de fondo
  fetch('/api/tiktok', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log(`[TikTok Events API Server] Evento de servidor "${eventName}" despachado.`);
      }
    })
    .catch(err => {
      console.error('[TikTok Events API Server fetch error]', err);
    });
}
