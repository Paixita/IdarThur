import { NextResponse } from 'next/server';

export const runtime = 'edge';

async function fetchRSS(url) {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  const xml = await res.text();
  
  const items = [];
  const regex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = regex.exec(xml)) !== null && items.length < 4) {
    const itemXml = match[1];
    const getTag = (tag) => {
      const tagRegex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`);
      const m = itemXml.match(tagRegex);
      return m ? m[1] : '';
    };
    items.push({
      title: getTag('title'),
      link: getTag('link'),
      pubDate: getTag('pubDate'),
      description: getTag('description')
    });
  }
  return items;
}

export async function GET() {
  try {
    const alphaItems = await fetchRSS('https://news.google.com/rss/search?q=clima+aeropuerto+vuelos+when:7d&hl=es-419&gl=US&ceid=US:es-419');
    const betaItems = await fetchRSS('https://news.google.com/rss/search?q=turismo+cruceros+eventos+when:7d&hl=es-419&gl=US&ceid=US:es-419');
    
    const cleanDesc = (htmlStr) => {
      if (!htmlStr) return "Lee el artículo completo para más detalles.";
      const decoded = htmlStr
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      
      const text = decoded.replace(/<[^>]*>?/gm, '').trim();
      if (text.toLowerCase().includes('google noticias') || text.toLowerCase().includes('google news')) {
        return "Lee el artículo completo para más detalles.";
      }
      return text.length > 150 ? text.substring(0, 150) + "..." : text;
    };

    const getSeverity = (title) => {
      const t = title.toLowerCase();
      if (t.includes('alerta') || t.includes('huracán') || t.includes('cancelado') || t.includes('emergencia') || t.includes('cierre')) return 'alta';
      if (t.includes('retraso') || t.includes('precaución') || t.includes('visa') || t.includes('requisito')) return 'media';
      return 'baja';
    };

    let newsData = [];
    let idCounter = 1;

    alphaItems.forEach(item => {
      newsData.push({
        id: idCounter++,
        category: 'clima',
        agent: 'Agente Alpha 🌤️',
        title: item.title.split(' - ')[0],
        desc: cleanDesc(item.description),
        date: new Date(item.pubDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        severity: getSeverity(item.title),
        link: item.link
      });
    });

    betaItems.forEach(item => {
      newsData.push({
        id: idCounter++,
        category: 'eventos',
        agent: 'Agente Beta 🎉',
        title: item.title.split(' - ')[0],
        desc: cleanDesc(item.description),
        date: new Date(item.pubDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        severity: getSeverity(item.title),
        link: item.link
      });
    });

    newsData = newsData.sort(() => Math.random() - 0.5);

    return NextResponse.json({ success: true, data: newsData });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}
