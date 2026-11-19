// Comparador comprobado: admite origen/destino IATA y conserva el identificador del socio.
const AIRPORTS = {
  medellin: 'MDE', bogota: 'BOG', cali: 'CLO', cartagena: 'CTG', barranquilla: 'BAQ',
  lima: 'LIM', cusco: 'CUZ', cuzco: 'CUZ', arequipa: 'AQP', iquitos: 'IQT',
  miami: 'MIA', madrid: 'MAD', paris: 'PAR', londres: 'LON', cancun: 'CUN', 'nueva york': 'NYC',
};
export function airportCode(value) {
  const text = String(value || '').trim();
  const explicit = text.match(/\b[A-Z]{3}\b/);
  if (explicit) return explicit[0];
  return AIRPORTS[text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()] || '';
}
export function buildFlightLink(destination = 'Lima', origin = 'Medellín') {
  const url = new URL('https://www.aviasales.com/');
  url.searchParams.set('marker', '729418');
  const from = airportCode(origin);
  const to = airportCode(destination);
  if (from) url.searchParams.set('origin_iata', from);
  if (to) url.searchParams.set('destination_iata', to);
  return url.href;
}
export function buildHotelLink(destination = '') {
  const url = new URL('https://www.booking.com/searchresults.es.html');
  url.searchParams.set('label', 'affnetTP_399989189573503');
  if (destination) url.searchParams.set('ss', String(destination));
  return url.href;
}
export function rewriteTravelLink(value) {
  const raw = String(value || '').trim();
  let url;
  try { url = new URL(raw); } catch { return raw; }
  if (url.hostname === 'search.hotellook.com' || url.hostname.endsWith('.hotellook.com')) {
    const destination = url.searchParams.get('destination') || '';
    if (/\/flights(?:\/|$)/i.test(url.pathname)) return buildFlightLink(destination || 'Lima', url.searchParams.get('origin') || 'Medellín');
    return buildHotelLink(destination);
  }
  return raw;
}
export function splitLinkPunctuation(value) {
  let url = value;
  let suffix = '';
  while (/[.,;:!?]$/.test(url) || (url.endsWith(')') && (url.match(/\)/g)?.length || 0) > (url.match(/\(/g)?.length || 0))) {
    suffix = url.slice(-1) + suffix;
    url = url.slice(0, -1);
  }
  return [url, suffix];
}
export function normalizeReplyLinks(value) {
  return String(value || '').replace(/https?:\/\/[^\s<>"']+/g, (match) => {
    const [url, suffix] = splitLinkPunctuation(match);
    return rewriteTravelLink(url) + suffix;
  });
}
