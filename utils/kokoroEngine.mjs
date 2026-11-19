import { KokoroTTS } from 'kokoro-js';
import ESpeakNg from 'espeak-ng';
import { StyleTextToSpeech2Model, AutoTokenizer } from '@huggingface/transformers';
import { join } from 'node:path';
import { packSpeechText } from './speechText.mjs';

// El modelo se instala durante el build; no se descarga al comenzar cada narración.
const MODEL_DIR = join(process.cwd(), 'assets', 'kokoro-model');
let modelPromise;
export function getSpeechModel() {
  if (!modelPromise) modelPromise = Promise.all([
    StyleTextToSpeech2Model.from_pretrained(MODEL_DIR, {
      dtype: 'q8', device: 'cpu',
      session_options: { intraOpNumThreads: 1, interOpNumThreads: 1 },
    }),
    AutoTokenizer.from_pretrained(MODEL_DIR),
  ]).then(([model, tokenizer]) => new KokoroTTS(model, tokenizer))
    .catch((error) => { modelPromise = null; throw error; });
  return modelPromise;
}

let phonemeCounter = 0;

export async function phonemize(text, lang) {
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
  return raw.replace(/\n+/g, ', ').replace(/\s+/g, ' ').trim();
}

function phonemeCounterSafe() {
  phonemeCounter = (phonemeCounter + 1) % 100000;
  return `${Date.now().toString(36)}-${phonemeCounter}`;
}

// ---------------------------------------------------------------------------
// Utilidades de audio
// ---------------------------------------------------------------------------
export function encodeWavPcm16(samples, sampleRate = 24000) {
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


export async function synthesizeSpeech(text, lang = 'es') {
  const voice = lang === 'en' ? 'am_michael' : 'em_alex';
  const tts = await getSpeechModel();
  const pieces = [];
  let sampleRate = 24000;
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  for (let p = 0; p < paragraphs.length; p += 1) {
    const chunks = packSpeechText(paragraphs[p]);
    for (let i = 0; i < chunks.length; i += 1) {
      const phonemes = await phonemize(chunks[i], lang);
      if (!phonemes) continue;
      const { input_ids } = tts.tokenizer(phonemes, { truncation: true });
      const audio = await tts.generate_from_ids(input_ids, { voice, speed: 1 });
      if (!audio?.audio?.length) throw new Error('El modelo devolvió audio vacío.');
      sampleRate = audio.sampling_rate || 24000;
      pieces.push(audio.audio);
      const isParagraphEnd = i === chunks.length - 1 && p < paragraphs.length - 1;
      if (i < chunks.length - 1 || isParagraphEnd) {
        pieces.push(new Float32Array(Math.round(sampleRate * (isParagraphEnd ? 0.4 : 0.16))));
      }
    }
  }
  const samples = new Float32Array(pieces.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of pieces) { samples.set(part, offset); offset += part.length; }
  return { wav: encodeWavPcm16(samples, sampleRate), voice, duration: samples.length / sampleRate };
}
