import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET() {
  try {
    // Agente Alpha: Clima y Vuelos
    const alphaFeed = await parser.parseURL('https://news.google.com/rss/search?q=clima+aeropuerto+vuelos&hl=es-419&gl=US&ceid=US:es-419');
    
    // Agente Beta: Turismo, Cruceros, Eventos
    const betaFeed = await parser.parseURL('https://news.google.com/rss/search?q=turismo+cruceros+eventos&hl=es-419&gl=US&ceid=US:es-419');
    
    // Función para limpiar la descripción HTML que trae Google News
    const cleanDesc = (htmlStr) => {
      if (!htmlStr) return "Lee el artículo completo para más detalles.";
      const text = htmlStr.replace(/<[^>]*>?/gm, ''); // Quita tags HTML
      return text.length > 150 ? text.substring(0, 150) + "..." : text;
    };

    // Función para calcular la severidad
    const getSeverity = (title) => {
      const t = title.toLowerCase();
      if (t.includes('alerta') || t.includes('huracán') || t.includes('cancelado') || t.includes('emergencia') || t.includes('cierre')) return 'alta';
      if (t.includes('retraso') || t.includes('precaución') || t.includes('visa') || t.includes('requisito')) return 'media';
      return 'baja';
    };

    let newsData = [];
    let idCounter = 1;

    // Procesar Alpha
    alphaFeed.items.slice(0, 4).forEach(item => {
      newsData.push({
        id: idCounter++,
        category: 'clima', // Simplificamos usando clima y geopolitica para Alpha
        agent: 'Agente Alpha 🌤️',
        title: item.title.split(' - ')[0], // Quitar el nombre del periódico al final
        desc: cleanDesc(item.content || item.contentSnippet),
        date: new Date(item.pubDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        severity: getSeverity(item.title),
        link: item.link
      });
    });

    // Procesar Beta
    betaFeed.items.slice(0, 4).forEach(item => {
      newsData.push({
        id: idCounter++,
        category: 'eventos', // Beta maneja eventos y turismo
        agent: 'Agente Beta 🎉',
        title: item.title.split(' - ')[0],
        desc: cleanDesc(item.content || item.contentSnippet),
        date: new Date(item.pubDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
        severity: getSeverity(item.title),
        link: item.link
      });
    });

    // Mezclar las noticias un poco para que no salgan todas las de Alpha primero
    newsData = newsData.sort(() => Math.random() - 0.5);

    return NextResponse.json({ success: true, data: newsData });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch news" }, { status: 500 });
  }
}
