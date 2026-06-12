import { UniversalEdgeTTS } from 'edge-tts-universal';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const voice = searchParams.get('voice') || 'es-ES-AlvaroNeural';

    if (!text) {
      return new Response('Falta el parámetro text', { status: 400 });
    }

    // Limpiar el texto de caracteres o emojis extraños para mejorar la narración
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    console.log(`[TTS] Generando audio con voz ${voice} para el texto: "${cleanText.substring(0, 50)}..."`);

    const tts = new UniversalEdgeTTS(cleanText, voice);
    const result = await tts.synthesize();

    if (!result || !result.audio) {
      throw new Error('El motor TTS no devolvió datos de audio.');
    }

    const arrayBuffer = await result.audio.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cachear por 1 día si es el mismo texto
      },
    });
  } catch (error) {
    console.error('[TTS Error]', error);
    return new Response(`Error al generar la voz neural: ${error.message}`, { status: 500 });
  }
}
