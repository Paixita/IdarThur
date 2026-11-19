// Reproductor compartido: conserva el diálogo; prepara solo su representación sonora.
import { sendLogisticsAlert } from './alerts';
import { prepareSpeechText, packSpeechText } from './speechText.mjs';

import prerecordedNarrations from '@/data/audio/manifest.json';

let sessionId = 0;
const idleSnapshot = { status: 'idle', text: '', error: '' };
let playbackSnapshot = idleSnapshot;
export const getAlvaroSnapshot = () => playbackSnapshot;
export const getAlvaroServerSnapshot = () => idleSnapshot;
function setPlaybackSnapshot(status, text = playbackSnapshot.text, error = '') {
  playbackSnapshot = { status, text, error };
  window.dispatchEvent(new CustomEvent('alvaro-tts-change', { detail: null }));
}
const preparedAudios = new Map();
let prerecordedUrl = null;
let queue = [];
let index = 0;
let playing = false;
let alertSent = false;
let cancelCurrent = null;

const LOAD_TIMEOUT_MS = 55000;
const STALL_TIMEOUT_MS = 20000;
const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
const isActive = (session) => playing && session === sessionId;

function finishPlayback(error) {
  cancelCurrent?.();
  cancelCurrent = null;
  for (const audio of preparedAudios.values()) {
    audio.pause(); audio.removeAttribute('src'); audio.load();
  }
  preparedAudios.clear();
  prerecordedUrl = null;
  playing = false;
  queue = [];
  index = 0;
  setPlaybackSnapshot(error ? 'error' : 'idle', playbackSnapshot.text, error || '');
  if (error) emit('alvaro-tts-error', { message: error });
  emit('alvaro-tts-end');
}

function nextSentence(session) {
  if (!isActive(session)) return;
  cancelCurrent?.();
  cancelCurrent = null;
  index += 1;
  playCurrent(session);
}

function speakWithBrowser(sentence, session) {
  if (!isActive(session)) return;
  if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
    finishPlayback('No hay una voz de respaldo disponible.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(sentence);
  const spanish = window.speechSynthesis.getVoices().filter((v) => /^es/i.test(v.lang));
  const voice = spanish.find((v) => /jorge|diego|[áa]lvaro|pablo|enrique|carlos|gonzalo|ra[uú]l/i.test(v.name)) || spanish[0];
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || 'es-ES';
  utterance.rate = 0.98;
  utterance.pitch = 0.9;
  let cancelled = false;
  const timer = setTimeout(() => {
    if (!cancelled && isActive(session)) finishPlayback('La voz del navegador no pudo terminar.');
  }, Math.max(15000, sentence.length * 200));
  cancelCurrent = () => {
    cancelled = true;
    clearTimeout(timer);
    utterance.onend = null;
    utterance.onerror = null;
    window.speechSynthesis.cancel();
  };
  utterance.onend = () => {
    if (!cancelled && isActive(session)) nextSentence(session);
  };
  utterance.onerror = () => {
    if (!cancelled && isActive(session)) finishPlayback('No se pudo reproducir la voz.');
  };
  try {
    setPlaybackSnapshot('playing');
    window.speechSynthesis.speak(utterance);
  } catch {
    finishPlayback('No se pudo iniciar la voz del navegador.');
  }
}

function playCurrent(session) {
  if (!isActive(session)) return;
  if (index >= queue.length) {
    finishPlayback();
    return;
  }
  const sentence = queue[index];
  const url = prerecordedUrl || '/api/tts?text=' + encodeURIComponent(sentence) + '&lang=es&v=3';
  const audio = preparedAudios.get(index) || new Audio(url);
  preparedAudios.delete(index);
  audio.preload = 'auto';
  let settled = false;
  let hasPlayed = false;
  let loadTimer;
  let stallTimer;
  const handlers = {};
  const cleanup = () => {
    settled = true;
    clearTimeout(loadTimer);
    clearTimeout(stallTimer);
    Object.entries(handlers).forEach(([name, fn]) => audio.removeEventListener(name, fn));
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  };
  cancelCurrent = cleanup;
  const fallback = (type) => {
    if (settled || !isActive(session)) return;
    cleanup();
    cancelCurrent = null;
    if (!alertSent) {
      alertSent = true;
      sendLogisticsAlert(type, 'La voz neuronal no respondió; se intentará la voz del navegador.');
    }
    speakWithBrowser(sentence, session);
  };
  handlers.playing = () => {
    if (settled || !isActive(session)) return;
    hasPlayed = true;
    setPlaybackSnapshot('playing');
    clearTimeout(loadTimer);
    clearTimeout(stallTimer);
    // Precargar mientras ya se escucha el bloque actual.
    if (!prerecordedUrl) {
      for (let ahead = index + 1; ahead <= Math.min(index + 2, queue.length - 1); ahead += 1) {
        if (preparedAudios.has(ahead)) continue;
        const next = new Audio('/api/tts?text=' + encodeURIComponent(queue[ahead]) + '&lang=es&v=3');
        next.preload = 'auto';
        next.load();
        preparedAudios.set(ahead, next);
      }
    }
  };
  handlers.waiting = () => {
    if (settled || !isActive(session) || !hasPlayed) return;
    clearTimeout(stallTimer);
    stallTimer = setTimeout(() => fallback('TTS_STALLED'), STALL_TIMEOUT_MS);
  };
  handlers.ended = () => {
    if (!settled && isActive(session)) nextSentence(session);
  };
  handlers.error = () => fallback('TTS_AUDIO_FAIL');
  Object.entries(handlers).forEach(([name, fn]) => audio.addEventListener(name, fn));
  loadTimer = setTimeout(() => fallback('TTS_TIMEOUT'), LOAD_TIMEOUT_MS);
  audio.play().catch((error) => {
    if (settled || !isActive(session)) return;
    if (error?.name === 'NotAllowedError') {
      finishPlayback('Pulsa reproducir para permitir el audio en este navegador.');
      return;
    }
    fallback('TTS_AUDIO_FAIL');
  });
}

export function playAlvaroAudio(text) {
  if (typeof window === 'undefined') return;
  stopAlvaroAudio();
  const prepared = prepareSpeechText(text);
  prerecordedUrl = prerecordedNarrations[prepared] || null;
  queue = prerecordedUrl ? [prepared] : packSpeechText(prepared);
  if (!queue.length) return;
  index = 0;
  playing = true;
  alertSent = false;
  const session = ++sessionId;
  setPlaybackSnapshot('loading', prepared);
  emit('alvaro-tts-start');
  playCurrent(session);
}

export function stopAlvaroAudio() {
  if (typeof window === 'undefined') return;
  sessionId += 1;
  finishPlayback();
  window.speechSynthesis?.cancel();
}

export function isAlvaroSpeaking() {
  return typeof window !== 'undefined' && playing;
}

export function subscribeToAlvaro(onChange) {
  window.addEventListener('alvaro-tts-change', onChange);
  window.addEventListener('alvaro-tts-start', onChange);
  window.addEventListener('alvaro-tts-end', onChange);
  return () => {
    window.removeEventListener('alvaro-tts-change', onChange);
    window.removeEventListener('alvaro-tts-start', onChange);
    window.removeEventListener('alvaro-tts-end', onChange);
  };
}
