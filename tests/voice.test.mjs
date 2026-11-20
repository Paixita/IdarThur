import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import ESpeakNg from 'espeak-ng';
import { detectLanguage } from '../utils/languageDetection.mjs';
import { getNeuralVoice, normalizeLanguage, normalizeVoiceGender, chooseBrowserVoice, languageCopy } from '../utils/languageConfig.mjs';
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
  const context = { ESpeakNg, process, Date, getNeuralVoice };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end).replace(/export /g, ''), context);
  const phonemes = await context.phonemize('Aquí, aerolíneas, Perú. ¡Hola! ¿Qué tal?', 'es');
  assert.match(phonemes, /akˈi/);
  assert.match(phonemes, /peɾˈu/);
  assert.doesNotMatch(phonemes, /tˈilðe|pˈunto|θiɾkum|kˈopir|komˈi/);
});

function player(prerecordedNarrations = {}, voices = [{name:'Spanish',lang:'es-ES',gender:'male'},{name:'English',lang:'en-US',gender:'male'}]) {
  const audios = [], spoken = [], alerts = [], timers = new Map(), events = [], voiceEvents = new Map();
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
    Audio, prepareSpeechText, packSpeechText, prerecordedNarrations, femaleNarrations:{}, normalizeVoiceGender, detectLanguage, normalizeLanguage, getNeuralVoice, chooseBrowserVoice, languageCopy,
    sendLogisticsAlert: (...args) => alerts.push(args),
    setTimeout: (fn, ms) => { timers.set(++nextId, { fn, ms }); return nextId; },
    clearTimeout: (id) => timers.delete(id),
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    window: {
      dispatchEvent: (event) => events.push(event.type),
      speechSynthesis: { getVoices: () => voices, speak: (u) => spoken.push(u), cancel() {}, addEventListener:(name,fn)=>voiceEvents.set(name,fn),removeEventListener:(name)=>voiceEvents.delete(name) },
    },
  };
  const code = readFileSync(new URL('../utils/playAlvaro.js', import.meta.url), 'utf8')
    .replace(/^import .*;$/mg, '').replace(/export /g, '');
  vm.createContext(context);
  vm.runInContext(code, context);
  return { context, audios, spoken, alerts, timers, events, voiceEvents };
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


test('El botón sigue la respuesta activa y sus estados al cambiar de mensaje', () => {
  const p = player();
  p.context.playAlvaroAudio('Primera respuesta.');
  assert.equal(vm.runInContext('getAlvaroSnapshot()', p.context).status, 'loading');
  assert.equal(vm.runInContext('getAlvaroSnapshot()', p.context).text, 'Primera respuesta.');
  p.audios[0].fire('playing');
  assert.equal(vm.runInContext('getAlvaroSnapshot()', p.context).status, 'playing');
  p.context.playAlvaroAudio('Segunda respuesta.');
  assert.equal(vm.runInContext('getAlvaroSnapshot()', p.context).text, 'Segunda respuesta.');
  assert.equal(p.audios[0].paused, true);
  p.context.stopAlvaroAudio();
  assert.equal(vm.runInContext('getAlvaroSnapshot()', p.context).status, 'idle');
});

test('La conversación se narra sin leer los enlaces de la bibliografía', () => {
  assert.equal(prepareSpeechText('Una alternativa es Lima.\n\nFuentes consultadas (hoy UTC):\n1. [JetSMART](https://jetsmart.com)'), 'Una alternativa es Lima.');
});


test('La preparación inicial usa su plazo de carga y no se corta como si fuera una interrupción', () => {
 const p=player(); p.context.playAlvaroAudio('Preparando una respuesta nueva.');
 p.audios[0].fire('waiting');
 assert.equal(p.timers.size,1); assert.equal([...p.timers.values()][0].ms,55000);
 p.audios[0].fire('playing'); p.audios[0].fire('waiting');
 assert.equal(p.timers.size,1); assert.equal([...p.timers.values()][0].ms,20000);
 p.context.stopAlvaroAudio(); assert.equal(p.timers.size,0);
});


