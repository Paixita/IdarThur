export const runtime = 'edge';

export async function GET() {
  return new Response(JSON.stringify({ apiKey: process.env.ELEVENLABS_API_KEY || '' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
