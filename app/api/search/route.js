import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'todos';

  const meiliHost = process.env.MEILISEARCH_HOST || 'http://localhost:7700';
  const meiliKey = process.env.MEILISEARCH_MASTER_KEY || 'idarthur_meili_master_key_2026';

  try {
    const searchBody = {
      q: query,
      limit: 15,
    };

    // If a type filter is specified and it is not 'todos' (e.g. 'noticia', 'historia', 'producto'),
    // we apply a Meilisearch filter using the filterable attribute 'type'
    if (type && type !== 'todos') {
      searchBody.filter = `type = "${type}"`;
    }

    const response = await fetch(`${meiliHost}/indexes/idarthur_unificado/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${meiliKey}`
      },
      body: JSON.stringify(searchBody)
    });

    if (!response.ok) {
      throw new Error(`Meilisearch search failed with status ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json({ success: true, hits: result.hits });

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
