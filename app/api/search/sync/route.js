import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const meiliHost = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
  const meiliKey = process.env.MEILISEARCH_MASTER_KEY || 'idarthur_meili_master_key_2026';
  
  try {
    // 1. Fetch News
    const newsRes = await fetch('http://localhost:3001/api/noticias');
    const newsJson = await newsRes.json();
    const news = newsJson.success ? newsJson.data : [];

    // 2. Fetch Stories
    const storiesPath = path.join(process.cwd(), 'data', 'historias', 'stories.json');
    const storiesData = fs.readFileSync(storiesPath, 'utf8');
    const stories = JSON.parse(storiesData);

    // 3. Fetch Products (from our medusa route)
    const productsRes = await fetch('http://localhost:3001/api/medusa');
    const productsJson = await productsRes.json();
    const products = productsJson.success ? productsJson.products : [];

    // 4. Format everything into a unified search schema
    const documents = [];

    // Format News
    news.forEach(n => {
      documents.push({
        id: `noticia_${n.id}`,
        title: n.title,
        subtitle: n.agent,
        content: n.desc,
        type: 'noticia',
        link: n.link,
        image: n.category === 'clima' ? '/historias/romance_airport.png' : '/historias/machupicchu_portada.png', // Fallback pictures
        metadata: { date: n.date, severity: n.severity }
      });
    });

    // Format Stories
    stories.forEach(s => {
      // Clean ID for Meilisearch (alphanumeric, hyphens, underscores only)
      const cleanId = (s.id || s.titulo.toLowerCase().replace(/\s+/g, '-')).replace(/[^a-zA-Z0-9_-]/g, '_');
      documents.push({
        id: `historia_${cleanId}`,
        title: s.titulo,
        subtitle: s.subtitulo,
        content: s.narrativa.replace(/<[^>]*>?/gm, '').substring(0, 500) + '...', // Strip HTML tags
        type: 'historia',
        link: `/historias/${s.id || cleanId}`,
        image: s.imagen,
        metadata: { category: s.categoria, characters: s.personajes }
      });
    });

    // Format Products
    products.forEach(p => {
      const cleanId = String(p.id).replace(/[^a-zA-Z0-9_-]/g, '_');
      documents.push({
        id: `producto_${cleanId}`,
        title: p.name,
        subtitle: p.price,
        content: p.copy,
        type: 'producto',
        link: p.affiliateLink,
        image: p.img,
        metadata: { bestseller: p.bestseller, origin: p.origin }
      });
    });

    // 5. Send documents to Meilisearch
    const meiliIndexUrl = `${meiliHost}/indexes/idarthur_unificado/documents`;
    const meiliResponse = await fetch(meiliIndexUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${meiliKey}`
      },
      body: JSON.stringify(documents)
    });

    if (!meiliResponse.ok) {
      const errorText = await meiliResponse.text();
      throw new Error(`Meilisearch upload failed: ${errorText}`);
    }

    const meiliResult = await meiliResponse.json();

    // 6. Configure filterableAttributes so we can filter by 'type'
    await fetch(`${meiliHost}/indexes/idarthur_unificado/settings/filterable-attributes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${meiliKey}`
      },
      body: JSON.stringify(['type'])
    });

    return NextResponse.json({
      success: true,
      message: `Sincronización exitosa. Indexados ${documents.length} documentos en Meilisearch.`,
      documentsCount: documents.length,
      meiliResult
    });

  } catch (error) {
    console.error("Error in Meilisearch synchronization:", error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
