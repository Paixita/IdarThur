import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import ESpeakNg from 'espeak-ng';
import { prepareSpeechText, splitSpeechText, packSpeechText } from '../utils/speechText.mjs';

test('El formato se limpia solo para audio y conserva el mensaje y los acentos', () => {
  const original = '<p>¡Aquí tenemos <strong>los mejores viajes</strong>! &quot;Aerolíneas&quot;, Perú y [hoteles](https://idarthur.com).</p>';
  assert.equal(prepareSpeechText(original), '¡Aquí tenemos los mejores viajes! Aerolíneas, Perú y hoteles.');
  assert.match(original, /<strong>/);
  assert.equal(prepareSpeechText('Viajes &#34;premium&#34; &amp; hoteles.'), 'Viajes premium y hoteles.');
});

test('Los bloques largos no pierden palabras aunque no tengan comas ni puntos', () => {
  const source = 'viajaremos juntos por los mejores destinos '.repeat(100).trim();
  const chunks = splitSpeechText(source);
  assert.ok(chunks.every((s) => s.length <= 360));
  assert.equal(chunks.join(' '), source);
  assert.equal(splitSpeechText('a'.repeat(999)).join(''), 'a'.repeat(999));
});

test('La fonemización real usa UTF-8 y no convierte acentos ni signos en sus nombres', async () => {
  const source = readFileSync(new URL('../utils/kokoroEngine.mjs', import.meta.url), 'utf8');
  const start = source.indexOf('let phonemeCounter = 0;');
  const end = source.indexOf('// Utilidades de audio', start);
  const context = { ESpeakNg, process, Date };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end).replace(/export /g, ''), context);
  const phonemes = await context.phonemize('Aquí, aerolíneas, Perú. ¡Hola! ¿Qué tal?', 'es');
  assert.match(phonemes, /akˈi/);
  assert.match(phonemes, /peɾˈu/);
  assert.doesNotMatch(phonemes, /tˈilðe|pˈunto|θiɾkum|kˈopir|komˈi/);
});

function player(prerecordedNarrations = {}) {
  const audios = [], spoken = [], alerts = [], timers = new Map(), events = [];
  let nextId = 0;
  class Audio {
    constructor(src) { this.src = src; this.handlers = new Map(); audios.push(this); }
    addEventListener(name, fn) { this.handlers.set(name, fn); }
    removeEventListener(name) { this.handlers.delete(name); }
    play() { return Promise.resolve(); }
    pause() { this.paused = true; }
    load() {}
    removeAttribute() { this.src = ''; }
    fire(name) { this.handlers.get(name)?.(); }
  }
  const context = {
    Audio, prepareSpeechText, packSpeechText, prerecordedNarrations,
    sendLogisticsAlert: (...args) => alerts.push(args),
    setTimeout: (fn, ms) => { timers.set(++nextId, { fn, ms }); return nextId; },
    clearTimeout: (id) => timers.delete(id),
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    window: {
      dispatchEvent: (event) => events.push(event.type),
      speechSynthesis: { getVoices: () => [], speak: (u) => spoken.push(u), cancel() {} },
    },
  };
  const code = readFileSync(new URL('../utils/playAlvaro.js', import.meta.url), 'utf8')
    .replace(/^import .*;$/mg, '').replace(/export /g, '');
  vm.createContext(context);
  vm.runInContext(code, context);
  return { context, audios, spoken, alerts, timers, events };
}

test('Una reproducción iniciada no tiene un límite de 20 segundos que la interrumpa', () => {
  const p = player();
  p.context.playAlvaroAudio('Aquí tenemos los mejores viajes.');
  p.audios[0].fire('playing');
  assert.equal(p.timers.size, 0);
  assert.equal(p.spoken.length, 0);
  assert.equal(p.audios[0].paused, undefined);
  p.audios[0].fire('ended');
  assert.equal(p.context.isAlvaroSpeaking(), false);
});

test('Detener elimina temporizadores y callbacks; un evento tardío no vuelve a hablar', () => {
  const p = player();
  p.context.playAlvaroAudio('La primera narración.');
  const staleTimer = [...p.timers.values()][0].fn;
  const staleError = p.audios[0].handlers.get('error');
  p.context.stopAlvaroAudio();
  staleTimer();
  staleError();
  assert.equal(p.timers.size, 0);
  assert.equal(p.spoken.length, 0);
  assert.equal(p.alerts.length, 0);
  assert.equal(p.context.isAlvaroSpeaking(), false);
});

test('Una sesión nueva no se interrumpe por callbacks de una sesión anterior', () => {
  const p = player();
  p.context.playAlvaroAudio('Primera.');
  const oldTimer = [...p.timers.values()][0].fn;
  p.context.playAlvaroAudio('Segunda.');
  oldTimer();
  assert.equal(p.spoken.length, 0);
  assert.equal(p.alerts.length, 0);
  assert.equal(p.context.isAlvaroSpeaking(), true);
  p.audios[1].fire('playing');
  p.audios[1].fire('ended');
  assert.equal(p.context.isAlvaroSpeaking(), false);
});

test('La voz de respaldo también se cancela y no avanza después de detener', () => {
  const p = player();
  p.context.playAlvaroAudio('Una frase. Otra frase.');
  p.audios[0].fire('error');
  assert.equal(p.spoken.length, 1);
  const staleEnd = p.spoken[0].onend;
  p.context.stopAlvaroAudio();
  staleEnd();
  assert.equal(p.audios.length, 1);
  assert.equal(p.timers.size, 0);
  assert.equal(p.context.isAlvaroSpeaking(), false);
});

test('Las narraciones preparadas se reproducen completas en un archivo, sin llamadas TTS entre frases', () => {
  const text = 'Aquí comienza el viaje. Seguimos hablando sin esperas.';
  const p = player({ [prepareSpeechText(text)]: '/audio/narraciones/prueba.mp3' });
  p.context.playAlvaroAudio(text);
  assert.equal(p.audios[0].src, '/audio/narraciones/prueba.mp3');
  p.audios[0].fire('playing');
  assert.equal(p.audios.length, 1);
  p.audios[0].fire('ended');
  assert.equal(p.context.isAlvaroSpeaking(), false);
});

test('Las respuestas nuevas precargan los bloques siguientes y reutilizan su audio', () => {
  const p = player();
  p.context.playAlvaroAudio(('Una nueva frase que continúa el relato. ').repeat(40));
  p.audios[0].fire('playing');
  assert.equal(p.audios.length, 3);
  const ready = p.audios[1];
  p.audios[0].fire('ended');
  assert.equal(p.audios.length, 3);
  assert.equal(ready.handlers.has('ended'), true);
  p.context.stopAlvaroAudio();
  assert.equal(p.timers.size, 0);
  assert.equal(p.audios[2].paused, true);
});

test('El audio conserva los párrafos y agrupa frases sin perder contenido', () => {
  assert.equal(prepareSpeechText('<p>Primero.</p><p>Después.</p>'), 'Primero.\n\nDespués.');
  const text = 'Una frase. Otra frase. Y seguimos.';
  assert.equal(packSpeechText(text).join(' '), text);
  assert.equal(packSpeechText(text).length, 1);
});
