import content from '@/data/mobile-content.json';
export async function GET(){return Response.json(content,{headers:{'Cache-Control':'public, s-maxage=300, stale-while-revalidate=60'}});}
