import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { NEWS_FEEDS, parseNewsFeed, mergeNewsFeeds } from '../utils/news.mjs';
const now = Date.now();
const item = (title, hours = 1, link = 'https://news.google.com/rss/articles/test') => '<item><title><![CDATA[' + title + ' - Medio]]></title><link>' + link + '</link><pubDate>' + new Date(now - hours * 3600000).toUTCString() + '</pubDate><source url="https://example.com">Medio</source></item>';
test('Solo se publican noticias fechadas y recientes con enlaces HTTPS', () => {
  const xml = '<rss><channel>' + item('Cierre &amp; retrasos') + item('Vieja', 80) + item('Futura', -4) + item('Enlace inválido', 1, 'javascript:alert(1)') + '</channel></rss>';
  const rows = parseNewsFeed(xml, NEWS_FEEDS[0], now);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].title, 'Cierre & retrasos');
  assert.equal(rows[0].publisher, 'Medio');
  assert.equal(rows[0].severity, 'alta');
});
test('Las noticias se deduplican y se ordenan por publicación, sin mezcla aleatoria', () => {
  const a = parseNewsFeed(item('Primera', 3), NEWS_FEEDS[0], now);
  const b = parseNewsFeed(item('Nueva', 1, 'https://example.com/nueva') + item('Primera', 4), NEWS_FEEDS[1], now);
  assert.deepEqual(mergeNewsFeeds([a, b]).map((row) => row.title), ['Nueva', 'Primera']);
});
const routeText = (await readFile(new URL('../app/api/noticias/route.js', import.meta.url), 'utf8')).replace("'@/utils/news.mjs'", JSON.stringify(new URL('../utils/news.mjs', import.meta.url).href));
const { GET } = await import('data:text/javascript;base64,' + Buffer.from(routeText).toString('base64'));
test('Una fuente caída no oculta las otras y el estado parcial es visible', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url) => {
    if (String(url).includes('cruceros')) throw new Error('Fuente caída');
    return new Response('<rss>' + item('Nueva noticia') + '</rss>');
  });
  const response = await GET(new Request('https://idarthur.com/api/noticias'));
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.partial, true);
  assert.equal(result.data.length, 1);
  assert.equal(result.agents.filter((a) => a.status === 'unavailable').length, 1);
});
test('Si todas las fuentes fallan se informa el fallo, sin inventar noticias', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Sin conexión'); });
  const response = await GET(new Request('https://idarthur.com/api/noticias?refresh=1'));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).success, false);
});
