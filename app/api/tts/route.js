// app/api/tts/route.js - Voz neuronal local de Yessel (Kokoro 82M)
// Microsoft cerró el endpoint gratuito de Edge TTS en octubre de 2026 (403),
// por eso el motor anterior quedó mudo. Ahora sintetizamos en el propio servidor.
//
// Voz por defecto: em_alex (masculina, español de España, tono de locutor).
// Alternativa masculina: em_santa.
import { KokoroTTS } from 'kokoro-js';
import ESpeakNg from 'espeak-ng';
import { env } from '@huggingface/transformers';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// En la nube el único directorio escribible es /tmp.
if (process.env.VERCEL) env.cacheDir = join(tmpdir(), 'idarthur-kokoro');
import { prepareSpeechText, splitSpeechText } from '@/utils/speechText.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const VOICES = {
  es: 'em_alex',
  en: 'am_michael',
};

const MAX_CHARS = 12000;    // límite explícito, sin recortar el relato
const MAX_CONCURRENT = 2;    // el CPU no da para más síntesis simultáneas
const MAX_CACHE_ENTRIES = 120;
const GENERATION_TIMEOUT_MS = 45000;

// ---------------------------------------------------------------------------
// Modelo (se carga una sola vez por proceso)
// ---------------------------------------------------------------------------
let modelPromise = null;

function getModel() {
  if (!modelPromise) {
    modelPromise = KokoroTTS.from_pretrained(MODEL_ID, {
      dtype: 'q8',
      device: 'cpu',
    }).catch((error) => {
      modelPromise = null; // permite reintentar en la siguiente petición
      throw error;
    });
  }
  return modelPromise;
}

// ---------------------------------------------------------------------------
// Fonemización (eSpeak-NG compilado a WASM, sin dependencias del sistema)
// ---------------------------------------------------------------------------
let phonemeCounter = 0;

async function phonemize(text, lang) {
  const voice = lang === 'en' ? 'en-us' : 'es';
  const outFile = `phon-${process.pid}-${phonemeCounterSafe()}`;
  const espeak = await ESpeakNg({
    arguments: [
      '--phonout', outFile,
      '--sep=',
      '-q',
      '-b1', // UTF-8: '-b=1' se interpretaba como otra codificación y leía símbolos.
      '--ipa=3',
      '-v', voice,
      text,
    ],
  });
  const raw = espeak.FS.readFile(outFile, { encoding: 'utf8' });
  return raw.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
}

function phonemeCounterSafe() {
  phonemeCounter = (phonemeCounter + 1) % 100000;
  return `${Date.now().toString(36)}-${phonemeCounter}`;
}

// ---------------------------------------------------------------------------
// Utilidades de audio
// ---------------------------------------------------------------------------
function encodeWavPcm16(samples, sampleRate = 24000) {
  const numSamples = samples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);       // tamaño del bloque fmt
  view.setUint16(20, 1, true);        // PCM
  view.setUint16(22, 1, true);        // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true);        // block align
  view.setUint16(34, 16, true);       // bits por muestra
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i] || 0));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  return Buffer.from(buffer);
}

function cleanText(value) {
  return prepareSpeechText(value);
}

function normalizeLang(value) {
  const lang = String(value || '').toLowerCase();
  return lang.startsWith('en') ? 'en' : 'es';
}

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

async function synthesize(text, lang) {
  const voice = VOICES[lang] || VOICES.es;
  const tts = await getModel();
  const pieces = [];
  let sampleRate = 24000;
  for (const chunk of splitSpeechText(text)) {
    const phonemes = await phonemize(chunk, lang);
    if (!phonemes) throw new Error('No se pudieron generar fonemas.');
    const { input_ids } = tts.tokenizer(phonemes, { truncation: true });
    const audio = await tts.generate_from_ids(input_ids, { voice, speed: 0.95 });
    if (!audio?.audio?.length) throw new Error('El modelo devolvió audio vacío.');
    sampleRate = audio.sampling_rate || 24000;
    if (pieces.length) pieces.push(new Float32Array(Math.round(sampleRate * 0.15)));
    pieces.push(audio.audio);
  }
  const samples = new Float32Array(pieces.reduce((total, piece) => total + piece.length, 0));
  let offset = 0;
  for (const piece of pieces) {
    samples.set(piece, offset);
    offset += piece.length;
  }
  return { wav: encodeWavPcm16(samples, sampleRate), voice, duration: samples.length / sampleRate };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const text = cleanText(searchParams.get('text'));
  const lang = normalizeLang(searchParams.get('lang'));

  if (!text) {
    return Response.json(
      { success: false, error: 'Falta el parámetro text.' },
      { status: 400 }
    );
  }

  if (text.length > MAX_CHARS) {
    return Response.json({ success: false, error: 'Divide el texto en bloques de hasta 12000 caracteres.' }, { status: 413 });
  }

  const cacheKey = `utf8-v2::${lang}::${text}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': String(cached.length),
        'Cache-Control': 'public, max-age=86400',
        'X-TTS-Engine': 'kokoro',
        'X-TTS-Version': 'utf8-v2',
        'X-TTS-Cache': 'hit',
      },
    });
  }

  await acquireSlot();
  try {
    const startedAt = Date.now();
    const { wav, voice, duration } = await withTimeout(
      synthesize(text, lang).finally(releaseSlot),
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
        'X-TTS-Version': 'utf8-v2',
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
