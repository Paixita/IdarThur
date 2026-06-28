// utils/alerts.js - Canal interno de alertas de logística y anomalías para agentes de IdarThur

/**
 * Registra una anomalía o error crítico y lo envía de forma privada al canal de alertas logísticas.
 * @param {string} errorType - Tipo de anomalía (ej. 'IMAGE_LOAD_FAIL', 'TTS_AUDIO_FAIL', 'MEILISEARCH_OFFLINE')
 * @param {string} message - Mensaje descriptivo del error
 * @param {Object} details - Detalles técnicos del error
 */
export function sendLogisticsAlert(errorType, message, details = {}) {
  if (typeof window === 'undefined') return;

  const payload = {
    type: errorType,
    message: message,
    timestamp: new Date().toISOString(),
    pageUrl: window.location.href,
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'unknown',
    details: details
  };

  console.warn(`[Alerts Client] Despachando alerta logística privada (${errorType}):`, message);

  fetch('/api/alerts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        console.log(`[Alerts Client] Alerta lograda e inyectada con éxito.`);
      }
    })
    .catch(err => {
      console.error('[Alerts Client Error]', err);
    });
}
