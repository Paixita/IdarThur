import { Communicate } from 'edge-tts-universal';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');
    const voice = searchParams.get('voice') || 'es-ES-AlvaroNeural';

    if (!text) {
      return new Response('Falta el parámetro text', { status: 400 });
    }

    // Limpiar texto de caracteres y emojis extraños
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    // Analizar el texto para modular velocidad (rate) y tono (pitch) según el sentimiento
    const lowerText = cleanText.toLowerCase();
    let rate = '+0%';
    let pitch = '+0Hz';

    if (lowerText.match(/(misterio|secreto|suspenso|oculto|noche|oscuro|miedo|tensión|desconocido|silencio)/)) {
      rate = '-10%';
      pitch = '-5Hz';
    } else if (lowerText.match(/(rápido|correr|acción|increíble|explosión|emoción|corazón|adrenalina|peligro|urgente)/)) {
      rate = '+12%';
      pitch = '+3Hz';
    } else if (lowerText.match(/(amor|romance|paz|calma|suave|tranquilo|relajante|brisa|luna|hermoso)/)) {
      rate = '-5%';
      pitch = '+2Hz';
    }

    console.log(`[TTS Stream] Voz: ${voice}, Rate: ${rate}, Pitch: ${pitch}. Texto: "${cleanText.substring(0, 50)}..."`);

    const communicate = new Communicate(cleanText, {
      voice,
      rate,
      pitch
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of communicate.stream()) {
            if (chunk.type === 'audio' && chunk.data) {
              controller.enqueue(chunk.data);
            }
          }
          controller.close();
        } catch (error) {
          console.error('[TTS ReadableStream Error]', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-store, must-revalidate', // No cachear para forzar respuesta inmediata en tiempo real
      },
    });
  } catch (error) {
    console.error('[TTS Endpoint Error]', error);
    return new Response(`Error al generar voz neural: ${error.message}`, { status: 500 });
  }
}