test('El idioma se envía a Kokoro y a la precarga de los siguientes bloques', () => {
 const p=player(); p.context.playAlvaroAudio('Bonjour, nous préparons votre voyage. '.repeat(30),{language:'fr'});
 assert.match(p.audios[0].src,/lang=fr/); p.audios[0].fire('playing');
 assert.ok(p.audios.length>1); assert.ok(p.audios.every(a=>a.src.includes('lang=fr')));
 assert.equal(vm.runInContext('getAlvaroSnapshot()',p.context).language,'fr');
 p.context.stopAlvaroAudio();
});
test('El respaldo inglés elige una voz inglesa, sin cambiar a español', () => {
 const p=player();p.context.playAlvaroAudio('Your flight is ready for review.',{language:'en'});p.audios[0].fire('error');
 assert.equal(p.spoken[0].lang,'en-US');assert.equal(p.spoken[0].voice.lang,'en-US');p.context.stopAlvaroAudio();
});
test('Un idioma sin Kokoro usa directamente su voz de navegador y puede detenerse', () => {
 const p=player({},[{name:'German',lang:'de-DE',gender:'male'}]);p.context.playAlvaroAudio('Ihre Reise wird vorbereitet.',{language:'de'});
 assert.equal(p.audios.length,0);assert.equal(p.spoken[0].lang,'de-DE');p.context.stopAlvaroAudio();
 assert.equal(p.context.isAlvaroSpeaking(),false);
});
test('No se usa una voz española cuando falta la voz del idioma solicitado', () => {
 const p=player({},[{name:'Spanish',lang:'es-ES',gender:'male'}]);p.context.playAlvaroAudio('こんにちは',{language:'ja'});
 for(const t of [...p.timers.values()])t.fn();
 assert.equal(p.audios.length,0);assert.equal(p.spoken.length,0);
 assert.equal(vm.runInContext('getAlvaroSnapshot()',p.context).status,'error');
 assert.equal(vm.runInContext('getAlvaroSnapshot()',p.context).error,languageCopy('ja').noVoice);
});
test('Las voces cargadas tarde respetan el idioma y no reviven una sesión cancelada', () => {
 const voices=[];const p=player({},voices);p.context.playAlvaroAudio('Guten Tag',{language:'de'});
 voices.push({name:'German',lang:'de-DE',gender:'male'});p.voiceEvents.get('voiceschanged')();assert.equal(p.spoken[0].lang,'de-DE');p.context.stopAlvaroAudio();
 const q=player({},[]);q.context.playAlvaroAudio('こんにちは',{language:'ja'});const stale=[...q.timers.values()][0].fn;q.context.stopAlvaroAudio();stale();assert.equal(q.spoken.length,0);
});

test('Natalia usa voz femenina sin reutilizar el audio masculino ni su precarga',()=>{
 const text='Este es un saludo de protección de cuentas.';
 const p=player({[text]:'/audio/saludo-masculino.mp3'});
 p.context.playAlvaroAudio(text,{language:'es',voiceGender:'female'});
 assert.match(p.audios[0].src,/gender=female/);
 assert.equal(vm.runInContext('getAlvaroSnapshot().voiceGender',p.context),'female');
 p.audios[0].fire('error');
 assert.equal(p.spoken.length,0,'No sustituye a Natalia por una voz masculina');
});
test('Los perfiles mantienen género y fonemas del idioma, incluido el francés masculino',()=>{
 for(const lang of ['es','en','fr','it','pt']){
  assert.notEqual(getNeuralVoice(lang,'male').voice,getNeuralVoice(lang,'female').voice);
 }
 assert.equal(getNeuralVoice('fr','male').phonemes,'fr-fr');
 assert.equal(getNeuralVoice('fr','male').voice,'em_alex');
 assert.equal(getNeuralVoice('fr','female').voice,'ff_siwis');
 const voices=[{name:'Microsoft Denise',lang:'fr-FR'},{name:'Microsoft Henri',lang:'fr-FR'}];
 assert.equal(chooseBrowserVoice(voices,'fr','male').name,'Microsoft Henri');
 assert.equal(chooseBrowserVoice(voices,'fr','female').name,'Microsoft Denise');
 assert.equal(chooseBrowserVoice([{name:'Inconnue',lang:'fr-FR'}],'fr','male'),null);
});
