import { Communicate } from 'edge-tts-universal';

export const dynamic = 'force-dynamic';

function detectLanguage(text) {
  const clean = text.toLowerCase();
  
  // Detección directa por alfabeto/caracteres especiales
  if (clean.match(/[\u4e00-\u9fff]/)) return 'zh-CN'; // Chino
  if (clean.match(/[\u3040-\u309f\u30a0-\u30ff]/)) return 'ja-JP'; // Japonés
  if (clean.match(/[\u0400-\u04ff]/)) return 'ru-RU'; // Ruso
  if (clean.match(/[\u0600-\u06ff]/)) return 'ar-SA'; // Árabe

  // Frecuencia de palabras más usadas para idiomas occidentales
  const enWords = /\b(the|and|you|that|was|for|on|are|with|as|at|this|hello|welcome|hotel|flight|travel|search|shop|store|booking|airport)\b/g;
  const frWords = /\b(le|la|les|et|en|un|une|pour|dans|sur|qui|bonjour|hotel|voyage|recherche)\b/g;
  const ptWords = /\b(o|a|os|as|e|em|um|uma|para|com|por|como|olá|hotel|viagem|busca)\b/g;
  const deWords = /\b(der|die|das|und|ist|in|zu|den|von|mit|hallo|hotel|reise|suche)\b/g;
  const itWords = /\b(il|la|i|gli|e|in|un|una|per|con|ciao|hotel|viaggio|ricerca)\b/g;

  const count = (regex) => (clean.match(regex) || []).length;

  const scores = {
    'en-US': count(enWords),
    'fr-FR': count(frWords),
    'pt-BR': count(ptWords),
    'de-DE': count(deWords),
    'it-IT': count(itWords)
  };

  let bestLang = 'es-ES'; // Por defecto es Español
  let maxScore = 1; // Mínima cantidad de coincidencias para cambiar

  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestLang = lang;
    }
  }

  return bestLang;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text');

    if (!text) {
      return new Response('Falta el parámetro text', { status: 400 });
    }

    // Limpiar texto de caracteres y emojis extraños
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    // Detección de idioma y asignación de voz nativa correspondiente
    const detectedLang = detectLanguage(cleanText);
    let voice = searchParams.get('voice');
    
    if (!voice) {
      if (detectedLang === 'en-US') voice = 'en-US-GuyNeural';
      else if (detectedLang === 'fr-FR') voice = 'fr-FR-HenriNeural';
      else if (detectedLang === 'pt-BR') voice = 'pt-BR-AntonioNeural';
      else if (detectedLang === 'de-DE') voice = 'de-DE-ConradNeural';
      else if (detectedLang === 'it-IT') voice = 'it-IT-DiegoNeural';
      else if (detectedLang === 'zh-CN') voice = 'zh-CN-YunxiNeural';
      else if (detectedLang === 'ja-JP') voice = 'ja-JP-KeitaNeural';
      else if (detectedLang === 'ru-RU') voice = 'ru-RU-DmitryNeural';
      else if (detectedLang === 'ar-SA') voice = 'ar-SA-HamedNeural';
      else voice = 'es-ES-AlvaroNeural';
    }

    // Analizar el texto para modular velocidad (rate) y tono (pitch) según el sentimiento
    const lowerText = cleanText.toLowerCase();
    let rate = '+4%'; // Un poco más rápido para evitar sonar aburrido o lento
    let pitch = '+0Hz';

    if (lowerText.match(/(misterio|secreto|suspenso|oculto|noche|oscuro|miedo|tensión|desconocido|silencio)/)) {
      rate = '-1%'; // Sutilmente pausado para el misterio pero manteniendo dinamismo
      pitch = '-3Hz';
    } else if (lowerText.match(/(rápido|correr|acción|increíble|explosión|emoción|corazón|adrenalina|peligro|urgente)/)) {
      rate = '+9%'; 
      pitch = '+2Hz';
    } else if (lowerText.match(/(amor|romance|paz|calma|suave|tranquilo|relajante|brisa|luna|hermoso)/)) {
      rate = '+1%'; 
      pitch = '+1Hz';
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
