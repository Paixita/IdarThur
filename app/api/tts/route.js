import { Communicate } from 'edge-tts-universal';

export const dynamic = 'force-dynamic';

function detectLanguage(text, clientLang = '', clientTimezone = '') {
  const clean = text.toLowerCase();
  
  // Detección directa por alfabeto/caracteres especiales
  if (clean.match(/[\u4e00-\u9fff]/)) return 'zh-CN'; // Chino
  if (clean.match(/[\u3040-\u309f\u30a0-\u30ff]/)) return 'ja-JP'; // Japonés
  if (clean.match(/[\u0400-\u04ff]/)) return 'ru-RU'; // Ruso
  if (clean.match(/[\u0600-\u06ff]/)) return 'ar-SA'; // Árabe

  // Frecuencia de palabras más usadas para idiomas occidentales
  const esWords = /\b(y|el|los|las|del|al|con|en|para|como|hola|bienvenido|viaje|vuelo|hotel|buscar|tienda|historia|avión|aeropuerto)\b/g;
  const enWords = /\b(the|and|you|that|was|for|on|are|with|as|at|this|hello|welcome|hotel|flight|travel|search|shop|store|booking|airport)\b/g;
  const frWords = /\b(le|la|les|et|en|un|une|pour|dans|sur|qui|bonjour|hotel|voyage|recherche)\b/g;
  const ptWords = /\b(e|o|os|as|do|ao|com|em|olá|bem-vindo|viagem|voo|loja|história|avião|aeroporto)\b/g;
  const deWords = /\b(der|die|das|und|ist|in|zu|den|von|mit|hallo|hotel|reise|suche)\b/g;
  const itWords = /\b(il|la|i|gli|e|in|un|una|per|con|ciao|hotel|viaggio|ricerca)\b/g;

  const count = (regex) => (clean.match(regex) || []).length;

  const scores = {
    'es-ES': count(esWords),
    'en-US': count(enWords),
    'fr-FR': count(frWords),
    'pt-BR': count(ptWords),
    'de-DE': count(deWords),
    'it-IT': count(itWords)
  };

  // 1. Determinar el idioma predeterminado usando la zona horaria del cliente o el idioma del navegador
  let defaultLang = 'es-ES';
  
  if (clientLang) {
    const l = clientLang.toLowerCase();
    if (l.startsWith('pt')) defaultLang = 'pt-BR';
    else if (l.startsWith('en')) defaultLang = 'en-US';
    else if (l.startsWith('fr')) defaultLang = 'fr-FR';
    else if (l.startsWith('de')) defaultLang = 'de-DE';
    else if (l.startsWith('it')) defaultLang = 'it-IT';
    else if (l.startsWith('zh')) defaultLang = 'zh-CN';
    else if (l.startsWith('ja')) defaultLang = 'ja-JP';
    else if (l.startsWith('ru')) defaultLang = 'ru-RU';
    else if (l.startsWith('ar')) defaultLang = 'ar-SA';
  }

  if (clientTimezone) {
    const tz = clientTimezone.toLowerCase();
    // Zonas horarias de habla hispana comunes
    const esTimezones = ['bogota', 'mexico', 'buenos_aires', 'madrid', 'santiago', 'lima', 'caracas', 'montevideo', 'asuncion', 'quito', 'guatemala', 'honduras', 'san_salvador', 'managua', 'san_jose', 'panama', 'santo_domingo', 'puerto_rico', 'havana', 'la_paz'];
    // Zonas horarias de Brasil
    const ptTimezones = ['sao_paulo', 'rio', 'manaus', 'recife', 'fortaleza', 'porto_alegre', 'cuiaba', 'belem'];
    
    if (esTimezones.some(e => tz.includes(e))) {
      defaultLang = 'es-ES';
    } else if (ptTimezones.some(p => tz.includes(p))) {
      defaultLang = 'pt-BR';
    }
  }

  let bestLang = defaultLang;
  let maxScore = 1; // Mínima cantidad de coincidencias para cambiar del default

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
    const clientLang = searchParams.get('lang') || '';
    const clientTimezone = searchParams.get('timezone') || '';

    if (!text) {
      return new Response('Falta el parámetro text', { status: 400 });
    }

    // Limpiar texto de caracteres y emojis extraños
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

    // Detección de idioma y asignación de voz nativa correspondiente
    const detectedLang = detectLanguage(cleanText, clientLang, clientTimezone);
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
