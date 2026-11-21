// Reproductor compartido: conserva el diálogo; prepara solo su representación sonora.
import { sendLogisticsAlert } from './alerts';
import { prepareSpeechText, packSpeechText } from './speechText.mjs';

import prerecordedNarrations from '@/data/audio/manifest.json';
import femaleNarrations from '@/data/audio/female-manifest.json';
import { detectLanguage } from './languageDetection.mjs';
import { normalizeLanguage, normalizeVoiceGender, getNeuralVoice, chooseBrowserVoice, languageCopy } from './languageConfig.mjs';

let sessionId = 0;
let speechLanguage = 'es';
let speechVoiceGender = 'male';
const idleSnapshot = { status: 'idle', text: '', error: '', language: 'es', voiceGender: 'male' };
let playbackSnapshot = idleSnapshot;
export const getAlvaroSnapshot = () => playbackSnapshot;
export const getAlvaroServerSnapshot = () => idleSnapshot;
function setPlaybackSnapshot(status, text = playbackSnapshot.text, error = '') {
  playbackSnapshot = { status, text, error, language: speechLanguage, voiceGender: speechVoiceGender };
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

function speakWithBrowser(sentence, session, waited = false) {
  if (!isActive(session)) return;
  if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
    finishPlayback(languageCopy(speechLanguage).noVoice);
    return;
  }
  const synth = window.speechSynthesis;
  const voice = chooseBrowserVoice(synth.getVoices(), speechLanguage, speechVoiceGender);
  if (!voice) {
    if (waited || !synth.addEventListener) {
      finishPlayback(languageCopy(speechLanguage).noVoice);
      return;
    }
    let timer;
    const cleanup = () => { clearTimeout(timer); synth.removeEventListener('voiceschanged', onVoices); };
    const retry = () => { cleanup(); if (isActive(session)) { cancelCurrent = null; speakWithBrowser(sentence, session, true); } };
    const onVoices = () => { if (chooseBrowserVoice(synth.getVoices(), speechLanguage, speechVoiceGender)) retry(); };
    synth.addEventListener('voiceschanged', onVoices);
    timer = setTimeout(retry, 2000);
    cancelCurrent = cleanup;
    return;
  }
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = 0.98;
  utterance.pitch = speechVoiceGender === 'female' ? 1 : 0.9;
  let cancelled = false;
  const timer = setTimeout(() => {
    if (!cancelled && isActive(session)) finishPlayback(languageCopy(speechLanguage).voiceError);
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
    if (!cancelled && isActive(session)) finishPlayback(languageCopy(speechLanguage).voiceError);
  };
  try {
    setPlaybackSnapshot('playing');
    window.speechSynthesis.speak(utterance);
  } catch {
    finishPlayback(languageCopy(speechLanguage).voiceError);
  }
}

function playCurrent(session) {
  if (!isActive(session)) return;
  if (index >= queue.length) {
    finishPlayback();
    return;
  }
  const sentence = queue[index];
  if (!getNeuralVoice(speechLanguage, speechVoiceGender)) { speakWithBrowser(sentence, session); return; }
  const url = prerecordedUrl || '/api/tts?text=' + encodeURIComponent(sentence) + '&lang=' + speechLanguage + '&gender=' + speechVoiceGender + '&v=5';
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
        const next = new Audio('/api/tts?text=' + encodeURIComponent(queue[ahead]) + '&lang=' + speechLanguage + '&gender=' + speechVoiceGender + '&v=5');
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
      finishPlayback(languageCopy(speechLanguage).voiceError);
      return;
    }
    fallback('TTS_AUDIO_FAIL');
  });
}

export function playAlvaroAudio(text, options = {}) {
  if (typeof window === 'undefined') return;
  stopAlvaroAudio();
  speechVoiceGender = normalizeVoiceGender(options.voiceGender);
  speechLanguage = normalizeLanguage(options.language) || detectLanguage(text, 'es');
  const prepared = prepareSpeechText(text, speechLanguage);
  prerecordedUrl = speechLanguage === 'es' ? (speechVoiceGender === 'female' ? femaleNarrations : prerecordedNarrations)[prepared] || null : null;
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
