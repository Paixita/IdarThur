import { NEWS_FEEDS, parseNewsFeed, mergeNewsFeeds } from '@/utils/news.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 20;
export async function GET(request) {
  const force = new URL(request.url).searchParams.get('refresh') === '1';
  const checkedAt = new Date().toISOString();
  const results = await Promise.allSettled(NEWS_FEEDS.map(async (feed) => {
    const params = new URLSearchParams({ q: feed.query, hl: 'es-419', gl: 'CO', ceid: 'CO:es-419' });
    const response = await fetch('https://news.google.com/rss/search?' + params, {
      ...(force ? { cache: 'no-store' } : { next: { revalidate: 300 } }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Fuente no disponible');
    const xml = await response.text();
    if (!/<rss\b/i.test(xml)) throw new Error('La fuente no devolvió noticias RSS');
    return parseNewsFeed(xml, feed);
  }));
  const successful = results.filter((r) => r.status === 'fulfilled');
  if (!successful.length) return Response.json({ success: false, error: 'No pudimos actualizar las fuentes. Intenta nuevamente en unos minutos.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  const data = mergeNewsFeeds(successful.map((r) => r.value));
  return Response.json({ success: true, data, checkedAt, refreshAfterSeconds: 300,
    partial: successful.length < NEWS_FEEDS.length,
    agents: NEWS_FEEDS.map((feed, i) => ({ id: feed.id, status: results[i].status === 'fulfilled' ? 'active' : 'unavailable', count: results[i].value?.length || 0 })),
  }, { headers: { 'Cache-Control': force ? 'no-store' : 'public, s-maxage=300, stale-while-revalidate=60' } });
}
