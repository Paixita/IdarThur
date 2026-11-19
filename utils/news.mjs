const ENTITIES = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
export function newsText(value) {
  return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_, code) => {
      if (code[0] !== '#') return ENTITIES[code.toLowerCase()] || ' ';
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : ' ';
    }).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
export function parseNewsFeed(xml, feed, now = Date.now()) {
  const items = [];
  for (const item of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
    const tag = (name) => item[1].match(new RegExp('<' + name + '(?:\\s[^>]*)?>([\\s\\S]*?)<\\/' + name + '>', 'i'))?.[1] || '';
    const title = newsText(tag('title'));
    const link = newsText(tag('link'));
    const time = Date.parse(newsText(tag('pubDate')));
    if (!title || !/^https:\/\//i.test(link) || !Number.isFinite(time) || time > now + 600000 || now - time > 72 * 3600000) continue;
    const publisher = newsText(tag('source'));
    const cleanTitle = publisher && title.endsWith(' - ' + publisher) ? title.slice(0, -(publisher.length + 3)) : title;
    const urgent = /cancel|cierre|cerrad|huelga|emergencia|hurac[aá]n|suspend|alerta/i.test(cleanTitle);
    items.push({ id: link, category: feed.category, agent: feed.agent, title: cleanTitle,
      desc: feed.summary, publisher: publisher || 'Medio de comunicación', publishedAt: new Date(time).toISOString(),
      severity: urgent ? 'alta' : /retras|demora|precauci[oó]n/i.test(cleanTitle) ? 'media' : 'baja', link });
  }
  return items;
}
export function mergeNewsFeeds(feeds, limit = 24) {
  const seen = new Set();
  return feeds.flat().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .filter((item) => { const key = item.title.toLocaleLowerCase('es'); if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, limit);
}
export const NEWS_FEEDS = [
  { id: 'alpha-global', category: 'clima', agent: 'Alpha · Aeropuertos', query: 'aeropuerto vuelos (cancelaciones OR retrasos OR cierre OR huelga) when:2d', summary: 'Operación aérea y posibles incidencias. Abre la noticia para conocer el aeropuerto, el alcance y la fecha del reporte.' },
  { id: 'alpha-colombia', category: 'clima', agent: 'Alpha · Colombia', query: 'Colombia aeropuerto vuelos when:2d', summary: 'Actualidad de aeropuertos y aerolíneas en Colombia. Confirma el estado de tu vuelo directamente con la aerolínea.' },
  { id: 'alpha-peru', category: 'peru', agent: 'Alpha · Perú', query: 'Perú (aeropuerto OR vuelos OR "Jorge Chávez") when:2d', summary: 'Noticias de conectividad y aeropuertos de Perú para preparar tu llegada o conexión.' },
  { id: 'beta-turismo', category: 'eventos', agent: 'Beta · Turismo', query: 'cruceros turismo eventos when:3d', summary: 'Novedades de turismo y cruceros. Consulta la publicación original para conocer sus condiciones.' },
];
