import { prepareSpeechText } from '@/utils/speechText.mjs';
import { synthesizeSpeech } from '@/utils/kokoroEngine.mjs';
import { normalizeLanguage, getNeuralVoice } from '@/utils/languageConfig.mjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
const MAX_CHARS = 12000;    // límite explícito, sin recortar el relato
const MAX_CONCURRENT = 2;    // el CPU no da para más síntesis simultáneas
const MAX_CACHE_ENTRIES = 120;
const GENERATION_TIMEOUT_MS = 45000;


// ---------------------------------------------------------------------------
// Cola de concurrencia: evita que varias frases se sinteticen a la vez
// ---------------------------------------------------------------------------
let activeJobs = 0;
const waiting = [];

function acquireSlot() {
  if (activeJobs < MAX_CONCURRENT) {
    activeJobs += 1;
    return Promise.resolve();
  }
  return new Promise((resolve) => waiting.push(resolve));
}

function releaseSlot() {
  activeJobs = Math.max(0, activeJobs - 1);
  const next = waiting.shift();
  if (next) {
    activeJobs += 1;
    next();
  }
}

// ---------------------------------------------------------------------------
// Caché en memoria (frases repetidas: saludos, avisos, bienvenida)
// ---------------------------------------------------------------------------
const audioCache = new Map();

function getCached(key) {
  if (!audioCache.has(key)) return null;
  const value = audioCache.get(key);
  audioCache.delete(key); // refresca el orden LRU
  audioCache.set(key, value);
  return value;
}

function setCached(key, value) {
  audioCache.set(key, value);
  while (audioCache.size > MAX_CACHE_ENTRIES) {
    const oldest = audioCache.keys().next().value;
    audioCache.delete(oldest);
  }
}

async function withTimeout(promise, ms) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('TTS timeout')), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = normalizeLanguage(searchParams.get('lang') || 'es');
  if (!getNeuralVoice(lang)) return Response.json({ error: 'Use a matching browser voice for this language.' }, { status: 422, headers: { 'X-TTS-Fallback':'browser', 'Cache-Control':'no-store' } });
  const text = prepareSpeechText(searchParams.get('text'), lang);

  if (!text) {
    return Response.json(
      { success: false, error: 'Falta el parámetro text.' },
      { status: 400 }
    );
  }

  if (text.length > MAX_CHARS) {
    return Response.json({ success: false, error: 'Divide el texto en bloques de hasta 12000 caracteres.' }, { status: 413 });
  }

  const cacheKey = `multilingual-v4::${lang}::${text}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': String(cached.length),
        'Cache-Control': 'public, max-age=86400',
        'X-TTS-Engine': 'kokoro',
        'X-TTS-Version': 'multilingual-v4',
        'X-TTS-Cache': 'hit',
      },
    });
  }

  await acquireSlot();
  try {
    const startedAt = Date.now();
    const { wav, voice, duration } = await withTimeout(
      synthesizeSpeech(text, lang).finally(releaseSlot),
      GENERATION_TIMEOUT_MS
    );

    setCached(cacheKey, wav);
    console.log(
      `[TTS Kokoro] voz=${voice} dur=${duration.toFixed(2)}s ` +
      `bytes=${wav.length} ms=${Date.now() - startedAt} :: "${text.slice(0, 60)}"`
    );

    return new Response(wav, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': String(wav.length),
        'Cache-Control': 'public, max-age=86400',
        'X-TTS-Engine': 'kokoro',
        'X-TTS-Version': 'multilingual-v4',
        'X-TTS-Voice': voice,
        'X-TTS-Cache': 'miss',
      },
    });
  } catch (error) {
    console.error('[TTS Kokoro Error]', error?.message || error);
    // El cliente usa la voz del navegador como respaldo cuando ve este estado.
    return Response.json(
      {
        success: false,
        error: 'La voz neuronal no está disponible en este momento.',
        fallback: 'browser',
      },
      {
        status: 503,
        headers: { 'X-TTS-Fallback': 'browser', 'Cache-Control': 'no-store' },
      }
    );
  }
}
